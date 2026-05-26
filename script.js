(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = document.querySelectorAll("[data-parallax-speed]");
  var scaleEls = document.querySelectorAll("[data-scroll-scale]");
  var ticking = false;

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }

    if (!prefersReduced) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateMotion);
      }
    }
  }

  function updateParallax() {
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

  function updateMotion() {
    updateParallax();
    updateScrollScale();
    ticking = false;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.classList.toggle("is-menu-open", !open);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.classList.remove("is-menu-open");
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (prefersReduced) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -5% 0px", threshold: 0.08 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    }
  }
})();
