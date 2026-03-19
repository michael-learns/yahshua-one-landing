"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  BarChart2,
  FileText,
  Users,
  Sparkles,
  CheckCircle,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`v2r ${visible ? "v2r-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #e5e7eb" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: "oklch(0.46 0.25 264)" }}
          >
            Y
          </div>
          <span
            className="font-bold text-base tracking-tight"
            style={{ color: "#1a1523" }}
          >
            YAHSHUA One
          </span>
        </div>

        {/* CTA */}
        <a
          href="#waitlist"
          className="v2-cta-btn text-sm font-semibold px-5 py-2 rounded-full text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
          style={{ background: "oklch(0.68 0.20 35)" }}
        >
          Join the Waitlist
        </a>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      className="relative"
      style={{
        background: "oklch(0.46 0.25 264)",
        clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)",
        paddingBottom: "9rem",
      }}
    >
      {/* subtle mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% -10%, oklch(0.55 0.20 280 / 0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{
            background: "rgba(255,255,255,0.14)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.20)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            style={{ boxShadow: "0 0 6px #4ade80" }}
          />
          Beta launching soon · Building in public
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-none"
          style={{ letterSpacing: "-0.03em" }}
        >
          Stop juggling apps.
          <br />
          Run your whole business
          <br />
          from one place.
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          Payroll. Accounting. Tax compliance. HR. All connected. All
          AI-powered. Built for Filipino businesses.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="#waitlist"
            className="v2-cta-btn px-8 py-4 rounded-full font-bold text-base text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
            style={{ background: "oklch(0.68 0.20 35)" }}
          >
            Join the Waitlist →
          </a>
          <a
            href="#features"
            className="v2-ghost-btn px-8 py-4 rounded-full font-semibold text-base text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ border: "1.5px solid rgba(255,255,255,0.28)" }}
          >
            See how it works
          </a>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            "🇵🇭 Built for the Philippines",
            "✓ No credit card needed",
            "✓ Free early access",
          ].map((pill) => (
            <span
              key={pill}
              className="text-sm px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.11)",
                color: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAIN POINTS
══════════════════════════════════════════════════════════════ */
const PAINS = [
  {
    emoji: "😩",
    text: "We have 4 different tools for payroll, HR, and accounting.",
  },
  {
    emoji: "😩",
    text: "BIR compliance gives me anxiety every quarter.",
  },
  {
    emoji: "😩",
    text: "I never know if our books are up to date.",
  },
];

function PainPoints() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2
            className="text-center text-2xl font-bold mb-10"
            style={{ color: "#1a1523" }}
          >
            Sound familiar?
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {PAINS.map((pain, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="rounded-xl p-5 h-full"
                style={{
                  background: "oklch(0.97 0.03 20)",
                  border: "1px solid oklch(0.90 0.05 20)",
                  borderLeft: "3px solid oklch(0.68 0.20 35)",
                }}
              >
                <div className="text-2xl mb-2">{pain.emoji}</div>
                <p
                  className="font-medium text-sm leading-relaxed"
                  style={{ color: "#1a1523" }}
                >
                  &ldquo;{pain.text}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#1a1523" }}>
              YAHSHUA One fixes all of this.
            </p>
            <div className="mt-2 text-2xl" style={{ color: "#6b7280" }}>
              ↓
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: Clock,
    title: "Payroll, done right",
    desc: "Automate timekeeping, compute government contributions, and send payslips in minutes — not hours.",
    ai: false,
  },
  {
    icon: BarChart2,
    title: "Accounting you'll actually understand",
    desc: "Real-time books, journal entries, and BIR-ready financial reports. No accounting degree required.",
    ai: false,
  },
  {
    icon: FileText,
    title: "Tax compliance on autopilot",
    desc: "Never miss an SSS, PhilHealth, Pag-IBIG, or BIR deadline again. We track it, you approve it.",
    ai: false,
  },
  {
    icon: Users,
    title: "HR that works for you",
    desc: "Manage leaves, overtime requests, and employee records from one dashboard. Your team will love it.",
    ai: false,
  },
  {
    icon: Sparkles,
    title: "Your AI business assistant",
    desc: "Ask questions in plain Filipino or English. Get instant answers about your payroll, finances, or compliance status.",
    ai: true,
  },
];

function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof FEATURES)[0];
  delay: number;
}) {
  const Icon = feature.icon;

  const inner = (
    <div className="p-6 h-full flex flex-col">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
        style={{ background: "oklch(0.46 0.25 264)" }}
      >
        <Icon size={20} color="white" />
      </div>
      <h3
        className="font-bold text-base mb-2"
        style={{ color: "#1a1523" }}
      >
        {feature.title}
      </h3>
      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: "#6b7280" }}
      >
        {feature.desc}
      </p>
      <span
        className="text-xs font-semibold"
        style={{ color: "oklch(0.46 0.25 264)" }}
      >
        Learn more →
      </span>
    </div>
  );

  if (feature.ai) {
    return (
      <Reveal delay={delay} className="md:col-span-2">
        <div
          className="rounded-2xl p-[2px] h-full"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.46 0.25 264), oklch(0.68 0.20 35))",
          }}
        >
          <div className="bg-white rounded-[14px] h-full">{inner}</div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={delay}>
      <div
        className="bg-white rounded-2xl h-full transition-shadow hover:shadow-md"
        style={{ border: "1px solid #e5e7eb" }}
      >
        {inner}
      </div>
    </Reveal>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 px-6" style={{ background: "#f8f7ff" }}>
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase mb-3"
              style={{ color: "oklch(0.46 0.25 264)" }}
            >
              The Platform
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "#1a1523", letterSpacing: "-0.02em" }}
            >
              Everything your business needs.
              <br />
              Finally in one place.
            </h2>
            <p style={{ color: "#6b7280" }}>
              No more switching tabs. No more missed deadlines. No more
              headaches.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    n: "1",
    title: "Set up your company",
    desc: "Add your employees and link your government numbers — SSS, PhilHealth, Pag-IBIG, BIR. Takes less than 10 minutes.",
  },
  {
    n: "2",
    title: "Let YAHSHUA One handle the routine",
    desc: "Payroll, contributions, and filings run automatically. You get notified when something needs your approval.",
  },
  {
    n: "3",
    title: "Focus on your business",
    desc: "Real-time insights, AI-powered answers, zero backoffice stress. You run the business. We handle the paperwork.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase mb-3"
              style={{ color: "oklch(0.46 0.25 264)" }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#1a1523", letterSpacing: "-0.02em" }}
            >
              Up and running in minutes.
            </h2>
          </div>
        </Reveal>

        <div className="relative flex flex-col md:flex-row gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="flex-1 relative">
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 left-1/2 w-full"
                  style={{
                    borderTop: "2px dashed #e5e7eb",
                    zIndex: 0,
                    transform: "translateX(28px)",
                  }}
                />
              )}
              <Reveal delay={i * 120} className="relative z-10 text-center px-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-4"
                  style={{ background: "oklch(0.46 0.25 264)" }}
                >
                  {step.n}
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "#1a1523" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6b7280" }}
                >
                  {step.desc}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   UPDATE LOG
══════════════════════════════════════════════════════════════ */
const BADGE_MAP: Record<string, { bg: string; color: string }> = {
  Launch: { bg: "oklch(0.94 0.06 264)", color: "oklch(0.38 0.24 264)" },
  Feature: { bg: "oklch(0.92 0.08 160)", color: "oklch(0.35 0.15 155)" },
  Improvement: { bg: "oklch(0.95 0.05 100)", color: "oklch(0.45 0.14 100)" },
  Fix: { bg: "oklch(0.96 0.04 20)", color: "oklch(0.50 0.15 20)" },
};

function badgeStyle(badge: string) {
  return BADGE_MAP[badge] ?? { bg: "#f3f4f6", color: "#374151" };
}

function UpdateLog() {
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetch("/updates.json")
      .then((r) => r.json())
      .then(setUpdates)
      .catch(() => setFetchError(true));
  }, []);

  return (
    <section className="py-20 px-6" style={{ background: "#f8f7ff" }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase mb-3"
              style={{ color: "oklch(0.46 0.25 264)" }}
            >
              Build Log
            </p>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#1a1523", letterSpacing: "-0.02em" }}
            >
              We build in public.
            </h2>
            <p style={{ color: "#6b7280" }}>
              Watch YAHSHUA One come to life — every update translated into
              plain language.
            </p>
          </div>
        </Reveal>

        {/* Skeleton */}
        {!updates && !fetchError && (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 animate-pulse"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {fetchError && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">😶</p>
            <p style={{ color: "#6b7280" }}>
              Couldn&apos;t load updates right now.
            </p>
          </div>
        )}

        {/* Empty */}
        {updates && updates.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🌱</p>
            <p style={{ color: "#6b7280" }}>No updates yet — stay tuned!</p>
          </div>
        )}

        {/* Entries */}
        {updates && updates.length > 0 && (
          <div className="space-y-3">
            {updates.map((u, i) => {
              const bs = badgeStyle(u.badge);
              return (
                <Reveal key={i} delay={i * 60}>
                  <div
                    className="bg-white rounded-xl p-5"
                    style={{ border: "1px solid #e5e7eb" }}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <time
                        className="text-xs"
                        style={{ color: "#6b7280" }}
                        dateTime={u.date}
                      >
                        {u.date}
                      </time>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: bs.bg, color: bs.color }}
                      >
                        {u.badge}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-base mb-1"
                      style={{ color: "#1a1523" }}
                    >
                      {u.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#6b7280" }}
                    >
                      {u.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   WAITLIST
══════════════════════════════════════════════════════════════ */
type FormStatus = "idle" | "loading" | "success" | "error";

function WaitlistSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    size: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const inputBase: React.CSSProperties = {
    borderColor: "#e5e7eb",
    color: "#1a1523",
  };

  function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "oklch(0.46 0.25 264)";
    e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.46 0.25 264 / 0.12)";
  }
  function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "#e5e7eb";
    e.currentTarget.style.boxShadow = "none";
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all";

  return (
    <section
      id="waitlist"
      className="py-24 px-6 relative"
      style={{ background: "oklch(0.46 0.25 264)" }}
    >
      {/* mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 110%, oklch(0.38 0.24 264 / 0.6) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-lg mx-auto text-center">
        <Reveal>
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Join the Waitlist
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Be the first to run your business smarter.
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.80)" }}>
            Join the waitlist. We&apos;ll let you in early, keep you updated,
            and actually listen to your feedback.
          </p>

          {/* Form card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-left">
            {status === "success" ? (
              <div className="text-center py-6">
                <CheckCircle
                  size={44}
                  className="mx-auto mb-3"
                  style={{ color: "#22c55e" }}
                />
                <p
                  className="font-bold text-lg mb-1"
                  style={{ color: "#1a1523" }}
                >
                  You&apos;re on the list!
                </p>
                <p style={{ color: "#6b7280" }}>
                  We&apos;ll keep you posted as we build. Talk soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#1a1523" }}
                    htmlFor="wl-name"
                  >
                    Full Name{" "}
                    <span style={{ color: "oklch(0.68 0.20 35)" }}>*</span>
                  </label>
                  <input
                    id="wl-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Juan dela Cruz"
                    className={inputClass}
                    style={inputBase}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#1a1523" }}
                    htmlFor="wl-email"
                  >
                    Email Address{" "}
                    <span style={{ color: "oklch(0.68 0.20 35)" }}>*</span>
                  </label>
                  <input
                    id="wl-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="juan@company.com"
                    className={inputClass}
                    style={inputBase}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#1a1523" }}
                    htmlFor="wl-company"
                  >
                    Company Name
                  </label>
                  <input
                    id="wl-company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your Business"
                    className={inputClass}
                    style={inputBase}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>

                {/* Size */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#1a1523" }}
                    htmlFor="wl-size"
                  >
                    Company Size
                  </label>
                  <select
                    id="wl-size"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className={inputClass}
                    style={{
                      ...inputBase,
                      color: form.size ? "#1a1523" : "#9ca3af",
                    }}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  >
                    <option value="">Select team size</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "oklch(0.97 0.03 20)",
                      color: "oklch(0.45 0.18 20)",
                      border: "1px solid oklch(0.88 0.07 20)",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="v2-submit-btn w-full py-4 rounded-xl font-bold text-white text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
                  style={{
                    background:
                      status === "loading"
                        ? "#9ca3af"
                        : "oklch(0.68 0.20 35)",
                    cursor:
                      status === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Claim My Spot →"}
                </button>
              </form>
            )}
          </div>

          <p
            className="mt-6 text-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            No spam. No credit card. Just honest updates.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      className="bg-white px-6 py-6"
      style={{ borderTop: "1px solid #e5e7eb" }}
    >
      <div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
        style={{ color: "#6b7280" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-white font-black"
            style={{
              background: "oklch(0.46 0.25 264)",
              fontSize: "10px",
            }}
          >
            Y
          </div>
          <span>
            YAHSHUA One{" "}
            <span style={{ color: "#9ca3af" }}>by</span> ABBA Initiative
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Built in the Philippines 🇵🇭</span>
          <span>© 2026 ABBA Initiative</span>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function V2Page() {
  return (
    <>
      <style>{`
        /* ── Scroll reveal ── */
        .v2r {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .v2r-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── CTA button ── */
        .v2-cta-btn:hover {
          background: oklch(0.62 0.21 33) !important;
        }

        /* ── Ghost button ── */
        .v2-ghost-btn:hover {
          background: rgba(255,255,255,0.10);
        }

        /* ── Submit button ── */
        .v2-submit-btn:not(:disabled):hover {
          background: oklch(0.62 0.21 33) !important;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .v2r {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <Navbar />
      <Hero />
      <PainPoints />
      <Features />
      <HowItWorks />
      <UpdateLog />
      <WaitlistSection />
      <Footer />
    </>
  );
}
