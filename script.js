(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = document.querySelectorAll("[data-parallax-speed]");
  var ticking = false;

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }

    if (!prefersReduced && parallaxEls.length) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
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

    ticking = false;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.style.overflow = "";
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
        { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    }
  }
})();
