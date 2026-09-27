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


## Reveal photography
The presentation previews use free-to-use Pexels photography loaded from the web:
- Stationery: https://www.pexels.com/photo/envelope-and-paper-sheets-11650476/
- Gift: https://www.pexels.com/photo/presents-on-a-beige-background-5485173/
- Balloon: https://www.pexels.com/photo/orange-balloon-on-white-surface-7185859/
- Lanterns: https://www.pexels.com/photo/illuminated-paper-lanterns-hanging-on-tree-branches-at-night-31367353/
- Message bottle: https://www.pexels.com/photo/a-bottle-on-the-seashore-26711144/

## V7 visual update

- Uses the supplied red wax-seal envelope for the envelope reveal.
- Uses the supplied gift-box figure for the gift reveal.
- Uses the supplied birthday balloon/cake drawing for Birthday recipient reactions.
- Occasion reactions remain mapped to Love, Graduation, Thank You, Miss You and Congratulations.
- Recipient reveal now uses type-specific motion (seal/letter, gift confetti, balloon pop, lantern glow, bottle note) before the final message appears.
- The final message appears as a paper note after the occasion reaction, with no demo names or prewritten filler copy.
