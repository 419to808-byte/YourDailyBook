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
  // Romance (spice 3-4)
  { id: "r1", title: "The Lighthouse Keeper's Wife", genre: "Romance", spice: 3, secs: 18720, dur: "5h 12m", grad: "g0", desc: "After twenty years apart, a marine biologist returns to the island where she left her first love — and the lighthouse that never stopped burning for her." },
  { id: "r2", title: "Second Chance at Willow Creek", genre: "Romance", spice: 3, secs: 17280, dur: "4h 48m", grad: "g5", desc: "A big-city chef inherits a failing diner in her hometown and finds the boy who broke her heart now owns the bakery next door." },
  { id: "r3", title: "The Last Dance in Lisbon", genre: "Romance", spice: 4, secs: 20100, dur: "5h 35m", grad: "g8", desc: "Two rival dance instructors are forced to choreograph one last show together — and the rehearsal room keeps getting smaller." },
  // Mystery (spice 1-2)
  { id: "m1", title: "The Clockmaker's Alibi", genre: "Mystery", spice: 2, secs: 17760, dur: "4h 56m", grad: "g4", desc: "Every clock in the village stopped at 11:47 — the exact minute the mayor was found dead. The clockmaker swears he was home. The clocks say otherwise." },
  { id: "m2", title: "Murder at the Marigold Hotel", genre: "Mystery", spice: 1, secs: 16500, dur: "4h 35m", grad: "g6", desc: "A retired schoolteacher checks into a seaside hotel for a quiet weekend and finds the guest in room 12 never checked out — because he never left." },
  { id: "m3", title: "The Vanishing Violinist", genre: "Mystery", spice: 2, secs: 18900, dur: "5h 15m", grad: "g1", desc: "A concert violinist vanishes mid-performance, leaving her Stradivarius on the stage and a locked room full of people who all saw nothing." },
  // Thriller (spice 2)
  { id: "t1", title: "The Silent Passenger", genre: "Thriller", spice: 2, secs: 19500, dur: "5h 25m", grad: "g4", desc: "A rideshare driver picks up a passenger who knows her name, her route, and the secret she buried ten years ago." },
  { id: "t2", title: "Countdown in the Dark", genre: "Thriller", spice: 2, secs: 18300, dur: "5h 05m", grad: "g5", desc: "A power grid engineer has 24 hours to find the saboteur inside her own company — before the city goes dark for good." },
  { id: "t3", title: "The Double Agent's Daughter", genre: "Thriller", spice: 2, secs: 20700, dur: "5h 45m", grad: "g7", desc: "She grew up believing her father was a diplomat. The day he disappears, three governments come looking for her." },
  // Fantasy (spice 1-2)
  { id: "f1", title: "The Cartographer's Map of Stars", genre: "Fantasy", spice: 1, secs: 21600, dur: "6h 00m", grad: "g2", desc: "A mapmaker discovers a coastline that moves — and a kingdom that only exists on maps drawn in starlight." },
  { id: "f2", title: "The Ember Throne", genre: "Fantasy", spice: 2, secs: 20400, dur: "5h 40m", grad: "g0", desc: "The youngest of seven heirs must light the ember throne before the winter court claims it — but the flame only answers to the truth." },
  { id: "f3", title: "Witches of the Hollow Moon", genre: "Fantasy", spice: 2, secs: 19200, dur: "5h 20m", grad: "g8", desc: "Three estranged sisters inherit their grandmother's spellbook and one very angry moon." },
  // Science Fiction (spice 1)
  { id: "s1", title: "The Last Signal from Europa", genre: "Science Fiction", spice: 1, secs: 20880, dur: "5h 48m", grad: "g1", desc: "A deep-space listening post picks up a signal from a dead moon — and it's broadcasting the crew's own voices, three days in the future." },
  { id: "s2", title: "The Memory Merchants", genre: "Science Fiction", spice: 1, secs: 18000, dur: "5h 00m", grad: "g3", desc: "In a city where memories are currency, a broker who trades in other people's pasts finds a memory of her own that someone paid to erase." },
  { id: "s3", title: "Starlight Protocol", genre: "Science Fiction", spice: 1, secs: 19800, dur: "5h 30m", grad: "g7", desc: "The first contact team has one rule: never answer back. Then the signal starts asking questions only they would know." },
  // Horror (spice 1-2)
  { id: "h1", title: "The House on Hollow Hill", genre: "Horror", spice: 1, secs: 17400, dur: "4h 50m", grad: "g4", desc: "A house-flipper buys the cheapest house in the county. The house has opinions about being flipped." },
  { id: "h2", title: "Whispers in the Walls", genre: "Horror", spice: 2, secs: 18600, dur: "5h 10m", grad: "g5", desc: "A sound engineer moves into a converted recording studio and starts hearing a song that was never recorded — sung in her own voice." },
  { id: "h3", title: "The Thirteenth Floor", genre: "Horror", spice: 1, secs: 16800, dur: "4h 40m", grad: "g4", desc: "The elevator in her building has twelve buttons. Her new neighbor keeps pressing a thirteenth." },
  // Historical Fiction (spice 1-2)
  { id: "hf1", title: "The Seamstress of Paris", genre: "Historical Fiction", spice: 2, secs: 21000, dur: "5h 50m", grad: "g6", desc: "In occupied Paris, a seamstress hides coded messages in the hems of dresses — until a German officer orders a gown for his wife." },
  { id: "hf2", title: "Letters from the Front", genre: "Historical Fiction", spice: 1, secs: 17700, dur: "4h 55m", grad: "g9", desc: "Two sisters on opposite sides of a war keep writing letters they can never send — and one of them is delivered forty years late." },
  { id: "hf3", title: "The Tea Merchant's Daughter", genre: "Historical Fiction", spice: 2, secs: 20100, dur: "5h 35m", grad: "g3", desc: "A tea merchant's daughter in 1840s Boston inherits the family business, the family debts, and a ledger full of secrets." },
  // Crime (spice 2)
  { id: "c1", title: "The Informant's Gamble", genre: "Crime", spice: 2, secs: 19200, dur: "5h 20m", grad: "g7", desc: "A low-level informant bets everything on one last tip — and the detective on the other end of the phone is the one person he can't trust." },
  { id: "c2", title: "Cold Case at Harbor Point", genre: "Crime", spice: 2, secs: 18300, dur: "5h 05m", grad: "g1", desc: "A cold-case detective reopens the drowning that made her career — and realizes the victim's sister has been lying for twenty years." },
  { id: "c3", title: "The Forger's Confession", genre: "Crime", spice: 2, secs: 17400, dur: "4h 50m", grad: "g6", desc: "A retired art forger is asked to authenticate his own fake — the one hanging in the museum, the one everyone believes is real." },
  // Adventure (spice 1-2)
  { id: "a1", title: "The Lost City of Zafir", genre: "Adventure", spice: 1, secs: 21600, dur: "6h 00m", grad: "g9", desc: "A disgraced archaeologist and a teenage cartographer follow a map that shouldn't exist into a desert that isn't on any satellite." },
  { id: "a2", title: "Across the Burning Sands", genre: "Adventure", spice: 1, secs: 19800, dur: "5h 30m", grad: "g0", desc: "A camel caravan crossing the Empty Quarter finds a well that grants one wish — and every traveler wants a different one." },
  { id: "a3", title: "The Treasure of Captain Vale", genre: "Adventure", spice: 2, secs: 18600, dur: "5h 10m", grad: "g7", desc: "A salvage diver finds a captain's log pointing to a wreck that sank a hundred years ago — and a crew that never stopped guarding it." },
  // Contemporary Fiction (spice 2)
  { id: "cf1", title: "The Bookshop on Maple Street", genre: "Contemporary Fiction", spice: 2, secs: 18000, dur: "5h 00m", grad: "g6", desc: "A woman who stopped reading after her husband died inherits a bookshop — and the regulars refuse to let her sell it." },
  { id: "cf2", title: "Summer at the Lake House", genre: "Contemporary Fiction", spice: 2, secs: 17400, dur: "4h 50m", grad: "g3", desc: "Three adult siblings return to the lake house to sell it and discover their late mother left each of them a different last letter." },
  { id: "cf3", title: "The Art of Starting Over", genre: "Contemporary Fiction", spice: 2, secs: 18900, dur: "5h 15m", grad: "g2", desc: "At fifty-two, a corporate lawyer quits everything, buys a food truck, and learns that starting over is mostly learning to ask for help." }
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

