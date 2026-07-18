export class AboutItem {
  DOM = {
    el: null,
    titleWrap: null,
    titleUp: null,
    titleDown: null,
    content: null,
    svg: null,
    mask: null,
    image: null,
  };

  flipstate = null;

  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.titleWrap = this.DOM.el.querySelector(".title-wrap");
    this.DOM.titleUp = this.DOM.titleWrap.querySelector(".title--up");
    this.DOM.titleDown = this.DOM.titleWrap.querySelector(".title--down");
    this.DOM.content = [...this.DOM.el.querySelectorAll(".content")];
    this.DOM.svg = this.DOM.el.querySelector(".content__img");
    this.DOM.mask = this.DOM.svg.querySelector(".mask");
    this.DOM.image = this.DOM.svg.querySelector("image");

    this.flipstate = Flip.getState([this.DOM.titleUp, this.DOM.titleDown]);
    this.DOM.content[1].prepend(this.DOM.titleUp, this.DOM.titleDown);

    const isCircle = this.DOM.mask.tagName.toLowerCase() === "circle";
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      if (isCircle) {
        this.DOM.mask.setAttribute("r", this.DOM.mask.dataset.valueFinal);
      } else {
        this.DOM.mask.setAttribute("d", this.DOM.mask.dataset.valueFinal);
      }
      return;
    }

    const flip = Flip.from(this.flipstate, {
      ease: "none",
      color: "fff",
      simple: true,
    })
      .fromTo(
        this.DOM.mask,
        {
          attr: isCircle
            ? { r: this.DOM.mask.getAttribute("r") }
            : { d: this.DOM.mask.getAttribute("d") },
        },
        {
          ease: "none",
          attr: isCircle
            ? { r: this.DOM.mask.dataset.valueFinal }
            : { d: this.DOM.mask.dataset.valueFinal },
        },
        0
      )
      .fromTo(
        this.DOM.image,
        {
          transformOrigin: "50% 50%",
          filter: "brightness(100%)",
        },
        {
          ease: "none",
          scale: isCircle ? 1.2 : 1,
          filter: "brightness(150%)",
        },
        0
      );

    ScrollTrigger.create({
      trigger: this.DOM.titleWrap,
      ease: "none",
      start: "clamp(top bottom-=15%)",
      end: "+=35%",
      scrub: true,
      animation: flip,
    });
  }
}

export function initAbout() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let shapeTop = isMobile ? "175%" : "183%";
  let shapeWidth = isMobile ? "30%" : "48vw";
  let shapeLeft = isMobile ? "35%" : "25%";

  if (document.querySelector(".shape")) {
    gsap.from(".shape", {
      height: "1rem",
      left: shapeLeft,
      width: shapeWidth,
      top: shapeTop,
      borderRadius: "10px",
      backgroundImage: "#e93f33",
      scrollTrigger: {
        trigger: ".shape",
        scrub: 2.3,
        start: "clamp(top bottom-=12%)",
        end: "+=25%",
      },
    });
  }

  if (document.querySelector(".content__text")) {
    gsap.from(".content__text", {
      y: "100%",
      scrollTrigger: {
        trigger: ".content__text",
        scrub: 2,
        start: "clamp(-300 bottom-=12%)",
        end: "+=25%",
      },
    });
  }

  [...document.querySelectorAll(".content-wrap")].forEach((element) => {
    new AboutItem(element);
  });
}
