/* ============================================================
   YourDailyBook — app.js
   Static front-end only. No backend, no real audio, no real
   book text. Everything below is PLACEHOLDER data to be
   replaced by the real generated catalog, real audio, and
   real account/billing systems at launch.
   ============================================================ */

"use strict";

/* ---------- Locked data ---------- */

const GENRES = [
  "Romance", "Mystery", "Thriller", "Fantasy", "Science Fiction",
  "Horror", "Historical Fiction", "Crime", "Adventure", "Contemporary Fiction"
];

// Descriptive narrator voices (locked: descriptive names, not human names/numbers).
// 6 female + 6 male = 12 voices.
const VOICES = [
  { name: "Warm",    gender: "Female" },
  { name: "Deep",    gender: "Male" },
  { name: "Bright",  gender: "Female" },
  { name: "Smooth",  gender: "Male" },
  { name: "Bold",    gender: "Male" },
  { name: "Gentle",  gender: "Female" },
  { name: "Rich",    gender: "Male" },
  { name: "Crisp",   gender: "Female" },
  { name: "Soft",    gender: "Female" },
  { name: "Strong",  gender: "Male" },
  { name: "Calm",    gender: "Female" },
  { name: "Lively",  gender: "Male" }
];

/*
 * PLACEHOLDER BOOKS — invented titles + one-line descriptions.
 * These are NOT real books. Replace with the real generated
 * catalog (a new book per genre, every day). Do not invent
 * author names that could be real people — catalog books are
 * shown as "AI Author".
 * durations are in seconds; display strings are pre-formatted.
 */
const BOOKS = [
  // Romance (PG-13, Rated R)
  { id: "r1", title: "The Lighthouse Keeper's Wife", genre: "Romance", rating: "PG-13", secs: 18720, dur: "5h 12m", grad: "g0", desc: "After twenty years apart, a marine biologist returns to the island where she left her first love — and the lighthouse that never stopped burning for her." },
  { id: "r2", title: "Second Chance at Willow Creek", genre: "Romance", rating: "PG-13", secs: 17280, dur: "4h 48m", grad: "g5", desc: "A big-city chef inherits a failing diner in her hometown and finds the boy who broke her heart now owns the bakery next door." },
  { id: "r3", title: "The Last Dance in Lisbon", genre: "Romance", rating: "R", secs: 20100, dur: "5h 35m", grad: "g8", desc: "Two rival dance instructors are forced to choreograph one last show together — and the rehearsal room keeps getting smaller." },
  // Mystery (PG)
  { id: "m1", title: "The Clockmaker's Alibi", genre: "Mystery", rating: "PG", secs: 17760, dur: "4h 56m", grad: "g4", desc: "Every clock in the village stopped at 11:47 — the exact minute the mayor was found dead. The clockmaker swears he was home. The clocks say otherwise." },
  { id: "m2", title: "Murder at the Marigold Hotel", genre: "Mystery", rating: "PG", secs: 16500, dur: "4h 35m", grad: "g6", desc: "A retired schoolteacher checks into a seaside hotel for a quiet weekend and finds the guest in room 12 never checked out — because he never left." },
  { id: "m3", title: "The Vanishing Violinist", genre: "Mystery", rating: "PG", secs: 18900, dur: "5h 15m", grad: "g1", desc: "A concert violinist vanishes mid-performance, leaving her Stradivarius on the stage and a locked room full of people who all saw nothing." },
  // Thriller (PG)
  { id: "t1", title: "The Silent Passenger", genre: "Thriller", rating: "PG", secs: 19500, dur: "5h 25m", grad: "g4", desc: "A rideshare driver picks up a passenger who knows her name, her route, and the secret she buried ten years ago." },
  { id: "t2", title: "Countdown in the Dark", genre: "Thriller", rating: "PG", secs: 18300, dur: "5h 05m", grad: "g5", desc: "A power grid engineer has 24 hours to find the saboteur inside her own company — before the city goes dark for good." },
  { id: "t3", title: "The Double Agent's Daughter", genre: "Thriller", rating: "PG", secs: 20700, dur: "5h 45m", grad: "g7", desc: "She grew up believing her father was a diplomat. The day he disappears, three governments come looking for her." },
  // Fantasy (PG)
  { id: "f1", title: "The Cartographer's Map of Stars", genre: "Fantasy", rating: "PG", secs: 21600, dur: "6h 00m", grad: "g2", desc: "A mapmaker discovers a coastline that moves — and a kingdom that only exists on maps drawn in starlight." },
  { id: "f2", title: "The Ember Throne", genre: "Fantasy", rating: "PG", secs: 20400, dur: "5h 40m", grad: "g0", desc: "The youngest of seven heirs must light the ember throne before the winter court claims it — but the flame only answers to the truth." },
  { id: "f3", title: "Witches of the Hollow Moon", genre: "Fantasy", rating: "PG", secs: 19200, dur: "5h 20m", grad: "g8", desc: "Three estranged sisters inherit their grandmother's spellbook and one very angry moon." },
  // Science Fiction (PG)
  { id: "s1", title: "The Last Signal from Europa", genre: "Science Fiction", rating: "PG", secs: 20880, dur: "5h 48m", grad: "g1", desc: "A deep-space listening post picks up a signal from a dead moon — and it's broadcasting the crew's own voices, three days in the future." },
  { id: "s2", title: "The Memory Merchants", genre: "Science Fiction", rating: "PG", secs: 18000, dur: "5h 00m", grad: "g3", desc: "In a city where memories are currency, a broker who trades in other people's pasts finds a memory of her own that someone paid to erase." },
  { id: "s3", title: "Starlight Protocol", genre: "Science Fiction", rating: "PG", secs: 19800, dur: "5h 30m", grad: "g7", desc: "The first contact team has one rule: never answer back. Then the signal starts asking questions only they would know." },
  // Horror (PG)
  { id: "h1", title: "The House on Hollow Hill", genre: "Horror", rating: "PG", secs: 17400, dur: "4h 50m", grad: "g4", desc: "A house-flipper buys the cheapest house in the county. The house has opinions about being flipped." },
  { id: "h2", title: "Whispers in the Walls", genre: "Horror", rating: "PG", secs: 18600, dur: "5h 10m", grad: "g5", desc: "A sound engineer moves into a converted recording studio and starts hearing a song that was never recorded — sung in her own voice." },
  { id: "h3", title: "The Thirteenth Floor", genre: "Horror", rating: "PG", secs: 16800, dur: "4h 40m", grad: "g4", desc: "The elevator in her building has twelve buttons. Her new neighbor keeps pressing a thirteenth." },
  // Historical Fiction (PG)
  { id: "hf1", title: "The Seamstress of Paris", genre: "Historical Fiction", rating: "PG", secs: 21000, dur: "5h 50m", grad: "g6", desc: "In occupied Paris, a seamstress hides coded messages in the hems of dresses — until a German officer orders a gown for his wife." },
  { id: "hf2", title: "Letters from the Front", genre: "Historical Fiction", rating: "PG", secs: 17700, dur: "4h 55m", grad: "g9", desc: "Two sisters on opposite sides of a war keep writing letters they can never send — and one of them is delivered forty years late." },
  { id: "hf3", title: "The Tea Merchant's Daughter", genre: "Historical Fiction", rating: "PG", secs: 20100, dur: "5h 35m", grad: "g3", desc: "A tea merchant's daughter in 1840s Boston inherits the family business, the family debts, and a ledger full of secrets." },
  // Crime (PG)
  { id: "c1", title: "The Informant's Gamble", genre: "Crime", rating: "PG", secs: 19200, dur: "5h 20m", grad: "g7", desc: "A low-level informant bets everything on one last tip — and the detective on the other end of the phone is the one person he can't trust." },
  { id: "c2", title: "Cold Case at Harbor Point", genre: "Crime", rating: "PG", secs: 18300, dur: "5h 05m", grad: "g1", desc: "A cold-case detective reopens the drowning that made her career — and realizes the victim's sister has been lying for twenty years." },
  { id: "c3", title: "The Forger's Confession", genre: "Crime", rating: "PG", secs: 17400, dur: "4h 50m", grad: "g6", desc: "A retired art forger is asked to authenticate his own fake — the one hanging in the museum, the one everyone believes is real." },
  // Adventure (PG)
  { id: "a1", title: "The Lost City of Zafir", genre: "Adventure", rating: "PG", secs: 21600, dur: "6h 00m", grad: "g9", desc: "A disgraced archaeologist and a teenage cartographer follow a map that shouldn't exist into a desert that isn't on any satellite." },
  { id: "a2", title: "Across the Burning Sands", genre: "Adventure", rating: "PG", secs: 19800, dur: "5h 30m", grad: "g0", desc: "A camel caravan crossing the Empty Quarter finds a well that grants one wish — and every traveler wants a different one." },
  { id: "a3", title: "The Treasure of Captain Vale", genre: "Adventure", rating: "PG", secs: 18600, dur: "5h 10m", grad: "g7", desc: "A salvage diver finds a captain's log pointing to a wreck that sank a hundred years ago — and a crew that never stopped guarding it." },
  // Contemporary Fiction (PG)
  { id: "cf1", title: "The Bookshop on Maple Street", genre: "Contemporary Fiction", rating: "PG", secs: 18000, dur: "5h 00m", grad: "g6", desc: "A woman who stopped reading after her husband died inherits a bookshop — and the regulars refuse to let her sell it." },
  { id: "cf2", title: "Summer at the Lake House", genre: "Contemporary Fiction", rating: "PG", secs: 17400, dur: "4h 50m", grad: "g3", desc: "Three adult siblings return to the lake house to sell it and discover their late mother left each of them a different last letter." },
  { id: "cf3", title: "The Art of Starting Over", genre: "Contemporary Fiction", rating: "PG", secs: 18900, dur: "5h 15m", grad: "g2", desc: "At fifty-two, a corporate lawyer quits everything, buys a food truck, and learns that starting over is mostly learning to ask for help." }
];

