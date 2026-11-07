/* ============================================================
   YourDailyBook — policies.js (v1.0, Nov 7, 2026)
   Mobile nav toggle for the policies page ONLY.

   This code used to live as an inline <script> in policies.html.
   It was moved here so the site has NO inline scripts anywhere —
   that is what makes a strict Content-Security-Policy
   (script-src 'self', no 'unsafe-inline') feasible once the site
   moves to Cloudflare Pages (see _headers + the E2EE plan).
   Loaded by policies.html as <script src="policies.js?v=1.0">.
   ============================================================ */
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }
})();
