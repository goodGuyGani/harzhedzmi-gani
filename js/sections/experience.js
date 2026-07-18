let experienceMotionInitialized = false;

export function initExperienceMotion() {
  if (experienceMotionInitialized) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  experienceMotionInitialized = true;
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector(".experience__header");
  const headerTitles = gsap.utils.toArray(".experience__header .title");
  const roles = gsap.utils.toArray(".experience-role");
  if (!headerTitles.length && !roles.length) return;

  gsap.set(headerTitles, { autoAlpha: 0, y: 18 });
  gsap.set(roles, { autoAlpha: 0, y: 16 });

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

  const revealRole = (role) => {
    if (role.dataset.revealed === "1") return;
    role.dataset.revealed = "1";
    role.classList.add("is-inview");

    gsap.to(role, {
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

        if (entry.target.classList.contains("experience__header")) {
          revealHeader();
          observer.unobserve(entry.target);
          return;
        }

        if (entry.target.classList.contains("experience-role")) {
          revealRole(entry.target);
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
  roles.forEach((role) => observer.observe(role));
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