// Generic chapter-title pool for the Write Your Own outline preview.
// PLACEHOLDER structure only — no real book text is generated here.
const OUTLINE_TITLES = [
  "The Beginning", "A New Arrival", "The First Clue", "Old Wounds",
  "A Spark Ignites", "The Turning Point", "Secrets in the Open",
  "The Long Night", "A Risky Plan", "The Confrontation",
  "What Was Lost", "The Hard Truth", "A Second Chance",
  "The Gathering Storm", "Crossroads", "The Choice",
  "Into the Unknown", "The Reckoning", "Coming Home",
  "A New Dawn", "Loose Ends", "The Final Test",
  "Everything Changes", "The Last Chapter"
];

// The 15 revision questions (locked in the policy): open text boxes, writer's own words.
const REVISION_QUESTIONS = [
  ["Plot", "Does the plot of this chapter work? What should change?"],
  ["Characters", "Are the characters acting like themselves? Anyone feel off?"],
  ["Dialogue", "Does the dialogue sound natural? Any lines that feel stiff or wrong?"],
  ["Pacing", "Is the chapter too fast, too slow, or just right?"],
  ["Setting", "Can you see and feel where this chapter happens? What needs more detail?"],
  ["Romance / chemistry", "If there's romance or chemistry here — does it land?"],
  ["Emotion", "Does the chapter make you feel what it should? What's missing?"],
  ["Conflict", "Is the tension strong enough? What should be at stake?"],
  ["Description", "Too much description, too little, or just right?"],
  ["Chapter ending", "Does the ending make you want to read the next chapter?"],
  ["Length", "Should this chapter be longer, shorter, or is it right?"],
  ["Point of view", "Is the point of view working? Should we see it through different eyes?"],
  ["Backstory", "Too much backstory, too little, or is it woven in well?"],
  ["Theme", "Does the chapter serve the book's bigger theme?"],
  ["Anything else", "Anything else you'd change about this chapter? Say it in your own words."]
];

/* ---------- Book preview / full text (PLACEHOLDER) ---------- */
/* A visitor sees only the PREVIEW: the first 2 paragraphs — about
   half a page, enough to hook, ending before the story gets going.
   A signed-in user sees the FULL text: preview + 5 more paragraphs.
   Real generated book text replaces all of this at launch. */

const PREVIEW_AUDIO_SECS = 90; // a visitor hears only the opening (~90s of narration)

// Genre-flavored opening paragraph for each book's preview (shared
// across the genre; the second paragraph is built from the book's
// own description, so every book's preview reads differently).
const GENRE_OPENERS = {
  "Romance": "The lighthouse had been dark for twenty years, and the whole town had agreed to stop talking about why. Mara told herself she was only back to sell the house — she did not tell herself she was back for the man who used to light it. But the first thing she saw from the ferry was the light, burning again, and the second thing she saw was him, standing on the dock like he had never left.",
  "Mystery": "Every clock in the village stopped at 11:47, and nobody could say why. The constable wrote it down anyway, because 11:47 was the exact minute they found the mayor, and the clockmaker was the only man in town who knew how to stop them all. The clockmaker swore he was home all evening — but the clocks, every one of them, said otherwise.",
  "Thriller": "The passenger knew her name before she introduced herself, and she had never given it to the app. 'Drive,' the voice said from the back seat, 'and don't look at your phone.' She drove. And with every mile, the voice told her one more thing it should not have been able to know.",
  "Fantasy": "The mapmaker found the coastline on a Tuesday, drawn in ink that had not been there the day before. It showed a shore her guild had never charted, and a kingdom that only existed on maps drawn in starlight. She traced the line with one finger and felt it move — as if the map were still being drawn, and as if it were drawing her.",
  "Science Fiction": "The listening post had been silent for eleven years, and then, at 03:14, it picked up a signal from a dead moon. The signal was broadcasting the crew's own voices — three days in the future. The crew did what the manual said never to do: they answered back.",
  "Horror": "The house was the cheapest in the county, and the listing did not say why. By the second night, the new owner understood: the house had opinions about being flipped. The third night, the house made its opinion known — in the walls, in a voice she recognized as her own.",
  "Historical Fiction": "In occupied Paris, the seamstress hid her messages where no soldier would ever look — in the hems of dresses. Then a German officer ordered a gown for his wife, and the hem she had just finished was the one that mattered most. She had one night to decide: finish the dress, and the message with it — or cut the hem out, and lose the only proof that the network was still alive.",
  "Crime": "The informant had one tip left, and it was the kind that could buy him a new life or get him killed before sunrise. The detective on the other end of the phone was the one person he could not trust — and the only one who would answer. He gave the tip anyway, because the alternative was worse: staying exactly where he was.",
  "Adventure": "The map should not have existed, and the desert it pointed to was not on any satellite. The disgraced archaeologist followed it anyway, because the map was drawn in her grandmother's hand. She packed light, told no one, and crossed the border at dawn — with a teenage cartographer who claimed she could read what the map was hiding.",
  "Contemporary Fiction": "She had not read a book since her husband died, and then she inherited a bookshop. The regulars refused to let her sell it, and the first customer through the door asked for the one book she could never find. She looked anyway — because the shop, and the people in it, were not going to let her stop looking."
};

const PREVIEW_HOOKS = [
  "By the end of the first chapter, the choice is already made — and there is no going back.",
  "What happens next is the reason the whole town is still talking about it.",
  "The first page is only the beginning of what the story is really about.",
  "Nobody in the story sees it coming. You will.",
  "The opening is quiet. The second chapter is not."
];

// The rest of the placeholder "full" text: preview + these 5 paragraphs.
const FULL_CONTINUATION = [
  book => "Chapter Two begins where the first one leaves off — with the hero of " + book.title + " standing at the edge of a decision that will shape everything after it. The morning is ordinary. The choice is not.",
  "The chapters that follow widen the world: new faces, old debts, and a thread that pulls tighter with every page. Nothing here is wasted — every scene is a door, and every door opens onto another.",
  "Halfway through, the story turns. What looked like the problem was only the shape of it; the real problem has been standing in plain sight since the first chapter, waiting to be named.",
  "The final chapters bring the threads together — the promise made in the opening, the debt incurred in the middle, and the price that has to be paid before the end. Not every thread is tied. Some are cut.",
  "The last page lands quietly, the way the best endings do: not with a shout, but with a door closing behind you — and the sense that the story is still going on somewhere, just out of sight."
];

function bookPreviewText(book) {
  const opener = GENRE_OPENERS[book.genre] || GENRE_OPENERS["Contemporary Fiction"];
  const hook = PREVIEW_HOOKS[BOOKS.indexOf(book) % PREVIEW_HOOKS.length];
  return [opener, book.desc + " " + hook];
}

function bookFullText(book) {
  const extra = FULL_CONTINUATION.map(p => typeof p === "function" ? p(book) : p);
  return bookPreviewText(book).concat(extra);
}

// How far a visitor may play. Signed-in users have no limit.
function previewLimitSecs() { return isSignedIn() ? Infinity : PREVIEW_AUDIO_SECS; }

// Chapters past the preview (chapter 1) are locked for visitors.
function chapterLocked(idx) { return !isSignedIn() && idx > 0; }

/* ---------- Helpers ---------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function fmtTime(totalSecs) {
  totalSecs = Math.max(0, Math.floor(totalSecs));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  return m + ":" + String(s).padStart(2, "0");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* ---------- Simulated sign-in state ---------- */
/* DEMO ONLY: no backend, no real accounts. The state lives in a
   variable + localStorage so the preview gate and the age modes can
   be tested (visitor / child / adult). Real auth + Stripe replace
   this at launch. The account's age comes from the date of birth
   given at sign-up; visitors (not signed in) are child-safe by
   default, since age cannot be verified. */

const AUTH_KEY = "ydb-auth";
let auth = { signedIn: false, name: "", dob: null, isAdult: false, writeMode: "child" };
try {
  const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  if (saved && saved.signedIn) {
    auth = Object.assign({ signedIn: false, name: "", dob: null, isAdult: false, writeMode: "child" }, saved);
  }
} catch (e) { /* corrupted saved state — stay signed out */ }

function isSignedIn() { return auth.signedIn === true; }

// An adult is a signed-in user whose account age is 18+. Visitors
// and child accounts are child-safe.
function isAdultUser() { return isSignedIn() && auth.isAdult === true; }

