/* ============================================================
   YourDailyBook — auth.js
   Sign-in / sign-up page + account settings (v7, Nov 6, 2026).
   Shared by signup.html and account.html. Does NOT load app.js —
   the two pages are standalone, so this file carries its own
   small copies of the pure helpers it needs.

   DEMO ONLY: no backend, no real accounts, no real payment.
   Sign-up / log-in state lives in localStorage (same demo keys
   as app.js: "ydb-auth" for the account, "ydb-profile" for the
   weekly-book details). Real auth + Stripe replace this at launch.
   A password is validated (8+ chars) and then DISCARDED — it is
   never stored anywhere.
   ============================================================ */

"use strict";

/* ---------- Locked data (mirrors app.js — same lists) ---------- */

const GENRES = [
  "Romance", "Mystery", "Thriller", "Fantasy", "Science Fiction",
  "Horror", "Historical Fiction", "Crime", "Adventure", "Contemporary Fiction"
];

// Descriptive narrator voices (locked: descriptive names, not human names/numbers).
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

const RATINGS = ["PG", "PG-13", "R"];
const MAX_GENRES = 3; // favorite genres: pick up to 3

/* ---------- Storage keys (same as app.js) ---------- */

const AUTH_KEY = "ydb-auth";
const PROFILE_KEY = "ydb-profile";
const SIGNUP_CONTEXT_KEY = "ydb-signup-context";

/* ---------- Pure helpers ---------- */

// keep in sync with app.js — same rule.
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

// keep in sync with app.js — same rule.
// Which ratings a reader with this date of birth may open.
// null / no DOB = age unverified (visitor) → PG only.
// under 13 → PG only; 13–17 → PG + PG-13; 18+ → all three.
function allowedRatingsForDob(dobStr) {
  const age = ageFromDob(dobStr);
  if (age === null) return ["PG"];
  if (age >= 18) return ["PG", "PG-13", "R"];
  if (age >= 13) return ["PG", "PG-13"];
  return ["PG"];
}

function ratingLabel(rating) { return rating === "R" ? "Rated R" : rating; }

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Narrator voice <option>s, grouped Female / Male (same as app.js).
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

// Genre cap, pure: toggling a genre adds it (if under the cap of 3)
// or removes it (if already picked). A 4th pick is refused — the
// returned array never holds more than MAX_GENRES.
function toggleGenreValue(selected, value) {
  const i = selected.indexOf(value);
  if (i >= 0) return selected.filter(v => v !== value);
  if (selected.length >= MAX_GENRES) return selected.slice();
  return selected.concat([value]);
}

// The weekly draw for Made For You (same rule as app.js): a random
// rating from the boxes the user checked. If none are checked, a
// random rating from what is available for their age — never Rated R
// unless they checked it.
function drawPersonalizedRating(checked, allowed) {
  const pool = checked.length > 0
    ? checked
    : allowed.filter(r => r !== "R");
  return pool[Math.floor(Math.random() * pool.length)];
}

// Hint text under a set of rating boxes, by what the reader may open.
function ratingHintText(allowed) {
  if (allowed.indexOf("R") >= 0) {
    return "Leave all unchecked for a random mix of PG and PG-13. Rated R is only generated if you check it.";
  }
  if (allowed.indexOf("PG-13") >= 0) {
    return "Rated R unlocks when you turn 18. Leave all unchecked for a random mix of PG and PG-13.";
  }
  return "PG-13 unlocks when you turn 13 and Rated R at 18 — books unlock for your age automatically.";
}

/* ---------- Demo storage ---------- */

function loadAuth() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    return saved && saved.signedIn ? saved : null;
  } catch (e) { return null; }
}

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") || null; }
  catch (e) { return null; }
}

function saveAuth(auth) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) { /* storage unavailable */ }
}

function saveProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) { /* storage unavailable */ }
}

function clearAuth() {
  try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ }
}

function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY); } catch (e) { /* ignore */ }
}

