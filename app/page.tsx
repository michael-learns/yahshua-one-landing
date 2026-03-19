"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Zap } from "lucide-react";

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
   MCP SECTION — AI provider cards
══════════════════════════════════════════════════════════════ */
/* Official ChatGPT logo (OpenAI) */
function ChatGPTLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ChatGPT">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.634-2.525 10.079 10.079 0 0 0-9.612 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.634 2.524 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.996l-4.331 2.5-4.331-2.5V18z" fill="currentColor"/>
    </svg>
  );
}

/* Official Claude logo (Anthropic) */
function ClaudeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Claude">
      <path d="M22.676 5.027c-1.204 3.173-2.498 6.31-3.745 9.464-2.625 6.636-5.358 13.236-7.659 19.98-.327.95-.63 1.91-.893 2.879-.076.283.11.517.405.493 1.814-.15 3.618-.44 5.408-.764.315-.057.578-.278.685-.583.983-2.824 2.07-5.612 3.193-8.386.083-.206.284-.34.507-.34h9.39c.228 0 .432.14.513.353 1.104 2.854 2.17 5.722 3.142 8.617.093.275.346.467.635.489 1.697.128 3.395.306 5.083.527.303.04.513-.21.437-.503a63.43 63.43 0 0 0-.847-2.795c-2.29-6.713-5.007-13.28-7.618-19.887A429.97 429.97 0 0 0 27.48 5.03c-.258-.591-.8-.98-1.437-1.003a1.523 1.523 0 0 0-1.367.999zM24.84 19.52c.56 1.49 1.103 2.989 1.63 4.494.08.228-.09.463-.333.463h-5.93c-.243 0-.412-.235-.333-.463a251.48 251.48 0 0 1 1.676-4.613c.417-1.106.806-2.22 1.215-3.324.065-.176.308-.172.37.006.538 1.478 1.072 2.956 1.704 4.437z" fill="currentColor"/>
    </svg>
  );
}

function AIProviderCard({ brand }: { brand: "ChatGPT" | "Claude" }) {
  const isChatGPT = brand === "ChatGPT";
  return (
    <div
      className="px-5 py-4 rounded-2xl text-white flex items-center gap-3 whitespace-nowrap"
      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isChatGPT ? "#10A37F" : "#D97757" }}
      >
        {isChatGPT ? <ChatGPTLogo size={20} /> : <ClaudeLogo size={20} />}
      </span>
      <div>
        <div className="font-bold text-base leading-tight">{brand}</div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          {isChatGPT ? "by OpenAI" : "by Anthropic"}
        </div>
      </div>
    </div>
  );
}

function MCPHubCard() {
  return (
    <div
      className="px-6 py-5 rounded-2xl text-white text-center"
      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <Zap size={16} className="opacity-80" />
        <span className="font-bold text-base">MCP</span>
      </div>
      <div className="text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.72)" }}>
        Model Context Protocol
      </div>
    </div>
  );
}

function YahshuaOneCard() {
  return (
    <div
      className="px-5 py-4 rounded-2xl text-white flex items-center gap-3 whitespace-nowrap"
      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: "oklch(0.55 0.20 264)", border: "1px solid rgba(255,255,255,0.3)" }}
      >
        Y
      </div>
      <div>
        <div className="font-semibold text-sm leading-tight">YAHSHUA One</div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.72)" }}>Your backoffice</div>
      </div>
    </div>
  );
}

function MCPDiagram() {
  const dashLine = {
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 4px, transparent 4px, transparent 8px)",
    height: 1.5,
  };

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:flex items-center justify-center gap-0">
        {/* Left: AI providers stacked */}
        <div className="flex flex-col gap-3">
          <AIProviderCard brand="ChatGPT" />
          <AIProviderCard brand="Claude" />
        </div>

        {/* Fork SVG — two branches merging to center */}
        <svg
          width="72"
          height="120"
          viewBox="0 0 72 120"
          fill="none"
          aria-hidden
          className="flex-shrink-0"
        >
          <path
            d="M0 30 L36 30 L36 60 L72 60"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M0 90 L36 90 L36 60"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        </svg>

        {/* MCP Hub */}
        <MCPHubCard />

        {/* Straight connector */}
        <div className="flex-shrink-0" style={{ width: 56 }}>
          <div style={dashLine} />
        </div>

        {/* YAHSHUA One */}
        <YahshuaOneCard />
      </div>

      {/* ── Mobile: stacked vertically ── */}
      <div className="flex md:hidden flex-col items-center gap-3">
        <AIProviderCard brand="ChatGPT" />
        <AIProviderCard brand="Claude" />
        <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.25)" }} />
        <MCPHubCard />
        <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.25)" }} />
        <YahshuaOneCard />
      </div>
    </>
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
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              Y
            </div>
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
            Ask ChatGPT or Claude about your payroll, taxes, and finances — and get real answers from your actual business data. YAHSHUA One is the AI-powered backoffice built for Filipino businesses.
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

      {/* ── SECTION 6: FEATURE 05 — MCP / AI CONNECTIONS ──── */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24"
        style={{ background: "oklch(0.46 0.25 264)" }}
      >
        <div className="max-w-5xl mx-auto w-full">
          {/* Section number + headline + subtext */}
          <Reveal className="text-center">
            <div
              className="font-normal mb-6"
              style={{
                fontSize: "clamp(3.5rem, 7vw, 5rem)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              05.
            </div>
            <h2
              className="font-extrabold text-white mb-4"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Talk to your business
              <br />
              through AI you already know.
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mt-4"
              style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}
            >
              YAHSHUA One connects to ChatGPT and Claude through MCP — giving your AI assistant
              direct access to your payroll data, financial records, and compliance status. Ask in
              plain language. Get real answers from your actual business data.
            </p>
          </Reveal>

          {/* MCP Connection Diagram */}
          <Reveal delay={150} className="mt-12">
            <MCPDiagram />
          </Reveal>

          {/* Example interaction cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "via ChatGPT",
                labelColor: "#10A37F",
                user: "How much did we pay in government contributions last month?",
                answer: "₱42,380 total — SSS ₱18,200, PhilHealth ₱12,600, Pag-IBIG ₱11,580",
              },
              {
                label: "via Claude",
                labelColor: "#D97757",
                user: "Are all our BIR deadlines for Q1 covered?",
                answer: "Yes — 3 filed, 1 due March 25. I'll remind you 3 days before.",
              },
              {
                label: "via any AI",
                labelColor: "rgba(255,255,255,0.6)",
                user: "Who has pending overtime requests this week?",
                answer: "5 employees — Juan, Maria, Pedro, Ana, and Carlo. Approve all?",
              },
            ].map((ex, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="rounded-xl p-4 h-full"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="text-xs font-semibold mb-3" style={{ color: ex.labelColor }}>
                    💬 {ex.label}
                  </div>
                  <p
                    className="text-sm italic mb-3"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    &ldquo;{ex.user}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-white">{ex.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom note */}
          <Reveal delay={200} className="text-center mt-8">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Powered by Model Context Protocol (MCP) — the open standard for connecting AI to
              your tools.
            </p>
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
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              Y
            </div>
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
