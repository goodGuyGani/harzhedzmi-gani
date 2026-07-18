const triggerFlipOnScroll = (galleryEl, options = {}) => {
  const settings = {
    flip: {
      absoluteOnLeave: false,
      absolute: false,
      scale: true,
      simple: true,
      ...(options.flip || {}),
    },
    scrollTrigger: {
      start: "center center",
      end: "+=300%",
      ...(options.scrollTrigger || {}),
    },
    stagger: options.stagger ?? 0,
  };

  const galleryCaption = galleryEl.querySelector(".caption2");
  const galleryItems = galleryEl.querySelectorAll(".gallery__item");
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  galleryEl.classList.add("gallery--switch");
  const flipstate = Flip.getState([galleryItems, galleryCaption], {
    props: "filter, opacity",
  });
  galleryEl.classList.remove("gallery--switch");

  const tl = Flip.to(flipstate, {
    ease: "none",
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      { scale: 2 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
        },
      },
      0
    );
  }
};

export function initTechStack() {
  if (typeof Flip === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  if (document.querySelector(".tech-stack .section__header")) {
    gsap.from(".tech-stack .section__header", {
      y: 48,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".tech-stack",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  }

  const galleryElement = document.querySelector("#gallery-1");
  if (!galleryElement) return;

  triggerFlipOnScroll(galleryElement, {
    flip: { absolute: true, scale: false },
    scrollTrigger: { start: "center center", end: "+=900%" },
    stagger: 0.05,
  });
}
