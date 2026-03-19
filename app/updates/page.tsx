"use client";

import { useState, useEffect, useRef } from "react";

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
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}
    >
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
      className="min-h-screen text-[#1c1a2e]"
      style={{ fontFamily: "var(--font-geist-sans, sans-serif)", background: "#faf9f7" }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-[#e8e6f0]"
        style={{ background: "rgba(250,249,247,0.92)" }}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "oklch(0.46 0.25 264)" }}
            >
              Y
            </div>
            <span className="font-semibold text-[#1c1a2e] text-sm tracking-tight group-hover:opacity-70 transition-opacity">
              YAHSHUA One
            </span>
          </a>
          <a
            href="/#waitlist"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
            style={{ background: "oklch(0.46 0.25 264)" }}
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <div className="hero-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: "#f0eef9", color: "oklch(0.46 0.25 264)" }}
        >
          ✦ Building in public
        </div>
        <h1
          className="font-extrabold text-[#1c1a2e] mb-4"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
          }}
        >
          Dev Log
        </h1>
        <p className="text-lg text-[#5c5878] max-w-lg" style={{ lineHeight: 1.7 }}>
          Every update, every milestone — in plain language.
          Follow along as we build YAHSHUA One from the ground up.
        </p>
      </header>

      {/* ── DIVIDER ── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-[#e8e6f0]" />
      </div>

      {/* ── UPDATES FEED ── */}
      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Loading skeleton */}
        {updates === null && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e8e6f0] p-6 shadow-sm"
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
              style={{ background: "#f0eef9" }}
            >
              🔨
            </div>
            <p className="text-lg font-semibold text-[#1c1a2e] mb-2">We&apos;re building.</p>
            <p className="text-[#9896aa]">Check back soon — updates are coming.</p>
          </div>
        )}

        {/* Timeline feed */}
        {updates !== null && updates.length > 0 && (
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[11px] top-2 bottom-2 w-px hidden sm:block"
              style={{ background: "linear-gradient(to bottom, oklch(0.46 0.25 264 / 0.3), transparent)" }}
            />

            <div className="space-y-8">
              {updates.map((update, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="sm:pl-10 relative">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-[22px] w-[23px] h-[23px] rounded-full border-2 border-white hidden sm:flex items-center justify-center"
                      style={{
                        background: i === 0
                          ? "oklch(0.46 0.25 264)"
                          : "oklch(0.88 0.10 264)",
                        boxShadow: i === 0 ? "0 0 0 3px oklch(0.46 0.25 264 / 0.2)" : "none",
                      }}
                    >
                      {i === 0 && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className="bg-white rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
                      style={{ borderColor: i === 0 ? "oklch(0.88 0.10 264)" : "#e8e6f0" }}
                    >
                      {/* Meta row */}
                      <div className="flex items-center gap-3 flex-wrap mb-4">
                        <Badge label={update.badge} />
                        <span className="text-xs text-[#9896aa] font-medium">
                          {formatDate(update.date)}
                        </span>
                        {i === 0 && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ background: "oklch(0.46 0.25 264)" }}
                          >
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        className="font-bold text-[#1c1a2e] mb-3 leading-snug"
                        style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)" }}
                      >
                        {update.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-[#5c5878] leading-relaxed">
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
            className="rounded-2xl p-8 text-center"
            style={{ background: "oklch(0.46 0.25 264)" }}
          >
            <p className="text-white font-bold text-xl mb-2">
              Want to be first when we launch?
            </p>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              Join the waitlist — no spam, no credit card.
            </p>
            <a
              href="/#waitlist"
              className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: "#fff", color: "oklch(0.46 0.25 264)" }}
            >
              Claim My Spot →
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-8 border-t border-[#e8e6f0]"
        style={{ background: "#faf9f7" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
