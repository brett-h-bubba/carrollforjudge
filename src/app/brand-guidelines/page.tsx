import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description:
    "Official brand guidelines for the Keri H. Carroll for Chancery Court Judge campaign. Colors, typography, logos, voice, and usage rules for anyone designing or building for the campaign.",
  alternates: { canonical: "/brand-guidelines" },
};

const colors = [
  {
    role: "Teal",
    hex: "#215b64",
    cssVar: "--color-teal",
    tailwind: "bg-teal / text-teal",
    usage: 'Primary dark. Script "K", headings, "Chancery Court Judge" banner, authoritative surfaces.',
  },
  {
    role: "Gold",
    hex: "#b08a49",
    cssVar: "--color-gold",
    tailwind: "bg-gold / text-gold",
    usage: 'Primary accent. Scales of justice, "Carroll" wordmark, eyebrow labels, highlights.',
  },
  {
    role: "Cream",
    hex: "#f7f1e8",
    cssVar: "--color-cream",
    tailwind: "bg-cream / text-cream",
    usage: "Primary background. Warm off-white — never stark white.",
  },
];

const supportingShades = [
  { name: "Teal dark", hex: "#17434a", cssVar: "--color-teal-dark" },
  { name: "Teal light", hex: "#2d7581", cssVar: "--color-teal-light" },
  { name: "Gold dark", hex: "#8c6d38", cssVar: "--color-gold-dark" },
  { name: "Gold light", hex: "#c9a668", cssVar: "--color-gold-light" },
  { name: "Cream dark", hex: "#ebe3d3", cssVar: "--color-cream-dark" },
  { name: "Ink", hex: "#1a1a1a", cssVar: "--color-ink" },
  { name: "Ink muted", hex: "#4a4a4a", cssVar: "--color-ink-muted" },
];

const logos = [
  {
    src: "/images/logo.png",
    label: "Primary lockup",
    caption: 'Full "Keri H. Carroll · Chancery Court Judge" lockup. Use on cream or neutral backgrounds. This is the default.',
    bg: "bg-cream",
  },
  {
    src: "/images/logo-alt.png",
    label: "Alternate lockup",
    caption: "Alternate color treatment of the same lockup. Use when the primary feels too heavy or to balance a page dominated by teal.",
    bg: "bg-cream",
  },
  {
    src: "/images/logo-og.png",
    label: "Social / OG",
    caption: "Social-share variant sized for Open Graph / Twitter cards. Use when the logo needs to read at thumbnail scale.",
    bg: "bg-teal",
  },
];