// Content ratings (locked Nov 6, 2026 — the old 1–4 level scale is gone).
// Every book carries one rating, decided at generation. Access is
// decided by the reader's age, computed in real time from the date
// of birth on the account — a birthday unlocks the next tier
// automatically, nothing stored to update. Visitors (not signed in)
// see PG only.
const RATINGS = ["PG", "PG-13", "R"];

// Display label: "PG", "PG-13", "Rated R".
function ratingLabel(rating) { return rating === "R" ? "Rated R" : rating; }

// The reader's age in whole years, from the date of birth on the
// account. Calendar-based (not milliseconds / 365.25), so the age
// changes on the birthday itself. null = visitor (age unverified).
// The demo log-in has no DOB on file, so it signs in as adult.
function userAgeYears() {
  if (!isSignedIn()) return null;
  if (!auth.dob) return 18;
  const age = ageFromDob(auth.dob);
  return age === null ? 18 : age;
}

// Which ratings this reader may open.
function allowedRatings() {
  const age = userAgeYears();
  if (age === null) return ["PG"];
  if (age >= 18) return ["PG", "PG-13", "R"];
  if (age >= 13) return ["PG", "PG-13"];
  return ["PG"];
}

function isRatingAllowed(rating) { return allowedRatings().includes(rating); }
function isBookLocked(book) { return !!book && !isRatingAllowed(book.rating); }

// The age a rating unlocks at (for the lock message).
function ratingUnlockAge(rating) {
  return rating === "R" ? 18 : rating === "PG-13" ? 13 : 0;
}

// Whole-year age from a "YYYY-MM-DD" date string, computed by
// calendar date so the birthday itself counts. Timezone-safe: the
// string is parsed as numbers, never as a UTC midnight.
function ageFromDob(dobStr) {
  if (!dobStr) return null;
  const parts = String(dobStr).split("-");
  if (parts.length < 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  const monthDiff = (now.getMonth() + 1) - m;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d)) age--;
  return age;
}

function persistAuth() {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) { /* storage unavailable — session-only */ }
}

function signIn(name, dob) {
  // dob is an ISO date string from the sign-up form. Log-in (demo)
  // has no DOB on file — treated as adult; real auth carries the
  // account's stored date of birth.
  const age = ageFromDob(dob);
  const isAdult = age === null ? true : age >= 18;
  auth = {
    signedIn: true,
    name: (name || "Reader").trim() || "Reader",
    dob: dob || null,
    isAdult: isAdult,
    writeMode: "child"
  };
  applyWriteModeFromDob(); // mode comes from the birthday, never from a user flip
  persistAuth();
  updateAuthUI();
  updateWriteModeUI();
  renderRatingFilter();
  renderPfRatings();
  if (readerBook) renderReader();
  renderChapterList();
  renderBooks();
}

function signOut() {
  auth = { signedIn: false, name: "", dob: null, isAdult: false, writeMode: "child" };
  try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ }
  // If the player was past the visitor preview limit, pull it back.
  if (player.current && player.position > PREVIEW_AUDIO_SECS) {
    player.position = PREVIEW_AUDIO_SECS;
    setPlaying(false);
  }
  updateAuthUI();
  updateWriteModeUI();
  renderRatingFilter();
  renderPfRatings();
  if (readerBook) renderReader();
  renderChapterList();
  renderBooks();
}

function updateAuthUI() {
  const signedIn = isSignedIn();
  $("#loginBtn").classList.toggle("hidden", signedIn);
  $("#signupBtn").classList.toggle("hidden", signedIn);
  $("#signoutBtn").classList.toggle("hidden", !signedIn);
  const greet = $("#authGreeting");
  greet.classList.toggle("hidden", !signedIn);
  if (signedIn) greet.textContent = "Hi, " + auth.name;
}

/* ---------- Child / adult mode (Write Your Own) ---------- */
/* The switch is controlled by the company, not the user — it is set
   by the birthday entered at sign-up (TY Nov 5 ~10:38 PM).
   - Birthday under 18 → the child side is turned on (child mode).
   - Birthday 18+ → adult access is granted (adult mode).
   - Visitor (not signed in): child mode — age can't be verified.
   The user does NOT flip the switch themselves. The mode is derived
   from the account's date of birth only (signIn sets it from the
   DOB; the demo log-in has no DOB on file, so it signs in as adult).
   There is no UI control that lets a signed-in user change their
   own mode — the switch in Write Your Own is a locked display
   indicator, not a control.
   Child mode generates age-appropriate books only (no sexual content,
   no adult themes). Adult mode is unchained. The minors hard stop —
   no sexual content involving minors, ever — applies in BOTH modes. */

function writeMode() { return auth.writeMode || "child"; }

// Internal only: derive the mode from the account age (date of
// birth). Called from signIn — never from a UI control.
function applyWriteModeFromDob() {
  auth.writeMode = auth.isAdult ? "adult" : "child";
}

function updateWriteModeUI() {
  // The switch is a display indicator, not a control: it shows the
  // mode set by the birthday on the account. Both buttons are always
  // disabled — the user cannot change their own mode.
  const mode = writeMode();
  const childBtn = $("#modeChildBtn");
  const adultBtn = $("#modeAdultBtn");
  childBtn.classList.toggle("active", mode === "child");
  adultBtn.classList.toggle("active", mode === "adult");
  childBtn.disabled = true;
  adultBtn.disabled = true;
  const badge = $("#writeModeBadge");
  badge.textContent = mode === "child" ? "Child mode" : "Adult mode";
  badge.className = "badge " + (mode === "child" ? "badge-child" : "badge-adult");
  $("#writeModeDesc").textContent = mode === "child"
    ? "Child mode — the AI writes age-appropriate books only: no sexual content, no adult themes. The questions and guidance are written for young writers."
    : "Adult mode — unchained: no holds, no blocks, no rating cap. The writer has full creative freedom.";
  $("#writeModeLock").textContent = !isSignedIn()
    ? "You're browsing as a visitor, so Child mode is on — we can't verify age without an account. Your mode is set by the birthday on your account once you sign up."
    : (!isAdultUser()
      ? "This account's birthday is under 18, so Child mode is set for this account. The switch is controlled by us — it can't be changed here."
      : "Your mode is set by the birthday on your account — adult access is granted. The switch is controlled by us, based on your birthday.");
  $("#writeFlowMode").textContent = mode === "child"
    ? "Mode: Child — age-appropriate. Your book will contain no sexual content and no adult themes."
    : "Mode: Adult — unchained. No holds, no blocks, no rating cap. (No sexual content involving minors, ever.)";
  $("#wfStep1Note").textContent = mode === "child"
    ? "Child mode: your book will be age-appropriate — no sexual content, no adult themes."
    : "Adult mode: unchained — no holds, no blocks, no rating cap. (The one hard rule still applies: no sexual content involving minors, ever.)";
  $("#wfRevisionModeNote").textContent = mode === "child"
    ? "In Child mode, every revision stays age-appropriate too."
    : "In Adult mode, revisions are unchained — the same freedom as the first draft. (No sexual content involving minors, ever.)";
}

// The 15 revision questions, framed for the current mode. In child
// mode the romance/chemistry question becomes a friendship question;
// the other 14 are already age-neutral.
function revisionQuestionsForMode() {
  if (writeMode() === "child") {
    return REVISION_QUESTIONS.map(q =>
      q[0] === "Romance / chemistry"
        ? ["Friendship", "Do the friendships feel real and kind? Is anyone left out or treated unkindly?"]
        : q
    );
  }
  return REVISION_QUESTIONS;
}

/* ---------- Age-based catalog filtering ---------- */
/* The rating filter doubles as the age filter. The reader's age
   sets which ratings are open; the filter lets them narrow within
   what is open to them — a child account or a visitor is only ever
   offered PG (and PG-13 from 13), Rated R only from 18. Locked
   books stay visible in the grid with a grey lock icon (see
   bookCardHTML); the filter never hides a book for age reasons. */

function renderRatingFilter() {
  const sel = $("#ratingFilter");
  const allowed = allowedRatings();
  const opts = [["", "Show all"]].concat(allowed.map(r => [r, ratingLabel(r)]));
  sel.innerHTML = opts.map(o => '<option value="' + o[0] + '">' + o[1] + "</option>").join("");
  if (ratingFilter && !allowed.includes(ratingFilter)) ratingFilter = "";
  sel.value = ratingFilter;
}

// Made For You rating checkboxes (PG / PG-13 / Rated R). Age decides
// which boxes can be checked: under 13 → PG only; 13–17 → PG +
// PG-13; 18+ → all three. A box that is not available is disabled
// and unchecked. Defaults (until the user touches a box): PG and
// PG-13 checked when available; Rated R starts unchecked — it is
// only ever picked when the user explicitly checks it.
const PF_RATING_BOXES = { "PG": "pfRatingPG", "PG-13": "pfRatingPG13", "R": "pfRatingR" };
let pfRatingsTouched = false;

