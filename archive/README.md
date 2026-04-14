# Archive — Preserved Page Versions

Files in this directory are **not compiled or routed** by Next.js. They're reference
implementations preserved for when the site scales up and a richer layout becomes
appropriate.

## Contents

### `endorsements-rich-stage-2+.tsx`

The "full" endorsements page as it existed before we simplified it for the
low-endorsement launch phase. Includes:

- Hero
- "Voices of Support" grid (non-featured approved endorsements)
- **Featured Endorsements** spotlight section (3-card grid, with placeholder fallback)
- **Four category sections** (Legal Community / Community Leaders / Organizations / Elected Officials), each with a list of endorsers
- Add Your Endorsement CTA
- Bottom CTA

**Why this was archived:** with only 1-3 real endorsements, the four category sections
rendered as "Name Placeholder / Endorsement Coming Soon" stubs, which made the page
feel empty rather than early. We simplified to a single unified grid until the
endorsement count grows past ~15 across 2+ categories.

**When to restore:**

- **6+ endorsements with 2+ featured:** Bring back the Featured Endorsements spotlight section
- **15+ endorsements with 3+ in each of 2+ categories:** Bring back the category sections
- **30+ endorsements:** Consider adding a "by the numbers" social proof bar

**How to restore:** copy the relevant sections from this file back into
`src/app/endorsements/page.tsx`. Data fetching patterns (`fetchApproved`, `featured`,
`nonFeatured`) are compatible.

---

_Do not import or modify files in this folder in production code. Git history is the
primary backup; this folder is a convenience reference._
