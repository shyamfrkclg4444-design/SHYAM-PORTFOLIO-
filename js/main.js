/**
 * SHYAM P — LUXURY PORTFOLIO INTERACTION ENGINE
 * Scroll progress, Spotlight cards, 3D Hero tilt, Lightbox carousel,
 * Counter animations, Gallery filtering, and Clipboard feedback.
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initHeader();
  initMobileDrawer();
  initCursorGlow();
  initSpotlightEffect();
  initHeroTilt();
  initScrollReveal();
  initCounters();
  initWorkGallery();
  initLightbox();
  initCopyToClipboard();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  function updateProgress() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal <= 0) {
      progressBar.style.width = "0%";
      return;
    }
    const progress = Math.min(Math.max((window.scrollY / scrollTotal) * 100, 0), 100);
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   2. Sticky Header & Navigation Spy
   ========================================================================== */
function initHeader() {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const sections = document.querySelectorAll("main section[id]");

  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section spy
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${id}`) {
                link.classList.add("is-active");
              } else {
                link.classList.remove("is-active");
              }
            });

            mobileLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${id}`) {
                link.classList.add("is-active");
              } else {
                link.classList.remove("is-active");
              }
            });
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileDrawer() {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const links = document.querySelectorAll(".mobile-link");

  if (!toggle || !drawer) return;

  function toggleDrawer(open) {
    const shouldOpen = open !== undefined ? open : toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(shouldOpen));
    toggle.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
    drawer.classList.toggle("is-open", shouldOpen);
    drawer.setAttribute("aria-hidden", String(!shouldOpen));
    document.body.classList.toggle("nav-open", shouldOpen);
  }

  toggle.addEventListener("click", () => toggleDrawer());

  links.forEach((link) => {
    link.addEventListener("click", () => toggleDrawer(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      toggleDrawer(false);
    }
  });
}

/* ==========================================================================
   4. Interactive Desktop Cursor Glow
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      glow.classList.add("is-active");
      isMoving = true;
    }
  });

  window.addEventListener("mouseleave", () => {
    glow.classList.remove("is-active");
    isMoving = false;
  });

  function render() {
    // Smooth lerp follow
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   5. Mouse-Tracking Card Spotlight
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll("[data-spotlight]");
  if (cards.length === 0 || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

/* ==========================================================================
   6. Hero Portrait 3D Perspective Tilt
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById("portrait-card");
  if (!card || window.matchMedia("(pointer: coarse)").matches) return;

  const frame = card.querySelector(".portrait-card__frame");
  if (!frame) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    frame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    frame.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    frame.style.transition = "transform 500ms var(--ease-spring)";
  });

  card.addEventListener("mouseenter", () => {
    frame.style.transition = "none";
  });
}

/* ==========================================================================
   7. Staggered Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length === 0) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
}

/* ==========================================================================
   8. Smooth Metric Number Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length === 0) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach((counter) => {
      const target = counter.dataset.count;
      const suffix = counter.dataset.suffix || "";
      counter.textContent = `${target}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounting(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));

  function startCounting(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(target * ease);

      el.textContent = `${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }
}

/* ==========================================================================
   9. Work Gallery Category Filtering
   ========================================================================== */
function initWorkGallery() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery__item");

  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active states
      filterBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      // Filter gallery cards
      items.forEach((item) => {
        const category = item.dataset.category;
        if (filter === "all" || category === filter) {
          item.classList.remove("is-hidden");
          item.style.opacity = "0";
          item.style.transform = "translateY(15px)";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 30);
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });
}

/* ==========================================================================
   10. Interactive Carousel Lightbox
   ========================================================================== */
function initLightbox() {
  const dialog = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const imgEl = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-title");
  const captionEl = document.getElementById("lightbox-caption");
  const counterEl = document.getElementById("lightbox-counter");
  const categoryEl = document.getElementById("lightbox-category");

  if (!dialog || !imgEl) return;

  const cards = Array.from(document.querySelectorAll(".gallery__card"));
  if (cards.length === 0) return;

  let currentIndex = 0;

  // Build items array
  const galleryItems = cards.map((card) => ({
    src: card.dataset.src,
    title: card.dataset.title || "",
    caption: card.dataset.caption || "",
    category: card.dataset.category || "",
    alt: card.querySelector("img")?.alt || "",
  }));

  function displaySlide(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];

    // Fade out and swap
    imgEl.style.opacity = "0.4";
    imgEl.style.transform = "scale(0.97)";

    setTimeout(() => {
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      titleEl.textContent = item.title;
      captionEl.textContent = item.caption;
      counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
      categoryEl.textContent = item.category;

      imgEl.style.opacity = "1";
      imgEl.style.transform = "scale(1)";
    }, 120);
  }

  // Open modal on card click
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      displaySlide(index);
      dialog.showModal();
      document.body.style.overflow = "hidden";
    });
  });

  // Controls
  function closeModal() {
    dialog.close();
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    displaySlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    displaySlide(currentIndex + 1);
  });

  // Close when clicking the backdrop
  dialog.addEventListener("click", (e) => {
    const rect = dialog.querySelector(".lightbox__container").getBoundingClientRect();
    const isInContainer =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    if (!isInContainer) {
      closeModal();
    }
  });

  // Keyboard navigation
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      displaySlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      displaySlide(currentIndex + 1);
    } else if (e.key === "Escape") {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. Copy to Clipboard with Toast Notification
   ========================================================================== */
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll("[data-copy]");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  if (copyButtons.length === 0 || !toast) return;

  let toastTimeout = null;

  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMsg.textContent = message;
    toast.classList.add("is-active");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-active");
    }, 2800);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const label = textToCopy.includes("@") ? "Email address" : "Phone number";
        showToast(`${label} copied to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const temp = document.createElement("textarea");
        temp.value = textToCopy;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("Copied to clipboard!");
      }
    });
  });
}