// The account record saved at sign-up — same shape app.js reads:
// name, email, dob, plan, isAdult, writeMode (child/adult, derived
// from the birthday, never user-flippable).
function buildAuth(name, email, dob, plan) {
  const age = ageFromDob(dob);
  const isAdult = age === null ? true : age >= 18;
  return {
    signedIn: true,
    name: (name || "Reader").trim() || "Reader",
    email: email || "",
    dob: dob || null,
    plan: plan || "listener",
    isAdult: isAdult,
    writeMode: isAdult ? "adult" : "child"
  };
}

/* ---------- DOM helpers (shared by both pages) ---------- */

function $(id) { return document.getElementById(id); }
function show(el) { if (el) el.classList.remove("hidden"); }
function hide(el) { if (el) el.classList.add("hidden"); }

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}
function clearError(el) {
  if (!el) return;
  el.textContent = "";
  el.classList.add("hidden");
}
function showMsg(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// Name for the demo log-in, taken from the email address (same as
// the old login modal in app.js).
function nameFromEmail(email) {
  return String(email || "").split("@")[0].replace(/[._\-+]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase()).trim() || "Reader";
}

// Render the 10 genre checkboxes into a container. onToggle(value)
// fires when a chip changes; the page owns the selection state.
function buildGenreChips(container, selected, onToggle) {
  if (!container) return;
  container.innerHTML = GENRES.map(g =>
    '<label class="check-chip"><input type="checkbox" value="' + escapeHtml(g) + '"' +
    (selected.indexOf(g) >= 0 ? " checked" : "") + '> ' + escapeHtml(g) + "</label>"
  ).join("");
  Array.from(container.querySelectorAll("input[type=checkbox]")).forEach(cb => {
    cb.addEventListener("change", () => onToggle(cb.value));
  });
}

// Sync a genre chip container to a selection array (used after a
// toggle that was refused by the cap — the 4th chip unchecks).
function syncGenreChips(container, selected) {
  if (!container) return;
  Array.from(container.querySelectorAll("input[type=checkbox]")).forEach(cb => {
    cb.checked = selected.indexOf(cb.value) >= 0;
  });
}

function readGenreBoxes(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll("input[type=checkbox]"))
    .filter(cb => cb.checked).map(cb => cb.value);
}

// Render the 3 rating checkboxes into a container, gated by the
// ratings the reader's age allows. checked = the ratings to check;
// unavailable boxes are disabled and unchecked.
function buildRatingBoxes(container, allowed, checked) {
  if (!container) return;
  container.innerHTML = RATINGS.map(r =>
    '<label class="check-chip"><input type="checkbox" value="' + r + '"' +
    (checked.indexOf(r) >= 0 ? " checked" : "") +
    (allowed.indexOf(r) < 0 ? " disabled" : "") + '> ' + ratingLabel(r) + "</label>"
  ).join("");
}

function readRatingBoxes(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll("input[type=checkbox]"))
    .filter(cb => cb.checked && !cb.disabled).map(cb => cb.value);
}

/* ---------- Shared header (both pages) ---------- */

function wireHeader() {
  // Mobile nav toggle (same pattern as app.js on index.html).
  const navToggle = $("navToggle");
  const mainNav = $("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    Array.from(mainNav.querySelectorAll("a")).forEach(a =>
      a.addEventListener("click", () => mainNav.classList.remove("open")));
  }

  const auth = loadAuth();
  const greet = $("authGreeting");
  const signoutBtn = $("signoutBtn");
  const loginBtn = $("loginBtn");
  const settingsLink = $("settingsLink");
  if (greet) {
    greet.classList.toggle("hidden", !auth);
    if (auth) greet.textContent = "Hi, " + auth.name;
  }
  if (signoutBtn) {
    signoutBtn.classList.toggle("hidden", !auth);
    signoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.reload();
    });
  }
  if (loginBtn) {
    loginBtn.classList.toggle("hidden", !!auth);
    loginBtn.addEventListener("click", () => {
      // On the sign-up page this flips to the log-in view; on the
      // account page it goes to the sign-up page's log-in view.
      if (document.querySelector('[data-auth-page="signup"]')) {
        showAuthMode("login");
      } else {
        window.location.href = "signup.html?mode=login";
      }
    });
  }
  if (settingsLink) {
    // Hidden on the account page itself (you are already there).
    const onAccount = !!document.querySelector('[data-auth-page="account"]');
    settingsLink.classList.toggle("hidden", !auth || onAccount);
  }
}

