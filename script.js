const header = document.querySelector("#siteHeader");
const navToggle = document.querySelector("#navToggle");
const navMenu = document.querySelector("#navMenu");
const revealEls = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const faqItems = document.querySelectorAll(".faq-item");
const testimonials = document.querySelectorAll(".testimonial-card");
const prevReview = document.querySelector("#prevReview");
const nextReview = document.querySelector("#nextReview");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const magneticButtons = document.querySelectorAll(".btn, .mobile-sticky-cta, .whatsapp-float");
const spotlightTargets = document.querySelectorAll(".service-card, .offer-card, .benefit-grid article, .final-cta-box, .contact-details a");

let activeReview = 0;
let countersStarted = false;
let ticking = false;
let reviewTimer;
let scrollProgress;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
  updateScrollProgress();
  ticking = false;
}

function createScrollProgress() {
  scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  document.body.prepend(scrollProgress);
  updateScrollProgress();
}

function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

function closeMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

if (header) {
  createScrollProgress();
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const headerOffset = header?.offsetHeight || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
    history.pushState(null, "", hash);
  });
});

function applyStagger(items, step = 90) {
  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
}

applyStagger(document.querySelectorAll(".service-card"), 75);
applyStagger(document.querySelectorAll(".offer-card"), 95);
applyStagger(document.querySelectorAll(".benefit-grid article"), 55);
applyStagger(document.querySelectorAll(".work-card"), 85);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

if (!prefersReducedMotion && hero && heroVisual) {
  hero.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 981) return;
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    heroVisual.style.setProperty("--parallax-x", `${x}px`);
    heroVisual.style.setProperty("--parallax-y", `${y}px`);
  });

  hero.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--parallax-x", "0px");
    heroVisual.style.setProperty("--parallax-y", "0px");
  });
}

if (!prefersReducedMotion) {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 768) return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
      button.style.setProperty("--magnet-x", `${x}px`);
      button.style.setProperty("--magnet-y", `${y}px`);
    });

    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    });
  });

  spotlightTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty("--spotlight-x", `${x}%`);
      target.style.setProperty("--spotlight-y", `${y}%`);
    });
  });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const decimals = Number(counter.dataset.decimals || 0);
  const prefix = counter.dataset.prefix || "";
  const suffix = counter.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    counter.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    }
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
      counterObserver.disconnect();
    }
  }, { threshold: 0.35 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    const decimals = Number(counter.dataset.decimals || 0);
    const target = Number(counter.dataset.target || 0);
    counter.textContent = `${counter.dataset.prefix || ""}${target.toFixed(decimals)}${counter.dataset.suffix || ""}`;
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  const symbol = item.querySelector("span");

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    symbol.textContent = isOpen ? "-" : "+";
  });
});

function showReview(index) {
  if (!testimonials.length) return;
  testimonials[activeReview].classList.remove("is-active");
  activeReview = (index + testimonials.length) % testimonials.length;
  testimonials[activeReview].classList.add("is-active");
}

prevReview?.addEventListener("click", () => showReview(activeReview - 1));
nextReview?.addEventListener("click", () => showReview(activeReview + 1));

function startReviewTimer() {
  if (prefersReducedMotion || testimonials.length < 2 || reviewTimer) return;
  reviewTimer = window.setInterval(() => {
    showReview(activeReview + 1);
  }, 5500);
}

function stopReviewTimer() {
  window.clearInterval(reviewTimer);
  reviewTimer = undefined;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopReviewTimer();
  } else {
    startReviewTimer();
  }
});

startReviewTimer();

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const message = [
    "Hola Glam Nails Studio, quiero reservar un turno.",
    `Nombre: ${data.get("name") || ""}`,
    `Teléfono: ${data.get("phone") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Servicio: ${data.get("service") || ""}`,
    `Mensaje: ${data.get("message") || ""}`
  ].join("\n");

  const whatsappNumber = "5491100000000";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  if (formStatus) formStatus.textContent = "Mensaje listo. Te abrimos WhatsApp para enviarlo.";
  window.open(whatsappUrl, "_blank", "noopener");
  contactForm.reset();
});
