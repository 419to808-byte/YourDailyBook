/* ============================================================
   YourDailyBook — auth.js
   Sign-in / sign-up page + account settings (v9, Nov 7, 2026).
   Shared by signup.html and account.html. Does NOT load app.js —
   the two pages are standalone, so this file carries its own
   small copies of the pure helpers it needs.

   REAL AUTH (Supabase Auth / GoTrue) via direct REST calls —
   NO Supabase JS SDK, so the site keeps zero third-party scripts
   (see ~/workspace/yourdailybook-supabase-auth-design.md §1).
   All auth calls go through supabaseAuthFetch() with the anon key.
   The service-role key NEVER goes in this file, the repo, or any
   page — it lives only on the API server (Render).

   FROZEN STATE: LAUNCH is false and no Supabase project exists
   yet, so no real sign-in can work. The public site shows the
   honest waitlist state: the sign-up form writes only to the
   waitlist (once a project is configured) and no account, plan,
   or payment is created. The real sign-up / log-in code ships
   behind the LAUNCH flag so launch day is a flip, not a build.
   Never claim real sign-in works without a backend, and never
   invent a Supabase project URL, key, or project ID — the
   SUPABASE_URL / SUPABASE_ANON_KEY constants below are empty
   until TY creates the project (design note §7).

   Sessions live in localStorage under "ydb-session" (access +
   refresh token + expiry + user). The old demo keys "ydb-auth"
   and "ydb-profile" are never read or written; they are deleted
   on load as hygiene — demo accounts were never real and cannot
   be migrated. A password is validated (8+ chars) and then
   DISCARDED — it is never stored anywhere.
   ============================================================ */

"use strict";

/* ---------- Config (one place — rotate / flip here) ---------- */

// Fill these in when TY creates the Supabase project (design §7).
// They are EMPTY until then — no URL or key is invented here.
// The anon key is public by design once set; the service-role key
// NEVER goes here.
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

// The catalog/profile API base (Render) — empty until the API
// worker's host exists. Profile reads/writes and account deletion
// go through it with the user's JWT; they fail closed while empty.
const API_BASE_URL = "";

// LAUNCH === false → waitlist only (frozen state, design §6).
// LAUNCH === true → the real sign-up path (§4.1) is live.
// Launch day is this one line, plus the §6 flip checklist.
const LAUNCH = false;

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

/* ---------- Storage keys ---------- */

// The Supabase session (design §8). The demo keys are gone — see
// clearLegacyDemoKeys() below.
const SESSION_KEY = "ydb-session";
const SIGNUP_CONTEXT_KEY = "ydb-signup-context";
// Weekly-book prefs + plan choice, staged at sign-up and pushed to
// profiles via the API after email verification (design §4.1/§8).
// Session-scoped: cleared once pushed. Preferences, not auth data.
const SIGNUP_PREFS_KEY = "ydb-signup-prefs";

/* ---------- Pure helpers ---------- */

// keep in sync with app.js — same rule.
// Whole-year age from a "YYYY-MM-DD" date string, computed by
// calendar date so the birthday itself counts. Timezone-safe: the
// string is parsed as numbers, never as a UTC midnight.
//
// DISPLAY-ONLY (design §0/§8): this gates the rating checkboxes
// on the sign-up form and the account page so the form cannot
// offer a box the reader's age cannot use. It is NEVER the
// enforcement point — the API computes the tier from the stored
// DOB in profiles on every request.
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
//
// DISPLAY-ONLY (design §0/§8): see ageFromDob. The API re-derives
// the tier server-side from the stored DOB; a client-side tier is
// never authoritative.
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

/* ---------- Supabase session layer (design §1/§8) ---------- */

// The Supabase project is not configured yet: no call is ever
// attempted against an invented URL. Every auth call fails closed
// with error "not_configured" until SUPABASE_URL + ANON_KEY are set.
function isSupabaseConfigured() {
  return typeof SUPABASE_URL === "string" && SUPABASE_URL.indexOf("https://") === 0 &&
    typeof SUPABASE_ANON_KEY === "string" && SUPABASE_ANON_KEY.length > 0;
}

function isApiConfigured() {
  return typeof API_BASE_URL === "string" && API_BASE_URL.indexOf("https://") === 0;
}

// One helper for every GoTrue call (design §1 table). Returns
// { ok, status, data } or { ok: false, error } where error is
// "not_configured" | "network" | the GoTrue error code/message.
// Never throws for an HTTP error — callers decide what to show.
async function supabaseAuthFetch(path, options) {
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  const opts = options || {};
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json"
  };
  if (opts.token) headers["Authorization"] = "Bearer " + opts.token;
  let res;
  try {
    res = await fetch(SUPABASE_URL + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
  } catch (e) {
    return { ok: false, error: "network" };
  }
  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) {
    const code = (data && (data.error_code || data.error)) || ("http_" + res.status);
    return { ok: false, error: String(code), status: res.status, data: data };
  }
  return { ok: true, status: res.status, data: data };
}

