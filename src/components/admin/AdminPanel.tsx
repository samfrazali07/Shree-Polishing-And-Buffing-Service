import { useEffect, useState } from "react";
import { getJson, sendJson } from "../../lib/api";
import Stars from "../ui/Stars";
import Logo from "../ui/Logo";

type FeedbackStatus = "pending" | "approved" | "rejected" | "hidden";
type StatusFilter = FeedbackStatus | "all";

interface AdminFeedback {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  service_used: string;
  rating: number;
  message: string;
  permission_to_publish: boolean;
  status: FeedbackStatus;
  created_at: string;
}

const TOKEN_KEY = "shree-admin-token";

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  pending: "border-bronze text-bronze",
  approved: "border-emerald-700 text-emerald-800",
  rejected: "border-red-700 text-red-800",
  hidden: "border-charcoal/40 text-charcoal/60",
};

/**
 * Moderation console for website feedback (route: /admin).
 * Feedback is only published when it is "approved" AND the reviewer gave publish permission.
 * Google reviews are managed on Google and are not editable here.
 */
export default function AdminPanel() {
  const [token, setToken] = useState<string>(() => window.sessionStorage.getItem(TOKEN_KEY) ?? "");
  const [tokenInput, setTokenInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(() => Boolean(window.sessionStorage.getItem(TOKEN_KEY)));
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;
    const params = new URLSearchParams({ status: statusFilter });
    if (ratingFilter) params.set("rating", String(ratingFilter));

    getJson<{ items: AdminFeedback[] }>(`/api/admin/feedback?${params.toString()}`, {
      Authorization: `Bearer ${token}`,
    }).then((res) => {
      if (!active) return;
      setLoading(false);
      if (res.ok) {
        setItems(res.data.items ?? []);
        setError("");
      } else {
        setItems([]);
        if (res.status === 401) {
          window.sessionStorage.removeItem(TOKEN_KEY);
          setToken("");
        }
        setError(res.error);
      }
    });

    return () => {
      active = false;
    };
  }, [token, statusFilter, ratingFilter, reloadKey]);

  const connect = (e: React.FormEvent) => {
    e.preventDefault();
    const value = tokenInput.trim();
    if (!value) return;
    window.sessionStorage.setItem(TOKEN_KEY, value);
    setLoading(true);
    setToken(value);
    setTokenInput("");
  };

  const setStatus = async (id: string, status: FeedbackStatus) => {
    setBusyId(id);
    const res = await sendJson<{ ok: boolean }>(
      "/api/admin/feedback",
      "PATCH",
      { id, status },
      { Authorization: `Bearer ${token}` },
    );
    setBusyId(null);
    if (res.ok) {
      setItems((list) => list.filter((item) => item.id !== id || statusFilter === "all"));
      setReloadKey((k) => k + 1);
    } else {
      setError(res.error);
    }
  };

  if (!token) {
    return (
      <Shell>
        <form onSubmit={connect} className="mx-auto mt-24 flex max-w-md flex-col gap-6 border border-champagne/20 bg-charcoal-soft p-10">
          <h1 className="font-serif text-4xl">Admin sign-in</h1>
          <p className="text-sm text-ivory/65">Enter the admin access token configured in your environment variables.</p>
          <label htmlFor="admin-token" className="text-[11px] uppercase tracking-[0.18em] text-ivory/70">
            Access token
          </label>
          <input
            id="admin-token"
            type="password"
            autoComplete="off"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="field-input !border-ivory/30 !text-ivory"
          />
          <button type="submit" className="btn-primary">
            Open moderation
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex flex-col gap-6 border-b border-champagne/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Moderation</p>
            <h1 className="mt-3 font-serif text-4xl">Website feedback</h1>
            <p className="mt-2 max-w-xl text-sm text-ivory/60">
              Only approved feedback with publish permission is shown on the website. These are not Google reviews.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.sessionStorage.removeItem(TOKEN_KEY);
              setToken("");
              setItems([]);
            }}
            className="btn-outline !px-5 !py-3 self-start"
          >
            Sign out
          </button>
        </header>

        <div className="mt-8 flex flex-col gap-6">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
            {(["pending", "approved", "rejected", "hidden", "all"] as StatusFilter[]).map((s) => (
              <FilterButton key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s}
              </FilterButton>
            ))}
          </div>
          <div role="group" aria-label="Filter by rating" className="flex flex-wrap gap-2">
            {[0, 5, 4, 3, 2, 1].map((r) => (
              <FilterButton key={r} active={ratingFilter === r} onClick={() => setRatingFilter(r)}>
                {r === 0 ? "all ratings" : `${r} stars`}
              </FilterButton>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="mt-10">
          {loading && <p className="text-sm text-ivory/60">Loading…</p>}
          {error && (
            <p role="alert" className="mb-6 border border-red-700/50 bg-red-900/20 p-4 text-sm text-red-200">
              {error}
            </p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="border border-champagne/15 p-8 text-sm text-ivory/60">No feedback matches these filters.</p>
          )}

          <ul className="space-y-5">
            {items.map((item) => (
              <li key={item.id} className="border border-champagne/15 bg-charcoal-soft p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Stars rating={item.rating} size={14} />
                    <span className={`border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.18em] ${item.permission_to_publish ? "text-emerald-300" : "text-ivory/45"}`}>
                      {item.permission_to_publish ? "Publish permission granted" : "No publish permission"}
                    </span>
                  </div>
                  <time dateTime={item.created_at} className="text-xs text-ivory/50">
                    {new Date(item.created_at).toLocaleString("en-GB")}
                  </time>
                </div>

                <p className="mt-5 whitespace-pre-line font-serif text-lg leading-relaxed text-ivory/90">“{item.message}”</p>

                <dl className="mt-5 grid gap-2 text-xs text-ivory/60 sm:grid-cols-3">
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-ivory/40">Name</dt>
                    <dd className="text-ivory/85">{item.full_name}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-ivory/40">Email</dt>
                    <dd className="break-all text-ivory/85">{item.email}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-ivory/40">Company / Service</dt>
                    <dd className="text-ivory/85">
                      {item.company_name || "—"} · {item.service_used}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionButton disabled={busyId === item.id} onClick={() => setStatus(item.id, "approved")}>
                    Approve
                  </ActionButton>
                  <ActionButton disabled={busyId === item.id} onClick={() => setStatus(item.id, "hidden")}>
                    Hide
                  </ActionButton>
                  <ActionButton disabled={busyId === item.id} onClick={() => setStatus(item.id, "rejected")} danger>
                    Reject
                  </ActionButton>
                  {item.status !== "pending" && (
                    <ActionButton disabled={busyId === item.id} onClick={() => setStatus(item.id, "pending")}>
                      Reset to pending
                    </ActionButton>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <div className="border-b border-champagne/15 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo compact href="/" />
          <a href="/" className="text-[11px] uppercase tracking-[0.2em] text-champagne hover:text-champagne-light">
            View site
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
        active ? "border-champagne bg-champagne text-charcoal" : "border-ivory/25 text-ivory/70 hover:border-champagne hover:text-champagne"
      }`}
    >
      {children}
    </button>
  );
}

function ActionButton({
  onClick,
  disabled,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
        danger ? "border-red-400/50 text-red-300 hover:bg-red-900/30" : "border-champagne/50 text-champagne hover:bg-champagne hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );
}