function renderPfRatings() {
  const allowed = allowedRatings();
  Object.keys(PF_RATING_BOXES).forEach(rating => {
    const box = document.getElementById(PF_RATING_BOXES[rating]);
    if (!box) return;
    const available = allowed.includes(rating);
    box.disabled = !available;
    if (!available) box.checked = false;
    else if (!pfRatingsTouched) box.checked = rating !== "R";
  });
  const hint = $("#pfRatingsHint");
  if (hint) {
    hint.textContent = allowed.includes("R")
      ? "Leave all unchecked for a random mix of PG and PG-13. Rated R is only generated if you check it."
      : allowed.includes("PG-13")
        ? "Rated R unlocks when you turn 18. Leave all unchecked for a random mix of PG and PG-13."
        : "PG-13 unlocks when you turn 13 and Rated R at 18 — books unlock for your age automatically.";
  }
}

// The weekly draw for Made For You: a random rating from the boxes
// the user checked. If none are checked, a random rating from what
// is available for their age — never Rated R unless they checked it.
function drawPersonalizedRating() {
  const checked = RATINGS.filter(r => {
    const box = document.getElementById(PF_RATING_BOXES[r]);
    return box && box.checked && !box.disabled;
  });
  const pool = checked.length > 0
    ? checked
    : allowedRatings().filter(r => r !== "R");
  return pool[Math.floor(Math.random() * pool.length)];
}

function updateCatalogNote() {
  const note = $("#catalogAgeNote");
  if (!note) return;
  const allowed = allowedRatings();
  if (allowed.length === 3) {
    note.textContent = "Showing the full catalog — PG, PG-13, and Rated R.";
  } else if (allowed.includes("PG-13")) {
    note.textContent = "Showing PG and PG-13 books. Rated R unlocks when you turn 18.";
  } else {
    note.textContent = "Showing PG books only. PG-13 unlocks when you turn 13 and Rated R at 18 — sign up with your date of birth and books unlock for your age automatically.";
  }
}

/* ---------- Tabs ---------- */

function switchTab(name) {
  $$(".tab-btn").forEach(btn => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  $$(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === "panel-" + name);
  });
  $$(".main-nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.navTab === name);
  });
}

$$(".tab-btn").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
$$("[data-nav-tab]").forEach(a => a.addEventListener("click", () => switchTab(a.dataset.navTab)));
$$("[data-cta-tab]").forEach(btn => btn.addEventListener("click", () => {
  switchTab(btn.dataset.ctaTab);
  document.getElementById("tabs").scrollIntoView({ behavior: "smooth" });
}));

/* ---------- Mobile nav ---------- */

