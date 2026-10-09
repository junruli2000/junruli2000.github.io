(function () {
  "use strict";

  var link = document.querySelector("[data-language-switch]");
  if (!link) return;

  var target = link.getAttribute("href");
  var section = window.location.hash;

  function preserveSection() {
    link.setAttribute("href", target + section);
  }

  preserveSection();
  window.addEventListener("hashchange", function () {
    section = window.location.hash;
    preserveSection();
  });

  // The theme's smooth scrolling does not update the URL fragment.
  var nav = document.getElementById("site-nav");
  if (!nav) return;

  nav.addEventListener("click", function (event) {
    var anchor = event.target;
    while (anchor && anchor.tagName !== "A") {
      anchor = anchor.parentElement;
    }

    if (anchor && anchor.hash && anchor.pathname === window.location.pathname) {
      section = anchor.hash;
      preserveSection();
    }
  });
}());
