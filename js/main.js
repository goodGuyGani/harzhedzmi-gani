import { preloadFonts, preloadImages, refreshScroll } from "./core/utils.js";
import { initSmoothScrolling } from "./core/lenis.js";
import {
  initPreloader,
  setPreloaderProgress,
  finishPreloader,
  bindIntroScrollHint,
  lockPreloaderScroll,
} from "./sections/preloader.js";
import { initAbout } from "./sections/about.js";
import { initSkills } from "./sections/skills.js";
import { initTechStack } from "./sections/stack.js";
import { initExperience, initExperienceMotion } from "./sections/experience.js";
import { initContact, initContactMotion } from "./sections/contact.js";

const boot = async () => {
  // Preloader timeline + progress counter start immediately
  initPreloader();

  await preloadFonts("qsy7khk");
  document.body.classList.remove("loading");
  setPreloaderProgress(35);

  initSmoothScrolling();
  // Lenis boots mid-preload — keep it stopped until the intro exits
  lockPreloaderScroll();
  bindIntroScrollHint();

  // Section modules (order mirrors page flow)
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initAbout();
  initSkills();
  initExperience();
  initContact();
  setPreloaderProgress(55);

  await preloadImages(".gallery__item img");
  initTechStack();
  setPreloaderProgress(85);

  refreshScroll();
  window.addEventListener("load", refreshScroll);

  // Holds the preloader until every resource has loaded, then reveals the site
  await finishPreloader();

  initExperienceMotion();
  initContactMotion();
  refreshScroll();
};

boot();
