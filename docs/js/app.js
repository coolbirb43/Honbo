(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  var heroBg = document.querySelector(".hero-parallax__bg");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scrollAnimId = null;
  var isScrollAnimating = false;

  function getHeaderOffset() {
    if (!header) return 72;
    var h = header.offsetHeight;
    document.documentElement.style.setProperty("--header-h", h + "px");
    return h;
  }

  function getTargetTop(target) {
    return Math.max(
      0,
      target.getBoundingClientRect().top +
        window.pageYOffset -
        getHeaderOffset()
    );
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }
  }

  function updateHeroParallax() {
    if (prefersReduced || !heroBg) return;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var shift = y * 0.32;
    var scale = 1 + Math.min(y / vh, 1) * 0.12;
    heroBg.style.transform =
      "translate3d(0, " + shift + "px, 0) scale(" + scale + ")";
  }

  function runScrollEffects() {
    updateHeader();
    updateHeroParallax();
  }

  function cancelScrollAnimation() {
    if (scrollAnimId !== null) {
      cancelAnimationFrame(scrollAnimId);
      scrollAnimId = null;
    }
    isScrollAnimating = false;
    document.body.classList.remove("is-scroll-animating");
  }

  /**
   * Animated scroll through the page — you see content pass by with parallax
   * updating until you land on the target section.
   */
  function animatedScrollTo(target) {
    if (!target) return;

    var targetY = getTargetTop(target);
    var startY = window.pageYOffset;
    var distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      runScrollEffects();
      return;
    }

    if (prefersReduced) {
      window.scrollTo(0, targetY);
      runScrollEffects();
      return;
    }

    cancelScrollAnimation();
    isScrollAnimating = true;
    document.body.classList.add("is-scroll-animating");

    var duration = Math.min(3200, Math.max(1000, Math.abs(distance) * 1.15));
    var startTime = null;

    function step(time) {
      if (!startTime) startTime = time;
      var elapsed = time - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);
      runScrollEffects();

      if (progress < 1) {
        scrollAnimId = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        runScrollEffects();
        cancelScrollAnimation();
      }
    }

    scrollAnimId = requestAnimationFrame(step);
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

    document
      .querySelectorAll(".horizontal-carousel--infinite")
      .forEach(function (viewport) {
        var track = viewport.querySelector(".horizontal-carousel__track");
        var firstSet = track && track.querySelector(".loop-track__set");
        if (!track || !firstSet) return;

        track.querySelectorAll(".loop-track__set").forEach(function (set, index) {
          if (index > 0) set.remove();
        });

        var clone = firstSet.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img[alt]").forEach(function (img) {
          img.setAttribute("alt", "");
        });
        track.appendChild(clone);

        var setWidth = 0;
        var looping = false;
        var wrapTimer = null;
        var WRAP_DELAY_MS = 220;

        function measure() {
          var sets = track.querySelectorAll(".loop-track__set");
          if (sets.length >= 2) {
            setWidth = sets[1].offsetLeft;
          } else {
            setWidth = firstSet.offsetWidth;
          }
        }

        function performWrap() {
          if (looping || setWidth < 1) return;

          var left = viewport.scrollLeft;
          if (left < setWidth - 8) return;

          looping = true;
          viewport.classList.add("is-looping");

          var next = left;
          while (next >= setWidth) {
            next -= setWidth;
          }

          viewport.scrollLeft = next;

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              viewport.classList.remove("is-looping");
              looping = false;
            });
          });
        }

        function scheduleWrap() {
          clearTimeout(wrapTimer);
          wrapTimer = window.setTimeout(performWrap, WRAP_DELAY_MS);
        }

        function cancelWrap() {
          clearTimeout(wrapTimer);
        }

        measure();

        viewport.addEventListener("scroll", scheduleWrap, { passive: true });

        if ("onscrollend" in window) {
          viewport.addEventListener("scrollend", performWrap, { passive: true });
        }

        viewport.addEventListener("pointerdown", cancelWrap, { passive: true });
        viewport.addEventListener("pointerup", scheduleWrap, { passive: true });
        viewport.addEventListener("pointercancel", scheduleWrap, { passive: true });

        window.addEventListener(
          "resize",
          function () {
            measure();
          },
          { passive: true }
        );
        window.addEventListener("load", measure);
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

  function bindNavScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        var delay =
          menu && menu.classList.contains("is-open") && window.innerWidth <= 768
            ? 260
            : 0;

        if (hash === "#top") {
          e.preventDefault();
          closeMobileMenu();
          window.setTimeout(function () {
            animatedScrollTo(document.getElementById("top") || document.body);
          }, delay);
          return;
        }

        var target = document.getElementById(hash.slice(1));
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        window.setTimeout(function () {
          animatedScrollTo(target);
        }, delay);
      });
    });
  }

  function onScroll() {
    if (isScrollAnimating) return;
    runScrollEffects();
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
  window.addEventListener("load", runScrollEffects);
  runScrollEffects();
})();
