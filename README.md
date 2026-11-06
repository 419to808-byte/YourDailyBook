# YourDailyBook — Website

The real product site for YourDailyBook (AI audiobook service), to be deployed at **yourdailybook.com**.

## Files

- `index.html` — the main site: large dominant main tabs (Daily Books / Made For You / Write Your Own) right under the header, the tagline in two lines under the tabs, genre row on one line, Pricing, Policies preview, footer, sticky audio player, book reader view (preview/full states), sign-up and log-in modals, child/adult mode switch (birthday-controlled, display only) in Write Your Own, and a closing value-prop section (positioning line + AI disclosure + pricing) below the book grid.
- `policies.html` — the Policies Hub: plain-language summaries of all 9 policy documents + the Children's Safety note.
- `style.css` — all styling. White background with baby blue / pale blue accents (official), system fonts only, no external assets. Main tabs are large and full-width; genre row is one line (horizontal scroll on narrow screens); book cards are post-style cards.
- `app.js` — all front-end logic: tab switching (defaults to Daily Books on load), genre/spice filters (default genre All), post-style book card rendering, the simulated audio player, the visitor preview + sign-up gate, simulated sign-in state (with account age), age-based catalog filtering, the birthday-controlled child/adult mode switch, the book reader view, the Made For You preview, the Write Your Own flow preview, modals.

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
11. **Child/adult switch + age filtering are simulated** — the mode comes from the date of birth entered at demo sign-up (stored in `localStorage`); the switch is set by that birthday and is NOT user-flippable (the mode buttons are disabled display indicators; there is no UI path that lets a signed-in user change their own mode). The catalog spice cap (spice 1–2 for child-safe, full catalog for adults) is enforced client-side in `app.js`. Real enforcement must happen server-side at launch, with the switch tied to the real account age. The minors hard stop (no sexual content involving minors, ever) applies in all modes and is a generation-time rule for the backend.

## Locked decisions used