// Session shape: { access_token, refresh_token, expires_at, user }.
// expires_at is a ms epoch, computed from expires_in at save time.
function getSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (saved && typeof saved.access_token === "string" && saved.access_token &&
      typeof saved.expires_at === "number") return saved;
    return null;
  } catch (e) { return null; }
}

function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* storage unavailable */ }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

function sessionIsValid(session) {
  return !!session && typeof session.access_token === "string" && !!session.access_token &&
    typeof session.expires_at === "number" && session.expires_at > Date.now();
}

// The access token for an API call, refreshing when within 60s of
// expiry (GoTrue rotates refresh tokens; a reused/rotated refresh
// token is rejected, which bounds the damage of a stolen one).
// Returns the token string, or null when there is no usable session.
async function getAccessToken() {
  const session = getSession();
  if (!session) return null;
  if (session.expires_at - Date.now() > 60000) return session.access_token;
  const res = await supabaseAuthFetch("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: { refresh_token: session.refresh_token }
  });
  if (!res.ok || !res.data || !res.data.access_token) {
    clearSession();
    return null;
  }
  const next = {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token || session.refresh_token,
    expires_at: Date.now() + (res.data.expires_in || 3600) * 1000,
    user: res.data.user || session.user || null
  };
  saveSession(next);
  return next.access_token;
}

// Display name for the header greeting, from the session's user.
// Never parses the JWT — the user object comes from GoTrue.
function sessionDisplayName(session) {
  if (!session || !session.user) return "Reader";
  const meta = session.user.user_metadata || {};
  return (meta.name || session.user.email || "Reader");
}

// Whether the session's email is confirmed (GoTrue sets
// email_confirmed_at). Unverified email = visitor treatment (§0):
// the site only reflects it, it never invents a "verified" flag.
function sessionEmailVerified(session) {
  return !!(session && session.user && session.user.email_confirmed_at);
}

// Hygiene for returning visitors: the demo keys were never real
// accounts. The new code ignores them (a visitor is signed out)
// and deletes them. No migration of demo accounts is possible or
// needed (design §8).
function clearLegacyDemoKeys() {
  try {
    localStorage.removeItem("ydb-auth");
    localStorage.removeItem("ydb-profile");
  } catch (e) { /* ignore */ }
}

/* ---------- GoTrue operations (design §1 table, §4) ---------- */

// Sign up (§4.1). DOB + name go in user_metadata so the server-side
// trigger can copy them into profiles (dob is NOT NULL there — a
// missing DOB cannot create an account). Plan choice and weekly-book
// details are NOT sent to GoTrue; they are staged in
// SIGNUP_PREFS_KEY and applied to profiles via the API after
// verification. parentEmail is passed in metadata only for an
// under-13 account, so the API's consent flow can pick it up (§5).
async function signUpWithSupabase(input) {
  const data = { name: input.name, dob: input.dob };
  if (input.parentEmail) data.parent_email = input.parentEmail;
  return supabaseAuthFetch("/auth/v1/signup", {
    method: "POST",
    body: { email: input.email, password: input.password, data: data }
  });
}

// Log in (§4.2). On success the session is stored and the password
// is discarded. Wrong password → 400 invalid_grant; the UI shows a
// generic message (no "this email exists" oracle).
async function logInWithSupabase(email, password) {
  const res = await supabaseAuthFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email: email, password: password }
  });
  if (!res.ok || !res.data || !res.data.access_token) return res;
  saveSession({
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
    expires_at: Date.now() + (res.data.expires_in || 3600) * 1000,
    user: res.data.user || null
  });
  return res;
}

// Log out on this device (§4.4): POST /logout + clear ydb-session.
// Best effort on the network call — the local session is cleared
// regardless, so the browser never stays signed in on a failure.
async function logOut() {
  const session = getSession();
  if (session && isSupabaseConfigured()) {
    await supabaseAuthFetch("/auth/v1/logout", { method: "POST", token: session.access_token });
  }
  clearSession();
}

// Current user from GoTrue (§1 table). The site asks the API for
// the session's user; it does not parse the JWT.
async function getCurrentUser() {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "no_session" };
  return supabaseAuthFetch("/auth/v1/user", { method: "GET", token: token });
}

// Password reset, request (§4.3). The UI always shows the same
// message whether or not the account exists (no enumeration).
async function requestPasswordReset(email) {
  return supabaseAuthFetch("/auth/v1/recover", {
    method: "POST",
    body: { email: email }
  });
}

// Resend the confirmation email (§4.1 step 7).
async function resendConfirmation(email) {
  return supabaseAuthFetch("/auth/v1/resend", {
    method: "POST",
    body: { type: "signup", email: email }
  });
}

// Complete an emailed code (recovery / signup / email_change) —
// exchanges token_hash for a session (§1 table).
async function verifyEmailCode(type, tokenHash, email) {
  return supabaseAuthFetch("/auth/v1/verify", {
    method: "POST",
    body: { type: type, token_hash: tokenHash, email: email }
  });
}

