# Keri H. Carroll — Official Brand Kit

**Source of truth:** `brand/BrandKit.pdf`

All future design work on this campaign — website, print, mail, signs, social — **must conform to this brand kit.** Do not invent new colors, fonts, or visual treatments.

---

## Colors

| Role | Hex | Notes |
|------|-----|-------|
| **Cream / Background** | `#f7f1e8` | Primary light background. Warm off-white. |
| **Gold** | `#b08a49` | Primary accent. Scales, "Carroll" wordmark, highlights. |
| **Teal** | `#215b64` | Primary dark. Script "K", "Chancery Court Judge" banner, headings. |

**Important:** This is a **teal**, not forest green. Previous builds used `#1B4332` — that is wrong. All instances should be `#215b64`.

Supporting neutrals may be used (white, near-black, neutral grays) only for text legibility. Never introduce additional accent colors.

---

## Typography

| Use | Font | Style |
|-----|------|-------|
| **Script / "K" flourish** | **Allura Regular** | Script — for the stylized "K" initial or decorative moments |
| **Display / Headings** | **Cormorant Garamond BOLD** | Serif — primary heading face |
| **Fallback serif** | **Times New Roman BOLD** | When Cormorant isn't available (print, email) |

Cormorant Garamond is the workhorse. Allura is for accent/flourish only (never body copy). Times New Roman Bold is the print fallback.

No sans-serif in the brand. Do **not** substitute Inter, Poppins, Geist, Helvetica, or any other sans.

### Web font loading
Cormorant Garamond: Google Fonts (`weight=700`)
Allura: Google Fonts (`weight=400`)

---

## Logo

The logo locks together three elements:
1. **Scales of justice** icon (teal on light backgrounds; gold on dark backgrounds)
2. **"Keri H. Carroll"** wordmark — large Cormorant Garamond Bold, with an Allura script **K** overlapping/flourishing
3. **"CHANCERY COURT JUDGE"** banner — solid block behind text in either teal or gold

The logo appears in four approved color combinations (see `BrandKit.pdf` pages 1–4):

| Variant | Background | Scales | Wordmark | Banner |
|---------|-----------|--------|----------|--------|
| 1 | Cream | Teal | Gold | Teal banner, cream text |
| 2 | Cream | Gold | Teal | Gold banner, cream text |
| 3 | Gold | Teal | Cream | Teal banner, gold text |
| 4 | Teal | Gold | Cream | Gold banner, teal text |

Always keep a visible frame/border around the logo card when presented as a block.

---

## Voice & Feel

The brand reads as **classic, dignified, warm, and grounded** — a serif-forward, gold-and-teal aesthetic that nods to southern tradition, judicial seriousness, and approachability. Not corporate, not stark, not modern-tech. Think engraved invitation, not startup landing page.

- **Serifs everywhere.** No sans-serif.
- **Warm backgrounds**, not stark white.
- **Sharp but elegant**, not blocky or tech-like.
- **Gold accents** signal prestige without being flashy.
- **Teal** grounds the brand — authoritative without being cold.

---

## Do / Don't

**Do**
- Use the exact hex values above. No substitutes.
- Pair teal with gold for highest impact.
- Keep generous whitespace on the cream background.
- Use Allura only for single-letter flourishes or sign-offs.

**Don't**
- Don't use forest green, navy blue, or red. This is not a Butler/Bloomberg palette.
- Don't use sans-serif fonts for body or headings.
- Don't flatten the logo to a single color when color printing is available.
- Don't crop, rotate, or modify the logo mark.

---

## When referencing this in code

Tailwind theme variable mapping:

```css
--color-teal: #215b64;        /* primary dark */
--color-teal-dark: #17434a;   /* optional darker shade for hover/depth */
--color-gold: #b08a49;        /* primary accent */
--color-gold-light: #c9a668;  /* optional lighter shade */
--color-cream: #f7f1e8;       /* primary background */
--color-ink: #1a1a1a;         /* body text on cream */
```

Any future agent or contributor must read this file and `BrandKit.pdf` before making visual changes.
