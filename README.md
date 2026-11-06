# YourDailyBook — Website

The real product site for YourDailyBook (AI audiobook service), to be deployed at **yourdailybook.com**.

## Files

- `index.html` — the main site: hero, Daily Books / Made For You / Write Your Own tabs, Pricing, Policies preview, footer, sticky audio player, sign-up and log-in modals, 18+ age gate.
- `policies.html` — the Policies Hub: plain-language summaries of all 9 policy documents + the Children's Safety note.
- `style.css` — all styling. Warm paper theme, system fonts only, no external assets.
- `app.js` — all front-end logic: tab switching, genre/spice filters, book catalog rendering, the simulated audio player, the Made For You preview, the Write Your Own flow preview, modals, age gate.

## How to view it

Open `index.html` in any browser. No build step, no server required — everything works from local files.

## Placeholders (to replace before/at launch)

1. **Real book content** — the 30 books in `app.js` (`BOOKS`) are invented placeholders (titles + one-line descriptions). Replace with the real generated catalog (a new book per genre, every day). No real book text is generated anywhere on the site.
2. **Real audio** — the player is simulated (progress advances on a timer). Replace with real audio files + word-timing maps for seamless voice switching.
3. **Sign-up / log-in backend** — the sign-up form currently shows a waitlist-style confirmation; log-in shows a "sign-in opens at launch" note. Needs real accounts + Stripe checkout.
4. **Payment integration** — no Stripe integration yet. Pricing shown is the locked pricing.
5. **Upfront fee amount** — shown as `$[amount]` (to be set). The policy explains what it pays for and that it is non-refundable once signup completes.
6. **Full policy text** — `policies.html` has plain-language summaries only. Full legal text to be finalized and reviewed by a lawyer before launch.
7. **Reader license purchase price** — not set yet; noted as "price varies by book" on the site.
8. **Voice rendering** — the 12 descriptive voices (Warm, Deep, Bright, Smooth, Bold, Gentle, Rich, Crisp, Soft, Strong, Calm, Lively) are names in the UI only; real voice rendering (Gemini/ElevenLabs) is a backend concern.

## Locked decisions used

- Name: YourDailyBook · Domain: yourdailybook.com · Support: support@yourdailybook.com
- Tabs: Daily Books / Made For You / Write Your Own
- 10 launch genres, no Young Adult (18+ only)
- Tiers: Listener $9.99/mo, Author $24.99/mo
- Writer pricing: Standard $99, Premium $199, Long $149/$299, extra revisions $5/chapter, Author Plan $199/mo, Prolific Plan $399/mo (proposed, not yet final)
- "AI-Generated" badge on every book; "Rough Draft" label on create-your-own books
- Positioning: lead with daily + personalized books; create-your-own is the differentiator

## Deployment

Upload the contents of this folder to the web host pointed to by yourdailybook.com (static hosting — e.g. the host's static site option, GitHub Pages, Netlify, or similar). No server-side code is needed. Point the domain's DNS at the host when ready.
