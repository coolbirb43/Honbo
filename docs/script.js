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
  var smoothScrollActive = false;
  var ticking = false;

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

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollToY(targetY) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    if (prefersReduced || smoothScrollActive) {
      window.scrollTo(0, targetY);
      return;
    }

    smoothScrollActive = true;
    var duration = Math.min(1000, Math.max(450, Math.abs(distance) * 0.55));
    var startTime = null;

    function step(time) {
      if (!startTime) startTime = time;
      var elapsed = time - startTime;
      var progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        smoothScrollActive = false;
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

  function scrollToTarget(target) {
    var offset = getHeaderOffset();
    var top =
      target.getBoundingClientRect().top + window.pageYOffset - offset;
    smoothScrollToY(Math.max(0, top));
  }

  function bindAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener(
        "click",
        function (e) {
          var hash = link.getAttribute("href");
          if (!hash || hash === "#") return;

          if (hash === "#top") {
            e.preventDefault();
            closeMobileMenu();
            var topDelay = window.innerWidth <= 768 ? 320 : 0;
            setTimeout(function () {
              smoothScrollToY(0);
            }, topDelay);
            return;
          }

          var id = hash.slice(1);
          var target = document.getElementById(id);
          if (!target) return;

          e.preventDefault();
          closeMobileMenu();

          var delay = window.innerWidth <= 768 ? 320 : 50;
          setTimeout(function () {
            scrollToTarget(target);
          }, delay);
        },
        false
      );
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
    }

    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateParallax();
      updateScrollScale();
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
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.classList.toggle("is-menu-open", !open);
    });
  }

  bindAnchorLinks();
  initAutoLoops();
  initHorizontalCarousels();
  getHeaderOffset();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    function () {
      getHeaderOffset();
      onScroll();
    },
    { passive: true }
  );

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
