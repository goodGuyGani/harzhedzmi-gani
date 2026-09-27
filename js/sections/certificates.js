let certificatesMotionReady = false;

const REST = 0.85;
const TURN = 0.6;

function activeIndex(progress, count) {
  const unit = REST + TURN;
  const duration = (count - 1) * unit + REST;
  const time = progress * duration;
  let index = 0;

  for (let i = 1; i < count; i += 1) {
    const switchAt = (i - 1) * unit + REST + TURN * 0.45;
    if (time >= switchAt) index = i;
  }

  return index;
}

function progressForIndex(index, count) {
  const unit = REST + TURN;
  const duration = (count - 1) * unit + REST;
  const center = index * unit + REST * 0.5;
  return Math.min(1, center / duration);
}

export function initCertificatesMotion() {
  if (certificatesMotionReady) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const root = document.querySelector(".certs");
  const pin = root?.querySelector(".certs__pin");
  const stage = root?.querySelector(".certs__stage");
  if (!root || !pin || !stage) return;

  const slides = gsap.utils.toArray(".cert-slide", root);
  const ticks = gsap.utils.toArray(".certs__tick", root);
  const bar = root.querySelector(".certs__bar span");

  if (slides.length < 2) return;

  certificatesMotionReady = true;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("certs--motion");

  const unit = REST + TURN;

  gsap.set(slides, {
    autoAlpha: 0,
    yPercent: 30,
    scale: 0.94,
    transformOrigin: "50% 60%",
  });
  gsap.set(slides[0], { autoAlpha: 1, yPercent: 0, scale: 1 });
  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");
  });

  const tl = gsap.timeline({ defaults: { ease: "none" }, paused: true });

  slides.forEach((slide, i) => {
    if (i === 0) return;
    const at = (i - 1) * unit + REST;
    tl.to(
      slides[i - 1],
      {
        autoAlpha: 0,
        yPercent: -36,
        scale: 0.9,
        duration: TURN,
      },
      at
    );
    tl.fromTo(
      slide,
      { autoAlpha: 0, yPercent: 42, scale: 0.94, immediateRender: false },
      {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        duration: TURN,
      },
      at
    );
  });

  tl.to(slides[slides.length - 1], { autoAlpha: 1, duration: REST });

  const syncChrome = (progress) => {
    const index = activeIndex(progress, slides.length);
    ticks.forEach((tick, i) => {
      const on = i === index;
      tick.classList.toggle("is-active", on);
      if (on) {
        tick.setAttribute("aria-current", "true");
        const nav = tick.parentElement;
        if (nav && nav.scrollWidth > nav.clientWidth + 4) {
          nav.scrollTo({
            left: tick.offsetLeft - nav.clientWidth / 2 + tick.offsetWidth / 2,
            behavior: "auto",
          });
        }
      } else {
        tick.removeAttribute("aria-current");
      }
    });
    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    if (bar) {
      bar.style.transform = `scaleX(${0.06 + progress * 0.94})`;
    }
  };

  ScrollTrigger.create({
    id: "certificates",
    animation: tl,
    trigger: pin,
    start: "top top",
    end: () => `+=${Math.round((slides.length - 1) * window.innerHeight * 0.92)}`,
    pin: true,
    scrub: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.animation ? self.animation.progress() : self.progress;
      syncChrome(progress);
    },
  });

  ticks.forEach((tick, index) => {
    tick.addEventListener("click", () => {
      const trigger = tl.scrollTrigger;
      if (!trigger) return;
      const progress = progressForIndex(index, slides.length);
      const y = trigger.start + (trigger.end - trigger.start) * progress;
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(y, { duration: 0.95 });
        return;
      }
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}
