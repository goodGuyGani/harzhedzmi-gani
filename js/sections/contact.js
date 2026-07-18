let contactMotionInitialized = false;

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = document.getElementById("contact-status");
  const submitBtn = form.querySelector(".contact-form__submit");
  const emailTo = form.dataset.email || "harzhedzmig@gmail.com";

  const setStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type);
  };

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
  };

  const clearInvalid = () => {
    form.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  };

  const validate = () => {
    clearInvalid();
    let ok = true;

    const name = form.elements.namedItem("name");
    const email = form.elements.namedItem("email");
    const message = form.elements.namedItem("message");

    if (!name || !String(name.value).trim()) {
      name?.classList.add("is-invalid");
      ok = false;
    }

    const emailValue = email ? String(email.value).trim() : "";
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      email?.classList.add("is-invalid");
      ok = false;
    }

    if (!message || !String(message.value).trim()) {
      message?.classList.add("is-invalid");
      ok = false;
    }

    return ok;
  };

  const getIntent = () => {
    const selected = form.querySelector('input[name="intent"]:checked');
    return selected ? selected.value : "Other";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.elements.namedItem("_gotcha");
    if (honeypot && String(honeypot.value).trim()) {
      setStatus("Message sent. Thank you.", "is-success");
      form.reset();
      return;
    }

    if (!validate()) {
      setStatus(
        "Please fill in name, a valid email, and your message.",
        "is-error"
      );
      return;
    }

    setLoading(true);
    setStatus("Sending your message…", null);

    const payload = {
      name: String(form.elements.namedItem("name").value).trim(),
      email: String(form.elements.namedItem("email").value).trim(),
      intent: getIntent(),
      message: String(form.elements.namedItem("message").value).trim(),
      _subject: `Portfolio contact — ${getIntent()}`,
      _template: "table",
      _captcha: "false",
    };

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(emailTo)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          (data && (data.message || data.error)) || "Send failed"
        );
      }

      form.reset();
      const jobOffer = form.querySelector(
        'input[name="intent"][value="Job Offer"]'
      );
      if (jobOffer) jobOffer.checked = true;

      setStatus(
        "Sent. I’ll get back to you soon — check your inbox if FormSubmit asks you to confirm once.",
        "is-success"
      );
    } catch {
      setStatus(
        "Couldn’t send right now. Email me directly at HARZHEDZMIG@GMAIL.COM.",
        "is-error"
      );
    } finally {
      setLoading(false);
    }
  });
}

export function initContactMotion() {
  if (contactMotionInitialized) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  contactMotionInitialized = true;
  gsap.registerPlugin(ScrollTrigger);

  const headerTitles = gsap.utils.toArray(".contact__header .title");
  const asideBits = gsap.utils.toArray(
    ".contact__lede, .contact__meta, .contact__links"
  );
  const fields = gsap.utils.toArray(
    ".contact-form .contact-field, .contact-form__actions"
  );

  if (!headerTitles.length && !fields.length) return;

  gsap.set(headerTitles, { autoAlpha: 0, y: 22 });
  gsap.set(asideBits, { autoAlpha: 0, y: 18 });
  gsap.set(fields, { autoAlpha: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contact",
      start: "top 72%",
      toggleActions: "play none none none",
    },
  });

  tl.to(headerTitles, {
    autoAlpha: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.out",
  })
    .to(
      asideBits,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.35"
    )
    .to(
      fields,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
      },
      "-=0.4"
    );
}

export function initContact() {
  initContactForm();
  window.initContactMotion = initContactMotion;

  const preloader = document.querySelector(".pre-loader");
  if (preloader) {
    window.setTimeout(initContactMotion, 7200);
  } else {
    initContactMotion();
  }
}