export default function BrandGuidelinesPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b-2 border-gold/40 bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            Brand Guidelines
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-teal-dark leading-tight">
            Keri H. Carroll
            <span className="font-script text-gold text-6xl sm:text-7xl align-middle ml-2">
              K
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink-muted max-w-2xl leading-relaxed">
            Official brand kit for the Carroll for Chancery Court Judge campaign.
            Everything here — colors, typography, logos, voice — is binding for
            any website, print piece, mailer, sign, or social asset carrying
            the campaign&apos;s name.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href="/brand-kit.pdf"
              className="inline-flex items-center px-5 py-3 bg-teal text-cream hover:bg-teal-dark transition-colors tracking-wide"
            >
              Download full brand kit (PDF)
            </a>
            <a
              href="#colors"
              className="inline-flex items-center px-5 py-3 border border-teal/30 text-teal hover:bg-teal/5 transition-colors tracking-wide"
            >
              Jump to colors
            </a>
          </div>
        </div>
      </section>

      {/* ── Colors ───────────────────────────────────────── */}
      <section id="colors" className="bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 01
          </p>
          <h2 className="font-display text-4xl font-bold text-teal-dark mb-4">Colors</h2>
          <p className="text-ink-muted max-w-2xl mb-12 leading-relaxed">
            Three brand colors. That&apos;s it. Teal is <em>this</em> teal
            (<code className="text-sm px-1.5 py-0.5 bg-cream-dark rounded">#215b64</code>) —
            not forest green (<code className="text-sm px-1.5 py-0.5 bg-cream-dark rounded">#1B4332</code>).
            Do not introduce additional accents.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colors.map((c) => (
              <div key={c.role} className="bg-white/40 border border-cream-dark">
                <div
                  className="h-40 border-b border-cream-dark"
                  style={{ background: c.hex }}
                  aria-label={c.role}
                />
                <div className="p-5">
                  <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                    {c.role}
                  </p>
                  <p className="font-mono text-lg text-teal-dark font-bold">{c.hex}</p>
                  <p className="font-mono text-xs text-ink-muted mt-1">{c.cssVar}</p>
                  <p className="font-mono text-xs text-ink-muted">{c.tailwind}</p>
                  <p className="text-sm text-ink mt-3 leading-snug">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold text-teal-dark mt-16 mb-4">
            Supporting shades
          </h3>
          <p className="text-ink-muted text-sm mb-6 max-w-2xl">
            Tonal variants for hover states, depth, and legibility. Never use
            them as primary accents — they support the three brand colors.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {supportingShades.map((s) => (
              <div key={s.name} className="border border-cream-dark">
                <div
                  className="h-16 border-b border-cream-dark"
                  style={{ background: s.hex }}
                  aria-label={s.name}
                />
                <div className="p-3">
                  <p className="text-[10px] text-gold font-semibold tracking-widest uppercase">
                    {s.name}
                  </p>
                  <p className="font-mono text-xs text-teal-dark font-bold">{s.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────── */}
      <section className="bg-cream-dark/30 border-y border-cream-dark">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 02
          </p>
          <h2 className="font-display text-4xl font-bold text-teal-dark mb-4">Typography</h2>
          <p className="text-ink-muted max-w-2xl mb-12 leading-relaxed">
            Serifs only. Cormorant Garamond is the workhorse; Allura is for
            single-letter flourishes; Times New Roman Bold is the print/email
            fallback. No sans-serif anywhere — no Inter, Poppins, Geist, or Helvetica substitutes.
          </p>

          <div className="space-y-12">
            {/* Cormorant Garamond */}
            <div className="bg-white/50 p-8 border border-cream-dark">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
                <div>
                  <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                    Display · Headings
                  </p>
                  <p className="font-display text-2xl font-bold text-teal-dark">
                    Cormorant Garamond Bold
                  </p>
                </div>
                <p className="font-mono text-xs text-ink-muted">
                  font-display · weight 700
                </p>
              </div>
              <p className="font-display text-6xl font-bold text-teal leading-tight">
                Experience. Fairness. Family.
              </p>
              <p className="font-display text-4xl font-bold text-ink mt-4">
                Abcdefghijklmnopqrstuvwxyz
              </p>
              <p className="font-display text-2xl text-ink mt-2">
                0123456789 — The quick brown fox jumps over the lazy dog.
              </p>
            </div>

            {/* Allura */}
            <div className="bg-white/50 p-8 border border-cream-dark">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
                <div>
                  <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                    Script · Flourish only
                  </p>
                  <p className="font-display text-2xl font-bold text-teal-dark">Allura Regular</p>
                </div>
                <p className="font-mono text-xs text-ink-muted">
                  font-script · weight 400
                </p>
              </div>
              <p className="font-script text-[10rem] leading-none text-gold">K</p>
              <p className="font-script text-4xl text-teal mt-2">Keri Carroll</p>
              <p className="text-sm text-ink-muted mt-4 italic">
                Use Allura only for the stylized &quot;K&quot; initial, a signature sign-off,
                or a single decorative word. Never for body copy or paragraphs.
              </p>
            </div>

            {/* Times New Roman fallback */}
            <div className="bg-white/50 p-8 border border-cream-dark">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
                <div>
                  <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                    Fallback · Print & Email
                  </p>
                  <p className="font-display text-2xl font-bold text-teal-dark">
                    Times New Roman Bold
                  </p>
                </div>
                <p className="font-mono text-xs text-ink-muted">system fallback</p>
              </div>
              <p
                className="text-5xl font-bold text-teal"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                Experience. Fairness. Family.
              </p>
              <p
                className="text-sm text-ink-muted mt-4"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                Used in email (Cormorant doesn&apos;t ship with most mail clients) and
                on print pieces where web fonts aren&apos;t available.
              </p>
            </div>
          </div>

          {/* Font loading */}
          <div className="mt-10 bg-teal text-cream p-6 font-mono text-xs leading-relaxed overflow-x-auto">
            <p className="text-gold/80 tracking-[0.2em] uppercase text-[10px] mb-3 font-sans">
              Loading the brand fonts
            </p>
            <pre className="whitespace-pre">
{`/* Google Fonts — include in <head> or layout.tsx */
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Allura&display=swap" rel="stylesheet" />

/* Or self-host from public/fonts/ (already in this repo):
   cormorant-400.ttf · cormorant-700.ttf · allura-400.ttf */`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── Logo ─────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 03
          </p>
          <h2 className="font-display text-4xl font-bold text-teal-dark mb-4">Logo</h2>
          <p className="text-ink-muted max-w-2xl mb-12 leading-relaxed">
            The logo locks together three elements: the <strong>scales of justice</strong>{" "}
            icon, the <strong>&quot;Keri H. Carroll&quot;</strong> wordmark with an Allura{" "}
            <strong>K</strong> flourish, and the <strong>&quot;CHANCERY COURT JUDGE&quot;</strong>{" "}
            banner. Keep a visible frame around logo cards when presenting as a block.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {logos.map((l) => (
              <div key={l.src} className="border border-cream-dark bg-white/40">
                <div className={`${l.bg} p-10 flex items-center justify-center border-b border-cream-dark`}>
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={l.src}
                      alt={l.label}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                    {l.label}
                  </p>
                  <p className="font-mono text-xs text-ink-muted mb-3">{l.src}</p>
                  <p className="text-sm text-ink leading-snug">{l.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold text-teal-dark mt-14 mb-4">
            Icon / Favicon
          </h3>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="bg-white border border-cream-dark p-6 w-32 h-32 flex items-center justify-center">
              <Image src="/icon.svg" alt="Site icon" width={64} height={64} />
            </div>
            <div className="text-sm text-ink-muted max-w-md leading-relaxed">
              Scales-of-justice mark in teal on cream. Available as{" "}
              <code className="text-xs px-1.5 py-0.5 bg-cream-dark rounded">/icon.svg</code>{" "}
              (crisp vector) and a dynamically-generated 192×192 PNG at{" "}
              <code className="text-xs px-1.5 py-0.5 bg-cream-dark rounded">/icon</code> for
              Google search and Apple touch icons.
            </div>
          </div>

          <div className="mt-10 bg-teal/5 border-l-4 border-teal p-6">
            <p className="font-display text-lg font-bold text-teal-dark mb-2">
              The four approved variants
            </p>
            <p className="text-sm text-ink leading-relaxed">
              The BrandKit PDF documents four color variants of the full lockup
              — cream/teal/gold combinations for light and dark backgrounds.
              Check <a href="/brand-kit.pdf" className="text-teal underline font-semibold">brand-kit.pdf</a>{" "}
              pages 1–4 before creating a new treatment. Never flatten the logo
              to a single color when color printing is available, and never crop,
              rotate, or re-scale the mark.
            </p>
          </div>
        </div>
      </section>

      {/* ── Voice ────────────────────────────────────────── */}
      <section className="bg-teal text-cream">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 04
          </p>
          <h2 className="font-display text-4xl font-bold text-cream mb-6">Voice &amp; Feel</h2>
          <p className="text-cream/90 text-xl leading-relaxed max-w-3xl mb-10 font-display">
            Classic, dignified, warm, and grounded. A serif-forward,
            gold-and-teal aesthetic that nods to southern tradition, judicial
            seriousness, and approachability. Think engraved invitation — not
            startup landing page.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-cream/85 max-w-3xl">
            <p><strong className="text-gold">Serifs everywhere.</strong> No sans-serif.</p>
            <p><strong className="text-gold">Warm backgrounds</strong>, not stark white.</p>
            <p><strong className="text-gold">Sharp but elegant</strong>, not blocky or tech-like.</p>
            <p><strong className="text-gold">Gold accents</strong> signal prestige without being flashy.</p>
            <p className="sm:col-span-2"><strong className="text-gold">Teal</strong> grounds the brand — authoritative without being cold.</p>
          </div>
        </div>
      </section>

      {/* ── Do / Don't ───────────────────────────────────── */}
      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 05
          </p>
          <h2 className="font-display text-4xl font-bold text-teal-dark mb-12">Do &amp; Don&apos;t</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 border-l-4 border-teal p-8">
              <p className="font-display text-xl font-bold text-teal-dark mb-4">Do</p>
              <ul className="space-y-3 text-ink text-sm leading-relaxed">
                <li>Use the <strong>exact hex values</strong> above. No substitutes.</li>
                <li>Pair <strong>teal with gold</strong> for highest impact.</li>
                <li>Keep <strong>generous whitespace</strong> on the cream background.</li>
                <li>Use <strong>Allura sparingly</strong> — single-letter flourishes or sign-offs only.</li>
                <li>Read this page and <strong>brand-kit.pdf</strong> before starting any new piece.</li>
              </ul>
            </div>
            <div className="bg-white/60 border-l-4 border-gold p-8">
              <p className="font-display text-xl font-bold text-teal-dark mb-4">Don&apos;t</p>
              <ul className="space-y-3 text-ink text-sm leading-relaxed">
                <li>Don&apos;t use <strong>forest green</strong> (#1B4332), navy, red, or other accent colors.</li>
                <li>Don&apos;t use <strong>sans-serif fonts</strong> anywhere — no Inter, Poppins, Geist, Helvetica.</li>
                <li>Don&apos;t flatten the logo to <strong>a single color</strong> when color is available.</li>
                <li>Don&apos;t <strong>crop, rotate, or modify</strong> the logo mark.</li>
                <li>Don&apos;t use <strong>Allura for body copy</strong>. It&apos;s a flourish, not a text face.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer snippets ───────────────────────────── */}
      <section className="bg-cream-dark/30 border-t border-cream-dark">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Section 06
          </p>
          <h2 className="font-display text-4xl font-bold text-teal-dark mb-4">For developers</h2>
          <p className="text-ink-muted max-w-2xl mb-10 leading-relaxed">
            Drop these tokens into any project picking up the brand. Matches
            what this repo uses in <code className="text-xs px-1.5 py-0.5 bg-cream-dark rounded">globals.css</code>.
          </p>

          <div className="space-y-6">
            <div className="bg-teal text-cream p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-gold/80 tracking-[0.2em] uppercase text-[10px] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                CSS custom properties
              </p>
              <pre className="whitespace-pre">
{`:root {
  --color-teal: #215b64;
  --color-teal-dark: #17434a;
  --color-teal-light: #2d7581;
  --color-gold: #b08a49;
  --color-gold-dark: #8c6d38;
  --color-gold-light: #c9a668;
  --color-cream: #f7f1e8;
  --color-cream-dark: #ebe3d3;
  --color-ink: #1a1a1a;
  --color-ink-muted: #4a4a4a;

  --font-display: "Cormorant Garamond", "Times New Roman", Times, serif;
  --font-script: "Allura", cursive;
}`}
              </pre>
            </div>

            <div className="bg-teal text-cream p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-gold/80 tracking-[0.2em] uppercase text-[10px] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Tailwind v4 — @theme block
              </p>
              <pre className="whitespace-pre">
{`@theme inline {
  --color-teal: #215b64;
  --color-gold: #b08a49;
  --color-cream: #f7f1e8;
  --color-ink: #1a1a1a;
  --font-display: "Cormorant Garamond", "Times New Roman", Times, serif;
  --font-script: "Allura", cursive;
}

/* Usage */
<h1 class="font-display text-teal">Morning Digest</h1>
<span class="font-script text-gold">K</span>
<p class="text-ink bg-cream">Body copy on warm background.</p>`}
              </pre>
            </div>

            <div className="bg-teal text-cream p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-gold/80 tracking-[0.2em] uppercase text-[10px] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Email-safe serif stack
              </p>
              <pre className="whitespace-pre">
{`font-family: 'Cormorant Garamond', 'Times New Roman', Times, serif;

/* Most email clients don't load web fonts — Times New Roman is the
   brand's explicit fallback per brand/BRAND.md § Typography. */`}
              </pre>
            </div>
          </div>

          <div className="mt-12 bg-white/60 border border-cream-dark p-6">
            <p className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-2">
              Source of truth
            </p>
            <p className="text-sm text-ink leading-relaxed">
              This page is generated from <code className="text-xs px-1.5 py-0.5 bg-cream-dark rounded">site/brand/BRAND.md</code>{" "}
              and <code className="text-xs px-1.5 py-0.5 bg-cream-dark rounded">site/brand/BrandKit.pdf</code>.
              If something conflicts with the PDF, the PDF wins — flag it and
              we&apos;ll update this page to match. Share this URL with any
              vendor, designer, or engineer picking up brand work.
            </p>
            <p className="text-sm text-ink mt-3">
              <a href="/brand-kit.pdf" className="text-teal underline font-semibold">
                Download full brand kit (PDF)
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
