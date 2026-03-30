/* ============================================================
   HOLIDAY HOME HOST — script.js
   Handles: Nav, Scroll Reveal, Counters, Testimonial Slider,
            Gallery Lightbox, Parallax, FAQ, ROI Calculator
   ============================================================ */

"use strict";

/* ── Utility ── */
const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ────────────────────────────────────────
   1. NAVIGATION SCROLL BEHAVIOUR
──────────────────────────────────────── */
(function initNav() {
  const nav = $("mainNav");
  const hamburger = $("navHamburger");
  const navLinks = $("navLinks");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  hamburger?.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    hamburger.setAttribute("aria-expanded", open);
  });

  // Close menu on link click (mobile)
  navLinks?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("menu-open");
      hamburger?.setAttribute("aria-expanded", false);
    });
  });
})();

/* ────────────────────────────────────────
   2. SMOOTH SCROLL TO SECTIONS
──────────────────────────────────────── */
window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Intercept anchor links that start with #
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href").slice(1);
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

/* ────────────────────────────────────────
   3. INTERSECTION OBSERVER — SCROLL REVEAL
──────────────────────────────────────── */
(function initScrollReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el) => observer.observe(el));
})();

/* ────────────────────────────────────────
   4. ANIMATED COUNTERS
──────────────────────────────────────── */
(function initCounters() {
  const counters = $$(".counter");
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ────────────────────────────────────────
   5. ANIMATED UNDERLINE (EXPERIENCE SECTION)
──────────────────────────────────────── */
(function initUnderline() {
  const el = $("expUnderline");
  if (!el) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  obs.observe(el);
})();

/* ────────────────────────────────────────
   6. HERO PARALLAX
──────────────────────────────────────── */
(function initParallax() {
  const bg = $("heroBg");
  if (!bg) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const factor = scrollY * 0.3;
          bg.style.transform = `scale(1) translateY(${factor}px)`;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
})();

/* ────────────────────────────────────────
   7. GALLERY LIGHTBOX
──────────────────────────────────────── */
(function initLightbox() {
  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const closeBtn = $("lightboxClose");
  const prevBtn = $("lightboxPrev");
  const nextBtn = $("lightboxNext");
  if (!lightbox) return;

  const galleryItems = $$(".gallery-item[data-index]");
  let currentIdx = 0;

  const images = galleryItems.map((item) => {
    const img = item.querySelector("img");
    return { src: img?.src || "", alt: img?.alt || "" };
  });

  function openLightbox(idx) {
    currentIdx = idx;
    showImage(currentIdx);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showImage(idx) {
    if (!images[idx]) return;
    lightboxImg.style.opacity = "0";
    lightboxImg.style.transform = "scale(.96)";
    setTimeout(() => {
      lightboxImg.src = images[idx].src;
      lightboxImg.alt = images[idx].alt;
      lightboxImg.style.opacity = "1";
      lightboxImg.style.transform = "scale(1)";
      lightboxImg.style.transition = "opacity .35s ease, transform .35s ease";
    }, 150);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener("click", () => openLightbox(idx));
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.addEventListener("click", () => {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    showImage(currentIdx);
  });
  nextBtn.addEventListener("click", () => {
    currentIdx = (currentIdx + 1) % images.length;
    showImage(currentIdx);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      currentIdx = (currentIdx - 1 + images.length) % images.length;
      showImage(currentIdx);
    }
    if (e.key === "ArrowRight") {
      currentIdx = (currentIdx + 1) % images.length;
      showImage(currentIdx);
    }
  });
})();

/* ────────────────────────────────────────
   8. TESTIMONIAL SLIDER (REMOVED - NOW CSS MARQUEE)
──────────────────────────────────────── */
// The testimonial auto-slider was replaced with a seamless CSS marquee.

/* ────────────────────────────────────────
   9. EXPLORE CARDS SCROLL BUTTONS
──────────────────────────────────────── */
(function initExploreScroll() {
  const cards = $("exploreCards");
  const prevBtn = $("explorePrev");
  const nextBtn = $("exploreNext");
  if (!cards) return;

  prevBtn?.addEventListener("click", () => {
    cards.scrollBy({ left: -380, behavior: "smooth" });
  });
  nextBtn?.addEventListener("click", () => {
    cards.scrollBy({ left: 380, behavior: "smooth" });
  });
})();

/* ────────────────────────────────────────
  10. CONTACT FORM SUBMIT
──────────────────────────────────────── */
(function initContactForm() {
  const form = $("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = $("contactSubmitBtn");
    if (btn) {
      btn.textContent = "Sending…";
      btn.disabled = true;
    }
    setTimeout(() => {
      showToast("✅ Enquiry sent! We'll get back to you within 2 hours.");
      form.reset();
      if (btn) {
        btn.innerHTML =
          'Send Enquiry <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.disabled = false;
      }
    }, 1400);
  });
})();

/* ────────────────────────────────────────
  11. TOAST NOTIFICATION
──────────────────────────────────────── */
function showToast(message, duration = 4000) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.transform = "translateY(0)";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.transform = "translateY(80px)";
    toast.style.opacity = "0";
  }, duration);
}