/* ============================================================
   SIGN-UP PAGE (signup.html)
   ============================================================ */

// The sign-up state, shared by BOTH variants — this is what makes
// switching variants lossless: each form reads from and writes to
// the same object.
const signupState = {
  name: "", email: "", password: "", dob: "", plan: "listener", terms: false,
  about: "", genres: [], ratings: null, // null = defaults not yet chosen
  ratingsTouched: false,
  voice: "Warm",
  variant: "one", // "one" | "steps"
  step: 1
};

function signupAllowedRatings() {
  return allowedRatingsForDob(signupState.dob);
}

function signupDefaultRatings() {
  return signupAllowedRatings().filter(r => r !== "R");
}

// (Re)render the rating boxes + hint for one variant's container,
// from the shared state.
function wireSignupRatings(containerId, hintId) {
  const container = $(containerId);
  const hint = $(hintId);
  if (!container) return;
  const allowed = signupAllowedRatings();
  let checked;
  if (signupState.ratings === null) {
    checked = signupDefaultRatings();
  } else {
    checked = signupState.ratings.filter(r => allowed.indexOf(r) >= 0);
  }
  buildRatingBoxes(container, allowed, checked);
  if (hint) hint.textContent = ratingHintText(allowed);
  Array.from(container.querySelectorAll("input[type=checkbox]")).forEach(cb => {
    cb.addEventListener("change", () => {
      signupState.ratingsTouched = true;
      signupState.ratings = readRatingBoxes(container);
    });
  });
}

function onSignupGenreToggle(variant) {
  return function (value) {
    signupState.genres = toggleGenreValue(signupState.genres, value);
    syncGenreChips($("opGenres"), signupState.genres);
    syncGenreChips($("st2Genres"), signupState.genres);
  };
}

// Pull the visible form's values into the shared state.
function collectSignupState() {
  if (signupState.variant === "one") {
    signupState.name = $("opName").value;
    signupState.email = $("opEmail").value;
    signupState.password = $("opPass").value;
    signupState.dob = $("opDob").value;
    signupState.plan = $("opPlan").value;
    signupState.terms = $("opTerms").checked;
    signupState.about = $("opAbout").value;
    signupState.genres = readGenreBoxes($("opGenres"));
    signupState.ratings = readRatingBoxes($("opRatings"));
    signupState.voice = $("opVoice").value;
  } else {
    signupState.name = $("st1Name").value;
    signupState.email = $("st1Email").value;
    signupState.password = $("st1Pass").value;
    signupState.dob = $("st1Dob").value;
    signupState.plan = $("st1Plan").value;
    signupState.about = $("st2About").value;
    signupState.genres = readGenreBoxes($("st2Genres"));
    signupState.ratings = readRatingBoxes($("st2Ratings"));
    signupState.voice = $("st2Voice").value;
    const termsBox = $("st3Terms");
    if (termsBox) signupState.terms = termsBox.checked;
  }
}

// Push the shared state into BOTH forms (so switching variants, or
// going back a step, never loses anything typed).
function populateSignupForms() {
  const s = signupState;
  // One-page form.
  $("opName").value = s.name;
  $("opEmail").value = s.email;
  $("opPass").value = s.password;
  $("opDob").value = s.dob;
  $("opPlan").value = s.plan;
  $("opTerms").checked = s.terms;
  $("opAbout").value = s.about;
  $("opVoice").value = s.voice;
  buildGenreChips($("opGenres"), s.genres, onSignupGenreToggle("one"));
  wireSignupRatings("opRatings", "opRatingsHint");
  // Step-by-step form.
  $("st1Name").value = s.name;
  $("st1Email").value = s.email;
  $("st1Pass").value = s.password;
  $("st1Dob").value = s.dob;
  $("st1Plan").value = s.plan;
  $("st2About").value = s.about;
  $("st2Voice").value = s.voice;
  buildGenreChips($("st2Genres"), s.genres, onSignupGenreToggle("steps"));
  wireSignupRatings("st2Ratings", "st2RatingsHint");
  const termsBox = $("st3Terms");
  if (termsBox) termsBox.checked = s.terms;
}

