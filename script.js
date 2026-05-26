(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  var heroBg = document.querySelector(".hero-parallax__bg");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getHeaderOffset() {
    if (!header) return 72;
    var h = header.offsetHeight;
    document.documentElement.style.setProperty("--header-h", h + "px");
    return h;
  }

  function initAutoLoops() {
    document.querySelectorAll("[data-loop-speed]").forEach(function (track) {
      var inner = track.querySelector(".loop-track__inner");
      if (!inner) return;
      var seconds = parseFloat(track.getAttribute("data-loop-speed")) || 22;
      inner.style.animation = "loop-scroll " + seconds + "s linear infinite";
    });
  }

  function initHorizontalCarousels() {
    document.querySelectorAll(".horizontal-carousel").forEach(function (viewport) {
      var maxScroll = function () {
        return viewport.scrollWidth - viewport.clientWidth;
      };

      var drag = { active: false, startX: 0, startScroll: 0 };

      viewport.addEventListener("mousedown", function (e) {
        if (e.button !== 0 || maxScroll() <= 0) return;
        drag.active = true;
        drag.startX = e.pageX;
        drag.startScroll = viewport.scrollLeft;
        viewport.classList.add("is-dragging");
      });

      window.addEventListener("mousemove", function (e) {
        if (!drag.active) return;
        e.preventDefault();
        viewport.scrollLeft = drag.startScroll - (e.pageX - drag.startX);
      });

      window.addEventListener("mouseup", function () {
        if (!drag.active) return;
        drag.active = false;
        viewport.classList.remove("is-dragging");
      });
    });
  }

  function closeMobileMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  }

  function openMobileMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.classList.add("is-menu-open");
  }

  /** Smooth scroll to a section (navbar, logo, hero CTA). */
  function scrollToSection(target) {
    if (!target) return;

    var behavior = prefersReduced ? "auto" : "smooth";

    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: behavior, block: "start" });
      return;
    }

    var top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      getHeaderOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: behavior });
  }

  function bindNavScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        if (hash === "#top") {
          e.preventDefault();
          closeMobileMenu();
          window.setTimeout(function () {
            scrollToSection(document.getElementById("top") || document.body);
          }, menu && menu.classList.contains("is-open") ? 250 : 0);
          return;
        }

        var target = document.getElementById(hash.slice(1));
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        window.setTimeout(
          function () {
            scrollToSection(target);
          },
          menu && window.innerWidth <= 768 ? 250 : 0
        );
      });
    });
  }

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }
  }

  /** Subtle hero parallax while the page scrolls (including nav jumps). */
  function updateHeroParallax() {
    if (prefersReduced || !heroBg) return;
    var y = window.scrollY;
    var shift = y * 0.28;
    var scale = 1 + Math.min(y / window.innerHeight, 1) * 0.1;
    heroBg.style.transform =
      "translate3d(0, " + shift + "px, 0) scale(" + scale + ")";
  }

  function onScroll() {
    updateHeader();
    updateHeroParallax();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (toggle.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMobileMenu();
    });
  }

  bindNavScroll();
  initAutoLoops();
  initHorizontalCarousels();
  getHeaderOffset();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", getHeaderOffset, { passive: true });
  window.addEventListener("load", onScroll);
  onScroll();
})();
