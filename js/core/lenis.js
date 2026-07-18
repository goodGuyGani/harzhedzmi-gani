let lenis = null;

export const getLenis = () => lenis;

export const initSmoothScrolling = () => {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
    syncTouch: true,
    syncTouchLerp: 0.075,
    touchMultiplier: 1.35,
    wheelMultiplier: 0.9,
    infinite: false,
  });

  lenis.on("scroll", () => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.update();
    }
  });

  window.lenis = lenis;

  if (typeof gsap !== "undefined" && gsap.ticker) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    const scrollFn = (time) => {
      lenis.raf(time);
      requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn);
  }

  document.documentElement.classList.add("lenis", "lenis-smooth");
  return lenis;
};
