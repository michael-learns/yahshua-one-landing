"use client";

import { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Update {
  date: string;
  title: string;
  description: string;
  badge?: string;
}

/* ─────────────────────────────────────────
   Feature data
───────────────────────────────────────── */
const FEATURES = [
  {
    icon: "⏱",
    title: "Payroll",
    description:
      "Automate timekeeping, government contributions, and payslips.",
    delay: "delay-100",
  },
  {
    icon: "📒",
    title: "Accounting",
    description:
      "BIR-ready books, journal entries, and financial reports.",
    delay: "delay-200",
  },
  {
    icon: "🏛",
    title: "Tax Compliance",
    description:
      "SSS, PhilHealth, Pag-IBIG, and BIR filings made simple.",
    delay: "delay-300",
  },
  {
    icon: "👥",
    title: "HR",
    description:
      "Leaves, requests, and employee management that actually works.",
    delay: "delay-400",
  },
  {
    icon: "✦",
    title: "AI Copilot",
    description:
      "Ask questions, get answers. Your AI-powered backoffice assistant.",
    delay: "delay-500",
    highlight: true,
  },
];

/* ─────────────────────────────────────────
   Badge style resolver
───────────────────────────────────────── */
function badgeClass(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes("launch")) return "badge-launch";
  if (b.includes("feature")) return "badge-feature";
  if (b.includes("improvement")) return "badge-improvement";
  if (b.includes("fix")) return "badge-fix";
  return "badge-feature";
}

/* ─────────────────────────────────────────
   Format date
───────────────────────────────────────── */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ─────────────────────────────────────────
   Waitlist Form
───────────────────────────────────────── */
function WaitlistForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    size: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setForm({ name: "", email: "", company: "", size: "" });
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-medium text-slate-400 tracking-wide"
          >
            Full Name <span className="text-amber-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Juan dela Cruz"
            value={form.name}
            onChange={handleChange}
            className="form-input rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-slate-400 tracking-wide"
          >
            Email Address <span className="text-amber-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="juan@company.ph"
            value={form.email}
            onChange={handleChange}
            className="form-input rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="company"
            className="text-xs font-medium text-slate-400 tracking-wide"
          >
            Company Name{" "}
            <span className="text-slate-600 text-xs">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Dela Cruz Trading"
            value={form.company}
            onChange={handleChange}
            className="form-input rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="size"
            className="text-xs font-medium text-slate-400 tracking-wide"
          >
            Company Size{" "}
            <span className="text-slate-600 text-xs">(optional)</span>
          </label>
          <select
            id="size"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="form-input rounded-lg px-4 py-3 text-sm w-full appearance-none cursor-pointer"
          >
            <option value="">Select size...</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="200+">200+ employees</option>
          </select>
        </div>
      </div>

      {status === "success" ? (
        <div className="rounded-xl p-5 text-center"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-emerald-300 font-semibold text-sm leading-relaxed">
            {message}
          </p>
        </div>
      ) : (
        <>
          {status === "error" && (
            <div className="rounded-lg px-4 py-3 text-sm text-rose-300"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-amber rounded-xl px-8 py-4 text-base w-full sm:w-auto sm:self-start cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Joining…" : "Claim My Early Access →"}
          </button>
        </>
      )}
    </form>
  );
}

