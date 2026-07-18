// Minimum time the designed intro stays on screen so its animations
// (headline reveal + highlight fill) always play in full.
const MIN_VISIBLE_MS = 6000;

const tl = gsap.timeline();
const counterState = { value: 0 };

let counterEl = null;
let targetProgress = 0;
let startTime = 0;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const whenWindowLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) =>
        window.addEventListener("load", resolve, { once: true })
      );

function renderCounter() {
  if (counterEl) counterEl.textContent = `${Math.round(counterState.value)}%`;
}

function advanceProgress(value) {
  const next = Math.min(Math.max(value, 0), 100);
  if (next <= targetProgress) return;
  targetProgress = next;
  gsap.to(counterState, {
    value: targetProgress,
    duration: 0.6,
    ease: "power2.out",
    overwrite: true,
    onUpdate: renderCounter,
  });
}

export function revealSite() {
  const preloader = document.querySelector(".pre-loader");
  if (!preloader) return;

  tl.to(preloader, 1, {
    opacity: 0,
    ease: "power2.inOut",
    onComplete: () => {
      preloader.style.display = "none";
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
    },
  });
}

export function playPreloaderIntro() {
  tl.to(".header > h1", 2, {
    top: 0,
    ease: "power3.inOut",
    stagger: { amount: 0.3 },
  }).to(".pre-loader-btn", 0.3, {
    opacity: 1,
    delay: 2,
  });
}

export function scrollToTop() {
  if (window.lenis && typeof window.lenis.scrollTo === "function") {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

export function bindIntroScrollHint() {
  const introInfo = document.querySelector(".intro__info");
  if (!introInfo || introInfo.dataset.scrollBound === "1") return;
  introInfo.dataset.scrollBound = "1";

  const hideScrollHint = () => {
    const y =
      window.lenis && typeof window.lenis.scroll === "number"
        ? window.lenis.scroll
        : window.scrollY || document.documentElement.scrollTop || 0;
    if (y <= 48) return;
    introInfo.classList.add("is-hidden");
    window.removeEventListener("scroll", hideScrollHint);
    if (window.lenis && typeof window.lenis.off === "function") {
      window.lenis.off("scroll", hideScrollHint);
    }
  };

  window.addEventListener("scroll", hideScrollHint, { passive: true });
  if (window.lenis && typeof window.lenis.on === "function") {
    window.lenis.on("scroll", hideScrollHint);
  }
}

export function playIntroEntrance() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  gsap.to(".intro__title-pre", {
    height: "100%",
    duration: 2,
    ease: "power3.inOut",
  });
  gsap.from(".intro__title-sub", {
    y: isMobile ? 28 : 50,
    duration: 2,
    ease: "bounce.out",
    delay: 0.2,
  });
  gsap.from(".intro__info", {
    y: isMobile ? 80 : 300,
    duration: isMobile ? 1.6 : 3,
  });
}

export function initPreloader() {
  counterEl = document.querySelector(".pre-loader-progress__value");
  startTime = performance.now();
  renderCounter();
  playPreloaderIntro();
  advanceProgress(10);
}

export function setPreloaderProgress(value) {
  advanceProgress(value);
}

// Exits only once every resource (scripts, styles, images, fonts) has
// loaded and the intro has been shown for its minimum designed duration.
export async function finishPreloader() {
  await whenWindowLoaded();
  advanceProgress(96);

  const elapsed = performance.now() - startTime;
  if (elapsed < MIN_VISIBLE_MS) await wait(MIN_VISIBLE_MS - elapsed);

  advanceProgress(100);
  await wait(650);

  revealSite();
  scrollToTop();
  playIntroEntrance();
  bindIntroScrollHint();
}
