# YourDailyBook — Website

The real product site for YourDailyBook (AI audiobook service), to be deployed at **yourdailybook.com**.

## Files

- `index.html` — the main site: hero, Daily Books / Made For You / Write Your Own tabs, Pricing, Policies preview, footer, sticky audio player, book reader view (preview/full states), sign-up and log-in modals, child/adult mode toggle in Write Your Own.
- `policies.html` — the Policies Hub: plain-language summaries of all 9 policy documents + the Children's Safety note.
- `style.css` — all styling. White background with light blue accents, system fonts only, no external assets.
- `app.js` — all front-end logic: tab switching, genre/spice filters, book catalog rendering, the simulated audio player, the visitor preview + sign-up gate, simulated sign-in state (with account age), age-based catalog filtering, the child/adult mode toggle, the book reader view, the Made For You preview, the Write Your Own flow preview, modals.

## How to view it

Open `index.html` in any browser. No build step, no server required — everything works from local files.

## Placeholders (to replace before/at launch)

1. **Real book content** — the 30 books in `app.js` (`BOOKS`) are invented placeholders (titles + one-line descriptions). Replace with the real generated catalog (a new book per genre, every day). No real book text is generated anywhere on the site.
2. **Real audio** — the player is simulated (progress advances on a timer). Replace with real audio files + word-timing maps for seamless voice switching.
3. **Sign-up / log-in backend** — sign-up and log-in are DEMO sign-ins: they set a simulated signed-in state in `localStorage` (no account or payment is created) so the preview gate can be tested. Needs real accounts + Stripe checkout.
4. **Payment integration** — no Stripe integration yet. Pricing shown is the locked pricing.
5. **Upfront fee amount** — shown as `$[amount]` (to be set). The policy explains what it pays for and that it is non-refundable once signup completes.
6. **Full policy text** — `policies.html` has plain-language summaries only. Full legal text to be finalized and reviewed by a lawyer before launch.
7. **Reader license purchase price** — not set yet; noted as "price varies by book" on the site.
8. **Voice rendering** — the 12 descriptive voices (Warm, Deep, Bright, Smooth, Bold, Gentle, Rich, Crisp, Soft, Strong, Calm, Lively) are names in the UI only; real voice rendering (Gemini/ElevenLabs) is a backend concern.
9. **Preview text** — the 2-paragraph preview and the 5-paragraph "full" text in `app.js` (`GENRE_OPENERS`, `FULL_CONTINUATION`) are genre-flavored placeholder prose. Real generated book text replaces them. The preview length (2 paragraphs, ~130–160 words, about half a page) and the 90-second audio preview limit are the locked design.
10. **Audio preview limit** — a visitor hears only the first 90 seconds of a book (`PREVIEW_AUDIO_SECS` in `app.js`). Enforced in the simulated player (tick, seek, chapter list). Real audio will enforce the same limit on the backend.
11. **Child/adult toggle + age filtering are simulated** — the mode comes from the date of birth entered at demo sign-up (stored in `localStorage`); the catalog spice cap (spice 1–2 for child-safe, full catalog for adults) is enforced client-side in `app.js`. Real enforcement must happen server-side at launch, and the toggle must be tied to the real account age. The minors hard stop (no sexual content involving minors, ever) applies in all modes and is a generation-time rule for the backend.

## Locked decisions used

- Name: YourDailyBook · Domain: yourdailybook.com · Support: support@yourdailybook.com
- Tabs: Daily Books / Made For You / Write Your Own
- 10 launch genres (no Young Adult genre)
- Tiers: Listener $9.99/mo, Author $24.99/mo
- Theme: white background, light blue accents (no orange/copper/amber — TY Nov 5 ~10:24 PM)
- Writer pricing: Standard $99, Premium $199, Long $149/$299, extra revisions $5/chapter, Author Plan $199/mo, Prolific Plan $399/mo (proposed, not yet final)
- "AI-Generated" badge on every book; "Rough Draft" label on create-your-own books
- Positioning: lead with daily + personalized books; create-your-own is the differentiator
- **Visitor preview + sign-up gate (TY Nov 5 ~9:55 PM)** — a visitor sees only the first paragraph or few paragraphs of each book (about half a page); clicking to read or listen to the full story takes a visitor to sign-up and opens the full story for a signed-in user. The audio preview follows the same rule (first ~90 seconds). See `~/workspace/yourdailybook-design-decisions.md`.
- **No site-wide 18+ gate — child/adult toggle in Write Your Own (TY Nov 5 ~10:20 PM)** — the site is open to all ages; the books are not X-rated (catalog spice 1–4, steamy at most, never explicit). Write Your Own has a child/adult toggle tied to the account age (DOB at sign-up): child mode generates age-appropriate books only; adult mode is unchained. A child account is locked to child mode; an adult account can switch to child mode; visitors default to child-safe. The catalog filters by age — child-safe users (child accounts + visitors) only see spice 1–2; adults see the full catalog. The minors hard stop (no sexual content involving minors, ever) applies in all modes, always.

## How to test the preview gate

1. Open `index.html` in a browser. The site opens straight to the homepage — there is no age gate.
2. **As a visitor** (default): every Daily Books card shows a "Preview" snippet with **▶ Preview** and **Read preview** buttons. Click a card, **Read preview**, or **▶ Preview** — the reader shows the first 2 paragraphs, then "— Preview ends here —" and the sign-up gate. Pressing play plays only the first 90 seconds, then stops and opens the sign-up modal. Chapters 2–13 in the chapter list are locked (🔒); seeking past 90 seconds opens the sign-up modal.
3. **As a user**: click **Sign Up** (any name/email, any date of birth, tick the box) or **Log In** (any email/password) — the header changes to "Hi, {name}" and the cards switch to **▶ Listen** / **Read full story**. Open a book: the full story text appears and playback runs the whole book. The gate is gone.
4. **Sign out** (header **Sign Out** button) to go back to the visitor state. The sign-in is remembered in `localStorage`, so a returning visitor stays signed in until they sign out.

## How to test the age modes

1. **Visitor (default, not signed in):** the Daily Books catalog shows only spice 1–2 books (the 3 Romance spice 3–4 books are hidden) and the spice filter offers only "Show all / 1 — Sweet / 2 — Mild". The catalog note under the filter says age-appropriate books are shown. In Write Your Own, the mode toggle shows **Child mode** with the Adult button disabled and a note that visitors are child-safe by default.
2. **Child account:** click **Sign Up**, enter any name/email and a date of birth under 18 (e.g., 2015-06-01), tick the box. The success message says "Child mode — age-appropriate books only." The catalog still shows spice 1–2 only, and in Write Your Own the toggle is locked to Child mode. Try the flow: the mode badge says "Child mode", the revision questions show "Friendship" instead of "Romance / chemistry", and the outline is marked age-appropriate.
3. **Adult account:** sign out, then **Sign Up** with a date of birth 18+ (e.g., 1990-05-08). The full catalog appears, including the spice 3–4 Romance books, and the spice filter offers all levels. In Write Your Own the toggle starts on **Adult mode** and can be switched to Child and back — the badge, the flow text, and the revision questions change with it (Child mode reframes question 6 as "Friendship").
4. **Log In** (any email/password) signs in as an adult (demo only — the demo login has no date of birth on file; real auth carries the account's stored DOB).

## Deployment

Upload the contents of this folder to the web host pointed to by yourdailybook.com (static hosting — e.g. the host's static site option, GitHub Pages, Netlify, or similar). No server-side code is needed. Point the domain's DNS at the host when ready.