/* ─────────────────────────────────────────
   Update Log Section
───────────────────────────────────────── */
function UpdateLog() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/updates.json")
      .then((r) => r.json())
      .then((data: Update[]) => {
        setUpdates(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section
      id="updates"
      className="relative py-24 px-6"
      style={{ background: "linear-gradient(180deg, #080d1a 0%, #0a1020 100%)" }}
    >
      {/* Subtle top divider */}
      <div className="divider mb-16 max-w-4xl mx-auto" />

      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="mb-12 animate-fade-up">
          <p className="section-label mb-3">Build Log</p>
          <h2
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What We&apos;re Building
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Follow our progress — translated for real people, not developers.
          </p>
        </div>

        {/* Updates list */}
        {!loaded ? (
          <div className="flex flex-col gap-6" aria-label="Loading updates">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="w-6 h-6 rounded-full mt-1 flex-shrink-0 bg-white/10 animate-pulse" />
                <div className="flex-1 rounded-2xl p-6 glass-card space-y-3">
                  <div className="flex gap-3">
                    <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-4 w-16 rounded-full bg-white/10 animate-pulse" />
                  </div>
                  <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-full rounded bg-white/[0.06] animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-white/[0.06] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center glass-card"
          >
            <div className="text-3xl mb-3">🔨</div>
            <p className="text-slate-400 text-sm">
              First update coming soon. Check back.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {updates.map((update, i) => (
              <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Timeline line */}
                {i < updates.length - 1 && (
                  <div
                    className="absolute left-[11px] top-6 bottom-0 w-px"
                    style={{ background: "linear-gradient(180deg, rgba(99,102,241,0.3) 0%, transparent 100%)" }}
                  />
                )}

                {/* Timeline dot */}
                <div className="relative mt-1 flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                      boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white opacity-90" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-2xl p-6 glass-card animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <time className="text-xs text-slate-500 font-medium">
                      {formatDate(update.date)}
                    </time>
                    {update.badge && (
                      <span
                        className={`${badgeClass(update.badge)} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                      >
                        {update.badge}
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {update.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {update.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ══ NAV ══ */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #4f46e5, #818cf8)" }}
            aria-hidden
          >
            Y
          </div>
          <span
            className="font-semibold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            YAHSHUA One
          </span>
        </div>
        <a
          href="#waitlist"
          className="btn-amber text-xs font-bold px-5 py-2.5 rounded-full hidden sm:inline-flex items-center gap-1.5"
        >
          Join Waitlist
        </a>
      </nav>

      {/* ══ HERO ══ */}
      <section
        className="relative overflow-hidden px-6 pt-20 pb-28 md:pt-28 md:pb-36"
        style={{
          background:
            "linear-gradient(180deg, #0c1228 0%, #080d1a 60%, #080d1a 100%)",
        }}
      >
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-60" />

        {/* Animated orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 mb-8">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(79,70,229,0.15)",
                border: "1px solid rgba(79,70,229,0.3)",
                color: "#a5b4fc",
              }}
            >
              ✦ Building in Public
            </span>
          </div>

          {/* Headline */}
          <h1
            className="gradient-text animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Entire Backoffice.
            <br />
            <span className="text-white">One Platform.</span>
            <br />
            AI-Powered.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up delay-200 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            YAHSHUA One brings payroll, accounting, tax compliance, and HR
            together in one intelligent system built for Filipino businesses.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="btn-amber rounded-xl px-8 py-4 text-base font-bold inline-flex items-center gap-2"
            >
              Join the Waitlist
              <span aria-hidden>→</span>
            </a>
            <a
              href="#features"
              className="btn-indigo rounded-xl px-8 py-4 text-base inline-flex items-center gap-2"
            >
              See Features
            </a>
          </div>

          {/* Floating stat pills */}
          <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-3 mt-12">
            {["Payroll", "Accounting", "Tax Filing", "HR", "AI Copilot"].map(
              (label) => (
                <span
                  key={label}
                  className="text-xs text-slate-400 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, #080d1a 0%, transparent 100%)",
          }}
        />
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="relative py-24 px-6 overflow-hidden">
        <div className="orb orb-3" style={{ position: "absolute" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-14 animate-fade-up">
            <p className="section-label mb-3">Platform</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything You Need.{" "}
              <span className="gradient-text">Nothing You Don&apos;t.</span>
            </h2>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`glass-card rounded-2xl p-7 animate-fade-up ${f.delay} flex flex-col gap-4 ${
                  f.highlight
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
                style={
                  f.highlight
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(99,102,241,0.06))",
                        borderColor: "rgba(99,102,241,0.3)",
                      }
                    : {}
                }
              >
                {/* Icon */}
                <div
                  className="icon-badge w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                >
                  {f.icon}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-lg font-semibold text-white mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.title}
                    {f.highlight && (
                      <span
                        className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full align-middle"
                        style={{
                          background: "rgba(245,158,11,0.15)",
                          color: "#fbbf24",
                          border: "1px solid rgba(245,158,11,0.3)",
                        }}
                      >
                        AI
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPDATE LOG ══ */}
      <UpdateLog />

      {/* ══ WAITLIST ══ */}
      <section
        id="waitlist"
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0a1020 0%, #0c1228 50%, #080d1a 100%)",
        }}
      >
        {/* Orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-10 animate-fade-up">
            <p className="section-label mb-3">Early Access</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get Ahead of the Queue.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Be among the first Filipino businesses to experience YAHSHUA One.
              We&apos;re building this for you — and we&apos;ll keep you in the loop.
            </p>
          </div>

          {/* Form card */}
          <div
            className="glass-card rounded-3xl p-8 md:p-10 animate-fade-up delay-100"
          >
            <WaitlistForm />
          </div>

          {/* Trust note */}
          <p className="mt-5 text-center text-xs text-slate-600">
            No spam. No credit card. Just honest updates as we build.
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        className="relative py-10 px-6 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #818cf8)",
              }}
              aria-hidden
            >
              Y
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                YAHSHUA One
              </p>
              <p className="text-xs text-slate-600">by ABBA Initiative</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-600">
            <span>Built in the Philippines 🇵🇭</span>
            <span className="hidden sm:inline opacity-30">·</span>
            <span>© {new Date().getFullYear()} ABBA Initiative</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
