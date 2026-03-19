"use client";

import { useState, useEffect } from "react";
import { Clock, BarChart2, FileText, Users, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Update {
  date: string;
  title: string;
  description: string;
  badge?: string;
}

type LucideIcon = typeof Clock;

interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  highlight?: boolean;
}

/* ─────────────────────────────────────────
   Feature data
───────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    Icon: Clock,
    title: "Payroll",
    description: "Automate timekeeping, contributions, and payslips.",
    delay: 0.1,
  },
  {
    Icon: BarChart2,
    title: "Accounting",
    description: "BIR-ready books, journal entries, and financial reports.",
    delay: 0.2,
  },
  {
    Icon: FileText,
    title: "Tax Compliance",
    description: "SSS, PhilHealth, Pag-IBIG, and BIR filings — handled.",
    delay: 0.3,
  },
  {
    Icon: Users,
    title: "HR",
    description: "Leaves, requests, and employee records that actually work.",
    delay: 0.4,
  },
  {
    Icon: Sparkles,
    title: "AI Copilot",
    description: "Ask questions. Get answers. Your AI backoffice assistant.",
    delay: 0.5,
    highlight: true,
  },
];

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function badgeClass(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes("launch")) return "badge-launch";
  if (b.includes("feature")) return "badge-feature";
  if (b.includes("improvement")) return "badge-improvement";
  if (b.includes("fix")) return "badge-fix";
  return "badge-feature";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ─────────────────────────────────────────
   Scroll animation hook
───────────────────────────────────────── */
function useScrollAnim() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".anim");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   Feature Card
───────────────────────────────────────── */
function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon, title, description, delay, highlight } = feature;
  return (
    <div
      className="feature-card rounded-2xl p-7 anim flex flex-col gap-5"
      style={{
        transitionDelay: `${delay}s`,
        ...(highlight
          ? {
              background: "var(--accent-light)",
              borderColor: "var(--accent-border)",
            }
          : {}),
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: highlight ? "var(--accent-mid)" : "var(--accent-light)",
          border: "1px solid var(--accent-border)",
        }}
      >
        <Icon size={19} style={{ color: "var(--accent)" }} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-[#0f172a] mb-1.5 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-[#64748b] leading-relaxed">{description}</p>
      </div>
    </div>
  );
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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

  if (status === "success") {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-semibold text-emerald-800 text-sm leading-relaxed">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-semibold text-[#64748b] tracking-wide"
          >
            Full Name <span className="text-rose-500">*</span>
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
            className="text-xs font-semibold text-[#64748b] tracking-wide"
          >
            Email Address <span className="text-rose-500">*</span>
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
            className="text-xs font-semibold text-[#64748b] tracking-wide"
          >
            Company Name{" "}
            <span className="font-normal text-[#94a3b8]">(optional)</span>
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
            className="text-xs font-semibold text-[#64748b] tracking-wide"
          >
            Company Size{" "}
            <span className="font-normal text-[#94a3b8]">(optional)</span>
          </label>
          <select
            id="size"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="form-input rounded-lg px-4 py-3 text-sm w-full appearance-none cursor-pointer"
          >
            <option value="">Select size…</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="200+">200+ employees</option>
          </select>
        </div>
      </div>

      {status === "error" && (
        <div
          className="rounded-lg px-4 py-3 text-sm text-rose-700"
          style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary rounded-xl px-8 py-4 text-base w-full cursor-pointer"
      >
        {status === "loading" ? "Joining…" : "Claim My Early Access →"}
      </button>
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

  // Re-observe update cards after they load
  useEffect(() => {
    if (!loaded || updates.length === 0) return;

    const elements = document.querySelectorAll<HTMLElement>(
      "[data-update-card]"
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => {
      el.classList.add("anim");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loaded, updates]);

  return (
    <section id="updates" className="py-24 px-6" style={{ background: "#f8fafc" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 anim">
          <p className="section-label mb-3">Build Log</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-3 leading-tight">
            What we&apos;re building
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed max-w-xl">
            Follow our progress — in plain language, not developer speak.
          </p>
        </div>

        {/* Loading state */}
        {!loaded ? (
          <div className="flex flex-col gap-4" aria-label="Loading updates">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex gap-3 mb-3">
                  <div className="skeleton h-4 w-28 rounded-full" />
                  <div className="skeleton h-4 w-16 rounded-full" />
                </div>
                <div className="skeleton h-5 w-3/4 rounded mb-2" />
                <div className="skeleton h-4 w-full rounded mb-1.5" />
                <div className="skeleton h-4 w-5/6 rounded" />
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-2xl p-10 text-center bg-white"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-[#64748b] text-sm">
              First update coming soon. Check back.
            </p>
          </div>
        ) : (
          /* Update cards */
          <div className="flex flex-col gap-4">
            {updates.map((update, i) => (
              <div
                key={i}
                data-update-card
                className="bg-white rounded-2xl p-6"
                style={{
                  border: "1px solid var(--border)",
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <time className="text-xs text-[#94a3b8] font-medium">
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
                <h3 className="text-[15px] font-semibold text-[#0f172a] mb-1.5 leading-snug">
                  {update.title}
                </h3>
                <p className="text-[#64748b] text-sm leading-relaxed">
                  {update.description}
                </p>
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
  useScrollAnim();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* ══ NAV ══ */}
      <nav className="sticky top-0 z-20 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ background: "var(--accent)" }}
              aria-hidden
            >
              Y
            </div>
            <span className="font-bold text-[#0f172a] tracking-tight text-[15px]">
              YAHSHUA One
            </span>
          </div>

          {/* CTA */}
          <a
            href="#waitlist"
            className="btn-primary text-sm px-5 py-2.5 rounded-full hidden sm:inline-flex items-center"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="px-6 pt-24 pb-32 md:pt-36 md:pb-44 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up inline-flex mb-8">
            <span
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
                border: "1px solid var(--accent-border)",
              }}
            >
              Now in Beta
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-[#0f172a]">
            Your entire backoffice.
            <br />
            <span style={{ color: "var(--accent)" }}>One platform.</span>
            <br />
            AI&#8209;powered.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up delay-200 text-lg md:text-xl text-[#64748b] max-w-xl mx-auto leading-relaxed mb-10">
            YAHSHUA One brings payroll, accounting, tax compliance, and HR
            together in one intelligent system built for Filipino businesses.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#waitlist"
              className="btn-primary rounded-full px-8 py-3.5 text-base inline-flex items-center gap-2"
            >
              Join the Waitlist
            </a>
            <a
              href="#features"
              className="btn-ghost rounded-full px-8 py-3.5 text-base font-medium inline-flex items-center gap-2"
            >
              See what&apos;s inside
            </a>
          </div>

          {/* Trust line */}
          <p className="animate-fade-up delay-400 mt-6 text-sm text-[#94a3b8]">
            No credit card. No commitment. Just early access.
          </p>
        </div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div className="border-t border-[#e2e8f0]" />

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 anim">
            <p className="section-label mb-3">Platform</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] leading-tight">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>

          {/* First row: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {FEATURES.slice(0, 3).map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>

          {/* Second row: 2 cards, centered (≈ 2/3 width of parent) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-2/3 mx-auto">
            {FEATURES.slice(3).map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPDATE LOG ══ */}
      <UpdateLog />

      {/* ══ WAITLIST ══ */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-10 anim">
            <p className="section-label mb-3">Early Access</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-3 leading-tight">
              Get ahead of the queue.
            </h2>
            <p className="text-[#64748b] text-lg leading-relaxed">
              Be among the first Filipino businesses to experience YAHSHUA One.
            </p>
          </div>

          {/* Form card */}
          <div
            className="bg-white rounded-2xl p-8 anim delay-100"
            style={{
              border: "1px solid var(--border)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            <WaitlistForm />
          </div>

          {/* Trust note */}
          <p className="mt-5 text-center text-xs text-[#94a3b8]">
            No spam. No credit card. Just honest updates as we build.
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-[#e2e8f0] py-8 px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ background: "var(--accent)" }}
              aria-hidden
            >
              Y
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#0f172a] leading-tight">
                YAHSHUA One
              </p>
              <p className="text-xs text-[#94a3b8]">by ABBA Initiative</p>
            </div>
          </div>
          <span className="text-sm text-[#94a3b8]">
            Built in the Philippines 🇵🇭
          </span>
        </div>
      </footer>
    </main>
  );
}
