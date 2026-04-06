import { notFound } from "next/navigation";
import { LogoMark } from "../../components/Logo";
import updatesData from "../../../public/updates.json";

/* ═══════════════════════════════════════════════════════════════
   BRAND
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

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
  body?: string[];
}

const updates: Update[] = updatesData as Update[];

/* ═══════════════════════════════════════════════════════════════
   STATIC PARAMS
═══════════════════════════════════════════════════════════════ */
export async function generateStaticParams() {
  return updates.map((u) => ({ slug: u.date }));
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = updates.find((u) => u.date === slug);

  if (!update) notFound();

  const paragraphs = update.body ?? [update.description];

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
            <a href="/updates" className="text-sm font-medium hidden sm:block transition-opacity hover:opacity-70"
              style={{ color: W50 }}>← Dev Log</a>
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

      {/* ── ARTICLE ── */}
      <main className="relative max-w-3xl mx-auto px-6 pt-36 pb-20">

        {/* Back link */}
        <a
          href="/updates"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-10 transition-opacity hover:opacity-70"
          style={{ color: W50 }}
        >
          ← Back to Dev Log
        </a>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <Badge label={update.badge} />
          <span className="text-xs font-medium" style={{ color: W30 }}>
            {formatDate(update.date)}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-bold text-white mb-10 leading-tight"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          {update.title}
        </h1>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: "2.5rem" }} />

        {/* Body */}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: W70,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </main>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
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
