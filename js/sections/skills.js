export function initSkills() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return null;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let scrollTween = null;
  const lineLeft = isMobile ? null : "43%";

  if (!isMobile) {
    const sections = gsap.utils.toArray(".wrapper > section");
    if (sections.length) {
      scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".wrapper",
          pin: true,
          scrub: 0.5,
          snap: 1 / (sections.length - 1),
          start: "top top",
          end: "+=3400",
        },
      });
    }
  }

  if (!isMobile && document.querySelector(".line")) {
    gsap.to(".line", {
      top: "50%",
      height: "25%",
      width: "28%",
      backgroundImage:
        "linear-gradient(to right bottom, #e93f33, #b42550, #712551, #341f38, #0a0a0a);",
      left: lineLeft,
      scrollTrigger: {
        trigger: ".line",
        scrub: 2,
        start: "clamp(top bottom-=12%)",
        end: "+=25%",
      },
    });
  }

  document.querySelectorAll(".character").forEach((el) => {
    if (isMobile) {
      gsap.from(el, {
        opacity: 0,
        y: 36,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      return;
    }

    if (!scrollTween) return;

    const animateChild = (selector, vars) => {
      const target = el.querySelector(selector);
      if (!target) return;
      gsap.to(target, {
        ...vars,
        scrollTrigger: {
          ...vars.scrollTrigger,
          containerAnimation: scrollTween,
          trigger: target,
        },
      });
    };

    animateChild(".caption", {
      x: 0,
      y: 0,
      scrollTrigger: { start: "top bottom", end: "+=45%", scrub: 0.5 },
    });
    animateChild(".quote", {
      y: 0,
      ease: "none",
      scrollTrigger: { start: "top bottom", end: "+=35%", scrub: 0.5 },
    });
    animateChild(".nickname", {
      y: 0,
      ease: "none",
      scrollTrigger: { start: "top bottom", end: "+=20%", scrub: 0.5 },
    });
    animateChild(".block", {
      x: 0,
      ease: "none",
      scrollTrigger: { start: "top bottom", end: "+=50%", scrub: 0.5 },
    });
    animateChild("img", {
      y: 0,
      ease: "none",
      scrollTrigger: { start: "top bottom", end: "+=50%", scrub: 0.5 },
    });
    animateChild(".huge-text", {
      y: 0,
      ease: "none",
      scrollTrigger: { start: "top bottom", end: "+=100%", scrub: 0.5 },
    });
  });

  return scrollTween;
}
