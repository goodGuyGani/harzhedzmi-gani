// Preload helpers shared across the app

export const preloadFonts = (id) => {
  return new Promise((resolve) => {
    WebFont.load({
      typekit: { id },
      active: resolve,
    });
  });
};

export const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    imagesLoaded(
      document.querySelectorAll(selector),
      { background: true },
      resolve
    );
  });
};

export const wrapElements = (elems, wrapType, wrapClass) => {
  elems.forEach((char) => {
    const wrapEl = document.createElement(wrapType);
    wrapEl.classList = wrapClass;
    char.parentNode.appendChild(wrapEl);
    wrapEl.appendChild(char);
  });
};

export const isMobileViewport = () =>
  window.matchMedia("(max-width: 768px)").matches;

export const refreshScroll = () => {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
  if (window.lenis && typeof window.lenis.resize === "function") {
    window.lenis.resize();
  }
};