function showSignupVariant(variant) {
  collectSignupState();
  signupState.variant = variant;
  populateSignupForms();
  $("onePageForm").classList.toggle("hidden", variant !== "one");
  $("stepsForm").classList.toggle("hidden", variant !== "steps");
  $("protoOneBtn").classList.toggle("btn-primary", variant === "one");
  $("protoOneBtn").classList.toggle("btn-ghost", variant !== "one");
  $("protoStepsBtn").classList.toggle("btn-primary", variant === "steps");
  $("protoStepsBtn").classList.toggle("btn-ghost", variant !== "steps");
  if (variant === "steps") showSignupStep(signupState.step);
}

// Step-by-step: show one step, update the progress indicator.
function showSignupStep(n) {
  signupState.step = n;
  [1, 2, 3].forEach(i => {
    const panel = $("stStep" + i);
    if (panel) panel.classList.toggle("hidden", i !== n);
  });
  Array.from(document.querySelectorAll(".steps-indicator li")).forEach(li => {
    const stepNum = parseInt(li.getAttribute("data-step"), 10);
    li.classList.toggle("active", stepNum === n);
    li.classList.toggle("done", stepNum < n);
  });
  if (n === 2) {
    // Ratings are gated by the Step 1 birthday — re-render them
    // from the shared state as the user arrives on Step 2.
    wireSignupRatings("st2Ratings", "st2RatingsHint");
  }
  if (n === 3) renderSignupReview();
}

function renderSignupReview() {
  const s = signupState;
  const planLabel = s.plan === "author" ? "Author — $24.99/month" : "Listener — $9.99/month";
  const dobText = s.dob ? s.dob : "—";
  const ratings = (s.ratings === null ? signupDefaultRatings() : s.ratings);
  const ratingsText = ratings.length ? ratings.map(ratingLabel).join(", ") : "Random mix (PG / PG-13)";
  const rows = [
    ["Your name", s.name || "—"],
    ["Email", s.email || "—"],
    ["Date of birth", dobText],
    ["Plan", planLabel],
    ["About you", s.about || "—"],
    ["Favorite genres", s.genres.length ? s.genres.join(", ") : "Surprise me"],
    ["Ratings", ratingsText],
    ["Narrator voice", s.voice]
  ];
  $("st3Review").innerHTML = rows.map(row =>
    '<div class="review-row"><span>' + escapeHtml(row[0]) + '</span><span>' + escapeHtml(row[1]) + "</span></div>"
  ).join("");
}

function validateAccountStep(errEl) {
  const s = signupState;
  if (!s.name.trim()) { showError(errEl, "Please enter your name."); return false; }
  if (!validEmail(s.email)) { showError(errEl, "Please enter a valid email address."); return false; }
  if (!s.password || s.password.length < 8) { showError(errEl, "Your password needs at least 8 characters."); return false; }
  if (ageFromDob(s.dob) === null) { showError(errEl, "Please enter your date of birth."); return false; }
  clearError(errEl);
  return true;
}

// Finish sign-up (either variant): save the account + the weekly
// book details, then show the success view.
function completeSignup() {
  const s = signupState;
  const ratings = (s.ratings === null ? signupDefaultRatings() : s.ratings);
  const auth = buildAuth(s.name, s.email, s.dob, s.plan);
  saveAuth(auth);
  saveProfile({
    about: s.about.trim(),
    genres: s.genres.slice(),
    ratings: ratings.slice(),
    voice: s.voice
  });
  // The password is validated and then discarded — never stored.
  signupState.password = "";
  hide($("authMain"));
  $("authSuccessTitle").textContent = "Welcome to YourDailyBook, " + auth.name + "!";
  $("authSuccessText").textContent = auth.isAdult
    ? "Your first weekly book is on its way — almost instant. The full story is unlocked — go read it."
    : "Your first weekly book is on its way — almost instant. You're signed in in Child mode — age-appropriate books only. A parent or guardian manages payment for your account.";
  show($("authSuccess"));
  window.scrollTo(0, 0);
}

