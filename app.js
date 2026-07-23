/*
 * FirstLight Federal Credit Union — front-end interactions
 * Vanilla JS, no dependencies. Each initializer is defensive and only
 * runs when the relevant markup is present, so the file is safe to load
 * on every page of the site.
 */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
   * Smooth scrolling for in-page anchor links (e.g. navbar #hero, #news)
   * ----------------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  }

  /* -------------------------------------------------------------------
   * Features / "Stay Informed" carousel
   * Centres the active slide, dims the others and wires the prev/next
   * buttons plus a gentle auto-advance that pauses on hover.
   * ----------------------------------------------------------------- */
  function initFeaturesCarousel() {
    var section = document.querySelector('section[aria-label="Features section"]');
    if (!section) return;

    var track = section.querySelector(".overflow-hidden > .flex");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var prevBtn = section.querySelector('button[aria-label="Previous slide"]');
    var nextBtn = section.querySelector('button[aria-label="Next slide"]');
    var viewport = track.parentElement;
    var index = 0;
    var timer = null;

    function render() {
      var slide = slides[index];
      var offset = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
      offset = Math.max(0, offset);
      track.style.transform = "translate3d(" + -offset + "px, 0px, 0px)";
      slides.forEach(function (s, i) {
        var inner = s.firstElementChild;
        if (!inner) return;
        var active = i === index;
        inner.classList.toggle("opacity-100", active);
        inner.classList.toggle("scale-100", active);
        inner.classList.toggle("opacity-70", !active);
        inner.classList.toggle("scale-90", !active);
      });
    }

    function go(step) {
      index = (index + step + slides.length) % slides.length;
      render();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); restart(); });

    function start() {
      if (slides.length < 2) return;
      timer = window.setInterval(function () { go(1); }, 6000);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", start);
    window.addEventListener("resize", render);

    render();
    start();
  }

  /* -------------------------------------------------------------------
   * FAQ accordion — expand/collapse answers, rotate the +/× icon.
   * ----------------------------------------------------------------- */
  function initFaqAccordion() {
    var section = document.querySelector('section[aria-label="FAQ section"]');
    if (!section) return;

    var items = section.querySelectorAll("[data-faq-item]");
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector("[data-faq-trigger]") || item;
      var answer = item.querySelector("[data-faq-answer]");
      var icon = item.querySelector("svg");

      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-expanded", "false");

      function toggle() {
        var open = item.classList.toggle("faq-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        if (icon) icon.classList.toggle("rotate-45", open);
        if (answer) {
          answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
        }
      }

      trigger.addEventListener("click", toggle);
      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    });
  }

  /* -------------------------------------------------------------------
   * Mobile navigation toggle.
   * ----------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menu.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function init() {
    initSmoothScroll();
    initFeaturesCarousel();
    initFaqAccordion();
    initMobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