- Name: YourDailyBook · Domain: yourdailybook.com · Support: support@yourdailybook.com
- Tabs: Daily Books / Made For You / Write Your Own
- 10 launch genres (no Young Adult genre)
- Tiers: Listener $9.99/mo, Author $24.99/mo
- Theme: white background, baby blue / pale blue accents — official (baby blue #7dd3fc, official blue #0369a1, deep navy #0c4a6e; no orange/copper/amber, no royal blue #2563eb — TY Nov 5 ~10:38 PM)
- Writer pricing: Standard $99, Premium $199, Long $149/$299, extra revisions $5/chapter, Author Plan $199/mo, Prolific Plan $399/mo (proposed, not yet final)
- "AI-Generated" badge on every book; "Rough Draft" label on create-your-own books
- Positioning: lead with daily + personalized books; create-your-own is the differentiator
- **Visitor preview + sign-up gate (TY Nov 5 ~9:55 PM)** — a visitor sees the opening text of each book (the decided form: the first 2 paragraphs, about half a page, in the reader; the card shows the first paragraph as a teaser); clicking to read or listen to the full story takes a visitor to sign-up and opens the full story for a signed-in user. The audio preview follows the same rule (first ~90 seconds). See `~/workspace/yourdailybook-design-decisions.md`.
- **Layout — main tabs dominate, Daily Books default (TY Nov 5 ~10:43 PM, hero split refined ~10:54 PM)** — the three main tabs are the most prominent element at the top: large, full-width, with a one-line description under each name; they sit right under the header (nothing above them except the header). The site opens on Daily Books (the first tab). The genre row sits under the main tabs on ONE line (All + 10 genres; horizontal scroll on narrow screens instead of wrapping). Default genre is **All** — the landing shows the breadth of the catalog; TY can change the default to a single genre later. Book cards are post-style cards (slim gradient band, title header, meta line with genre/spice/chapters/length, the opening text, Listen/Read actions with the voice picker) — written from scratch for YourDailyBook; no code copied from any other project.
- **Hero split — tagline kept under the tabs, rest moved below the books (TY Nov 5 ~10:54 PM, on Muse's recommendation; two-line break ~10:55 PM)** — the old hero block is split, not moved whole. The tagline ("A new audiobook every day, one made just for you every week — and when you're ready, make your own.") stays at the top directly under the main tabs (above the genre row): it is the one line that explains the whole site and maps directly to the three tabs (daily / weekly personal / make your own), so a first-time visitor needs it to understand the site. It renders as **two lines with a deliberate break at the em dash** (line 1: "A new audiobook every day, one made just for you every week —" / line 2: "and when you're ready, make your own.") — the two beats are the consumption promise and the creation hook, and the break lets "make your own" land as the differentiator; a single ~100-character line would wrap unpredictably on narrower screens. The other two lines move to a closing value-prop section below the book grid: the positioning line ("Audiobook-first · All genres · For all ages") and the AI disclosure + pricing ("Every book is written by AI and read by an AI voice — and we say so openly. Listener $9.99/mo · Author $24.99/mo · Cancel anytime."). Top order is now: header → main tabs → tagline (two lines) → genre row → books → closing value-prop section.
- **No site-wide 18+ gate — child/adult switch set by birthday (TY Nov 5 ~10:20 PM, refined ~10:38 PM)** — the site is open to all ages; the books are not X-rated (catalog spice 1–4, steamy at most, never explicit). Write Your Own has a child/adult switch that WE control — it is set by the birthday entered at sign-up: under 18 turns on child mode (age-appropriate books only), 18+ grants adult access (unchained). The user does NOT flip the switch; the mode buttons are disabled display indicators and there is no UI path to change your own mode. Visitors default to child-safe. The catalog filters by age — child-safe users (child accounts + visitors) only see spice 1–2; adults see the full catalog. The minors hard stop (no sexual content involving minors, ever) applies in all modes, always.

## How to test the preview gate

1. Open `index.html` in a browser. The site opens straight to the homepage — there is no age gate.
2. **As a visitor** (default): every Daily Books card shows a "Preview" snippet with **▶ Preview** and **Read preview** buttons. Click a card, **Read preview**, or **▶ Preview** — the reader shows the first 2 paragraphs, then "— Preview ends here —" and the sign-up gate. Pressing play plays only the first 90 seconds, then stops and opens the sign-up modal. Chapters 2–13 in the chapter list are locked (🔒); seeking past 90 seconds opens the sign-up modal.
3. **As a user**: click **Sign Up** (any name/email, any date of birth, tick the box) or **Log In** (any email/password) — the header changes to "Hi, {name}" and the cards switch to **▶ Listen** / **Read full story**. Open a book: the full story text appears and playback runs the whole book. The gate is gone.
4. **Sign out** (header **Sign Out** button) to go back to the visitor state. The sign-in is remembered in `localStorage`, so a returning visitor stays signed in until they sign out.

## How to test the layout

1. **Top of the page:** the header is slim (logo + Pricing/Policies + Sign Up/Log In). Directly under it — nothing else above — are the three main tabs: **Daily Books / Made For You / Write Your Own**, large and full-width, each with a one-line description underneath its name. The active tab is baby blue with navy text. Under the tabs is the tagline in two lines ("A new audiobook every day, one made just for you every week —" / "and when you're ready, make your own."), then the genre row, then the books. There is no hero block at the top anymore.
2. **Default tab:** on load, **Daily Books** is active and its books are showing. Click **Made For You** or **Write Your Own** to switch; click **Daily Books** to come back.
3. **Genre row:** directly under the main tabs, All + the 10 genres sit on ONE line — they never wrap to a second row. On a narrow screen (phone width), the row scrolls sideways instead of wrapping.
4. **Default genre:** **All** is selected on load, so the landing shows books across all genres (27 books for a visitor — the 3 steamy Romance books are hidden by the age filter). Click a genre pill (e.g., Fantasy) to filter to that genre; click **All** to restore the full list.
5. **Book cards:** each card is a post-style card — a slim gradient band on top (genre + AI-Generated badge), then the title, a meta line (genre · chapters · length · spice · New today), the book description, "The opening pages" with the first paragraph, and the **▶ Preview / Read preview** actions with the voice picker. Clicking a card (not a button) opens the reader.
6. **Closing value-prop section:** scroll past the book grid to the bottom of the Daily Books view — a pale-blue closing section reads "Audiobook-first · All genres · For all ages" and "Every book is written by AI and read by an AI voice — and we say so openly. Listener $9.99/mo · Author $24.99/mo · Cancel anytime." Those two lines live here now, not at the top.

## How to test the age modes

The child/adult switch is set by the birthday on the account — it is a locked display, not a control. Nobody can flip it themselves.

1. **Visitor (default, not signed in):** the Daily Books catalog shows only spice 1–2 books (the 3 Romance spice 3–4 books are hidden) and the spice filter offers only "Show all / 1 — Sweet / 2 — Mild". The catalog note under the filter says age-appropriate books are shown. In Write Your Own, the switch shows **Child mode** with both Child and Adult buttons disabled and a note that visitors are child-safe by default.
2. **Child account:** click **Sign Up**, enter any name/email and a date of birth under 18 (e.g., 2015-06-01), tick the box. The success message says "Child mode — age-appropriate books only." The catalog still shows spice 1–2 only, and in Write Your Own the switch shows Child mode, both buttons disabled. Try the flow: the mode badge says "Child mode", the revision questions show "Friendship" instead of "Romance / chemistry", and the outline is marked age-appropriate. There is no way to change it to Adult mode.
3. **Adult account:** sign out, then **Sign Up** with a date of birth 18+ (e.g., 1990-05-08). The full catalog appears, including the spice 3–4 Romance books, and the spice filter offers all levels. In Write Your Own the switch shows **Adult mode** (set by the birthday) — both buttons are disabled, so the mode cannot be changed from the site; it follows the birthday on the account.
4. **Log In** (any email/password) signs in as an adult (demo only — the demo login has no date of birth on file; real auth carries the account's stored DOB).

## Deployment

Upload the contents of this folder to the web host pointed to by yourdailybook.com (static hosting — e.g. the host's static site option, GitHub Pages, Netlify, or similar). No server-side code is needed. Point the domain's DNS at the host when ready.