// Change password while signed in (§4.3): PUT /auth/v1/user.
// The old password stops working immediately.
async function changePassword(newPassword) {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "no_session" };
  return supabaseAuthFetch("/auth/v1/user", {
    method: "PUT",
    token: token,
    body: { password: newPassword }
  });
}

// Change the account name (GoTrue user_metadata) while signed in.
async function changeAccountName(name) {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "no_session" };
  return supabaseAuthFetch("/auth/v1/user", {
    method: "PUT",
    token: token,
    body: { data: { name: name } }
  });
}

// Change the account email — GoTrue sends a confirmation to the new
// address; the new email is not live until confirmed (§8).
async function changeAccountEmail(email) {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "no_session" };
  return supabaseAuthFetch("/auth/v1/user", {
    method: "PUT",
    token: token,
    body: { email: email }
  });
}

/* ---------- Waitlist (frozen state, design §6) ---------- */

// Pre-launch sign-ups write ONLY to the waitlist table, via the
// Supabase REST API (public INSERT policy, §3). No auth.users row,
// no plan granted, no password collected, no confirmation email.
// Duplicate email → the unique constraint rejects the insert; the
// caller shows the SAME success screen (no "already on the list"
// oracle — same anti-enumeration rule as password reset).
// While no project is configured this fails closed with
// "not_configured" and the UI says so honestly — it never fakes a
// successful join.
async function joinWaitlist(input) {
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  let res;
  try {
    res = await fetch(SUPABASE_URL + "/rest/v1/waitlist", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        email: input.email,
        name: input.name || null,
        plan_interest: input.planInterest || null,
        source: input.source || "signup"
      })
    });
  } catch (e) {
    return { ok: false, error: "network" };
  }
  if (res.status === 409) return { ok: true, duplicate: true };
  if (!res.ok) return { ok: false, error: "request_failed", status: res.status };
  return { ok: true, duplicate: false };
}

/* ---------- Profile + account API (via the API server) ---------- */

// All of these need the API host (Render). They fail closed with
// "not_configured" until API_BASE_URL is set — the site never talks
// to Supabase Postgres directly for profile writes; RLS + the
// column guard (§3) are the backstops, the API is the path.
async function apiFetch(path, options) {
  if (!isApiConfigured()) return { ok: false, error: "not_configured" };
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "no_session" };
  const opts = options || {};
  let res;
  try {
    res = await fetch(API_BASE_URL + path, {
      method: opts.method || "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
  } catch (e) {
    return { ok: false, error: "network" };
  }
  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) return { ok: false, error: "http_" + res.status, status: res.status, data: data };
  return { ok: true, status: res.status, data: data };
}

// Load the signed-in user's profile row (about/genres/ratings/
// voice/plan/paid/dob/age tier). RLS admits only the owning user.
function fetchProfile() {
  return apiFetch("/api/profile", { method: "GET" });
}

// Save weekly-book prefs + plan choice to profiles. dob/plan/paid
// are never sent here — they are server-managed (§3 guard).
function saveProfilePrefs(prefs) {
  return apiFetch("/api/profile", {
    method: "PUT",
    body: {
      about: prefs.about,
      genres: prefs.genres,
      ratings: prefs.ratings,
      voice: prefs.voice,
      plan: prefs.plan
    }
  });
}

// Clear the preference columns on profiles (delete-my-details).
function clearProfilePrefs() {
  return apiFetch("/api/profile/preferences", { method: "DELETE" });
}

// Delete the whole account (§4.5): one server-side transaction
// (auth + profiles + Stripe + deletion_requests audit row).
function deleteAccount() {
  return apiFetch("/api/account", { method: "DELETE" });
}

// Sign out everywhere (§4.4): revokes all refresh tokens without
// deleting the account. Until the API worker exposes this endpoint
// the route is the Supabase dashboard (operator action) or support.
function signOutEverywhere() {
  return apiFetch("/api/auth/signout-everywhere", { method: "POST" });
}

// Push prefs staged at sign-up (SIGNUP_PREFS_KEY) to profiles after
// verification / first log-in. Best effort; the key is cleared only
// on success so a failed push is retried at the next sign-in.
async function pushPendingSignupPrefs() {
  let staged = null;
  try { staged = JSON.parse(sessionStorage.getItem(SIGNUP_PREFS_KEY) || "null"); } catch (e) { staged = null; }
  if (!staged) return { ok: true, nothing: true };
  const res = await saveProfilePrefs(staged);
  if (res.ok) {
    try { sessionStorage.removeItem(SIGNUP_PREFS_KEY); } catch (e) { /* ignore */ }
  }
  return res;
}

