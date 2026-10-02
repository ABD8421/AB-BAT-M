/* Applies the saved theme before first paint so there is no flash.
   Kept as a static file (not an inline script) so the CSP needs no
   'unsafe-inline' for scripts. */
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var theme = saved === "light" || saved === "dark"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