// Create account / Log in toggle on the sign-up page.
function showAuthMode(mode) {
  const isSignup = mode === "signup";
  $("modeSignupBtn").classList.toggle("active", isSignup);
  $("modeLoginBtn").classList.toggle("active", !isSignup);
  $("authTitle").textContent = isSignup ? "Create your account" : "Welcome back";
  $("protoSwitcher").classList.toggle("hidden", !isSignup);
  $("onePageForm").classList.toggle("hidden", !isSignup || signupState.variant !== "one");
  $("stepsForm").classList.toggle("hidden", !isSignup || signupState.variant !== "steps");
  $("loginFormPage").classList.toggle("hidden", isSignup);
}

function initSignupPage() {
  const params = new URLSearchParams(window.location.search || "");
  const existing = loadAuth();
  wireHeader();

  // Already signed in? Say so — don't make them sign up twice.
  if (existing) {
    hide($("authMain"));
    $("authAlreadyTitle").textContent = "You're already signed in, " + existing.name + ".";
    $("authAlreadyText").textContent = "Pick up where you left off — your books, your weekly story, and your settings are waiting.";
    show($("authAlready"));
    $("authAlreadySignout").addEventListener("click", () => {
      clearAuth();
      window.location.reload();
    });
    return;
  }

  // Context from the page that sent the user here (e.g. a book's
  // preview gate) — shown once, then cleared.
  try {
    const context = sessionStorage.getItem(SIGNUP_CONTEXT_KEY);
    if (context) {
      $("authContext").textContent = context;
      sessionStorage.removeItem(SIGNUP_CONTEXT_KEY);
    }
  } catch (e) { /* ignore */ }

  // ?plan=listener|author pre-selects the plan (e.g. from Pricing).
  const planParam = params.get("plan");
  if (planParam === "author" || planParam === "listener") signupState.plan = planParam;

  // Fill the voice selects.
  $("opVoice").innerHTML = voiceOptionsHTML("Warm");
  $("st2Voice").innerHTML = voiceOptionsHTML("Warm");
  populateSignupForms();

  // Mode toggle.
  $("modeSignupBtn").addEventListener("click", () => showAuthMode("signup"));
  $("modeLoginBtn").addEventListener("click", () => showAuthMode("login"));
  $("switchToSignup").addEventListener("click", () => showAuthMode("signup"));

  // Prototype switcher — both flows, one page, nothing typed lost.
  $("protoOneBtn").addEventListener("click", () => showSignupVariant("one"));
  $("protoStepsBtn").addEventListener("click", () => showSignupVariant("steps"));

  // DOB typed on the one-page form re-gates the ratings live.
  $("opDob").addEventListener("change", () => {
    collectSignupState();
    if (!signupState.ratingsTouched) signupState.ratings = null;
    else signupState.ratings = (signupState.ratings || []).filter(r => signupAllowedRatings().indexOf(r) >= 0);
    wireSignupRatings("opRatings", "opRatingsHint");
  });
  // DOB typed on Step 1 re-gates the Step 2 ratings.
  $("st1Dob").addEventListener("change", () => {
    collectSignupState();
    if (!signupState.ratingsTouched) signupState.ratings = null;
    else signupState.ratings = (signupState.ratings || []).filter(r => signupAllowedRatings().indexOf(r) >= 0);
  });

  // Step-by-step navigation.
  $("stNext1").addEventListener("click", () => {
    collectSignupState();
    if (validateAccountStep($("stStep1Error"))) showSignupStep(2);
  });
  $("stBack2").addEventListener("click", () => { collectSignupState(); showSignupStep(1); });
  $("stNext2").addEventListener("click", () => { collectSignupState(); showSignupStep(3); });
  $("stBack3").addEventListener("click", () => { collectSignupState(); showSignupStep(2); });

  // One-page submit.
  $("onePageForm").addEventListener("submit", e => {
    e.preventDefault();
    collectSignupState();
    if (!validateAccountStep($("opError"))) return;
    if (!signupState.terms) { showError($("opError"), "Please agree to the Terms of Service."); return; }
    clearError($("opError"));
    completeSignup();
  });

  // Step-by-step submit (from the review step).
  $("stepsForm").addEventListener("submit", e => {
    e.preventDefault();
    collectSignupState();
    if (!validateAccountStep($("stStep3Error"))) return;
    if (!signupState.terms) { showError($("stStep3Error"), "Please agree to the Terms of Service."); return; }
    clearError($("stStep3Error"));
    completeSignup();
  });

  // Log-in submit — demo: any email/password works. If a profile
  // exists for this email, restore it; otherwise sign in as a demo
  // account named from the email.
  $("loginFormPage").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("lgEmail").value.trim();
    const password = $("lgPass").value;
    if (!validEmail(email)) { showError($("lgError"), "Please enter a valid email address."); return; }
    if (!password) { showError($("lgError"), "Please enter your password."); return; }
    clearError($("lgError"));
    const stored = loadAuth();
    if (stored && stored.email && stored.email.toLowerCase() === email.toLowerCase()) {
      saveAuth(Object.assign({}, stored, { signedIn: true }));
    } else {
      // Demo account — no DOB on file, treated as adult (same as
      // the old demo log-in in app.js).
      saveAuth(buildAuth(nameFromEmail(email), email, null, (stored && stored.plan) || "listener"));
    }
    window.location.href = "index.html";
  });

  // ?mode=login opens the log-in view directly.
  if (params.get("mode") === "login") showAuthMode("login");
  else showAuthMode("signup");
}

