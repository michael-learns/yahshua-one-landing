"use client";

import { useState, useEffect, useRef } from "react";
import { LogoMark } from "../components/Logo";

/* ═══════════════════════════════════════════════════════════════
   BRAND — same as landing page
═══════════════════════════════════════════════════════════════ */
const BG     = "#07090f";
const CARD   = "#0c1118";
const BORDER = "rgba(255,255,255,0.07)";
const A1     = "#2980B0";
const A2     = "#28B0E8";
const A3     = "#7DE5F0";
const GRAD   = `linear-gradient(135deg, ${A1} 0%, ${A3} 100%)`;
const W70    = "rgba(255,255,255,0.70)";
const W50    = "rgba(255,255,255,0.50)";
const W30    = "rgba(255,255,255,0.30)";
const W10    = "rgba(255,255,255,0.10)";
const W07    = "rgba(255,255,255,0.07)";

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
function useInView<T extends Element = HTMLDivElement>(threshold = 0.1) {
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
   REVEAL
══════════════════════════════════════════════════════════════ */
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
      className={`reveal${visible ? " visible" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BADGE
══════════════════════════════════════════════════════════════ */
function Badge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  let cls = "badge-feature";
  if (normalized === "launch") cls = "badge-launch";
  else if (normalized.includes("fix")) cls = "badge-fix";
  else if (normalized.includes("improve")) cls = "badge-improvement";

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   FORMAT DATE
══════════════════════════════════════════════════════════════ */
function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[] | null>(null);

  useEffect(() => {
    fetch("/updates.json")
      .then((r) => r.json())
      .then(setUpdates)
      .catch(() => setUpdates([]));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: BG, color: "#fff", fontFamily: "var(--font-inter, sans-serif)" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 40% at 50% -5%, rgba(40,176,232,0.08) 0%, transparent 60%)`,
      }} />

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(7,9,15,0.88)", borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <LogoMark size={28} />
            <span className="font-semibold text-white text-sm tracking-tight group-hover:opacity-70 transition-opacity">
              YAHSHUA One
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium hidden sm:block transition-opacity hover:opacity-70"
              style={{ color: W50 }}>← Back</a>
            <a
              href="/#waitlist"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: GRAD }}
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <header className="relative max-w-3xl mx-auto px-6 pt-36 pb-12">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(40,176,232,0.1)", color: A3, border: `1px solid rgba(40,176,232,0.2)` }}>
            ✦ Building in public
          </span>
        </Reveal>
        <Reveal delay={60}>
          <h1
            className="font-serif text-white mb-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            Dev Log
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-lg max-w-lg" style={{ color: W50, lineHeight: 1.7 }}>
            Every update, every milestone — in plain language.
            Follow along as we build YAHSHUA One from the ground up.
          </p>
        </Reveal>
      </header>

      {/* ── DIVIDER ── */}
      <div className="max-w-3xl mx-auto px-6">
        <div style={{ borderTop: `1px solid ${BORDER}` }} />
      </div>

      {/* ── UPDATES FEED ── */}
      <main className="relative max-w-3xl mx-auto px-6 py-12">

        {/* Loading skeleton */}
        {updates === null && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="skeleton h-6 w-24 rounded-full" />
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
                <div className="skeleton h-5 w-3/4 rounded mb-3" />
                <div className="skeleton h-4 w-full rounded mb-1.5" />
                <div className="skeleton h-4 w-5/6 rounded mb-1.5" />
                <div className="skeleton h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {updates !== null && updates.length === 0 && (
          <div className="text-center py-24">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: "rgba(40,176,232,0.1)" }}
            >
              🔨
            </div>
            <p className="text-lg font-semibold text-white mb-2">We&apos;re building.</p>
            <p style={{ color: W30 }}>Check back soon — updates are coming.</p>
          </div>
        )}

        {/* Timeline feed */}
        {updates !== null && updates.length > 0 && (
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[11px] top-2 bottom-2 w-px hidden sm:block"
              style={{ background: `linear-gradient(to bottom, ${A2}4d, transparent)` }}
            />

            <div className="space-y-8">
              {updates.map((update, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="sm:pl-10 relative">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-[22px] w-[23px] h-[23px] rounded-full hidden sm:flex items-center justify-center"
                      style={{
                        background: i === 0
                          ? A2
                          : "rgba(40,176,232,0.2)",
                        border: `2px solid ${BG}`,
                        boxShadow: i === 0 ? `0 0 0 3px rgba(40,176,232,0.2)` : "none",
                      }}
                    >
                      {i === 0 && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-2xl p-6 transition-all hover:border-[rgba(40,176,232,0.2)]"
                      style={{
                        background: CARD,
                        border: `1px solid ${i === 0 ? "rgba(40,176,232,0.18)" : BORDER}`,
                        boxShadow: i === 0 ? "0 0 40px rgba(40,176,232,0.06)" : undefined,
                      }}
                    >
                      {/* Meta row */}
                      <div className="flex items-center gap-3 flex-wrap mb-4">
                        <Badge label={update.badge} />
                        <span className="text-xs font-medium" style={{ color: W30 }}>
                          {formatDate(update.date)}
                        </span>
                        {i === 0 && (
                          <span
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                            style={{ background: A2 }}
                          >
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        className="font-bold text-white mb-3 leading-snug"
                        style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)" }}
                      >
                        {update.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm leading-relaxed" style={{ color: W50 }}>
                        {update.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal>
          <div
            className="rounded-2xl p-8 text-center overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, rgba(41,128,176,0.22) 0%, rgba(125,229,240,0.09) 100%), ${CARD}`,
              border: `1px solid rgba(40,176,232,0.18)`,
              boxShadow: "0 0 70px rgba(40,176,232,0.08)",
            }}
          >
            <p className="text-white font-bold text-xl mb-2">
              Want to be first when we launch?
            </p>
            <p className="mb-6 text-sm" style={{ color: W50 }}>
              Join the waitlist — no spam, no credit card.
            </p>
            <a
              href="/#waitlist"
              className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: GRAD }}
            >
              Claim My Spot →
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-8"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