const navToggle = $("#navToggle");
const mainNav = $("#mainNav");
navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
$$("#mainNav a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));

/* ---------- Daily Books: genre pills + cards ---------- */

let activeGenre = "All";
let ratingFilter = ""; // "" = show all ratings

function voiceOptionsHTML(selectedName) {
  const groups = { Female: [], Male: [] };
  VOICES.forEach(v => groups[v.gender].push(v));
  let html = "";
  ["Female", "Male"].forEach(gender => {
    html += '<optgroup label="' + gender + ' voices">';
    groups[gender].forEach(v => {
      html += '<option value="' + v.name + '"' + (v.name === selectedName ? " selected" : "") + '>' + v.name + "</option>";
    });
    html += "</optgroup>";
  });
  return html;
}

function renderGenrePills() {
  const row = $("#genreRow");
  const all = ["All"].concat(GENRES);
  row.innerHTML = all.map(g =>
    '<button type="button" class="genre-pill' + (g === activeGenre ? " active" : "") +
    '" data-genre="' + escapeHtml(g) + '">' + escapeHtml(g) + "</button>"
  ).join("");
  $$(".genre-pill", row).forEach(pill => pill.addEventListener("click", () => {
    activeGenre = pill.dataset.genre;
    renderGenrePills();
    renderBooks();
  }));
}

function filteredBooks() {
  // Locked books stay visible in the grid (with a grey lock icon) —
  // the age gate controls opening a book, not seeing it. The filter
  // only narrows by rating, within what is open to this reader.
  return BOOKS.filter(b =>
    (activeGenre === "All" || b.genre === activeGenre) &&
    (ratingFilter === "" || b.rating === ratingFilter)
  );
}

/* ---------- Daily shuffle (All view) ---------- */
/* TY Nov 5 ~11:08 PM (approved): the "All" genre view shows the books
   in a random order, shuffled once a day — the same order for everyone
   all day, fresh tomorrow. NOT re-randomized on every reload (that
   would feel unstable). The shuffle is seeded by the current date
   (YYYY-MM-DD), so it is stable within the day. Single-genre views
   keep their normal order, and the starting genre stays "All" (not a
   random genre). The "New today" badge stays on every card, so the
   newest books are still clearly marked in the shuffle. */

function seedFromString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic shuffle of a copy of arr, seeded by seedStr.
function shuffleWithSeed(arr, seedStr) {
  const rand = mulberry32(seedFromString(seedStr));
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

function todayKey(d) {
  const date = d || new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

// Shuffle the "All" view once a day. dateKey is an optional
// "YYYY-MM-DD" override (used by tests to simulate another day).
function dailyShuffle(list, dateKey) {
  if (activeGenre !== "All") return list;
  return shuffleWithSeed(list, "ydb-" + (dateKey || todayKey()));
}

/* Book cards, post-style (TY Nov 5 ~10:43 PM): each card reads like a
   post — a slim gradient band, a title header, a meta line (genre,
   rating, chapter count, length), the opening text, and the Listen /
   Read actions with the voice picker. A locked book (rating above
   what this reader may open) shows a small grey lock icon and stays
   visible in the grid — clicking it shows the age message, never
   the book. Written from scratch for YourDailyBook; no code copied
   from any other project.
   opts.removable adds an "✕ Remove" button (Currently Reading only).
   opts.continuable adds a "▶ Continue" button (Currently Reading
   only) that resumes the book from its saved position. */
function bookCardHTML(book, opts) {
  const preview = bookPreviewText(book)[0];
  const signedIn = isSignedIn();
  const locked = isBookLocked(book);
  const removeBtn = (opts && opts.removable)
    ? '<button class="btn btn-ghost btn-sm remove-cr" type="button" data-book-id="' + book.id + '" title="Remove from Currently Reading">✕ Remove</button>'
    : "";
  const continueBtn = (opts && opts.continuable)
    ? '<button class="btn btn-dark btn-sm continue-book" type="button" data-book-id="' + book.id + '" title="Pick up where you left off">▶ Continue</button>'
    : "";
  return `
    <article class="book-card${locked ? " locked" : ""}" data-book-id="${book.id}">
      <div class="book-cover ${book.grad}">
        <div class="cover-top">
          <span class="cover-genre">${escapeHtml(book.genre)}</span>
          <span class="cover-badges">
            ${locked ? '<span class="lock-icon" title="' + escapeHtml(lockMessage(book)) + '">🔒</span>' : ""}
            <span class="badge badge-ai">AI-Generated</span>
          </span>
        </div>
      </div>
      <div class="book-body">
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <p class="book-meta">
          <span>${escapeHtml(book.genre)}</span>
          <span>📖 13 chapters</span>
          <span>⏱ ${book.dur}</span>
          <span class="badge badge-rating">${ratingLabel(book.rating)}</span>
          <span class="badge badge-new">New today</span>
        </p>
        <p class="book-desc">${escapeHtml(book.desc)}</p>
        <p class="preview-label">The opening pages</p>
        <p class="preview-snippet">${escapeHtml(preview)}</p>
        <div class="book-actions">
          ${continueBtn}
          <button class="btn btn-primary btn-sm play-book" type="button" data-book-id="${book.id}">${signedIn ? "▶ Listen" : "▶ Preview"}</button>
          <button class="btn btn-ghost btn-sm read-book" type="button" data-book-id="${book.id}">${signedIn ? "Read full story" : "Read preview"}</button>
          <div class="voice-select">
            <select aria-label="Narrator voice for ${escapeHtml(book.title)}" data-book-voice="${book.id}">${voiceOptionsHTML("Warm")}</select>
          </div>
          ${removeBtn}
        </div>
      </div>
    </article>`;
}

// Wire the buttons/selects inside a rendered book grid (catalog or
// Currently Reading): clicking a card opens the reader, Listen/Read
// open the reader/player, voice selects switch the voice, and
// ✕ Remove takes a book out of Currently Reading only.
function wireBookGrid(grid) {
  // Clicking the card itself (not a button/select) opens the reader.
  $$(".book-card", grid).forEach(card => {
    const book = BOOKS.find(x => x.id === card.dataset.bookId);
    card.addEventListener("click", e => {
      if (e.target.closest("button, select, a")) return;
      openReader(book);
    });
  });
  $$(".read-book", grid).forEach(btn => btn.addEventListener("click", () => {
    openReader(BOOKS.find(x => x.id === btn.dataset.bookId));
  }));
  $$(".play-book", grid).forEach(btn => btn.addEventListener("click", () => {
    const book = BOOKS.find(x => x.id === btn.dataset.bookId);
    const voiceSel = grid.querySelector('[data-book-voice="' + book.id + '"]');
    if (openReader(book)) loadBook(book, voiceSel ? voiceSel.value : "Warm", true);
  }));
  $$("[data-book-voice]", grid).forEach(sel => sel.addEventListener("change", () => {
    const book = BOOKS.find(x => x.id === sel.dataset.bookVoice);
    if (player.current && player.current.id === book.id) {
      setVoice(sel.value);
    }
  }));
  $$(".remove-cr", grid).forEach(btn => btn.addEventListener("click", () => {
    removeCurrentlyReading(btn.dataset.bookId);
  }));
  $$(".continue-book", grid).forEach(btn => btn.addEventListener("click", () => {
    const book = BOOKS.find(x => x.id === btn.dataset.bookId);
    const voiceSel = grid.querySelector('[data-book-voice="' + book.id + '"]');
    continueBook(book, voiceSel ? voiceSel.value : "Warm");
  }));
}

function renderBooks() {
  const grid = $("#bookGrid");
  const list = dailyShuffle(filteredBooks());
  updateCatalogNote();
  $("#bookCount").textContent = list.length + " book" + (list.length === 1 ? "" : "s") + " · New today";
  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state"><h3>No books match that filter</h3><p>Try a different genre or rating.</p></div>';
  } else {
    grid.innerHTML = list.map(b => bookCardHTML(b)).join("");
    wireBookGrid(grid);
  }
  renderCurrentlyReading();
}

/* ---------- Currently Reading ---------- */
/* TY Nov 5 ~11:08 PM: any book the user opens (Read or Listen —
   opening the reader or starting the player) goes into Currently
   Reading, most recent first; opening it again moves it back to the
   top. The section lives on the Daily Books tab above the book grid
   and is hidden when empty. Each book has an ✕ Remove button that
   takes it out of this section only — never out of the catalog.
   The list persists in localStorage (demo; real backend storage at
   launch) and respects the age filter, like the catalog.
   The MOST IMPORTANT part is picking up where you left off (TY Nov 5
   ~11:10 PM): every book also carries a saved position (see the
   progress functions below) and a "Continue" button that resumes it. */

const CURRENTLY_READING_KEY = "ydb-currently-reading";

function currentlyReadingIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(CURRENTLY_READING_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(id => BOOKS.some(b => b.id === id));
  } catch (e) { return []; }
}

function saveCurrentlyReading(ids) {
  try { localStorage.setItem(CURRENTLY_READING_KEY, JSON.stringify(ids)); } catch (e) { /* storage unavailable */ }
}

// Add a book to Currently Reading (or move it back to the top if it
// is already there). Called from openReader and loadBook.
function markCurrentlyReading(book) {
  if (!book) return;
  const ids = currentlyReadingIds().filter(id => id !== book.id);
  ids.unshift(book.id);
  saveCurrentlyReading(ids);
  renderCurrentlyReading();
}

// Remove a book from Currently Reading only — the book stays in the catalog.
function removeCurrentlyReading(bookId) {
  saveCurrentlyReading(currentlyReadingIds().filter(id => id !== bookId));
  renderCurrentlyReading();
}

// Books in Currently Reading, most recent first. No age filter
// here: a book only enters Currently Reading by being opened, and
// a locked book cannot be opened — so every book in this list was
// openable when it was added, and ratings never change.
function currentlyReadingBooks() {
  return currentlyReadingIds()
    .map(id => BOOKS.find(b => b.id === id))
    .filter(b => b);
}

function renderCurrentlyReading() {
  const section = $("#currentlyReading");
  const grid = $("#currentlyReadingGrid");
  const list = currentlyReadingBooks();
  if (list.length === 0) {
    section.classList.add("hidden");
    grid.innerHTML = "";
    return;
  }
  section.classList.remove("hidden");
  grid.innerHTML = list.map(b => bookCardHTML(b, { removable: true, continuable: true })).join("");
  wireBookGrid(grid);
}

/* ---------- Reading / listening progress (resume) ---------- */
/* TY Nov 5 ~11:10 PM — the MOST IMPORTANT part of Currently Reading
   is picking up where you left off. For every book the user opens,
   the exact position is saved and restored on return:
   - reading: chapter + paragraph (saved as the user scrolls the reader)
   - listening: chapter + timestamp in seconds (saved as audio plays)
   Stored in localStorage under `ydb-progress`, mapping book id to
   { chapter, paragraph, timeSec }. The three values always describe
   the SAME spot (the latest one, whether reached by reading or by
   listening): a reading save sets the chapter/paragraph and the
   timestamp of that chapter's start; a listening save sets the
   chapter/timestamp and the paragraph that chapter maps to.
   The paragraph <-> chapter mapping is a PLACEHOLDER for the demo
   text (7 paragraphs spread across 13 chapters); real generated
   books will have real chapter boundaries. */

const PROGRESS_KEY = "ydb-progress";

function getProgress(bookId) {
  try {
    const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {};
    const p = all[bookId];
    if (!p || typeof p !== "object") return null;
    return {
      chapter: typeof p.chapter === "number" ? p.chapter : 1,
      paragraph: typeof p.paragraph === "number" ? p.paragraph : null,
      timeSec: typeof p.timeSec === "number" ? p.timeSec : null
    };
  } catch (e) { return null; }
}

// Merge a partial position into the saved one (missing fields keep
// their previous values).
function saveProgress(bookId, patch) {
  if (!bookId) return;
  let all = {};
  try { all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {}; } catch (e) { all = {}; }
  all[bookId] = Object.assign({}, all[bookId] || {}, patch);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch (e) { /* storage unavailable */ }
}

// Placeholder mapping between reader paragraphs and chapters:
// the demo text has totalParas paragraphs spread across 13 chapters.
function chapterForParagraph(paraIdx, totalParas) {
  if (!totalParas || totalParas <= 0) return 1;
  return Math.min(CHAPTER_COUNT, Math.floor(paraIdx / totalParas * CHAPTER_COUNT) + 1);
}
function paragraphForChapter(chapter, totalParas) {
  if (!totalParas || totalParas <= 0) return 0;
  return Math.min(totalParas - 1, Math.ceil((chapter - 1) / CHAPTER_COUNT * totalParas));
}

// Save the reading position: the paragraph the user has reached.
// The chapter and the audio timestamp follow from it (start of that
// chapter), so the saved position stays one coherent spot.
function saveReadingProgress(book, paragraphIdx) {
  if (!book) return;
  const total = bookFullText(book).length;
  const para = Math.max(0, Math.min(paragraphIdx, total - 1));
  const chapter = chapterForParagraph(para, total);
  saveProgress(book.id, {
    chapter: chapter,
    paragraph: para,
    timeSec: chapterStartSecondsFor(book, chapter - 1)
  });
}

// Save the listening position: the current chapter + audio timestamp.
// The paragraph follows from the chapter, so the reader can resume
// at the same spot.
function saveAudioProgress() {
  if (!player.current) return;
  const book = player.current;
  const total = bookFullText(book).length;
  const chapter = currentChapterIndex() + 1;
  saveProgress(book.id, {
    chapter: chapter,
    paragraph: paragraphForChapter(chapter, total),
    timeSec: Math.floor(player.position)
  });
}

// "Continue" — resume a book from the saved position: open the reader
// at the saved chapter/paragraph and load the player at the saved
// timestamp (no autoplay — the user presses play to resume listening).
// With no saved position yet, it starts at the beginning.
function continueBook(book, voice) {
  if (!book) return;
  if (openReader(book)) loadBook(book, voice || "Warm", false);
}

$("#ratingFilter").addEventListener("change", e => {
  ratingFilter = e.target.value || "";
  renderBooks();
});

/* ---------- Simulated audio player ---------- */
/* No real audio file: progress advances on a timer. At launch
   this is replaced by real audio + word-timing maps. */

const player = {
  current: null,      // book object
  position: 0,        // seconds
  playing: false,
  speed: 1,
  voice: "Warm",
  sleepMins: 0,       // 0 = off
  sleepEndsAt: 0,     // timestamp ms
  timer: null
};

const CHAPTER_COUNT = 13;

function chapterDurations(book) {
  // Split the book evenly across 13 chapters (placeholder timing).
  const base = Math.floor(book.secs / CHAPTER_COUNT);
  const durs = Array(CHAPTER_COUNT).fill(base);
  durs[CHAPTER_COUNT - 1] += book.secs - base * CHAPTER_COUNT;
  return durs;
}

function currentChapterIndex() {
  if (!player.current) return 0;
  const durs = chapterDurations(player.current);
  let acc = 0;
  for (let i = 0; i < durs.length; i++) {
    acc += durs[i];
    if (player.position < acc) return i;
  }
  return durs.length - 1;
}

function chapterStartSeconds(idx) {
  return chapterStartSecondsFor(player.current, idx);
}

// Chapter start (seconds) for a given book — chapterStartSeconds is
// the same thing for the book currently in the player.
function chapterStartSecondsFor(book, idx) {
  if (!book) return 0;
  return chapterDurations(book).slice(0, idx).reduce((a, b) => a + b, 0);
}

function loadBook(book, voice, autoplay) {
  // A locked book never loads into the player — the age message instead.
  if (isBookLocked(book)) { showAgeLockMessage(book); return false; }
  player.current = book;
  // Resume from the saved listening position (if any) — do not restart
  // from 0. Clamped to the book length and, for visitors, to the
  // 90-second preview limit.
  const prog = getProgress(book.id);
  const limit = previewLimitSecs();
  player.position = (prog && typeof prog.timeSec === "number")
    ? Math.max(0, Math.min(prog.timeSec, book.secs, limit))
    : 0;
  _lastAudioSaveSec = -1;
  markCurrentlyReading(book);
  player.voice = voice || player.voice;
  $("#playerCover").className = "player-cover " + book.grad;
  $("#playerCover").textContent = book.title.split(" ").map(w => w[0]).slice(0, 2).join("");
  $("#playerTitle").textContent = book.title;
  updatePlayerSub();
  $("#playerVoiceSelect").value = player.voice;
  renderChapterList();
  updatePlayerUI();
  if (autoplay) setPlaying(true);
  return true;
}

// A visitor hit the end of the audio preview: stop and open the gate.
function previewGateReached() {
  if (player.current) {
    openSignup("You reached the end of the preview of “" + player.current.title + "”. Sign up to hear the rest — and every book, every day.");
  } else {
    openSignup();
  }
}

function updatePlayerSub() {
  if (!player.current) return;
  if (!isSignedIn() && player.position >= PREVIEW_AUDIO_SECS) {
    $("#playerSub").textContent = "Preview ended — sign up to keep listening";
    return;
  }
  const ch = currentChapterIndex() + 1;
  $("#playerSub").textContent =
    player.current.genre + " · Chapter " + ch + " of " + CHAPTER_COUNT +
    " · Narrated by " + player.voice + " · " + ratingLabel(player.current.rating) +
    (isSignedIn() ? "" : " · Preview");
}

function setVoice(name) {
  player.voice = name;
  $("#playerVoiceSelect").value = name;
  // Voice switches seamlessly — position is preserved by design.
  updatePlayerSub();
}

function setPlaying(playing) {
  // A visitor who already reached the end of the preview cannot
  // resume past it — the gate opens instead.
  if (playing && player.current && !isSignedIn() && player.position >= PREVIEW_AUDIO_SECS) {
    previewGateReached();
    return;
  }
  player.playing = playing;
  $("#playPauseBtn").textContent = playing ? "⏸" : "▶";
  $("#playPauseBtn").setAttribute("aria-label", playing ? "Pause" : "Play");
  if (playing) {
    if (!player.current) {
      // Start with the first book this reader may open — never a
      // locked one (BOOKS[0] is PG-13, so it cannot be the default).
      loadBook(BOOKS.find(b => isRatingAllowed(b.rating)) || BOOKS[0], "Warm", false);
    }
    if (!player.timer) {
      player.timer = setInterval(tick, 250);
    }
  } else {
    // Pausing saves the listening position, so "Continue" resumes here.
    saveAudioProgress();
    if (player.timer) {
      clearInterval(player.timer);
      player.timer = null;
    }
  }
  updatePlayerUI();
}

// Last whole second the listening position was saved at (tick saves
// at most once per second so localStorage is not written every tick).
let _lastAudioSaveSec = -1;

function tick() {
  if (!player.playing || !player.current) return;
  player.position += 0.25 * player.speed;
  // Save the listening position as audio plays (once per whole
  // second) so "Continue" always reflects the latest spot.
  const sec = Math.floor(player.position);
  if (sec !== _lastAudioSaveSec) {
    _lastAudioSaveSec = sec;
    saveAudioProgress();
  }
  // Visitor audio preview: stop at the preview limit and open the gate.
  if (player.position >= previewLimitSecs()) {
    player.position = previewLimitSecs();
    setPlaying(false);
    if (!isSignedIn()) previewGateReached();
    return;
  }
  if (player.sleepMins > 0 && Date.now() >= player.sleepEndsAt) {
    player.sleepMins = 0;
    updateSleepBtn();
    setPlaying(false);
  }
  if (player.position >= player.current.secs) {
    player.position = player.current.secs;
    setPlaying(false);
  }
  updatePlayerUI();
}

function updatePlayerUI() {
  if (!player.current) {
    $("#timeCurrent").textContent = "0:00";
    $("#timeTotal").textContent = "0:00";
    $("#progressFill").style.width = "0%";
    return;
  }
  $("#timeCurrent").textContent = fmtTime(player.position);
  $("#timeTotal").textContent = fmtTime(player.current.secs);
  const pct = (player.position / player.current.secs) * 100;
  $("#progressFill").style.width = pct + "%";
  $("#progressTrack").setAttribute("aria-valuenow", String(Math.round(pct)));
  updatePlayerSub();
  // Keep the chapter list highlight in sync, but only re-render when
  // the current chapter actually changes (re-rendering every tick
  // would replace the list while the user tries to click it).
  if ($("#chapterPanel").classList.contains("open")) {
    const ci = currentChapterIndex();
    if (ci !== updatePlayerUI._lastChapter) {
      updatePlayerUI._lastChapter = ci;
      renderChapterList();
    }
  }
}

function updateSleepBtn() {
  const btn = $("#sleepBtn");
  if (player.sleepMins === 0) {
    btn.textContent = "💤 Off";
    btn.classList.remove("active");
  } else {
    const minsLeft = Math.max(0, Math.ceil((player.sleepEndsAt - Date.now()) / 60000));
    btn.textContent = "💤 " + minsLeft + "m";
    btn.classList.add("active");
  }
}

function renderChapterList() {
  const list = $("#chapterList");
  if (!player.current) {
    list.innerHTML = "<li class='small muted' style='padding:8px 4px;'>Pick a book to see its chapters.</li>";
    $("#chapterPanelTitle").textContent = "Chapters";
    $("#chapterPanelSub").textContent = "";
    return;
  }
  const durs = chapterDurations(player.current);
  const cur = currentChapterIndex();
  $("#chapterPanelTitle").textContent = player.current.title;
  $("#chapterPanelSub").textContent = player.current.genre + " · " + CHAPTER_COUNT + " chapters · " + player.current.dur;
  list.innerHTML = durs.map((d, i) => {
    const locked = chapterLocked(i);
    return '<li><button type="button" data-chapter="' + i + '" class="' + (i === cur ? "current" : "") + (locked ? " locked" : "") + '">' +
    "<span>" + (locked ? "🔒 " : "") + "Chapter " + (i + 1) + (i === cur ? " — now playing" : "") + (locked ? " — sign up to listen" : "") + "</span>" +
    "<span>" + fmtTime(d) + "</span></button></li>";
  }).join("");
  $$("[data-chapter]", list).forEach(btn => btn.addEventListener("click", () => {
    const idx = parseInt(btn.dataset.chapter, 10);
    if (chapterLocked(idx)) {
      openSignup("Chapter " + (idx + 1) + " is past the preview. Sign up to listen to the full story.");
      return;
    }
    player.position = chapterStartSeconds(idx);
    saveAudioProgress();
    updatePlayerUI();
    renderChapterList();
  }));
}

// Player controls
$("#playPauseBtn").addEventListener("click", () => setPlaying(!player.playing));
$("#prevChapterBtn").addEventListener("click", () => {
  if (!player.current) return;
  const cur = currentChapterIndex();
  player.position = chapterStartSeconds(Math.max(0, cur - 1));
  saveAudioProgress();
  updatePlayerUI();
});
$("#nextChapterBtn").addEventListener("click", () => {
  if (!player.current) return;
  const cur = currentChapterIndex();
  player.position = chapterStartSeconds(Math.min(CHAPTER_COUNT - 1, cur + 1));
  saveAudioProgress();
  updatePlayerUI();
});
$("#speedSelect").addEventListener("change", e => { player.speed = parseFloat(e.target.value); });
$("#playerVoiceSelect").addEventListener("change", e => setVoice(e.target.value));
$("#sleepBtn").addEventListener("click", () => {
  const cycle = [0, 15, 30, 60];
  const next = cycle[(cycle.indexOf(player.sleepMins) + 1) % cycle.length];
  player.sleepMins = next;
  player.sleepEndsAt = next > 0 ? Date.now() + next * 60000 : 0;
  updateSleepBtn();
});
$("#chaptersBtn").addEventListener("click", () => {
  const panel = $("#chapterPanel");
  panel.classList.toggle("open");
  if (panel.classList.contains("open")) renderChapterList();
});
$("#progressTrack").addEventListener("click", e => {
  if (!player.current) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  const target = ratio * player.current.secs;
  if (target > previewLimitSecs()) {
    // A visitor tried to seek past the preview — open the gate.
    openSignup("That part of the book is past the preview. Sign up to listen to the full story.");
    return;
  }
  player.position = target;
  saveAudioProgress();
  updatePlayerUI();
});
$("#progressTrack").addEventListener("keydown", e => {
  if (!player.current) return;
  if (e.key === "ArrowLeft") { player.position = Math.max(0, player.position - 10); saveAudioProgress(); updatePlayerUI(); }
  if (e.key === "ArrowRight") {
    player.position = Math.min(player.current.secs, player.position + 10, previewLimitSecs());
    saveAudioProgress();
    updatePlayerUI();
  }
});
document.addEventListener("click", e => {
  const panel = $("#chapterPanel");
  if (panel.classList.contains("open") &&
      !panel.contains(e.target) && e.target.id !== "chaptersBtn") {
    panel.classList.remove("open");
  }
});
// Sleep timer countdown display refresh
setInterval(() => { if (player.sleepMins > 0) updateSleepBtn(); }, 15000);

/* ---------- Book reader view ---------- */
/* Two states, per the locked design decision (TY Nov 5 ~9:55 PM):
   - Visitor: preview text only (first 2 paragraphs, ~half a page),
     then the sign-up gate. "Read/listen to the full story" opens
     the sign-up modal.
   - Signed-in user: the full story text + full audio playback. */

/* ---------- Age lock message ---------- */
/* The message for a locked book: which rating it is and when it
   unlocks. No preview text, no audio — the message is all the
   reader gets. */

function lockMessage(book) {
  const age = ratingUnlockAge(book.rating);
  const label = ratingLabel(book.rating);
  if (!isSignedIn()) {
    return "This book is rated " + label + ". It unlocks when you turn " + age + ". Sign up with your date of birth and books unlock for your age automatically.";
  }
  return "This book is rated " + label + ". It unlocks when you turn " + age + ".";
}

function showAgeLockMessage(book) {
  $("#ageLockText").textContent = lockMessage(book);
  openModal("ageLockModal");
}

let readerBook = null;
// The saved reading position for the book currently in the reader:
// { paragraph, chapter } — or null when starting at the beginning.
let readerResume = null;
// Timestamp of the last openReader (the programmatic scroll to the
// saved position must not be mistaken for the user reading).
let _readerOpenedAt = 0;
// Last paragraph the scroll tracker saved (so it only saves on change).
let _lastReadPara = -1;

// The reader position to resume from, if the user left off past the
// beginning: { paragraph, chapter }. Null when there is no saved
// position or the saved position is the beginning.
function resumeParagraphFor(book, paras) {
  if (!book || !paras) return null;
  const prog = getProgress(book.id);
  if (!prog) return null;
  let para = null;
  if (typeof prog.paragraph === "number") para = prog.paragraph;
  else if (prog.chapter > 1) para = paragraphForChapter(prog.chapter, paras.length);
  if (para === null) return null;
  para = Math.max(0, Math.min(para, paras.length - 1));
  if (para <= 0) return null;
  return { paragraph: para, chapter: prog.chapter || chapterForParagraph(para, paras.length) };
}

function openReader(book) {
  if (!book) return false;
  // A locked book never opens — the age message is all the reader gets.
  if (isBookLocked(book)) { showAgeLockMessage(book); return false; }
  readerBook = book;
  markCurrentlyReading(book);
  document.body.classList.add("reading");
  $("#bookView").classList.remove("hidden");
  _readerOpenedAt = Date.now();
  _lastReadPara = -1;
  renderReader();
  // Jump to the saved reading position (if any); otherwise start at the top.
  if (readerResume) {
    const el = document.getElementById("reader-p-" + readerResume.paragraph);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  } else {
    window.scrollTo(0, 0);
  }
  return true;
}

function closeReader() {
  readerBook = null;
  document.body.classList.remove("reading");
  $("#bookView").classList.add("hidden");
}

$("#readerBackBtn").addEventListener("click", closeReader);

function renderReader() {
  const wrap = $("#readerContent");
  const book = readerBook;
  if (!book) { wrap.innerHTML = ""; return; }
  // The book the reader has open became locked (e.g. the user signed
  // out while reading a Rated R book): show the age message instead
  // of the text — no preview, no audio.
  if (isBookLocked(book)) {
    wrap.innerHTML = `
    <article class="reader">
      <div class="reader-cover ${book.grad}">
        <span class="cover-genre">${escapeHtml(book.genre)} · New today</span>
        <div class="cover-title">${escapeHtml(book.title)}</div>
        <div class="cover-meta">${book.dur} · ${CHAPTER_COUNT} chapters · ${ratingLabel(book.rating)}</div>
      </div>
      <div class="gate-box">
        <h3>🔒 This book is locked for now</h3>
        <p class="muted">${escapeHtml(lockMessage(book))}</p>
        <button class="btn btn-primary" id="ageLockBackBtn" type="button">Back to Daily Books</button>
      </div>
    </article>`;
    $("#ageLockBackBtn").addEventListener("click", closeReader);
    return;
  }
  const voice = player.current && player.current.id === book.id ? player.voice : "Warm";
  // The paragraphs shown here, and where the user left off in them.
  const paras = isSignedIn() ? bookFullText(book) : bookPreviewText(book);
  const resume = resumeParagraphFor(book, paras);
  readerResume = resume;
  const resumeBanner = resume
    ? '<p class="resume-banner">▶ Continue from Chapter ' + resume.chapter + ' <span class="small muted">— you left off at paragraph ' + (resume.paragraph + 1) + " of " + paras.length + "</span></p>"
    : "";
  // Every paragraph gets an id so the scroll tracker can tell how far
  // the user has read, and the resume paragraph is marked so the
  // reader can jump straight to it.
  const readerTextHTML = '<div class="reader-text">' + paras.map((p, i) =>
    '<p id="reader-p-' + i + '"' + (resume && i === resume.paragraph ? ' class="resume-target"' : "") + ">" + escapeHtml(p) + "</p>"
  ).join("") + "</div>";
  const coverHTML = `
      <div class="reader-cover ${book.grad}">
        <span class="cover-genre">${escapeHtml(book.genre)} · New today</span>
        <div class="cover-title">${escapeHtml(book.title)}</div>
        <div class="cover-meta">${book.dur} · ${CHAPTER_COUNT} chapters · ${ratingLabel(book.rating)}</div>
      </div>`;
  const headHTML = `
      <div class="reader-head">
        <h2>${escapeHtml(book.title)}</h2>
        <p class="muted">${escapeHtml(book.genre)} · ${book.dur} · 13 chapters · <span class="badge badge-rating">${ratingLabel(book.rating)}</span> <span class="badge badge-ai-dark">AI-Generated</span> <span class="badge badge-new">New today</span></p>
      </div>`;
  const voiceHTML = `
        <label class="reader-voice">Narrator
          <select id="readerVoiceSelect" aria-label="Narrator voice">${voiceOptionsHTML(voice)}</select>
        </label>`;

  if (isSignedIn()) {
    wrap.innerHTML = `
    <article class="reader">
      ${coverHTML}
      ${headHTML}
      <div class="reader-actions">
        <button class="btn btn-primary" id="readerListenBtn" type="button">▶ Listen to the Full Story</button>
        ${voiceHTML}
      </div>
      ${resumeBanner}
      ${readerTextHTML}
      <p class="small muted">(Placeholder text — the real generated book replaces this at launch.)</p>
    </article>`;
    $("#readerListenBtn").addEventListener("click", () => {
      loadBook(book, $("#readerVoiceSelect").value, true);
      document.getElementById("player").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    $("#readerVoiceSelect").addEventListener("change", e => setVoice(e.target.value));
  } else {
    wrap.innerHTML = `
    <article class="reader">
      ${coverHTML}
      ${headHTML}
      <div class="reader-actions">
        <button class="btn btn-primary" id="readerListenPreviewBtn" type="button">▶ Listen to the Preview</button>
        ${voiceHTML}
      </div>
      <p class="preview-label">Preview — the first pages</p>
      ${resumeBanner}
      ${readerTextHTML}
      <p class="preview-end">— Preview ends here —</p>
      <div class="gate-box">
        <h3>Keep reading ${escapeHtml(book.title)}?</h3>
        <p class="muted">The preview ends here. Sign up to read the full story — and listen to the full audiobook in any of the 12 narrator voices.</p>
        <button class="btn btn-primary" id="gateReadBtn" type="button">Read the Full Story — Sign Up</button>
        <button class="btn btn-ghost" id="gateListenBtn" type="button">Listen to the Full Story — Sign Up</button>
        <p class="small muted">Already a member? <button class="link-btn" id="gateLoginBtn" type="button">Log in</button></p>
        <p class="small muted">Listener $9.99/mo · Author $24.99/mo · Cancel anytime</p>
      </div>
    </article>`;
    const gateContext = "You picked “" + book.title + "”. Sign up to read the full story — and listen to the full audiobook.";
    $("#gateReadBtn").addEventListener("click", () => openSignup(gateContext));
    $("#gateListenBtn").addEventListener("click", () => openSignup(gateContext));
    $("#gateLoginBtn").addEventListener("click", () => openModal("loginModal"));
    $("#readerListenPreviewBtn").addEventListener("click", () => {
      loadBook(book, $("#readerVoiceSelect").value, true);
      document.getElementById("player").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    $("#readerVoiceSelect").addEventListener("change", e => setVoice(e.target.value));
  }
}

// Track how far the user has read: as the reader scrolls, save the
// furthest paragraph reached (only when it changes, so the saved
// position always reflects the latest spot). The programmatic scroll
// to the saved position when the reader opens is ignored (800ms
// window), so opening a book never overwrites its saved position.
function onReaderScroll() {
  if (!readerBook) return;
  if (Date.now() - _readerOpenedAt < 800) return;
  const paras = $$('[id^="reader-p-"]');
  if (!paras.length) return;
  const mid = (typeof window !== "undefined" && window.innerHeight) ? window.innerHeight / 2 : 0;
  let current = 0;
  paras.forEach((el, i) => {
    const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    if (rect && rect.top <= mid) current = i;
  });
  if (current !== _lastReadPara) {
    _lastReadPara = current;
    saveReadingProgress(readerBook, current);
  }
}
document.addEventListener("scroll", onReaderScroll);

/* ---------- Made For You form ---------- */

function renderPfGenres() {
  const wrap = $("#pfGenres");
  wrap.innerHTML = GENRES.map(g =>
    '<label class="check-chip"><input type="checkbox" value="' + escapeHtml(g) + '"> ' + escapeHtml(g) + "</label>"
  ).join("");
  $$("input[type=checkbox]", wrap).forEach(cb => cb.addEventListener("change", () => {
    const checked = $$("input[type=checkbox]:checked", wrap);
    if (checked.length > 3) { cb.checked = false; }
  }));
}

$("#personalizeForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#pfName").value.trim() || "you";
  const about = $("#pfAbout").value.trim();
  const genres = $$("#pfGenres input[type=checkbox]:checked").map(c => c.value);
  const rating = drawPersonalizedRating();
  const voice = $("#pfVoice").value;
  const genre = genres.length ? genres[0] : "Contemporary Fiction";
  const preview = $("#personalPreview");
  preview.innerHTML = `
    <span class="badge badge-ai-dark">AI-Generated</span>
    <span class="badge badge-new" style="margin-left:6px;">This week's preview</span>
    <h3 class="mt-2">A ${escapeHtml(genre)} story for ${escapeHtml(name)}</h3>
    <p class="muted">Your weekly book — about 30 minutes of listening. ${about ? "Built from what you told us: “" + escapeHtml(about.slice(0, 120)) + (about.length > 120 ? "…" : "") + "”" : "Built from your details, in the genres you picked."}</p>
    <p class="small"><strong>Genre:</strong> ${escapeHtml(genres.join(", ") || "Surprise me")} · <strong>Rating:</strong> ${ratingLabel(rating)} · <strong>Voice:</strong> ${escapeHtml(voice)}</p>
    <p class="small muted">This is a preview of how your personalized book is shaped — the real one is written fresh each week from your details. Change your details anytime on your account page and your next book changes with them.</p>
    <button class="btn btn-primary" type="button" id="previewPlayBtn">▶ Listen to a Sample Chapter</button>
    <p class="small muted mt-2">Sample playback is simulated in this preview — the real player plays your full weekly book.</p>`;
  $("#previewPlayBtn").addEventListener("click", () => {
    const sample = BOOKS.find(b => b.genre === genre) || BOOKS[0];
    loadBook(sample, voice, true);
    document.getElementById("player").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

/* ---------- Write Your Own flow ---------- */

function showWriteStep(n) {
  [1, 2, 3, 4].forEach(i => $("#writeStep" + i).classList.toggle("hidden", i !== n));
}

function buildOutline() {
  const genre = $("#wfGenre").value;
  const length = $("#wfLength").value;
  const count = (length === "long" || length === "longpremium") ? 24 : 16;
  const titles = OUTLINE_TITLES.slice(0, count);
  $("#wfOutlineTitle").textContent = "Your chapter outline — " + genre + " (" + count + " chapters)" + (writeMode() === "child" ? " — age-appropriate" : "");
  $("#wfOutlineList").innerHTML = titles.map((t, i) =>
    "<li><strong>Chapter " + (i + 1) + ":</strong> " + escapeHtml(t) + "</li>"
  ).join("");
  $("#wfOutlineNote").textContent = writeMode() === "child"
    ? "This outline is age-appropriate: no sexual content, no adult themes. In the full product, each chapter is written from the story bible, and you approve each one before the next is written."
    : "This outline is a preview. In the full product, each chapter is written from the story bible, and you approve each one before the next is written.";
  showWriteStep(2);
}

function buildQuestions() {
  const wrap = $("#wfQuestions");
  const questions = revisionQuestionsForMode();
  $("#wfQuestionsIntro").textContent = writeMode() === "child"
    ? "Answer in your own words. These questions are written for young writers — everything stays age-appropriate: no sexual content, no adult themes."
    : "Answer in your own words. Your answers direct the revision — the AI never changes the meaning of your story, only the writing.";
  wrap.innerHTML = questions.map((q, i) => `
    <div class="q-item">
      <label for="wq${i}">${i + 1}. ${escapeHtml(q[0])} <span>— ${escapeHtml(q[1])}</span></label>
      <textarea id="wq${i}" placeholder="Your answer, in your own words…"></textarea>
    </div>`).join("");
  showWriteStep(3);
}

$("#wfOutlineBtn").addEventListener("click", buildOutline);
$("#wfQuestionsBtn").addEventListener("click", buildQuestions);
$("#wfFinishBtn").addEventListener("click", () => showWriteStep(4));
$("#wfRestartBtn").addEventListener("click", () => showWriteStep(1));

// Child / adult mode switch (Write Your Own) — display only. The
// switch is set by the birthday on the account (see
// applyWriteModeFromDob); there is no UI control that lets a user
// change their own mode, so these buttons have no click handlers
// and are always disabled (see updateWriteModeUI).

/* ---------- Modals: sign up, log in ---------- */

function openModal(id) { $("#" + id).classList.add("open"); }
function closeModal(id) { $("#" + id).classList.remove("open"); }
$$("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
$$(".modal-backdrop").forEach(bd => bd.addEventListener("click", e => {
  if (e.target === bd) bd.classList.remove("open");
}));

// Sign up / log in — DEMO sign-in: no backend yet. Signing up or
// logging in sets the simulated signed-in state (localStorage) so
// the preview gate can be tested. Real accounts + Stripe at launch.
function openSignup(context) {
  $("#signupContext").textContent = context || "Join YourDailyBook. Your first book is waiting.";
  // Reset the modal to the form (a previous sign-up may have left the success view showing).
  $("#signupFormWrap").hidden = false;
  $("#signupSuccess").hidden = true;
  openModal("signupModal");
}

$("#signupBtn").addEventListener("click", () => openSignup());
$("#loginBtn").addEventListener("click", () => openModal("loginModal"));
$("#signoutBtn").addEventListener("click", signOut);
$$("[data-plan]").forEach(btn => btn.addEventListener("click", () => {
  const plan = btn.dataset.plan;
  $("#suPlan").value = plan;
  openSignup(plan === "author"
    ? "You picked the Author plan ($24.99/month) — daily books, your weekly book, plus a Write Your Own book every month."
    : "You picked the Listener plan ($9.99/month) — a new book in every genre, every day, plus your weekly personalized book.");
}));

$("#signupForm").addEventListener("submit", e => {
  e.preventDefault();
  const dobValue = $("#suDob").value;
  const dob = new Date(dobValue);
  if (isNaN(dob.getTime())) { alert("Please enter your date of birth."); return; }
  if (!$("#suAge").checked) {
    alert("Please agree to the Terms of Service.");
    return;
  }
  // PLACEHOLDER: no account/billing backend yet. Demo sign-in only.
  // The date of birth sets the account's content mode: under 18
  // signs in as a child account (child-safe content, locked to
  // Child mode); 18+ signs in as an adult.
  signIn($("#suName").value.trim(), dobValue);
  $("#signupSuccessTitle").textContent = "Welcome to YourDailyBook, " + auth.name + "!";
  $("#signupSuccessText").textContent = auth.isAdult
    ? "You're signed in. The full story is unlocked — go read it."
    : "You're signed in in Child mode — age-appropriate books only. A parent or guardian manages payment for your account.";
  $("#signupFormWrap").hidden = true;
  $("#signupSuccess").hidden = false;
});

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  // PLACEHOLDER: demo sign-in — any email/password works. The name
  // is taken from the email address. Real accounts open at launch.
  const email = $("#liEmail").value.trim();
  const name = email.split("@")[0].replace(/[._\-+]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Reader";
  signIn(name);
  closeModal("loginModal");
});

/* ---------- Init ---------- */

(function init() {
  // Defaults (TY Nov 5 ~10:43 PM): the site opens on Daily Books
  // (the first main tab) with genre "All" — the landing shows the
  // breadth of the catalog. activeGenre already defaults to "All".
  switchTab("daily");
  updateAuthUI(); // restore the signed-in header for returning demo users
  // Fill voice selects (player + Made For You form + Write Your Own genre select).
  $("#playerVoiceSelect").innerHTML = voiceOptionsHTML("Warm");
  $("#pfVoice").innerHTML = voiceOptionsHTML("Warm");
  $("#wfGenre").innerHTML = GENRES.map(g => "<option>" + escapeHtml(g) + "</option>").join("");
  renderPfGenres();
  renderGenrePills();
  renderRatingFilter(); // age-capped rating choices for the catalog
  renderPfRatings();     // age-capped rating choices for Made For You
  // Once the user touches a rating checkbox, their choices are theirs
  // — renderPfRatings stops re-applying the defaults (see the
  // pfRatingsTouched flag). Availability (disabled) is still enforced.
  $$("#pfRatings input[type=checkbox]").forEach(cb => cb.addEventListener("change", () => { pfRatingsTouched = true; }));
  updateWriteModeUI(); // child/adult toggle state for Write Your Own
  renderBooks();
  renderChapterList();
  updateSleepBtn();
})();
