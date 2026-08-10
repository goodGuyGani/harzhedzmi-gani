let experienceMotionInitialized = false;

function observeRevealSection({ headerSelector, itemSelector, headerTitlesSelector }) {
  const header = document.querySelector(headerSelector);
  const headerTitles = gsap.utils.toArray(headerTitlesSelector);
  const items = gsap.utils.toArray(itemSelector);
  if (!headerTitles.length && !items.length) return;

  gsap.set(headerTitles, { autoAlpha: 0, y: 18 });
  gsap.set(items, { autoAlpha: 0, y: 16 });

  const revealHeader = () => {
    gsap.to(headerTitles, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const revealItem = (item) => {
    if (item.dataset.revealed === "1") return;
    item.dataset.revealed = "1";
    item.classList.add("is-inview");

    gsap.to(item, {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target === header) {
          revealHeader();
          observer.unobserve(entry.target);
          return;
        }

        if (entry.target.matches(itemSelector)) {
          revealItem(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  if (header) observer.observe(header);
  items.forEach((item) => observer.observe(item));
}

export function initExperienceMotion() {
  if (experienceMotionInitialized) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  experienceMotionInitialized = true;
  gsap.registerPlugin(ScrollTrigger);

  observeRevealSection({
    headerSelector: ".work__header",
    itemSelector: ".work-card",
    headerTitlesSelector: ".work__header .title",
  });

  observeRevealSection({
    headerSelector: ".experience__header",
    itemSelector: ".experience-role",
    headerTitlesSelector: ".experience__header .title",
  });
}

export function initExperience() {
  window.initExperienceMotion = initExperienceMotion;

  const preloader = document.querySelector(".pre-loader");
  if (preloader) {
    window.setTimeout(initExperienceMotion, 7200);
  } else {
    initExperienceMotion();
  }
}