// Highest spice level this user may see in the catalog.
function maxSpiceAllowed() { return isAdultUser() ? 4 : 2; }

function ageFromDob(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  return (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
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
    writeMode: isAdult ? "adult" : "child"
  };
  persistAuth();
  updateAuthUI();
  updateWriteModeUI();
  renderSpiceFilter();
  renderPfSpice();
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
  renderSpiceFilter();
  renderPfSpice();
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
/* The toggle is tied to the account age (date of birth at sign-up).
   - Visitor (not signed in): child mode, locked — age can't be verified.
   - Child account (under 18): child mode, locked — cannot switch to adult.
   - Adult account: starts in adult mode, can switch to child freely
     (e.g., making a book for a child) and back.
   Child mode generates age-appropriate books only (no sexual content,
   no adult themes). Adult mode is unchained. The minors hard stop —
   no sexual content involving minors, ever — applies in BOTH modes. */

function writeMode() { return auth.writeMode || "child"; }
function canSwitchWriteMode() { return isAdultUser(); }

function setWriteMode(mode) {
  if (mode === "adult" && !canSwitchWriteMode()) return false;
  auth.writeMode = mode;
  persistAuth();
  updateWriteModeUI();
  return true;
}

function updateWriteModeUI() {
  const mode = writeMode();
  const locked = !canSwitchWriteMode();
  const childBtn = $("#modeChildBtn");
  const adultBtn = $("#modeAdultBtn");
  childBtn.classList.toggle("active", mode === "child");
  adultBtn.classList.toggle("active", mode === "adult");
  adultBtn.disabled = locked;
  const badge = $("#writeModeBadge");
  badge.textContent = mode === "child" ? "Child mode" : "Adult mode";
  badge.className = "badge " + (mode === "child" ? "badge-child" : "badge-adult");
  $("#writeModeDesc").textContent = mode === "child"
    ? "Child mode — the AI writes age-appropriate books only: no sexual content, no adult themes. The questions and guidance are written for young writers."
    : "Adult mode — unchained: no holds, no blocks, no spice cap. The writer has full creative freedom.";
  $("#writeModeLock").textContent = !isSignedIn()
    ? "You're browsing as a visitor, so Child mode is on — we can't verify age without an account. Sign in with an adult account to switch to Adult mode."
    : (!isAdultUser()
      ? "This account is under 18, so Child mode is locked on. It can't be switched to Adult mode."
      : "You can switch modes anytime — use Child mode when making a book for a child.");
  $("#writeFlowMode").textContent = mode === "child"
    ? "Mode: Child — age-appropriate. Your book will contain no sexual content and no adult themes."
    : "Mode: Adult — unchained. No holds, no blocks, no spice cap. (No sexual content involving minors, ever.)";
  $("#wfStep1Note").textContent = mode === "child"
    ? "Child mode: your book will be age-appropriate — no sexual content, no adult themes."
    : "Adult mode: unchained — no holds, no blocks, no spice cap. (The one hard rule still applies: no sexual content involving minors, ever.)";
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
/* The spice filter doubles as the age filter. A child account or a
   visitor only ever sees spice 1–2; spice 3–4 are hidden from the
   grid and are not offered as filter choices. An adult account sees
   the full catalog. */

function renderSpiceFilter() {
  const sel = $("#spiceFilter");
  const adult = isAdultUser();
  const opts = [[0, "Show all"], [1, "1 — Sweet"], [2, "2 — Mild"]];
  if (adult) opts.push([3, "3 — Steamy"], [4, "4 — Open-door"]);
  sel.innerHTML = opts.map(o => '<option value="' + o[0] + '">' + o[1] + "</option>").join("");
  if (maxSpice > maxSpiceAllowed()) maxSpice = 0;
  sel.value = String(maxSpice);
}

function renderPfSpice() {
  const sel = $("#pfSpice");
  const adult = isAdultUser();
  const prev = sel.value;
  const opts = [[1, "1 — Sweet"], [2, "2 — Mild"]];
  if (adult) opts.push([3, "3 — Steamy"], [4, "4 — Open-door"]);
  sel.innerHTML = opts.map(o => '<option value="' + o[0] + '">' + o[1] + "</option>").join("");
  sel.value = (prev === "3" || prev === "4") ? (adult ? prev : "2") : (prev || "2");
  const hint = $("#pfSpiceHint");
  if (hint) hint.textContent = adult ? "" : "Child-safe accounts only see spice 1–2.";
}

function updateCatalogNote() {
  const note = $("#catalogAgeNote");
  if (!note) return;
  note.textContent = isAdultUser()
    ? "Showing the full catalog, including steamy books (spice 3–4)."
    : "Showing age-appropriate books (spice 1–2). Sign in with an adult account to see the full catalog, including steamy books.";
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
let maxSpice = 0; // 0 = show all

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
  const cap = maxSpiceAllowed();
  return BOOKS.filter(b =>
    (activeGenre === "All" || b.genre === activeGenre) &&
    b.spice <= cap &&
    (maxSpice === 0 || b.spice <= maxSpice)
  );
}

function renderBooks() {
  const grid = $("#bookGrid");
  const list = filteredBooks();
  updateCatalogNote();
  $("#bookCount").textContent = list.length + " book" + (list.length === 1 ? "" : "s") + " · New today";
  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state"><h3>No books match that filter</h3><p>Try a different genre or spice level.</p></div>';
    return;
  }
  grid.innerHTML = list.map(b => {
    const preview = bookPreviewText(b)[0];
    const signedIn = isSignedIn();
    return `
    <article class="book-card" data-book-id="${b.id}">
      <div class="book-cover ${b.grad}">
        <div class="cover-top">
          <span class="cover-genre">${escapeHtml(b.genre)}</span>
          <span class="badge badge-ai">AI-Generated</span>
        </div>
        <div class="cover-title">${escapeHtml(b.title)}</div>
      </div>
      <div class="book-body">
        <p class="book-desc">${escapeHtml(b.desc)}</p>
        <p class="preview-label">Preview — the first pages</p>
        <p class="preview-snippet">${escapeHtml(preview)}</p>
        <div class="book-meta">
          <span>⏱ ${b.dur}</span>
          <span>📖 13 chapters</span>
          <span class="badge badge-spice">Spice ${b.spice}</span>
          <span class="badge badge-new">New today</span>
        </div>
        <div class="book-actions">
          <button class="btn btn-primary btn-sm play-book" type="button" data-book-id="${b.id}">${signedIn ? "▶ Listen" : "▶ Preview"}</button>
          <button class="btn btn-ghost btn-sm read-book" type="button" data-book-id="${b.id}">${signedIn ? "Read full story" : "Read preview"}</button>
          <div class="voice-select">
            <select aria-label="Narrator voice for ${escapeHtml(b.title)}" data-book-voice="${b.id}">${voiceOptionsHTML("Warm")}</select>
          </div>
        </div>
      </div>
    </article>`;
  }).join("");

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
    openReader(book);
    loadBook(book, voiceSel ? voiceSel.value : "Warm", true);
  }));
  $$("[data-book-voice]", grid).forEach(sel => sel.addEventListener("change", () => {
    const book = BOOKS.find(x => x.id === sel.dataset.bookVoice);
    if (player.current && player.current.id === book.id) {
      setVoice(sel.value);
    }
  }));
}