/* ────────────────────────────────────────
  12. FAQ ACCORDION
──────────────────────────────────────── */
(function initFAQ() {
  $$(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    question?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
})();

/* ────────────────────────────────────────
  13. ROI CALCULATOR
──────────────────────────────────────── */
(function initROICalculator() {
  const nightlyRange = $("nightlyRange");
  const occupancyRange = $("occupancyRange");
  const expensesRange = $("expensesRange");
  const nightlyVal = $("nightlyVal");
  const occupancyVal = $("occupancyVal");
  const expensesVal = $("expensesVal");
  const monthlyResult = $("monthlyResult");
  const yearlyResult = $("yearlyResult");
  const netResult = $("netResult");

  if (!nightlyRange) return;

  function calcROI() {
    const nightly = parseFloat(nightlyRange.value) || 0;
    const occupancy = parseFloat(occupancyRange.value) / 100 || 0;
    const expenses = parseFloat(expensesRange.value) || 0;

    const daysPerMonth = 30.4;
    const grossMonthly = nightly * daysPerMonth * occupancy;
    const netMonthly = grossMonthly - expenses;
    const yearlyGross = grossMonthly * 12;

    if (nightlyVal) nightlyVal.textContent = `AED ${nightly.toLocaleString()}`;
    if (occupancyVal) occupancyVal.textContent = `${occupancyRange.value}%`;
    if (expensesVal)
      expensesVal.textContent = `AED ${expenses.toLocaleString()}`;
    if (monthlyResult)
      monthlyResult.textContent = `AED ${Math.round(grossMonthly).toLocaleString()}`;
    if (yearlyResult)
      yearlyResult.textContent = `AED ${Math.round(yearlyGross).toLocaleString()}`;
    if (netResult)
      netResult.textContent = `AED ${Math.round(netMonthly).toLocaleString()}`;
  }

  [nightlyRange, occupancyRange, expensesRange].forEach((el) => {
    el?.addEventListener("input", calcROI);
  });

  calcROI(); // initial render
})();

/* ────────────────────────────────────────
  14. SET ASSETS (relative path helper)
      Removed for light coastal hero
──────────────────────────────────────── */

/* ────────────────────────────────────────
  15. PAGE HERO BACKGROUND (inner pages)
──────────────────────────────────────── */
(function initPageHero() {
  const pageHeroBg = document.querySelector(".page-hero-bg");
  if (!pageHeroBg) return;
  const src = pageHeroBg.dataset.bg;
  if (src) pageHeroBg.style.backgroundImage = `url('${src}')`;
})();

/* ────────────────────────────────────────
  16. STRIP HOVER PAUSE
──────────────────────────────────────── */
(function initStripHover() {
  const strip = document.querySelector(".strip-track");
  if (!strip) return;
  strip.addEventListener(
    "mouseenter",
    () => (strip.style.animationPlayState = "paused"),
  );
  strip.addEventListener(
    "mouseleave",
    () => (strip.style.animationPlayState = "running"),
  );
})();

console.log(
  "%cHoliday Home Host 🌊 — Powered by luxury.",
  "color:#8FB3C2; font-size:14px; font-weight:bold;",
);
