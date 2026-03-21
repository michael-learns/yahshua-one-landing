"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { LogoMark } from "./components/Logo";

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
   INTERSECTION OBSERVER HOOK
══════════════════════════════════════════════════════════════ */
function useInView<T extends Element = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
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

/* ══════════════════════════════════════════════════════════════
   REVEAL — scroll-triggered entrance
══════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, visible } = useInView();
  const base =
    direction === "left"  ? "reveal-left"  :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" :
    "reveal";

  return (
    <div
      ref={ref}
      className={`${base}${visible ? " visible" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE LIST ITEM — individual stagger via IntersectionObserver
══════════════════════════════════════════════════════════════ */
function FeatureItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView<HTMLLIElement>(0.2);
  return (
    <li
      ref={ref}
      className={`flex items-start gap-2.5 text-[#5c5878] reveal${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: "oklch(0.92 0.07 264)" }}
      >
        <Check size={10} style={{ color: "oklch(0.46 0.25 264)" }} strokeWidth={3} />
      </span>
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCKUP: PAYROLL
══════════════════════════════════════════════════════════════ */
function PayrollMockup() {
  const employees = [
    { name: "Juan dela Cruz", role: "Manager · 22 days", amount: "28,500", init: "JD", hue: 0 },
    { name: "Maria Santos", role: "Associate · 22 days", amount: "18,000", init: "MS", hue: 1 },
    { name: "Pedro Reyes", role: "Associate · 20 days", amount: "16,363", init: "PR", hue: 2 },
    { name: "Ana Villanueva", role: "Admin · 22 days", amount: "15,200", init: "AV", hue: 3 },
  ];

  return (
    <div
      className="w-full max-w-xs rounded-2xl p-4 sm:p-5"
      style={{ background: "oklch(0.92 0.07 264)" }}
    >
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider">
              Payroll Run
            </div>
            <div className="text-sm font-bold text-[#1c1a2e]">March 2026</div>
          </div>
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-[#f0eef9] text-[#5c5878] font-semibold">
            4 employees
          </div>
        </div>

        <div className="space-y-2.5 mb-4">
          {employees.map((emp) => (
            <div
              key={emp.init}
              className="flex items-center justify-between py-2 border-b border-[#e8e6f0] last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{
                    background: `oklch(${0.46 + emp.hue * 0.07} 0.22 ${264 + emp.hue * 12})`,
                  }}
                >
                  {emp.init}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1c1a2e]">{emp.name}</div>
                  <div className="text-[10px] text-[#9896aa]">{emp.role}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[#1c1a2e] flex-shrink-0 ml-2">
                ₱{emp.amount}
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "oklch(0.46 0.25 264)" }}
          tabIndex={-1}
          aria-hidden="true"
        >
          Run Payroll →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCKUP: ACCOUNTING
══════════════════════════════════════════════════════════════ */
function AccountingMockup() {
  const bars = [55, 72, 48, 88, 65, 95, 74];

  return (
    <div className="w-full max-w-xs rounded-2xl p-4 sm:p-5 bg-white shadow-sm border border-[#e8e6f0]">
      <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider mb-0.5">
        Profit & Loss
      </div>
      <div className="text-sm font-bold text-[#1c1a2e] mb-4">Q1 2026 Overview</div>

      <div className="flex items-end gap-1.5 h-20 mb-5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${h}%`,
              background: i === 5 ? "oklch(0.46 0.25 264)" : "oklch(0.92 0.07 264)",
            }}
          />
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {[
          { label: "Revenue", value: "₱1.24M", green: false, bold: false },
          { label: "Expenses", value: "₱0.81M", green: false, bold: false },
          { label: "Net Income", value: "₱430K", green: true, bold: true },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between text-sm border-b border-[#e8e6f0] last:border-0 pb-1.5 last:pb-0"
          >
            <span className="text-[#9896aa]">{row.label}</span>
            <span
              className={
                row.green
                  ? "text-emerald-600 font-bold"
                  : `text-[#1c1a2e]${row.bold ? " font-bold" : ""}`
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-[#e8e6f0]">
        <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider mb-2">
          Recent Entries
        </div>
        {[
          { desc: "Sales Revenue", type: "CR", amt: "+₱84,500" },
          { desc: "Utilities Expense", type: "DR", amt: "-₱3,200" },
          { desc: "Salaries Expense", type: "DR", amt: "-₱312,000" },
        ].map((entry) => (
          <div
            key={entry.desc}
            className="flex items-center justify-between text-xs py-1.5 border-b border-[#e8e6f0] last:border-0"
          >
            <span className="text-[#5c5878]">{entry.desc}</span>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f0eef9] text-[#5c5878]">
                {entry.type}
              </span>
              <span className="text-[#1c1a2e] font-semibold">{entry.amt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCKUP: DEADLINE TRACKER
══════════════════════════════════════════════════════════════ */
function DeadlineMockup() {
  const deadlines = [
    { name: "SSS Monthly Contribution", agency: "SSS", due: "Mar 31", bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
    { name: "BIR VAT Return (2550M)", agency: "BIR", due: "Mar 20 ✓", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
    { name: "PhilHealth Premium", agency: "PhilHealth", due: "Apr 10", bg: "#f0eef9", text: "#5c5878", dot: "oklch(0.46 0.25 264)" },
    { name: "Pag-IBIG Contribution", agency: "Pag-IBIG", due: "Apr 15", bg: "#f0eef9", text: "#5c5878", dot: "oklch(0.46 0.25 264)" },
    { name: "BIR 1601-C Withholding", agency: "BIR", due: "Apr 10", bg: "#fef9c3", text: "#92400e", dot: "#f59e0b" },
  ];

  return (
    <div className="w-full max-w-xs rounded-2xl p-4 sm:p-5 bg-white shadow-sm border border-[#e8e6f0]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider">
            Compliance
          </div>
          <div className="text-sm font-bold text-[#1c1a2e]">Upcoming Deadlines</div>
        </div>
        <div
          className="text-[10px] px-2.5 py-1 rounded-full text-white font-semibold"
          style={{ background: "oklch(0.46 0.25 264)" }}
        >
          2 due soon
        </div>
      </div>

      <div className="space-y-2">
        {deadlines.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ background: d.bg }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.dot }} />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#1c1a2e] truncate">{d.name}</div>
                <div className="text-[10px]" style={{ color: d.text }}>{d.agency}</div>
              </div>
            </div>
            <div className="text-xs font-bold flex-shrink-0 ml-2" style={{ color: d.text }}>
              {d.due}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOCKUP: HR DASHBOARD
══════════════════════════════════════════════════════════════ */
function HRMockup() {
  const employees = [
    { name: "Juan dela Cruz", role: "Engineering", status: "Active", init: "JD", i: 0 },
    { name: "Maria Santos", role: "Operations", status: "On Leave", init: "MS", i: 1 },
    { name: "Pedro Reyes", role: "Finance", status: "Active", init: "PR", i: 2 },
    { name: "Ana Villanueva", role: "Admin", status: "Active", init: "AV", i: 3 },
  ];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#e8e6f0]">
        <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider mb-3">
          Team Directory
        </div>
        <div className="space-y-2.5">
          {employees.map((emp) => (
            <div key={emp.init} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{
                    background: `oklch(${0.46 + emp.i * 0.07} 0.22 ${264 + emp.i * 12})`,
                  }}
                >
                  {emp.init}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1c1a2e] truncate">{emp.name}</div>
                  <div className="text-[10px] text-[#9896aa]">{emp.role}</div>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${
                  emp.status === "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#f0eef9] text-[#5c5878]"
                }`}
              >
                {emp.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white shadow-sm border border-[#e8e6f0]">
        <div className="text-[10px] font-semibold text-[#9896aa] uppercase tracking-wider mb-3">
          Pending Requests
        </div>
        <div className="space-y-2">
          {[
            { name: "Maria Santos", type: "Vacation Leave", dates: "Apr 3–5" },
            { name: "Ana Villanueva", type: "Sick Leave", dates: "Mar 22" },
          ].map((req) => (
            <div key={req.name} className="rounded-xl p-2.5 bg-[#f0eef9]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-semibold text-[#1c1a2e]">{req.name}</div>
                  <div className="text-[10px] text-[#5c5878]">
                    {req.type} · {req.dates}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 justify-end">
                <button
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-white text-[#5c5878] font-semibold border border-[#e8e6f0]"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  Deny
                </button>
                <button
                  className="text-[10px] px-2.5 py-1 rounded-lg text-white font-semibold"
                  style={{ background: "oklch(0.46 0.25 264)" }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    fetch("/updates.json")
      .then((r) => r.json())
      .then(setUpdates)
      .catch(() => setUpdates([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFormState("success");
        setFormMsg(data.message);
      } else {
        setFormState("error");
        setFormMsg(data.message || "Something went wrong.");
      }
    } catch {
      setFormState("error");
      setFormMsg("Something went wrong. Please try again.");
    }
  }

  const heroWords1 = ["Your", "AI", "knows"];
  const heroWords2 = ["your", "business."];

  return (
    <div className="text-[#1c1a2e]" style={{ fontFamily: "var(--font-geist-sans, sans-serif)" }}>
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        style={{ background: "rgba(250,249,247,0.92)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="font-semibold text-[#1c1a2e] text-sm tracking-tight">
              YAHSHUA One
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/updates"
              className="text-sm font-medium text-[#5c5878] hover:text-[#1c1a2e] transition-colors hidden sm:block"
            >
              Dev Log
            </a>
            <a
              href="#waitlist"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 relative overflow-hidden"
        style={{ background: "#faf9f7" }}
      >
        <div className="flex flex-col items-center max-w-3xl w-full">
          {/* Badge — fade-in from scale */}
          <span
            className="hero-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{ background: "#f0eef9", color: "oklch(0.46 0.25 264)" }}
          >
            ✦ Now in Beta · Building in public
          </span>

          {/* Headline — word-by-word stagger */}
          <h1
            className="font-extrabold text-[#1c1a2e] mb-6"
            style={{
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            {heroWords1.map((word, i) => (
              <span
                key={`l1-${i}`}
                className="inline-block hero-word"
                style={{
                  animationDelay: `${i * 30}ms`,
                  marginRight: i < heroWords1.length - 1 ? "0.25em" : 0,
                }}
              >
                {word}
              </span>
            ))}
            <br />
            {heroWords2.map((word, i) => (
              <span
                key={`l2-${i}`}
                className="inline-block hero-word"
                style={{
                  animationDelay: `${(heroWords1.length + i) * 30}ms`,
                  marginRight: i < heroWords2.length - 1 ? "0.25em" : 0,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p
            className="hero-subtext text-xl text-[#5c5878] max-w-lg mb-10"
            style={{ lineHeight: 1.7 }}
          >
            YAHSHUA One is the AI-powered backoffice built for Filipino businesses — handling payroll, taxes, compliance, and HR so you can focus on growing.
          </p>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#waitlist"
              className="px-8 py-4 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              Join the Waitlist →
            </a>
            <a
              href="#features"
              className="text-base font-medium transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:rounded focus-visible:outline-offset-2"
              style={{ color: "oklch(0.46 0.25 264)" }}
            >
              See what&apos;s inside ↓
            </a>
          </div>
        </div>

        {/* Scroll chevron — continuous bounce */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bounce-chevron opacity-40">
          <ChevronDown size={24} className="text-[#5c5878]" />
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #faf9f7, transparent)" }}
        />
      </section>

      {/* ── SECTION 1.5: WHY AI ────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <Reveal className="text-center mb-16">
            <div className="section-label mb-3">The Shift</div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Your competitors are already
              <br />
              using AI. Are you?
            </h2>
            <p className="text-lg text-[#5c5878] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
              Running a business in the Philippines has always meant juggling payroll, BIR deadlines,
              and government contributions — all at once. AI doesn't remove that complexity.
              It handles it for you.
            </p>
          </Reveal>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {[
              {
                icon: "⏱️",
                stat: "40+ hrs",
                label: "saved per month",
                body: "The average SMB owner spends over 40 hours a month on admin — payroll, filings, bookkeeping. That's a full work week. AI gives it back.",
              },
              {
                icon: "⚠️",
                stat: "₱25,000+",
                label: "average BIR penalty",
                body: "Missing a BIR deadline or filing the wrong form costs tens of thousands in fines. AI tracks every deadline automatically — so you never miss one.",
              },
              {
                icon: "📊",
                stat: "78%",
                label: "of SMBs lack real-time data",
                body: "Most Filipino business owners decide on gut feel, not data. AI gives instant answers on cashflow, payroll costs, and liabilities — in seconds.",
              },
              {
                icon: "🚀",
                stat: "3×",
                label: "faster decisions",
                body: "Businesses using AI make operational decisions 3× faster. In a competitive market, speed is the advantage you can't afford to ignore.",
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="rounded-2xl p-6 h-full flex flex-col border border-[#e8e6f0] hover:shadow-md transition-all"
                  style={{ background: "#faf9f7" }}
                >
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <div
                    className="font-extrabold mb-0.5"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", letterSpacing: "-0.02em", color: "oklch(0.46 0.25 264)" }}
                  >
                    {card.stat}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#9896aa] mb-3">
                    {card.label}
                  </div>
                  <p className="text-sm text-[#5c5878] leading-relaxed flex-1">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Use case scenarios — before vs after */}
          <Reveal className="text-center mb-10">
            <div className="section-label mb-3">Real-World Impact</div>
            <h3
              className="font-extrabold text-[#1c1a2e] mb-3"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              A day in the life — with and without AI
            </h3>
            <p className="text-lg text-[#5c5878] max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              See how AI transforms the same tasks for both business owners and employees.
            </p>
          </Reveal>

          <div className="space-y-5 mb-20">
            {[
              {
                role: "Business Owner",
                emoji: "👔",
                scenario: "Payroll cutoff — end of month",
                without: [
                  "Manually compute SSS, PhilHealth, Pag-IBIG for each employee",
                  "Cross-check timesheets with a spreadsheet",
                  "Print, sign, and distribute payslips one by one",
                  "Encode disbursements manually into the bank portal",
                ],
                with: [
                  "Payroll auto-computed based on actual attendance data",
                  "Government contributions calculated instantly and correctly",
                  "Payslips emailed to every employee in one click",
                  "Bank disbursement file exported and ready to upload",
                ],
              },
              {
                role: "HR Officer",
                emoji: "👩‍💼",
                scenario: "Employee files a leave request",
                without: [
                  "Employee fills out a paper form and hands it to HR",
                  "HR manually checks remaining leave balance in a spreadsheet",
                  "Manager approves via text message or email chain",
                  "HR updates the spreadsheet and hopes payroll gets the memo",
                ],
                with: [
                  "Employee submits leave via self-service portal in 30 seconds",
                  "System checks leave balance and flags conflicts automatically",
                  "Manager approves with one tap — everyone's notified instantly",
                  "Payroll is updated automatically — no manual entry needed",
                ],
              },
              {
                role: "Accountant / Finance",
                emoji: "📒",
                scenario: "BIR quarterly filing",
                without: [
                  "Manually gather income data from multiple spreadsheets",
                  "Recompute withholding tax for each employee",
                  "Spend 2–3 days preparing the 1601-C and supporting docs",
                  "Scramble to meet the deadline or risk penalties",
                ],
                with: [
                  "All income and deduction data already organized in one place",
                  "Withholding tax computed automatically throughout the quarter",
                  "BIR-ready reports generated in minutes, not days",
                  "Deadline reminders sent weeks in advance — never scramble again",
                ],
              },
              {
                role: "Employee",
                emoji: "👷",
                scenario: "Checking your payslip and benefits",
                without: [
                  "Wait for HR to print and hand you your payslip",
                  "Have no idea how your deductions were computed",
                  "Call HR just to ask about your remaining leave balance",
                  "No visibility into your benefits or employment records",
                ],
                with: [
                  "Access your payslip anytime from your phone",
                  "See exactly how every deduction was calculated",
                  "Check your leave balance and request time off in seconds",
                  "Full visibility into your benefits, history, and records",
                ],
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="rounded-2xl border border-[#e8e6f0] overflow-hidden">
                  {/* Header row */}
                  <div
                    className="flex items-center gap-3 px-6 py-4 border-b border-[#e8e6f0]"
                    style={{ background: "#faf9f7" }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#9896aa]">{item.role}</span>
                      <p className="font-bold text-[#1c1a2e] text-sm leading-tight">{item.scenario}</p>
                    </div>
                  </div>

                  {/* Before / After columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Without AI */}
                    <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-[#e8e6f0]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">✕</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Without AI</span>
                      </div>
                      <ul className="space-y-2.5">
                        {item.without.map((point, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-[#5c5878]">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* With AI */}
                    <div className="p-5 md:p-6" style={{ background: "oklch(0.97 0.03 264)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                          style={{ background: "oklch(0.46 0.25 264)" }}>✓</span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "oklch(0.46 0.25 264)" }}>With YAHSHUA One</span>
                      </div>
                      <ul className="space-y-2.5">
                        {item.with.map((point, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-[#1c1a2e]">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: "oklch(0.46 0.25 264)" }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pull quote */}
          <Reveal>
            <div
              className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              <div
                className="absolute top-4 left-8 text-9xl font-serif leading-none select-none pointer-events-none"
                style={{ color: "rgba(255,255,255,0.07)" }}
              >
                "
              </div>
              <p
                className="relative font-bold text-white max-w-2xl mx-auto mb-4"
                style={{ fontSize: "clamp(1.2rem, 3vw, 1.65rem)", lineHeight: 1.45 }}
              >
                The businesses that thrive in the next decade won't be the ones with the most employees.
                They'll be the ones where every employee is empowered by AI.
              </p>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Built for Filipino business owners who want to compete at the highest level.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 2: FEATURE 01 — PAYROLL ───────────────── */}
      <section
        id="features"
        className="min-h-screen flex items-center px-6 py-24 bg-white"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text — slides in from left */}
          <Reveal direction="left">
            <div
              className="font-normal mb-4"
              style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", lineHeight: 1, color: "oklch(0.46 0.25 264)" }}
            >
              01.
            </div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Payroll that
              <br />
              runs itself.
            </h2>
            <p className="text-lg text-[#5c5878] max-w-sm mb-6" style={{ lineHeight: 1.7 }}>
              From timekeeping to payslips — YAHSHUA One handles the whole payroll process.
              Government contributions computed automatically. Employees paid on time, every time.
            </p>
            <ul className="space-y-2.5 list-none">
              <FeatureItem delay={0}>Automated SSS, PhilHealth, Pag-IBIG computation</FeatureItem>
              <FeatureItem delay={50}>Payslip generation and distribution</FeatureItem>
              <FeatureItem delay={100}>Timekeeping integration</FeatureItem>
            </ul>
          </Reveal>

          {/* Visual — slides in from right */}
          <Reveal direction="right" delay={120} className="flex justify-center lg:justify-end">
            <PayrollMockup />
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: FEATURE 02 — ACCOUNTING ────────────── */}
      <section
        className="min-h-screen flex items-center px-6 py-24"
        style={{ background: "#f0eef9" }}
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual — left on desktop, slides in from left */}
          <Reveal direction="left" delay={120} className="flex justify-center lg:justify-start order-2 lg:order-1">
            <AccountingMockup />
          </Reveal>

          {/* Text — right on desktop, slides in from right */}
          <Reveal direction="right" className="order-1 lg:order-2">
            <div
              className="font-normal mb-4"
              style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", lineHeight: 1, color: "oklch(0.46 0.25 264)" }}
            >
              02.
            </div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Books you&apos;ll
              <br />
              actually understand.
            </h2>
            <p className="text-lg text-[#5c5878] max-w-sm mb-6" style={{ lineHeight: 1.7 }}>
              Real-time accounting in plain language. BIR-ready financial reports generated
              automatically. Know exactly where your business stands — without needing an
              accounting degree.
            </p>
            <ul className="space-y-2.5 list-none">
              <FeatureItem delay={0}>BIR-compliant journal entries</FeatureItem>
              <FeatureItem delay={50}>Real-time profit &amp; loss</FeatureItem>
              <FeatureItem delay={100}>Financial reports in one click</FeatureItem>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: FEATURE 03 — COMPLIANCE ────────────── */}
      <section
        className="min-h-screen flex items-center px-6 py-24"
        style={{ background: "#faf9f7" }}
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text — slides in from left */}
          <Reveal direction="left">
            <div
              className="font-normal mb-4"
              style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", lineHeight: 1, color: "oklch(0.46 0.25 264)" }}
            >
              03.
            </div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Never miss a
              <br />
              filing deadline.
            </h2>
            <p className="text-lg text-[#5c5878] max-w-sm mb-6" style={{ lineHeight: 1.7 }}>
              SSS, PhilHealth, Pag-IBIG, BIR — YAHSHUA One tracks every government deadline for
              you. Get reminded before it&apos;s due. File with confidence.
            </p>
            <ul className="space-y-2.5 list-none">
              <FeatureItem delay={0}>Automated deadline tracking</FeatureItem>
              <FeatureItem delay={50}>Smart reminders</FeatureItem>
              <FeatureItem delay={100}>One-click filing summaries</FeatureItem>
            </ul>
          </Reveal>

          {/* Visual — slides in from right */}
          <Reveal direction="right" delay={120} className="flex justify-center lg:justify-end">
            <DeadlineMockup />
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: FEATURE 04 — HR ─────────────────────── */}
      <section className="min-h-screen flex items-center px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual — left on desktop, slides in from left */}
          <Reveal direction="left" delay={120} className="flex justify-center lg:justify-start order-2 lg:order-1">
            <HRMockup />
          </Reveal>

          {/* Text — right on desktop, slides in from right */}
          <Reveal direction="right" className="order-1 lg:order-2">
            <div
              className="font-normal mb-4"
              style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", lineHeight: 1, color: "oklch(0.46 0.25 264)" }}
            >
              04.
            </div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              HR that works
              <br />
              for your team.
            </h2>
            <p className="text-lg text-[#5c5878] max-w-sm mb-6" style={{ lineHeight: 1.7 }}>
              Manage leave requests, overtime, and employee records from one dashboard. Your team
              submits. You approve. Everyone&apos;s happy.
            </p>
            <ul className="space-y-2.5 list-none">
              <FeatureItem delay={0}>Leave and overtime management</FeatureItem>
              <FeatureItem delay={50}>Employee self-service</FeatureItem>
              <FeatureItem delay={100}>Digital HR records</FeatureItem>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 7: BUILD LOG ────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#f0eef9" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="section-label mb-3">Build Log</div>
            <h2
              className="font-extrabold text-[#1c1a2e] mb-3"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em" }}
            >
              We build in public.
            </h2>
            <div className="flex items-center gap-4 mb-10 flex-wrap">
              <p className="text-lg text-[#5c5878]" style={{ lineHeight: 1.7 }}>
                Every update, in plain language.
              </p>
              <a
                href="/updates"
                className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors hover:opacity-80 whitespace-nowrap"
                style={{
                  color: "oklch(0.46 0.25 264)",
                  borderColor: "oklch(0.46 0.25 264 / 0.35)",
                  background: "oklch(0.46 0.25 264 / 0.06)",
                }}
              >
                View all updates →
              </a>
            </div>
          </Reveal>

          {/* Loading skeleton */}
          {updates === null && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e8e6f0] p-6">
                  <div className="skeleton h-4 w-24 mb-3 rounded" />
                  <div className="skeleton h-5 w-2/3 mb-3 rounded" />
                  <div className="skeleton h-4 w-full rounded mb-1.5" />
                  <div className="skeleton h-4 w-4/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {updates !== null && updates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[#9896aa]">No updates yet. We&apos;re building!</p>
            </div>
          )}

          {/* Update cards — staggered fade-up */}
          {updates !== null && updates.length > 0 && (
            <div className="space-y-4">
              {updates.map((update, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="bg-white rounded-xl border border-[#e8e6f0] p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full badge-feature">
                        {update.badge}
                      </span>
                      <span className="text-xs text-[#9896aa]">{update.date}</span>
                    </div>
                    <h3 className="font-bold text-[#1c1a2e] mb-2 text-lg leading-snug">
                      {update.title}
                    </h3>
                    <p className="text-sm text-[#5c5878] leading-relaxed">{update.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 8: WAITLIST CTA ─────────────────────────── */}
      <section
        id="waitlist"
        className="min-h-[80vh] flex items-center justify-center px-6 py-24"
        style={{ background: "#faf9f7" }}
      >
        <div className="w-full max-w-md">
          <Reveal className="text-center mb-8">
            <h2
              className="font-extrabold text-[#1c1a2e] mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 3.25rem)", letterSpacing: "-0.03em" }}
            >
              Get in early.
            </h2>
            <p className="text-lg text-[#5c5878]" style={{ lineHeight: 1.7 }}>
              Join the waitlist and be among the first Filipino businesses on YAHSHUA One.
            </p>
          </Reveal>

          {/* Form card — scale entrance */}
          <Reveal delay={100} direction="scale">
            <div className="bg-white rounded-2xl border border-[#e8e6f0] p-8 shadow-sm">
              {formState === "success" ? (
                <div className="text-center py-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "oklch(0.92 0.07 264)" }}
                  >
                    <Check
                      style={{ color: "oklch(0.46 0.25 264)" }}
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="font-semibold text-[#1c1a2e] text-lg mb-2">
                    You&apos;re on the list!
                  </p>
                  <p className="text-[#5c5878] text-sm">{formMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5878] mb-1.5">
                      Full Name{" "}
                      <span className="text-red-400 font-normal">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Juan dela Cruz"
                      className="form-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c5878] mb-1.5">
                      Email <span className="text-red-400 font-normal">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="juan@company.com.ph"
                      className="form-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c5878] mb-1.5">
                      Company{" "}
                      <span className="text-[#9896aa] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Dela Cruz Trading"
                      className="form-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5c5878] mb-1.5">
                      Company Size{" "}
                      <span className="text-[#9896aa] font-normal">(optional)</span>
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="form-input w-full px-4 py-3 rounded-xl text-sm"
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>

                  {formState === "error" && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2.5">
                      {formMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "oklch(0.46 0.25 264)" }}
                  >
                    {formState === "loading" ? "Sending…" : "Claim My Spot →"}
                  </button>
                </form>
              )}
            </div>

            <p className="text-center text-xs text-[#9896aa] mt-4">
              No spam. No credit card.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="px-6 py-8 border-t border-[#e8e6f0]" style={{ background: "#faf9f7" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-semibold text-sm text-[#1c1a2e]">YAHSHUA One</span>
          </div>
          <p className="text-xs text-[#9896aa]">
            Built in the Philippines 🇵🇭 · © 2026 ABBA Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
