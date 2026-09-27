# ForYou v4

A bilingual Arabic/English Next.js experience for creating private message surprises.

## What changed in v4

- Home rebuilt around the supplied pink/cream art direction.
- Supplied desktop and mobile artwork is used responsively for the hero and three-step section.
- GSAP entrance and scroll motion for headings, copy, and small decorative elements.
- The previous dark closing area was replaced with a light, soft CTA and light footer.
- The old "message stays at the center" section was replaced with a new personal-message composition panel.
- Reveal selection was rebuilt into an organised picker with real DOM/SVG interactive objects (envelope, gift box, balloon, lantern, secret bottle), not stock photography.
- Gift opening now uses those same animated reveal objects.
- Arabic and English continue across Home, Create, Gift, and share links.
- `Designed by RiWebs` remains in the footer.
- Fonts use an offline-safe system stack, so local development does not depend on Google Fonts.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env` if needed and provide the public Supabase values.
For share links after deployment, set:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Checks

- TypeScript: `tsc --noEmit` passed.
- Next production build completed successfully in the build environment (using the installed SWC WASM fallback because external package downloads are blocked there).