/* ============================================================
   ACCOUNT / SETTINGS PAGE (account.html)
   ============================================================ */

const accountState = {
  genres: [],
  ratings: null, // null = defaults not yet chosen
  ratingsTouched: false,
  voice: "Warm"
};

function accountAllowedRatings(auth) {
  return allowedRatingsForDob(auth && auth.dob ? auth.dob : null);
}

function wireAccountRatings(auth) {
  const container = $("acRatings");
  const hint = $("acRatingsHint");
  if (!container) return;
  const allowed = accountAllowedRatings(auth);
  let checked;
  if (accountState.ratings === null) {
    checked = allowed.filter(r => r !== "R");
  } else {
    checked = accountState.ratings.filter(r => allowed.indexOf(r) >= 0);
  }
  buildRatingBoxes(container, allowed, checked);
  if (hint) hint.textContent = ratingHintText(allowed);
  Array.from(container.querySelectorAll("input[type=checkbox]")).forEach(cb => {
    cb.addEventListener("change", () => {
      accountState.ratingsTouched = true;
      accountState.ratings = readRatingBoxes(container);
    });
  });
}

function initAccountPage() {
  wireHeader();
  const auth = loadAuth();
  const loggedOut = $("acctLoggedOut");
  const main = $("acctMain");

  if (!auth) {
    hide(main);
    show(loggedOut);
    return;
  }
  hide(loggedOut);
  show(main);
  $("acctGreeting").textContent = "Hi, " + auth.name;
  $("acctSignoutBtn").addEventListener("click", () => {
    clearAuth();
    window.location.reload();
  });

  // --- Section 1: Your weekly book (details from signup) ---
  const profile = loadProfile() || {};
  accountState.genres = (profile.genres || []).slice();
  accountState.ratings = profile.ratings ? profile.ratings.slice() : null;
  accountState.ratingsTouched = !!profile.ratings;
  accountState.voice = profile.voice || "Warm";
  $("acAbout").value = profile.about || "";
  $("acVoice").innerHTML = voiceOptionsHTML(accountState.voice);
  buildGenreChips($("acGenres"), accountState.genres, value => {
    accountState.genres = toggleGenreValue(accountState.genres, value);
    syncGenreChips($("acGenres"), accountState.genres);
  });
  wireAccountRatings(auth);

  $("acSaveBookBtn").addEventListener("click", () => {
    saveProfile({
      about: $("acAbout").value.trim(),
      genres: readGenreBoxes($("acGenres")),
      ratings: readRatingBoxes($("acRatings")),
      voice: $("acVoice").value
    });
    accountState.ratings = readRatingBoxes($("acRatings"));
    accountState.ratingsTouched = true;
    showMsg($("acBookMsg"), "Saved — your next weekly book will use these details.");
  });

  // --- Section 2: Account ---
  $("acName").value = auth.name || "";
  $("acEmail").value = auth.email || "";
  $("acPlan").value = auth.plan || "listener";
  $("acDobNote").textContent = auth.dob
    ? "Date of birth on file: " + auth.dob + " — this sets your content ratings and can't be changed here."
    : "No date of birth on file (demo log-in) — your account is treated as adult. Sign up with a date of birth to set your content ratings.";

  $("acSaveAccountBtn").addEventListener("click", () => {
    const name = $("acName").value.trim();
    const email = $("acEmail").value.trim();
    if (!name) { showError($("acAccountMsg"), "Please enter your name."); return; }
    if (!validEmail(email)) { showError($("acAccountMsg"), "Please enter a valid email address."); return; }
    const newPass = $("acNewPass").value;
    if (newPass && newPass.length < 8) { showError($("acAccountMsg"), "A new password needs at least 8 characters."); return; }
    const updated = Object.assign({}, loadAuth() || auth, {
      name: name,
      email: email,
      plan: $("acPlan").value
    });
    if (newPass) {
      // Demo honesty: passwords aren't checked at sign-in yet, so
      // nothing secret is stored — just a note that it was changed.
      updated.passwordNote = "Password changed on " + new Date().toISOString().slice(0, 10) +
        " (demo — sign-in doesn't check passwords yet; set a real password when real accounts open at launch).";
    }
    saveAuth(updated);
    clearError($("acAccountMsg"));
    $("acNewPass").value = "";
    $("acctGreeting").textContent = "Hi, " + updated.name;
    const greet = $("authGreeting");
    if (greet) greet.textContent = "Hi, " + updated.name;
    showMsg($("acAccountMsg"), newPass
      ? "Saved. Demo note: passwords aren't checked at sign-in yet, so your new password isn't stored as a credential — you'll set a real one when real accounts open at launch."
      : "Saved.");
  });

  // --- Section 3: Privacy & data ---
  $("acDelDetailsBtn").addEventListener("click", () => {
    if (!window.confirm("Delete your personal details? This clears the about-you text, genres, ratings, and voice saved for your weekly book. Your account stays signed in.")) return;
    clearProfile();
    accountState.genres = [];
    accountState.ratings = null;
    accountState.ratingsTouched = false;
    $("acAbout").value = "";
    $("acVoice").value = "Warm";
    buildGenreChips($("acGenres"), [], value => {
      accountState.genres = toggleGenreValue(accountState.genres, value);
      syncGenreChips($("acGenres"), accountState.genres);
    });
    wireAccountRatings(loadAuth());
    showMsg($("acDeleteMsg"), "Your personal details are deleted — your weekly book will use the defaults until you set them again.");
  });

  $("acDelAccountBtn").addEventListener("click", () => {
    if (!window.confirm("Delete your whole account? This signs you out and clears your account and your personal details from this browser. This can't be undone.")) return;
    clearProfile();
    clearAuth();
    window.location.reload();
  });
}

/* ---------- Boot ---------- */

// Only run the page wiring when this file is loaded on a page that
// declares itself (data-auth-page="signup" | "account"). In a Node
// vm harness the stub document returns null here, so nothing runs
// and only the pure helpers are exercised.
if (typeof document !== "undefined" && document.querySelector) {
  const pageEl = document.querySelector("[data-auth-page]");
  if (pageEl) {
    const kind = pageEl.getAttribute("data-auth-page");
    if (kind === "signup") initSignupPage();
    else if (kind === "account") initAccountPage();
  }
}