function stageSignupPrefs(prefs) {
  try { sessionStorage.setItem(SIGNUP_PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
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

  const session = getSession();
  const signedIn = sessionIsValid(session);
  const greet = $("authGreeting");
  const signoutBtn = $("signoutBtn");
  const loginBtn = $("loginBtn");
  const settingsLink = $("settingsLink");
  if (greet) {
    greet.classList.toggle("hidden", !signedIn);
    if (signedIn) greet.textContent = "Hi, " + sessionDisplayName(session);
  }
  if (signoutBtn) {
    signoutBtn.classList.toggle("hidden", !signedIn);
    signoutBtn.addEventListener("click", async () => {
      await logOut();
      window.location.reload();
    });
  }
  if (loginBtn) {
    loginBtn.classList.toggle("hidden", signedIn);
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
    settingsLink.classList.toggle("hidden", !signedIn || onAccount);
  }
}

/* ============================================================
   SIGN-UP PAGE (signup.html)
   Two states, one file (design §6/§8):
   - LAUNCH === false (frozen): waitlist form only — name
     (optional), email, plan interest. Password, DOB, plan
     selector details, weekly-book sections, and terms are hidden.
   - LAUNCH === true (live): the full form + the COPPA parent
     section, shown when DOB < 13 (§5).
   ============================================================ */

// The sign-up state — the one-page form reads from and writes
// to this object.
const signupState = {
  name: "", email: "", password: "", dob: "", plan: "listener", terms: false,
  about: "", genres: [], ratings: null, // null = defaults not yet chosen
  ratingsTouched: false,
  voice: "Warm",
  parentEmail: "", consent: false
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

function onSignupGenreToggle() {
  return function (value) {
    signupState.genres = toggleGenreValue(signupState.genres, value);
    syncGenreChips($("opGenres"), signupState.genres);
  };
}

// Pull the form's values into the shared state.
function collectSignupState() {
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
  const parentEmailEl = $("opParentEmail");
  const consentEl = $("opConsent");
  signupState.parentEmail = parentEmailEl ? parentEmailEl.value : "";
  signupState.consent = consentEl ? consentEl.checked : false;
}

// Push the shared state into the form.
function populateSignupForm() {
  const s = signupState;
  $("opName").value = s.name;
  $("opEmail").value = s.email;
  $("opPass").value = s.password;
  $("opDob").value = s.dob;
  $("opPlan").value = s.plan;
  $("opTerms").checked = s.terms;
  $("opAbout").value = s.about;
  $("opVoice").value = s.voice;
  buildGenreChips($("opGenres"), s.genres, onSignupGenreToggle());
  wireSignupRatings("opRatings", "opRatingsHint");
}

// Show/hide the live-only blocks for the LAUNCH flag, and the
// COPPA parent section for an under-13 DOB (live mode only).
// The static markup ships in the frozen state (live blocks hidden),
// so a no-JS load still shows the honest waitlist form.
function applyLaunchState() {
  const live = LAUNCH === true;
  ["fldPass", "fldDob", "weeklySection", "termsField"].forEach(id => {
    const el = $(id);
    if (el) el.classList.toggle("hidden", !live);
  });
  const intro = $("waitlistIntro");
  if (intro) intro.classList.toggle("hidden", live);
  const submit = $("signupSubmitBtn");
  if (submit) submit.textContent = live ? "Create Account" : "Join the Waitlist";
  const title = $("authTitle");
  if (title && $("onePageForm") && !$("onePageForm").classList.contains("hidden")) {
    title.textContent = live ? "Create your account" : "Join the waitlist";
  }
  updateCoppaSection();
}

// COPPA (§5): under-13 in the live form reveals the parent section
// and the form cannot submit without it. No child self-sign-up path.
function updateCoppaSection() {
  const box = $("coppaBox");
  if (!box) return;
  const age = ageFromDob(signupState.dob);
  const showCoppa = LAUNCH === true && age !== null && age < 13;
  box.classList.toggle("hidden", !showCoppa);
}

function validateAccountStep(errEl) {
  const s = signupState;
  if (LAUNCH !== true) {
    // Frozen: waitlist only — name optional, email required.
    if (!validEmail(s.email)) { showError(errEl, "Please enter a valid email address."); return false; }
    clearError(errEl);
    return true;
  }
  if (!s.name.trim()) { showError(errEl, "Please enter your name."); return false; }
  if (!validEmail(s.email)) { showError(errEl, "Please enter a valid email address."); return false; }
  if (!s.password || s.password.length < 8) { showError(errEl, "Your password needs at least 8 characters."); return false; }
  if (ageFromDob(s.dob) === null) { showError(errEl, "Please enter your date of birth."); return false; }
  const age = ageFromDob(s.dob);
  if (age !== null && age < 13) {
    if (!validEmail(s.parentEmail)) { showError(errEl, "Please enter a parent or guardian's email address."); return false; }
    if (s.parentEmail.trim().toLowerCase() === s.email.trim().toLowerCase()) { showError(errEl, "The parent or guardian's email must be different from the account email."); return false; }
    if (!s.consent) { showError(errEl, "A parent or guardian must agree to the consent statement before we can create an account for a child under 13."); return false; }
  }
  clearError(errEl);
  return true;
}

function showSignupSuccess(variant, name, email) {
  hide($("authMain"));
  if (variant === "waitlist") {
    $("authSuccessTitle").textContent = "You're on the waitlist!";
    $("authSuccessText").textContent = "Accounts open at launch — you're on the waitlist. We'll email you when accounts open. No account has been created and no payment has been taken.";
  } else {
    $("authSuccessTitle").textContent = "Check your email" + (name ? ", " + name : "") + "!";
    $("authSuccessText").textContent = "Click the confirmation link we sent to " + email + " to finish creating your account. Until then, you can browse as a visitor — PG books and previews only.";
  }
  show($("authSuccess"));
  window.scrollTo(0, 0);
}

// Finish sign-up: frozen → waitlist insert; live → GoTrue signup
// (§4.1) + COPPA parent section when DOB < 13 (§5). The weekly-book
// details are staged for profiles after verification, not stored
// in this browser as an account record. The password is validated
// and then discarded — never stored.
async function completeSignup() {
  const s = signupState;
  const ratings = (s.ratings === null ? signupDefaultRatings() : s.ratings);

  if (LAUNCH !== true) {
    const res = await joinWaitlist({
      name: s.name.trim(),
      email: s.email.trim(),
      planInterest: s.plan,
      source: "signup"
    });
    if (!res.ok && res.error === "not_configured") {
      showError($("opError"), "The waitlist isn't connected yet — accounts open at launch. Please check back soon, or email support@yourdailybook.com.");
      return;
    }
    if (!res.ok) {
      showError($("opError"), "Something went wrong — please try again in a moment.");
      return;
    }
    // Duplicate email shows the SAME success screen (§6).
    signupState.password = "";
    showSignupSuccess("waitlist");
    return;
  }

  const res = await signUpWithSupabase({
    email: s.email.trim(),
    password: s.password,
    name: s.name.trim(),
    dob: s.dob,
    parentEmail: (ageFromDob(s.dob) !== null && ageFromDob(s.dob) < 13) ? s.parentEmail.trim() : ""
  });
  if (!res.ok) {
    if (res.error === "not_configured") {
      showError($("opError"), "Real accounts aren't connected yet — accounts open at launch. Join the waitlist and we'll email you when they do.");
      return;
    }
    // No "this email exists" oracle: the same message covers a
    // duplicate registration and other signup failures.
    showError($("opError"), "We couldn't create that account. If an account already exists for this email, try logging in — or resetting your password.");
    return;
  }
  // Stage the weekly-book details + plan choice for profiles; the
  // API applies them after email verification (§4.1).
  stageSignupPrefs({
    about: s.about.trim(),
    genres: s.genres.slice(),
    ratings: ratings.slice(),
    voice: s.voice,
    plan: s.plan
  });
  signupState.password = "";
  showSignupSuccess("confirm", s.name.trim(), s.email.trim());
}

// Create account / Log in toggle on the sign-up page.
function showAuthMode(mode) {
  const isSignup = mode === "signup";
  $("modeSignupBtn").classList.toggle("active", isSignup);
  $("modeLoginBtn").classList.toggle("active", !isSignup);
  $("authTitle").textContent = isSignup
    ? (LAUNCH === true ? "Create your account" : "Join the waitlist")
    : "Welcome back";
  $("onePageForm").classList.toggle("hidden", !isSignup);
  $("loginFormPage").classList.toggle("hidden", isSignup);
}

function initSignupPage() {
  const params = new URLSearchParams(window.location.search || "");
  clearLegacyDemoKeys();
  wireHeader();
  const existing = getSession();
  const signedIn = sessionIsValid(existing);

  // Already signed in? Say so — don't make them sign up twice.
  if (signedIn) {
    hide($("authMain"));
    $("authAlreadyTitle").textContent = "You're already signed in, " + sessionDisplayName(existing) + ".";
    $("authAlreadyText").textContent = "Pick up where you left off — your books, your weekly story, and your settings are waiting.";
    show($("authAlready"));
    $("authAlreadySignout").addEventListener("click", async () => {
      await logOut();
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
  // Frozen: it is the plan interest on the waitlist — it grants nothing.
  const planParam = params.get("plan");
  if (planParam === "author" || planParam === "listener") signupState.plan = planParam;

  // Fill the voice select.
  $("opVoice").innerHTML = voiceOptionsHTML("Warm");
  populateSignupForm();
  applyLaunchState();

  // Mode toggle.
  $("modeSignupBtn").addEventListener("click", () => showAuthMode("signup"));
  $("modeLoginBtn").addEventListener("click", () => showAuthMode("login"));
  $("switchToSignup").addEventListener("click", () => showAuthMode("signup"));

  // DOB typed on the form re-gates the ratings live, and reveals
  // the COPPA parent section under 13 (live mode only).
  $("opDob").addEventListener("change", () => {
    collectSignupState();
    if (!signupState.ratingsTouched) signupState.ratings = null;
    else signupState.ratings = (signupState.ratings || []).filter(r => signupAllowedRatings().indexOf(r) >= 0);
    wireSignupRatings("opRatings", "opRatingsHint");
    updateCoppaSection();
  });

  // One-page submit: waitlist while frozen, real sign-up at launch.
  $("onePageForm").addEventListener("submit", async e => {
    e.preventDefault();
    collectSignupState();
    if (!validateAccountStep($("opError"))) return;
    if (LAUNCH === true && !signupState.terms) { showError($("opError"), "Please agree to the Terms of Service."); return; }
    clearError($("opError"));
    await completeSignup();
  });

  // Log-in submit — real GoTrue log-in (§4.2). No demo path: any
  // email/password does NOT work, and there is no demo account.
  $("loginFormPage").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("lgEmail").value.trim();
    const password = $("lgPass").value;
    if (!validEmail(email)) { showError($("lgError"), "Please enter a valid email address."); return; }
    if (!password) { showError($("lgError"), "Please enter your password."); return; }
    clearError($("lgError"));
    if (!isSupabaseConfigured()) {
      showError($("lgError"), "Real accounts open at launch — join the waitlist and we'll email you when they do.");
      return;
    }
    const res = await logInWithSupabase(email, password);
    if (!res.ok) {
      // Generic message — no "this email exists" oracle.
      showError($("lgError"), "Email or password is incorrect.");
      return;
    }
    await pushPendingSignupPrefs();
    window.location.href = "index.html";
  });

  // "Forgot password?" (§4.3) — same message whether or not the
  // account exists, so the form cannot enumerate accounts.
  const forgotLink = $("forgotPassLink");
  if (forgotLink) forgotLink.addEventListener("click", () => {
    show($("forgotBox"));
    hide($("resendBox"));
  });
  const forgotBtn = $("forgotBtn");
  if (forgotBtn) forgotBtn.addEventListener("click", async () => {
    const email = $("fpEmail").value.trim();
    if (!validEmail(email)) { showError($("fpError"), "Please enter a valid email address."); return; }
    clearError($("fpError"));
    if (!isSupabaseConfigured()) {
      showError($("fpError"), "Password reset opens at launch, with real accounts.");
      return;
    }
    await requestPasswordReset(email);
    showMsg($("fpMsg"), "If an account exists for that email, a reset link is on its way.");
  });

  // "Resend confirmation email" (§4.1 step 7).
  const resendLink = $("resendLink");
  if (resendLink) resendLink.addEventListener("click", () => {
    show($("resendBox"));
    hide($("forgotBox"));
  });
  const resendBtn = $("resendBtn");
  if (resendBtn) resendBtn.addEventListener("click", async () => {
    const email = $("rsEmail").value.trim();
    if (!validEmail(email)) { showError($("rsError"), "Please enter a valid email address."); return; }
    clearError($("rsError"));
    if (!isSupabaseConfigured()) {
      showError($("rsError"), "Confirmation emails open at launch, with real accounts.");
      return;
    }
    await resendConfirmation(email);
    showMsg($("rsMsg"), "If an account exists for that email, a new confirmation email is on its way.");
  });

  // ?confirmed=1 — the emailed link landed back here.
  if (params.get("confirmed") === "1") {
    showAuthMode("login");
    showMsg($("confirmedNote"), "Your email is confirmed — log in below.");
  }

  // ?mode=reset with a token_hash — complete the password reset
  // (§4.3): verify the code, then set the new password.
  if (params.get("mode") === "reset") {
    showAuthMode("login");
    const tokenHash = params.get("token_hash") || "";
    const resetEmail = params.get("email") || "";
    if (tokenHash && resetEmail) {
      show($("resetBox"));
      $("resetBtn").addEventListener("click", async () => {
        const newPass = $("npPass").value;
        if (!newPass || newPass.length < 8) { showError($("npError"), "Your new password needs at least 8 characters."); return; }
        clearError($("npError"));
        const verified = await verifyEmailCode("recovery", tokenHash, resetEmail);
        if (!verified.ok || !verified.data || !verified.data.access_token) {
          showError($("npError"), "That reset link has expired or was already used. Ask for a new one below.");
          return;
        }
        saveSession({
          access_token: verified.data.access_token,
          refresh_token: verified.data.refresh_token,
          expires_at: Date.now() + (verified.data.expires_in || 3600) * 1000,
          user: verified.data.user || null
        });
        const changed = await changePassword(newPass);
        if (!changed.ok) {
          showError($("npError"), "We couldn't set that password — please try again.");
          return;
        }
        showMsg($("npMsg"), "Password changed. You can log in with it now — and use \"Sign out of all other devices\" on your account page if you want every other device signed out too.");
      });
    } else {
      show($("forgotBox"));
      showMsg($("fpMsg"), "That reset link is incomplete — enter your email below and we'll send a fresh one.");
    }
  }

  // ?mode=login opens the log-in view directly.
  if (params.get("mode") === "login") showAuthMode("login");
  else if (params.get("mode") !== "reset") showAuthMode("signup");
}

/* ============================================================
   ACCOUNT / SETTINGS PAGE (account.html)
   Real profile/plan display (design §8). Weekly-book details and
   the account record come from profiles via the API (RLS admits
   only the owning user) — never from localStorage. Plan is
   display-only (changing plan goes through Stripe at A9, never a
   <select> that writes the DB). DOB is display-only text (§4.6).
   ============================================================ */

const accountState = {
  genres: [],
  ratings: null, // null = defaults not yet chosen
  ratingsTouched: false,
  voice: "Warm",
  profile: null // the profiles row from the API (in-memory only)
};

function accountAllowedRatings(profile) {
  // Display-only gating from the profile's DOB (server-provided).
  // The API re-derives the tier on every request.
  return allowedRatingsForDob(profile && profile.dob ? profile.dob : null);
}

function wireAccountRatings(profile) {
  const container = $("acRatings");
  const hint = $("acRatingsHint");
  if (!container) return;
  const allowed = accountAllowedRatings(profile);
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

function accountAgeTier(profile) {
  if (!profile || !profile.age_tier) {
    const age = ageFromDob(profile && profile.dob ? profile.dob : null);
    if (age === null) return null;
    if (age >= 18) return "adult";
    if (age >= 13) return "teen";
    return "child";
  }
  return profile.age_tier;
}

function initAccountPage() {
  clearLegacyDemoKeys();
  wireHeader();
  const session = getSession();
  const signedIn = sessionIsValid(session);
  const loggedOut = $("acctLoggedOut");
  const main = $("acctMain");

  if (!signedIn) {
    hide(main);
    show(loggedOut);
    return;
  }
  hide(loggedOut);
  show(main);
  $("acctGreeting").textContent = "Hi, " + sessionDisplayName(session);
  $("acctSignoutBtn").addEventListener("click", async () => {
    await logOut();
    window.location.reload();
  });

  // Unverified email → visitor treatment (§0): banner, PG only.
  if (!sessionEmailVerified(session)) {
    showMsg($("acAccountMsg"), "Your email isn't confirmed yet — check your inbox for the confirmation link. Until then, your account gets visitor access (PG books and previews only).");
  }

  // --- Section 1: Your weekly book (from profiles via the API) ---
  // While the API is not configured, the saved details cannot load;
  // the form shows the defaults and saving says so honestly.
  async function loadAccountProfile() {
    const res = await fetchProfile();
    if (!res.ok) {
      accountState.profile = null;
      return;
    }
    accountState.profile = res.data && res.data.profile ? res.data.profile : res.data;
  }

  function renderAccountProfile() {
    const profile = accountState.profile || {};
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
    wireAccountRatings(profile);

    // --- Section 2: Account ---
    $("acName").value = profile.name || sessionDisplayName(session) || "";
    $("acEmail").value = (session.user && session.user.email) || profile.email || "";
    // Plan is DISPLAY-ONLY: current plan + paid status from the API.
    // Changing plan goes through Stripe (A9), never a form control.
    const plan = profile.plan || "listener";
    const paid = profile.paid === true;
    const paidUntil = profile.paid_until ? " (paid until " + String(profile.paid_until).slice(0, 10) + ")" : "";
    $("acPlan").textContent = (plan === "author" ? "Author — $24.99/month" : "Listener — $9.99/month") +
      (paid ? " · Paid" + paidUntil : " · Not paid — upgrade at launch through Stripe");
    $("acDobNote").textContent = profile.dob
      ? "Date of birth on file: " + profile.dob + " — this sets your content ratings and can't be changed here. To correct it, email support@yourdailybook.com."
      : "No date of birth on file — email support@yourdailybook.com and we'll correct it.";
    // Child accounts: parent-managed (§5).
    const parentNote = $("acParentNote");
    if (parentNote) {
      const tier = accountAgeTier(profile);
      parentNote.classList.toggle("hidden", tier !== "child");
      if (tier === "child") {
        parentNote.textContent = "This account is managed by a parent or guardian. To correct the date of birth or content mode, email support@yourdailybook.com.";
      }
    }
  }

  loadAccountProfile().then(() => {
    renderAccountProfile();
    // Retry any prefs staged at sign-up (post-verification push).
    pushPendingSignupPrefs();
  });
  // Render the defaults immediately so the page is usable while the
  // profile loads; the API result re-renders over them.
  renderAccountProfile();

  $("acSaveBookBtn").addEventListener("click", async () => {
    const prefs = {
      about: $("acAbout").value.trim(),
      genres: readGenreBoxes($("acGenres")),
      ratings: readRatingBoxes($("acRatings")),
      voice: $("acVoice").value
    };
    const res = await saveProfilePrefs(prefs);
    if (!res.ok && res.error === "not_configured") {
      showError($("acBookMsg"), "Your details can't be saved yet — the account service isn't connected. They'll save once real accounts open at launch.");
      return;
    }
    if (!res.ok) {
      showError($("acBookMsg"), "We couldn't save those details — please try again.");
      return;
    }
    accountState.ratings = prefs.ratings.slice();
    accountState.ratingsTouched = true;
    clearError($("acBookMsg"));
    showMsg($("acBookMsg"), "Saved — your next weekly book will use these details.");
  });

  $("acSaveAccountBtn").addEventListener("click", async () => {
    const name = $("acName").value.trim();
    const email = $("acEmail").value.trim();
    if (!name) { showError($("acAccountMsg"), "Please enter your name."); return; }
    if (!validEmail(email)) { showError($("acAccountMsg"), "Please enter a valid email address."); return; }
    const newPass = $("acNewPass").value;
    if (newPass && newPass.length < 8) { showError($("acAccountMsg"), "A new password needs at least 8 characters."); return; }
    if (!isSupabaseConfigured()) {
      showError($("acAccountMsg"), "Account changes open at launch, with real accounts.");
      return;
    }
    const currentEmail = (session.user && session.user.email) || "";
    if (email !== currentEmail) {
      const changed = await changeAccountEmail(email);
      if (!changed.ok) {
        showError($("acAccountMsg"), "We couldn't change that email — please try again.");
        return;
      }
      clearError($("acAccountMsg"));
      showMsg($("acAccountMsg"), "Saved. Check your new email inbox to confirm the change — the new address isn't live until you do.");
      return;
    }
    const renamed = await changeAccountName(name);
    if (!renamed.ok) {
      showError($("acAccountMsg"), "We couldn't save that name — please try again.");
      return;
    }
    if (newPass) {
      const changed = await changePassword(newPass);
      if (!changed.ok) {
        showError($("acAccountMsg"), "Your name was saved, but the password change failed — please try again.");
        return;
      }
      $("acNewPass").value = "";
      clearError($("acAccountMsg"));
      $("acctGreeting").textContent = "Hi, " + name;
      const greet = $("authGreeting");
      if (greet) greet.textContent = "Hi, " + name;
      showMsg($("acAccountMsg"), "Saved. Your password is changed — your old password stops working immediately.");
      return;
    }
    clearError($("acAccountMsg"));
    $("acNewPass").value = "";
    $("acctGreeting").textContent = "Hi, " + name;
    const greet = $("authGreeting");
    if (greet) greet.textContent = "Hi, " + name;
    showMsg($("acAccountMsg"), "Saved.");
  });

  // Sign out of all other devices (§4.4). Until the API endpoint
  // exists, the route is support (dashboard revocation).
  const signoutEverywhereBtn = $("acSignoutEverywhereBtn");
  if (signoutEverywhereBtn) signoutEverywhereBtn.addEventListener("click", async () => {
    if (!window.confirm("Sign out of all other devices? This device stays signed in.")) return;
    const res = await signOutEverywhere();
    if (!res.ok && res.error === "not_configured") {
      showMsg($("acAccountMsg"), "That isn't connected yet — email support@yourdailybook.com and we'll sign out all your other devices.");
      return;
    }
    if (!res.ok) {
      showError($("acAccountMsg"), "We couldn't sign out your other devices — please try again.");
      return;
    }
    showMsg($("acAccountMsg"), "Signed out everywhere else. This device stays signed in.");
  });

  // --- Section 3: Privacy & data ---
  $("acDelDetailsBtn").addEventListener("click", async () => {
    if (!window.confirm("Delete your personal details? This clears the about-you text, genres, ratings, and voice saved for your weekly book. Your account stays signed in.")) return;
    const res = await clearProfilePrefs();
    if (!res.ok && res.error === "not_configured") {
      showError($("acDeleteMsg"), "That isn't connected yet — your details live in this browser only until real accounts open, so clearing them here is all there is to clear for now. Email support@yourdailybook.com if you need more.");
      return;
    }
    if (!res.ok) {
      showError($("acDeleteMsg"), "We couldn't delete those details — please try again.");
      return;
    }
    accountState.genres = [];
    accountState.ratings = null;
    accountState.ratingsTouched = false;
    $("acAbout").value = "";
    $("acVoice").value = "Warm";
    buildGenreChips($("acGenres"), [], value => {
      accountState.genres = toggleGenreValue(accountState.genres, value);
      syncGenreChips($("acGenres"), accountState.genres);
    });
    wireAccountRatings(accountState.profile);
    showMsg($("acDeleteMsg"), "Your personal details are deleted — your weekly book will use the defaults until you set them again.");
  });

  $("acDelAccountBtn").addEventListener("click", async () => {
    if (!window.confirm("Delete your whole account? This deletes your account and your personal details. It can't be undone — you'd need to sign up again as a new user. Stripe payment records and books you've bought the license to are NOT deleted.")) return;
    const res = await deleteAccount();
    if (!res.ok && res.error === "not_configured") {
      showError($("acDeleteMsg"), "Account deletion isn't connected yet — email support@yourdailybook.com and we'll delete your account and confirm by email.");
      return;
    }
    if (!res.ok) {
      showError($("acDeleteMsg"), "We couldn't delete your account — please try again, or email support@yourdailybook.com.");
      return;
    }
    clearSession();
    window.location.href = "index.html";
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