$("#spiceFilter").addEventListener("change", e => {
  maxSpice = parseInt(e.target.value, 10) || 0;
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
  if (!player.current) return 0;
  return chapterDurations(player.current).slice(0, idx).reduce((a, b) => a + b, 0);
}

function loadBook(book, voice, autoplay) {
  player.current = book;
  player.position = 0;
  player.voice = voice || player.voice;
  $("#playerCover").className = "player-cover " + book.grad;
  $("#playerCover").textContent = book.title.split(" ").map(w => w[0]).slice(0, 2).join("");
  $("#playerTitle").textContent = book.title;
  updatePlayerSub();
  $("#playerVoiceSelect").value = player.voice;
  renderChapterList();
  updatePlayerUI();
  if (autoplay) setPlaying(true);
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
    " · Narrated by " + player.voice + " · Spice " + player.current.spice +
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
    if (!player.current) { loadBook(BOOKS[0], "Warm", false); }
    if (!player.timer) {
      player.timer = setInterval(tick, 250);
    }
  } else if (player.timer) {
    clearInterval(player.timer);
    player.timer = null;
  }
  updatePlayerUI();
}

function tick() {
  if (!player.playing || !player.current) return;
  player.position += 0.25 * player.speed;
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
  updatePlayerUI();
});
$("#nextChapterBtn").addEventListener("click", () => {
  if (!player.current) return;
  const cur = currentChapterIndex();
  player.position = chapterStartSeconds(Math.min(CHAPTER_COUNT - 1, cur + 1));
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
  updatePlayerUI();
});
$("#progressTrack").addEventListener("keydown", e => {
  if (!player.current) return;
  if (e.key === "ArrowLeft") { player.position = Math.max(0, player.position - 10); updatePlayerUI(); }
  if (e.key === "ArrowRight") {
    player.position = Math.min(player.current.secs, player.position + 10, previewLimitSecs());
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

let readerBook = null;

function openReader(book) {
  readerBook = book;
  document.body.classList.add("reading");
  $("#bookView").classList.remove("hidden");
  renderReader();
  window.scrollTo(0, 0);
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
  const voice = player.current && player.current.id === book.id ? player.voice : "Warm";
  const coverHTML = `
      <div class="reader-cover ${book.grad}">
        <span class="cover-genre">${escapeHtml(book.genre)} · New today</span>
        <div class="cover-title">${escapeHtml(book.title)}</div>
        <div class="cover-meta">${book.dur} · ${CHAPTER_COUNT} chapters · Spice ${book.spice}</div>
      </div>`;
  const headHTML = `
      <div class="reader-head">
        <h2>${escapeHtml(book.title)}</h2>
        <p class="muted">${escapeHtml(book.genre)} · ${book.dur} · 13 chapters · <span class="badge badge-spice">Spice ${book.spice}</span> <span class="badge badge-ai-dark">AI-Generated</span> <span class="badge badge-new">New today</span></p>
      </div>`;
  const voiceHTML = `
        <label class="reader-voice">Narrator
          <select id="readerVoiceSelect" aria-label="Narrator voice">${voiceOptionsHTML(voice)}</select>
        </label>`;

  if (isSignedIn()) {
    const paras = bookFullText(book);
    wrap.innerHTML = `
    <article class="reader">
      ${coverHTML}
      ${headHTML}
      <div class="reader-actions">
        <button class="btn btn-primary" id="readerListenBtn" type="button">▶ Listen to the Full Story</button>
        ${voiceHTML}
      </div>
      <div class="reader-text">${paras.map(p => "<p>" + escapeHtml(p) + "</p>").join("")}</div>
      <p class="small muted">(Placeholder text — the real generated book replaces this at launch.)</p>
    </article>`;
    $("#readerListenBtn").addEventListener("click", () => {
      loadBook(book, $("#readerVoiceSelect").value, true);
      document.getElementById("player").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    $("#readerVoiceSelect").addEventListener("change", e => setVoice(e.target.value));
  } else {
    const paras = bookPreviewText(book);
    wrap.innerHTML = `
    <article class="reader">
      ${coverHTML}
      ${headHTML}
      <div class="reader-actions">
        <button class="btn btn-primary" id="readerListenPreviewBtn" type="button">▶ Listen to the Preview</button>
        ${voiceHTML}
      </div>
      <p class="preview-label">Preview — the first pages</p>
      <div class="reader-text">${paras.map(p => "<p>" + escapeHtml(p) + "</p>").join("")}</div>
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
  const spice = $("#pfSpice").value;
  const voice = $("#pfVoice").value;
  const genre = genres.length ? genres[0] : "Contemporary Fiction";
  const preview = $("#personalPreview");
  preview.innerHTML = `
    <span class="badge badge-ai-dark">AI-Generated</span>
    <span class="badge badge-new" style="margin-left:6px;">This week's preview</span>
    <h3 class="mt-2">A ${escapeHtml(genre)} story for ${escapeHtml(name)}</h3>
    <p class="muted">Your weekly book — about 30 minutes of listening. ${about ? "Built from what you told us: “" + escapeHtml(about.slice(0, 120)) + (about.length > 120 ? "…" : "") + "”" : "Built from your details, in the genres you picked."}</p>
    <p class="small"><strong>Genre:</strong> ${escapeHtml(genres.join(", ") || "Surprise me")} · <strong>Spice:</strong> ${spice} · <strong>Voice:</strong> ${escapeHtml(voice)}</p>
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

// Child / adult mode toggle (Write Your Own). The Adult button is
// disabled for visitors and child accounts — see updateWriteModeUI.
$("#modeChildBtn").addEventListener("click", () => setWriteMode("child"));
$("#modeAdultBtn").addEventListener("click", () => setWriteMode("adult"));

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
  updateAuthUI(); // restore the signed-in header for returning demo users
  // Fill voice selects (player + Made For You form + Write Your Own genre select).
  $("#playerVoiceSelect").innerHTML = voiceOptionsHTML("Warm");
  $("#pfVoice").innerHTML = voiceOptionsHTML("Warm");
  $("#wfGenre").innerHTML = GENRES.map(g => "<option>" + escapeHtml(g) + "</option>").join("");
  renderPfGenres();
  renderGenrePills();
  renderSpiceFilter(); // age-capped spice choices for the catalog
  renderPfSpice();     // age-capped spice choices for Made For You
  updateWriteModeUI(); // child/adult toggle state for Write Your Own
  renderBooks();
  renderChapterList();
  updateSleepBtn();
})();
