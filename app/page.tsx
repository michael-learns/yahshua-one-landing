"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { LogoMark } from "./components/Logo";

/* ═══════════════════════════════════════════════════════════════
   BRAND — YAHSHUA One logo palette
   Deep blue → cyan-blue → light aqua
═══════════════════════════════════════════════════════════════ */
const BG     = "#07090f";
const CARD   = "#0c1118";
const BORDER = "rgba(255,255,255,0.07)";
const A1     = "#2980B0";  // deep blue
const A2     = "#28B0E8";  // cyan-blue (primary)
const A3     = "#7DE5F0";  // light aqua
const GRAD   = `linear-gradient(135deg, ${A1} 0%, ${A3} 100%)`;
const W70    = "rgba(255,255,255,0.70)";
const W50    = "rgba(255,255,255,0.50)";
const W30    = "rgba(255,255,255,0.30)";
const W10    = "rgba(255,255,255,0.10)";
const W07    = "rgba(255,255,255,0.07)";

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
}

/* ═══════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER
═══════════════════════════════════════════════════════════════ */
function useInView<T extends Element = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════════════════════
   REVEAL — scroll-triggered entrance
═══════════════════════════════════════════════════════════════ */
function Reveal({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, visible } = useInView();
  const base =
    direction === "left"  ? "reveal-left"  :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" : "reveal";
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

/* ═══════════════════════════════════════════════════════════════
   BENTO CARD
═══════════════════════════════════════════════════════════════ */
function BentoCard({
  children, className = "", glow = false, accentBg = false, style = {},
}: {
  children: React.ReactNode; className?: string;
  glow?: boolean; accentBg?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden relative ${className}`}
      style={{
        background: accentBg
          ? `linear-gradient(135deg, rgba(41,128,176,0.22) 0%, rgba(125,229,240,0.09) 100%), ${CARD}`
          : CARD,
        border: `1px solid ${BORDER}`,
        boxShadow: glow
          ? `0 0 70px rgba(40,176,232,0.12), 0 1px 0 rgba(255,255,255,0.05) inset`
          : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARD LABEL
═══════════════════════════════════════════════════════════════ */
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: A2 }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCKUP: PAYROLL
═══════════════════════════════════════════════════════════════ */
function PayrollMockup() {
  const employees = [
    { name: "Juan dela Cruz", role: "Manager · 22 days", amount: "28,500", init: "JD", h: 200 },
    { name: "Maria Santos",   role: "Associate · 22 days", amount: "18,000", init: "MS", h: 210 },
    { name: "Pedro Reyes",    role: "Associate · 20 days", amount: "16,363", init: "PR", h: 220 },
    { name: "Ana Villanueva", role: "Admin · 22 days",     amount: "15,200", init: "AV", h: 230 },
  ];
  return (
    <div className="w-full rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9896aa]">Payroll Run</div>
          <div className="text-sm font-bold text-[#1c1a2e]">March 2026</div>
        </div>
        <div className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#e8f6fc] text-[#2980B0]">4 employees</div>
      </div>
      <div className="space-y-2 mb-3">
        {employees.map((emp) => (
          <div key={emp.init} className="flex items-center justify-between py-1.5 border-b border-[#e8e6f0] last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: `hsl(${emp.h}, 65%, 44%)` }}>
                {emp.init}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1c1a2e]">{emp.name}</div>
                <div className="text-[10px] text-[#9896aa]">{emp.role}</div>
              </div>
            </div>
            <div className="text-xs font-bold text-[#1c1a2e]">₱{emp.amount}</div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 rounded-lg text-white text-xs font-semibold"
        style={{ background: A2 }} tabIndex={-1} aria-hidden>Run Payroll →</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCKUP: ACCOUNTING
═══════════════════════════════════════════════════════════════ */
function AccountingMockup() {
  const bars = [55, 72, 48, 88, 65, 95, 74];
  return (
    <div className="w-full rounded-xl p-4 bg-white shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9896aa] mb-0.5">Profit & Loss</div>
      <div className="text-sm font-bold text-[#1c1a2e] mb-3">Q1 2026</div>
      <div className="flex items-end gap-1 h-14 mb-3">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t"
            style={{ height: `${h}%`, background: i === 5 ? A2 : `rgba(40,176,232,0.18)` }} />
        ))}
      </div>
      {[
        { label: "Revenue",    value: "₱1.24M" },
        { label: "Expenses",   value: "₱0.81M" },
        { label: "Net Income", value: "₱430K", accent: true },
      ].map((row) => (
        <div key={row.label} className="flex justify-between text-xs border-b border-[#e8e6f0] last:border-0 py-1.5">
          <span className="text-[#9896aa]">{row.label}</span>
          <span style={{ color: row.accent ? "#16a34a" : "#1c1a2e", fontWeight: row.accent ? 700 : 400 }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCKUP: COMPLIANCE
═══════════════════════════════════════════════════════════════ */
function ComplianceMockup() {
  const items = [
    { name: "SSS Monthly Contribution", agency: "SSS",       due: "Mar 31",   s: "soon" },
    { name: "BIR VAT Return (2550M)",   agency: "BIR",       due: "Mar 20 ✓", s: "done" },
    { name: "PhilHealth Premium",       agency: "PhilHealth", due: "Apr 10",   s: "ok"   },
    { name: "BIR 1601-C Withholding",   agency: "BIR",       due: "Apr 10",   s: "warn" },
  ];
  const C = {
    soon: { bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
    done: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
    ok:   { bg: "rgba(40,176,232,0.07)", text: A2, dot: A2 },
    warn: { bg: "#fef9c3", text: "#92400e", dot: "#f59e0b" },
  };
  return (
    <div className="w-full rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-[#1c1a2e]">Upcoming Deadlines</div>
        <div className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold bg-orange-500">2 due soon</div>
      </div>
      <div className="space-y-1.5">
        {items.map((d) => {
          const c = C[d.s as keyof typeof C];
          return (
            <div key={d.name} className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: c.bg }}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate text-[#1c1a2e]">{d.name}</div>
                  <div className="text-[10px]" style={{ color: c.text }}>{d.agency}</div>
                </div>
              </div>
              <div className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: c.text }}>{d.due}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCKUP: HR (compact)
═══════════════════════════════════════════════════════════════ */
function HRMockupCompact() {
  const reqs = [
    { name: "Maria Santos",   type: "Vacation Leave", dates: "Apr 3–5", init: "MS" },
    { name: "Ana Villanueva", type: "Sick Leave",      dates: "Mar 22",  init: "AV" },
  ];
  return (
    <div className="w-full rounded-xl p-4 bg-white shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9896aa] mb-3">Pending Requests</div>
      <div className="space-y-2.5">
        {reqs.map((req) => (
          <div key={req.name} className="rounded-lg p-3" style={{ background: "rgba(40,176,232,0.06)", border: "1px solid rgba(40,176,232,0.12)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: A1 }}>{req.init}</div>
              <div>
                <div className="text-xs font-semibold text-[#1c1a2e]">{req.name}</div>
                <div className="text-[10px] text-[#9896aa]">{req.type} · {req.dates}</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-1 rounded-md text-[10px] font-semibold text-[#5c5878] bg-white border border-[#e8e6f0]"
                tabIndex={-1} aria-hidden>Deny</button>
              <button className="flex-1 py-1 rounded-md text-[10px] font-semibold text-white"
                style={{ background: A2 }} tabIndex={-1} aria-hidden>Approve ✓</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DAY IN LIFE — DATA
═══════════════════════════════════════════════════════════════ */
const SCENARIOS = [
  {
    role: "Business Owner", emoji: "👔", scenario: "Payroll Cutoff",
    saved: "2 days", timeBefore: "2 days", timeAfter: "20 min", barRatio: 0.07,
    without: [
      { icon: "📋", text: "Manual computation per employee" },
      { icon: "😰", text: "Hours cross-checking timesheets" },
      { icon: "🖨️", text: "Print & hand out payslips one by one" },
      { icon: "🏦", text: "Encode bank disbursements manually" },
    ],
    with: [
      { icon: "⚡", text: "Auto-computed from attendance data" },
      { icon: "✅", text: "Gov contributions — instantly correct" },
      { icon: "📧", text: "All payslips sent in one click" },
      { icon: "🚀", text: "Bank file exported, ready to upload" },
    ],
  },
  {
    role: "HR Officer", emoji: "👩‍💼", scenario: "Leave Request Approval",
    saved: "4 hours", timeBefore: "4 hrs", timeAfter: "30 sec", barRatio: 0.03,
    without: [
      { icon: "📝", text: "Paper form — hand it to HR" },
      { icon: "🔍", text: "Manually check leave balance" },
      { icon: "📱", text: "Approval via text message chain" },
      { icon: "😓", text: "Update spreadsheet, hope payroll knows" },
    ],
    with: [
      { icon: "📲", text: "Self-service submit in 30 seconds" },
      { icon: "🤖", text: "Balance checked, conflicts flagged — auto" },
      { icon: "👆", text: "One-tap approval, instant notifications" },
      { icon: "🔄", text: "Payroll synced — zero manual entry" },
    ],
  },
  {
    role: "Accountant / Finance", emoji: "📒", scenario: "BIR Quarterly Filing",
    saved: "3 days", timeBefore: "3 days", timeAfter: "1 hour", barRatio: 0.04,
    without: [
      { icon: "🗂️", text: "Hunt data across multiple spreadsheets" },
      { icon: "🧮", text: "Recompute withholding tax by hand" },
      { icon: "😱", text: "2–3 days prepping 1601-C docs" },
      { icon: "⏰", text: "Scramble right before the deadline" },
    ],
    with: [
      { icon: "📊", text: "All data organized in one place" },
      { icon: "✅", text: "Tax computed automatically all quarter" },
      { icon: "📄", text: "BIR-ready reports in minutes" },
      { icon: "🔔", text: "Deadline alerts weeks in advance" },
    ],
  },
  {
    role: "Employee", emoji: "👷", scenario: "Payslip & Benefits Check",
    saved: "days of waiting", timeBefore: "days", timeAfter: "instant", barRatio: 0.02,
    without: [
      { icon: "⏳", text: "Wait for HR to print your payslip" },
      { icon: "🤷", text: "No idea how deductions are computed" },
      { icon: "📞", text: "Call HR just to check leave balance" },
      { icon: "👀", text: "Zero visibility into your own records" },
    ],
    with: [
      { icon: "📱", text: "Payslip on your phone, anytime" },
      { icon: "🔍", text: "Every deduction explained clearly" },
      { icon: "🏖️", text: "Check leave & file requests instantly" },
      { icon: "📋", text: "Full view of benefits & history" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SCENARIO CARD
═══════════════════════════════════════════════════════════════ */
function ScenarioCard({
  item, delay = 0,
}: {
  item: (typeof SCENARIOS)[number]; delay?: number;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return (
    <Reveal delay={delay}>
      <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, background: CARD }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between gap-3"
          style={{ background: "rgba(255,255,255,0.025)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex-shrink-0" style={{ fontSize: "2rem", lineHeight: 1.1 }}>{item.emoji}</span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: W30 }}>{item.role}</div>
              <div className="font-serif text-white leading-tight" style={{ fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(1.1rem, 4vw, 1.3rem)" }}>{item.scenario}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 pl-2">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: W30 }}>you save</div>
            <div className="font-sans leading-none"
              style={{ fontSize: "clamp(1.2rem, 4vw, 1.7rem)", color: A3, fontWeight: 700 }}>{item.saved}</div>
          </div>
        </div>

        {/* Animated speed bars */}
        <div ref={ref} className="px-6 py-5 flex flex-col gap-4"
          style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 whitespace-nowrap">✕ Without AI</span>
              <span className="text-lg font-bold text-red-400 ml-3">{item.timeBefore}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(239,68,68,0.14)" }}>
              <div className="h-full rounded-full bg-red-400 transition-all duration-1000 ease-out"
                style={{ width: visible ? "100%" : "0%" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: A2 }}>⚡ With AI</span>
              <span className="text-lg font-bold ml-3" style={{ color: A2 }}>{item.timeAfter}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(40,176,232,0.14)" }}>
              <div className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: visible ? `${item.barRatio * 100}%` : "0%", transitionDelay: "250ms", background: A2 }} />
            </div>
          </div>
        </div>

        {/* Icon rows */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:border-r" style={{ borderColor: BORDER }}>
            <ul className="space-y-4">
              {item.without.map((pt, j) => (
                <li key={j} className="flex items-center gap-3.5">
                  <span className="text-xl flex-shrink-0 grayscale opacity-35">{pt.icon}</span>
                  <span className="text-sm font-medium leading-snug" style={{ color: W30 }}>{pt.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6" style={{ background: "rgba(40,176,232,0.04)" }}>
            <ul className="space-y-4">
              {item.with.map((pt, j) => (
                <li key={j} className="flex items-center gap-3.5">
                  <span className="text-xl flex-shrink-0">{pt.icon}</span>
                  <span className="text-sm font-semibold leading-snug text-white">{pt.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    fetch("/updates.json").then((r) => r.json()).then(setUpdates).catch(() => setUpdates([]));
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
      if (data.success) { setFormState("success"); setFormMsg(data.message); }
      else { setFormState("error"); setFormMsg(data.message || "Something went wrong."); }
    } catch {
      setFormState("error");
      setFormMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div style={{ background: BG, color: "#fff", fontFamily: "var(--font-inter, sans-serif)", minHeight: "100vh" }}>

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(7,9,15,0.88)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="font-semibold text-white text-sm tracking-tight">YAHSHUA One</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/updates" className="text-sm font-medium hidden sm:block transition-opacity hover:opacity-70"
              style={{ color: W50 }}>Dev Log</a>
            <a href="#waitlist"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: GRAD }}>
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <main>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden" aria-label="Hero">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 80% 55% at 50% -10%, rgba(40,176,232,0.10) 0%, transparent 70%)`,
        }} />

        <div className="relative max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{ background: "rgba(40,176,232,0.1)", color: A3, border: `1px solid rgba(40,176,232,0.2)` }}>
              ✦ Now in Beta · Building in public
            </span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="font-serif text-white"
              style={{ fontSize: "clamp(3.2rem, 9vw, 7rem)", letterSpacing: "-0.025em", lineHeight: 0.97, fontWeight: 400 }}>
              Your AI knows
              <br />
              <span style={{
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                background: GRAD, backgroundClip: "text",
              }}>
                your business.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-xl mt-7 max-w-2xl mx-auto" style={{ color: W50, lineHeight: 1.7 }}>
              The AI-powered backoffice built for Filipino businesses.
              Payroll, taxes, compliance, and HR — handled automatically.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a href="#waitlist"
                className="px-9 py-4 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRAD }}>
                Join the Waitlist →
              </a>
              <a href="#features"
                className="text-base font-medium transition-opacity hover:opacity-70"
                style={{ color: A3 }}>
                See what&apos;s inside ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENTO GRID ───────────────────────────────────── */}
      <section id="features" className="px-6 pb-24" aria-label="Product features">
        <div className="max-w-7xl mx-auto">

          {/* ROW 1: Payroll (5) + Accounting (4) + Stats (3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">

            {/* [A] Payroll — col-span-5 */}
            <Reveal delay={0} className="lg:col-span-5">
              <BentoCard className="p-6 h-full flex flex-col" glow>
                <CardLabel>⚡ 01 — Payroll</CardLabel>
                <h3 className="font-serif text-white text-2xl mb-2 leading-tight" style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Payroll that<br />runs itself.
                </h3>
                <p className="text-sm mb-5" style={{ color: W50, lineHeight: 1.6 }}>
                  From timekeeping to payslips. SSS, PhilHealth, Pag-IBIG auto-computed. On time, every time.
                </p>
                <div className="mt-auto">
                  <PayrollMockup />
                </div>
              </BentoCard>
            </Reveal>

            {/* [B] Accounting — col-span-4 */}
            <Reveal delay={70} className="lg:col-span-4">
              <BentoCard className="p-6 h-full flex flex-col">
                <CardLabel>📊 02 — Accounting</CardLabel>
                <h3 className="font-serif text-white text-2xl mb-2 leading-tight" style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Books you&apos;ll<br />understand.
                </h3>
                <p className="text-sm mb-5" style={{ color: W50, lineHeight: 1.6 }}>
                  Real-time P&L. BIR-ready financial reports generated in one click.
                </p>
                <div className="mt-auto">
                  <AccountingMockup />
                </div>
              </BentoCard>
            </Reveal>

            {/* [C] Stats column — col-span-3 */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <Reveal delay={140}>
                <BentoCard className="p-6" accentBg glow>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: W30 }}>
                    Time Saved
                  </div>
                  <div className="font-sans text-white leading-none"
                    style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", letterSpacing: "-0.04em", fontWeight: 700 }}>
                    40+
                  </div>
                  <div className="text-base font-semibold mt-1" style={{ color: A3 }}>hrs / month</div>
                  <p className="text-xs mt-3 leading-relaxed" style={{ color: W30 }}>
                    Average time returned to business owners vs. manual admin work.
                  </p>
                </BentoCard>
              </Reveal>
              <Reveal delay={190}>
                <BentoCard className="p-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: W30 }}>
                    BIR Penalties Avoided
                  </div>
                  <div className="font-sans leading-none"
                    style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", letterSpacing: "-0.035em", color: A3, fontWeight: 700 }}>
                    ₱25K+
                  </div>
                  <div className="text-sm font-semibold mt-1" style={{ color: W50 }}>average fine</div>
                  <p className="text-xs mt-3 leading-relaxed" style={{ color: W30 }}>
                    Miss one BIR deadline. That&apos;s what it costs. We track all of them.
                  </p>
                </BentoCard>
              </Reveal>
            </div>
          </div>

          {/* ROW 2: Compliance (4) + HR (4) + Quote/CTA (4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

            {/* [D] Compliance — col-span-4 */}
            <Reveal delay={0} className="lg:col-span-4">
              <BentoCard className="p-6 h-full flex flex-col">
                <CardLabel>🔔 03 — Compliance</CardLabel>
                <h3 className="font-serif text-white text-2xl mb-2 leading-tight" style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Never miss a<br />filing deadline.
                </h3>
                <p className="text-sm mb-5" style={{ color: W50, lineHeight: 1.6 }}>
                  SSS, PhilHealth, Pag-IBIG, BIR — every deadline tracked for you.
                </p>
                <div className="mt-auto">
                  <ComplianceMockup />
                </div>
              </BentoCard>
            </Reveal>

            {/* [E] HR — col-span-4 */}
            <Reveal delay={70} className="lg:col-span-4">
              <BentoCard className="p-6 h-full flex flex-col">
                <CardLabel>👥 04 — HR</CardLabel>
                <h3 className="font-serif text-white text-2xl mb-2 leading-tight" style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>
                  HR that works<br />for your team.
                </h3>
                <p className="text-sm mb-5" style={{ color: W50, lineHeight: 1.6 }}>
                  Leave, overtime, records — from one dashboard. Submit. Approve. Done.
                </p>
                <div className="mt-auto">
                  <HRMockupCompact />
                </div>
              </BentoCard>
            </Reveal>

            {/* [F] Quote + CTA — col-span-4 */}
            <Reveal delay={140} className="lg:col-span-4">
              <BentoCard className="p-8 h-full flex flex-col justify-between" accentBg glow>
                {/* Big pull quote */}
                <div>
                  <div className="text-4xl mb-4 opacity-40" style={{ color: A2, fontFamily: "Georgia, serif" }}>&ldquo;</div>
                  <p className="font-bold text-white leading-snug"
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.5 }}>
                    The businesses that thrive won&apos;t have the most employees — they&apos;ll have every employee empowered by AI.
                  </p>
                  <p className="text-xs mt-4" style={{ color: W30 }}>
                    Built for Filipino business owners who want to compete at the highest level.
                  </p>
                </div>

                {/* Tags + CTA */}
                <div className="mt-8">
                  <div className="flex gap-2 flex-wrap mb-6">
                    {["Payroll", "BIR", "SSS", "HR", "Reports"].map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{ background: "rgba(40,176,232,0.12)", color: A3, border: `1px solid rgba(40,176,232,0.2)` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#waitlist"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: GRAD }}>
                    Get Early Access →
                  </a>
                </div>
              </BentoCard>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "40+",  label: "Hours saved per month" },
            { value: "₱25K+", label: "Avg BIR penalty avoided" },
            { value: "78%",  label: "SMBs lack real-time data" },
            { value: "3×",   label: "Faster decisions with AI"  },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="font-sans"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: A3, letterSpacing: "-0.03em", fontWeight: 700 }}>
                {s.value}
              </div>
              <div className="text-sm mt-1" style={{ color: W30 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DAY IN LIFE ──────────────────────────────────── */}
      <section className="py-24 px-6" aria-label="Day in the life — with and without AI">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: A2 }}>
              Real-World Impact
            </div>
            <h2 className="font-serif text-white mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05, fontWeight: 400 }}>
              A day in the life —
              <br />
              <span style={{
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                background: GRAD, backgroundClip: "text",
              }}>
                with and without AI
              </span>
            </h2>
            <p className="text-lg" style={{ color: W50, lineHeight: 1.7 }}>
              The speed difference is hard to unsee.
            </p>
          </Reveal>

          <div className="space-y-6">
            {SCENARIOS.map((item, i) => (
              <ScenarioCard key={i} item={item} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ─────────────────────────────────────── */}
      <section id="waitlist" className="py-24 px-6" style={{ borderTop: `1px solid ${BORDER}` }} aria-label="Join the waitlist">
        <div className="max-w-md mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="font-serif text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", letterSpacing: "-0.02em", fontWeight: 400 }}>
              Get in early.
            </h2>
            <p className="text-lg" style={{ color: W50, lineHeight: 1.7 }}>
              Join the waitlist. Be among the first Filipino businesses on YAHSHUA One.
            </p>
          </Reveal>

          <Reveal delay={100} direction="scale">
            <BentoCard className="p-8" glow>
              {formState === "success" ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(40,176,232,0.15)" }}>
                    <Check style={{ color: A2 }} size={24} strokeWidth={2.5} />
                  </div>
                  <p className="font-semibold text-white text-lg mb-2">You&apos;re on the list!</p>
                  <p className="text-sm" style={{ color: W50 }}>{formMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Juan dela Cruz", required: true },
                    { label: "Email",     key: "email", type: "email", placeholder: "juan@company.com.ph", required: true },
                    { label: "Company",   key: "company", type: "text", placeholder: "Dela Cruz Trading", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: W50 }}>
                        {field.label}{" "}
                        {field.required
                          ? <span className="text-red-400 font-normal">*</span>
                          : <span style={{ color: W30 }}>(optional)</span>}
                      </label>
                      <input
                        required={field.required}
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                        style={{ background: W07, border: `1.5px solid ${BORDER}` }}
                        onFocus={(e) => {
                          e.target.style.borderColor = A2;
                          e.target.style.boxShadow = `0 0 0 3px rgba(40,176,232,0.12)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = BORDER;
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: W50 }}>
                      Company Size <span style={{ color: W30 }}>(optional)</span>
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{
                        background: CARD,
                        border: `1.5px solid ${BORDER}`,
                        color: form.size ? "#fff" : W30,
                      }}
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>

                  {formState === "error" && (
                    <p className="text-sm rounded-lg px-3 py-2.5 text-red-400"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {formMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: GRAD }}
                  >
                    {formState === "loading" ? "Sending…" : "Claim My Spot →"}
                  </button>
                </form>
              )}
            </BentoCard>

            <p className="text-center text-xs mt-4" style={{ color: W30 }}>
              No spam. No credit card. Just early access.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── BUILD LOG ────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: A2 }}>Build Log</div>
            <h2 className="font-serif text-white mb-3"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", fontWeight: 400 }}>
              We build in public.
            </h2>
            <div className="flex items-center gap-4 mb-10 flex-wrap">
              <p className="text-lg" style={{ color: W50 }}>Every update, in plain language.</p>
              <a href="/updates"
                className="text-sm font-semibold px-4 py-2 rounded-full border transition-opacity hover:opacity-80"
                style={{ color: A3, borderColor: "rgba(40,176,232,0.28)", background: "rgba(40,176,232,0.06)" }}>
                View all updates →
              </a>
            </div>
          </Reveal>

          {updates === null && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="skeleton h-4 w-24 mb-3 rounded" />
                  <div className="skeleton h-5 w-2/3 mb-3 rounded" />
                  <div className="skeleton h-4 w-full rounded mb-1.5" />
                  <div className="skeleton h-4 w-4/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {updates !== null && updates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: W30 }}>No updates yet. We&apos;re building!</p>
            </div>
          )}

          {updates !== null && updates.length > 0 && (
            <div className="space-y-4">
              {updates.slice(0, 3).map((update, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full badge-feature">{update.badge}</span>
                      <span className="text-xs" style={{ color: W30 }}>{update.date}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg leading-snug">{update.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: W50 }}>{update.description}</p>
                  </div>
                </Reveal>
              ))}
              {updates.length > 3 && (
                <Reveal delay={180}>
                  <div className="text-center pt-2">
                    <a
                      href="/updates"
                      className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border transition-opacity hover:opacity-80"
                      style={{ color: A3, borderColor: "rgba(40,176,232,0.28)", background: "rgba(40,176,232,0.06)" }}
                    >
                      View full dev log →
                    </a>
                  </div>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: `1px solid ${BORDER}` }} aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: A2 }}>FAQ</div>
            <h2 id="faq-heading" className="font-serif text-white mb-10"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", fontWeight: 400 }}>
              Common questions
            </h2>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                q: "Does YAHSHUA One automate payroll computation in the Philippines?",
                a: "Yes. YAHSHUA One automatically computes payroll for all employees — including SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. It generates payslips and prepares bank disbursement files with zero manual computation required.",
              },
              {
                q: "Does it handle BIR compliance and tax filings?",
                a: "Yes. YAHSHUA One tracks all BIR deadlines including 1601-C, 2550M, and quarterly returns. It generates BIR-ready reports and alerts you weeks before every filing deadline — so you never incur penalties again.",
              },
              {
                q: "Can YAHSHUA One handle HR onboarding and offboarding?",
                a: "Yes. YAHSHUA One manages the full employee lifecycle — digital onboarding, contract management, leave requests, overtime approvals, and offboarding. Employees get a self-service portal to view their payslips, leave balances, and records anytime.",
              },
              {
                q: "Is YAHSHUA One built specifically for Filipino businesses?",
                a: "100%. YAHSHUA One is built from the ground up for the Philippine business environment — BIR, SSS, PhilHealth, and Pag-IBIG compliance baked in, Philippine Labor Code leave policies, and peso-denominated reporting. No workarounds needed.",
              },
              {
                q: "How is it different from other payroll or HR systems in the Philippines?",
                a: "Most systems only cover one area — payroll OR HR OR accounting. YAHSHUA One combines all of them in one AI-powered platform. It's also built specifically for Filipino SMBs, not adapted from a foreign product.",
              },
              {
                q: "Who is YAHSHUA One designed for?",
                a: "YAHSHUA One is built for Filipino business owners, HR officers, accountants, and finance managers who want to stop doing administrative work manually. It's also useful for employees who want visibility into their payslips, benefits, and leave balances.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <details
                  className="group rounded-xl overflow-hidden"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}
                >
                  <summary
                    className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none"
                    style={{ color: "white" }}
                  >
                    <span className="font-semibold text-base leading-snug">{item.q}</span>
                    <span className="flex-shrink-0 text-xl transition-transform group-open:rotate-45"
                      style={{ color: A2 }}>+</span>
                  </summary>
                  <div className="px-6 pb-5" style={{ color: W50, borderTop: `1px solid ${BORDER}`, paddingTop: "1.25rem" }}>
                    <p className="text-sm leading-relaxed">{item.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="px-6 py-8" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="font-semibold text-sm text-white">YAHSHUA One</span>
          </div>
          <p className="text-xs" style={{ color: W30 }}>
            Built in the Philippines 🇵🇭 · © 2026 ABBA Initiative
          </p>
        </div>
      </footer>

    </div>
  );
}
