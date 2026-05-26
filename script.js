(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = document.querySelectorAll("[data-parallax-speed]");
  var scaleEls = document.querySelectorAll("[data-scroll-scale]");
  var scrubEls = document.querySelectorAll(".scrub[data-scrub]");
  var smoothScrollActive = false;
  var ticking = false;

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function getHeaderOffset() {
    if (!header) return 72;
    var h = header.offsetHeight;
    document.documentElement.style.setProperty("--header-h", h + "px");
    return h;
  }

  function getScrubProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * parseFloat(el.getAttribute("data-scrub-start") || "0.9");
    var end = vh * parseFloat(el.getAttribute("data-scrub-end") || "0.22");
    var range = start - end;
    if (range <= 0) return rect.top < end ? 1 : 0;
    return clamp((start - rect.top) / range, 0, 1);
  }

  function applyScrub(el, progress) {
    var type = el.getAttribute("data-scrub") || "fade-up";
    var t = easeOutQuart(progress);

    if (type === "hero") {
      var heroProgress = clamp(1 - window.scrollY / (window.innerHeight * 0.85), 0, 1);
      t = easeOutQuart(heroProgress);
      el.style.opacity = String(t);
      el.style.transform =
        "translate3d(0, " + 32 * (1 - t) + "px, 0) scale(" + (0.94 + 0.06 * t) + ")";
      return;
    }

    switch (type) {
      case "fade-up":
        el.style.opacity = String(t);
        el.style.transform = "translate3d(0, " + 48 * (1 - t) + "px, 0)";
        break;
      case "slide-right":
        el.style.opacity = String(t);
        el.style.transform = "translate3d(" + -56 * (1 - t) + "px, " + 24 * (1 - t) + "px, 0)";
        break;
      case "slide-left":
        el.style.opacity = String(t);
        el.style.transform = "translate3d(" + 56 * (1 - t) + "px, " + 24 * (1 - t) + "px, 0)";
        break;
      case "scale-in":
        el.style.opacity = String(t);
        el.style.transform = "scale(" + (0.86 + 0.14 * t) + ")";
        break;
      case "clip-up":
        el.style.opacity = String(t);
        el.style.clipPath = "inset(" + (100 - t * 100) + "% 0 0 0)";
        el.style.transform = "translate3d(0, " + 20 * (1 - t) + "px, 0)";
        break;
      default:
        el.style.opacity = String(t);
        el.style.transform = "translate3d(0, " + 40 * (1 - t) + "px, 0)";
    }
  }

  function updateScrollScrub() {
    if (prefersReduced) return;
    scrubEls.forEach(function (el) {
      applyScrub(el, getScrubProgress(el));
    });
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

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function runScrollFrame() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }
    updateParallax();
    updateScrollScale();
    updateScrollScrub();
  }

  function smoothScrollToY(targetY, onStep) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    if (prefersReduced) {
      window.scrollTo(0, targetY);
      runScrollFrame();
      return;
    }

    if (smoothScrollActive) return;
    smoothScrollActive = true;

    var duration = Math.min(2800, Math.max(650, Math.abs(distance) * 0.9));
    var startTime = null;

    function step(time) {
      if (!startTime) startTime = time;
      var elapsed = time - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);
      runScrollFrame();
      if (typeof onStep === "function") onStep();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        smoothScrollActive = false;
        runScrollFrame();
      }
    }

    requestAnimationFrame(step);
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

  function scrollToTarget(target) {
    var offset = getHeaderOffset();
    var top =
      target.getBoundingClientRect().top + window.pageYOffset - offset;
    smoothScrollToY(Math.max(0, top));
  }

  function bindAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        if (hash === "#top") {
          e.preventDefault();
          closeMobileMenu();
          setTimeout(function () {
            smoothScrollToY(0);
          }, window.innerWidth <= 768 ? 280 : 0);
          return;
        }

        var id = hash.slice(1);
        var target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        var delay = window.innerWidth <= 768 ? 280 : 40;
        setTimeout(function () {
          scrollToTarget(target);
        }, delay);
      });
    });
  }

  function onScroll() {
    if (smoothScrollActive) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      runScrollFrame();
      ticking = false;
    });
  }

  function updateParallax() {
    if (prefersReduced) return;
    var viewportCenter = window.innerHeight * 0.5;

    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.15;
      var rect = el.getBoundingClientRect();
      var elCenter = rect.top + rect.height * 0.5;
      var offset = (elCenter - viewportCenter) * speed;
      el.style.transform = "translate3d(0, " + offset + "px, 0)";
    });
  }

  function updateScrollScale() {
    if (prefersReduced) return;
    scaleEls.forEach(function (el) {
      var maxScale = parseFloat(el.getAttribute("data-scroll-scale")) || 1.1;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;

      if (rect.bottom < 0 || rect.top > vh) return;

      var progress = 1 - Math.min(1, Math.max(0, rect.top / vh));
      var scale = 1 + (maxScale - 1) * progress;
      el.style.transform = "scale(" + scale + ")";
    });
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
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

  bindAnchorLinks();
  initAutoLoops();
  initHorizontalCarousels();
  getHeaderOffset();

  if (prefersReduced) {
    scrubEls.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    function () {
      getHeaderOffset();
      runScrollFrame();
    },
    { passive: true }
  );

  window.addEventListener("load", runScrollFrame);
  runScrollFrame();
})();
