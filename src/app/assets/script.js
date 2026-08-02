

(() => {
  const cards = document.querySelectorAll(".story-card");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!cards.length || reduceMotion || !window.gsap) {
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(cards, {
      scrollTrigger: {
        trigger: ".discover-section",
        start: "top 72%",
        once: true
      },
      y: 72,
      opacity: 0,
      rotation(index) {
        return index % 2 === 0 ? -2.5 : 2.5;
      },
      scale: 0.94,
      duration: 1.15,
      stagger: 0.09,
      ease: "power4.out",
      clearProps: "opacity"
    });
  }

  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  cards.forEach((card) => {
    const image = card.querySelector("img");

    const moveRotationX = gsap.quickTo(image, "rotationX", {
      duration: 0.65,
      ease: "power3.out"
    });

    const moveRotationY = gsap.quickTo(image, "rotationY", {
      duration: 0.65,
      ease: "power3.out"
    });

    card.addEventListener("mouseenter", () => {
      gsap.to(image, {
        y: 0,
        scale: 1.035,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto"
      });
    });

    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const y =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.set(image, {
        transformPerspective: 1000
      });

      moveRotationY(x * 5);
      moveRotationX(y * -5);
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(image, {
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto"
      });

    });
  });
})();

(() => {
  const cards = Array.from(document.querySelectorAll(".story-card"));

  if (!cards.length) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const categories = cards.map((card) => ({
    card,
    title: card.querySelector("h3")?.textContent.trim() || "",
    image: card.querySelector("img")?.getAttribute("src") || "",
    alt: card.querySelector("img")?.getAttribute("alt") || "",
    color: getComputedStyle(card).getPropertyValue("--card-accent").trim()
  }));

  const overlay = document.createElement("aside");
  overlay.className = "category-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="category-overlay__panel" role="dialog" aria-modal="true" aria-labelledby="categoryOverlayTitle">
      <header class="category-overlay__header">
        <div class="category-overlay__tabs" role="tablist" aria-label="Categorías"></div>
        <button class="category-overlay__close" type="button" aria-label="Cerrar categorías">
          <span></span><span></span>
        </button>
      </header>
      <div class="category-overlay__body">
        <div class="category-overlay__copy">
          <p>Explora y descubre</p>
          <h2 id="categoryOverlayTitle"></h2>
          <a href="/productos">Ver productos <span aria-hidden="true">→</span></a>
        </div>
        <div class="category-overlay__media">
          <img src="" alt="">
        </div>
      </div>
    </div>
  `;
  document.body.append(overlay);

  const panel = overlay.querySelector(".category-overlay__panel");
  const tabs = overlay.querySelector(".category-overlay__tabs");
  const closeButton = overlay.querySelector(".category-overlay__close");
  const title = overlay.querySelector("#categoryOverlayTitle");
  const image = overlay.querySelector(".category-overlay__media img");
  let activeIndex = 0;
  let sourceCard = null;
  let lastFocused = null;
  let transitionClone = null;

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-overlay__tab";
    button.setAttribute("role", "tab");
    button.textContent = category.title.replace(/\s+/g, " ");
    button.addEventListener("click", () => showCategory(index));
    tabs.append(button);
  });

  const tabButtons = Array.from(tabs.querySelectorAll("button"));

  const showCategory = (index, animate = true) => {
    const category = categories[index];

    if (!category) {
      return;
    }

    const update = () => {
      activeIndex = index;
      panel.style.setProperty("--overlay-accent", category.color);
      title.textContent = category.title.replace(/\s+/g, " ");
      image.src = category.image;
      image.alt = category.alt;

      tabButtons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", selected ? "true" : "false");
      });
    };

    if (!animate || reduceMotion || !window.gsap) {
      update();
      return;
    }

    gsap.timeline()
      .to([title, image], {
        opacity: 0,
        y: 16,
        duration: 0.22,
        ease: "power2.in"
      })
      .add(update)
      .fromTo(
        [title, image],
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out"
        }
      );
  };

  const createTransitionClone = (card) => {
    const bounds = card.getBoundingClientRect();
    const clone = document.createElement("div");

    clone.className = "category-overlay__transition";
    clone.style.backgroundImage =
      `linear-gradient(rgba(8,18,12,.34), rgba(8,18,12,.58)), ` +
      `url("${card.querySelector("img")?.src || ""}")`;
    Object.assign(clone.style, {
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`
    });
    document.body.append(clone);
    return clone;
  };

  const openOverlay = (index) => {
    if (overlay.classList.contains("is-open")) {
      return;
    }

    activeIndex = index;
    sourceCard = cards[index];
    lastFocused = document.activeElement;
    showCategory(index, false);
    transitionClone = createTransitionClone(sourceCard);
    overlay.classList.add("is-open", "is-opening");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("category-overlay-open");

    if (reduceMotion || !window.gsap) {
      overlay.classList.remove("is-opening");
      transitionClone.remove();
      transitionClone = null;
      closeButton.focus();
      return;
    }

    const targetInset = window.innerWidth <= 768 ? 0 : 24;

    gsap.timeline({
      onComplete() {
        overlay.classList.remove("is-opening");
        transitionClone.remove();
        transitionClone = null;
        closeButton.focus();
      }
    })
      .to(transitionClone, {
        left: targetInset,
        top: targetInset,
        width: window.innerWidth - targetInset * 2,
        height: window.innerHeight - targetInset * 2,
        borderRadius: window.innerWidth <= 768 ? 0 : 24,
        duration: 0.78,
        ease: "power4.inOut"
      })
      .to(transitionClone, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.out"
      }, "-=0.14")
      .fromTo(
        panel,
        { opacity: 0 },
        { opacity: 1, duration: 0.32, ease: "power2.out" },
        "-=0.25"
      );
  };

  const closeOverlay = () => {
    if (!overlay.classList.contains("is-open")) {
      return;
    }

    const finish = () => {
      overlay.classList.remove("is-open", "is-closing");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("category-overlay-open");
      transitionClone?.remove();
      transitionClone = null;
      lastFocused?.focus();
    };

    if (reduceMotion || !window.gsap || !sourceCard) {
      finish();
      return;
    }

    const bounds = sourceCard.getBoundingClientRect();
    transitionClone = createTransitionClone(sourceCard);
    overlay.classList.add("is-closing");
    gsap.set(transitionClone, {
      left: window.innerWidth <= 768 ? 0 : 24,
      top: window.innerWidth <= 768 ? 0 : 24,
      width: window.innerWidth - (window.innerWidth <= 768 ? 0 : 48),
      height: window.innerHeight - (window.innerWidth <= 768 ? 0 : 48),
      borderRadius: window.innerWidth <= 768 ? 0 : 24,
      opacity: 1
    });

    gsap.timeline({ onComplete: finish })
      .to(panel, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      })
      .to(transitionClone, {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        borderRadius: 20,
        duration: 0.72,
        ease: "power4.inOut"
      }, "-=0.04");
  };

  cards.forEach((card, index) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute(
      "aria-label",
      `Abrir categoría ${categories[index].title.replace(/\s+/g, " ")}`
    );
    card.addEventListener("click", () => openOverlay(index));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openOverlay(index);
      }
    });
  });

  closeButton.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeOverlay();
    }
  });
})();

document.querySelectorAll(".js-circle-button-legacy").forEach((button) => {
  const circle = button.querySelector(".button-circle");
  const label = button.querySelector(".button-label");
  const arrow = button.querySelector(".button-arrow");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !window.gsap) {
    return;
  }

  function getPointerPosition(event) {
    const bounds = button.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return {
      x,
      y
    };
  }

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
    scale: 0,
    force3D: true
  });

  const moveCircleX = gsap.quickTo(circle, "left", {
    duration: 0.18,
    ease: "power3.out"
  });

  const moveCircleY = gsap.quickTo(circle, "top", {
    duration: 0.18,
    ease: "power3.out"
  });

  button.addEventListener("pointermove", (event) => {
    const { x, y } = getPointerPosition(event);
    moveCircleX(x);
    moveCircleY(y);
  });

  button.addEventListener("pointerenter", (event) => {
    const { x, y } = getPointerPosition(event);
    gsap.killTweensOf([circle, label, arrow]);

    gsap.set(circle, {
      left: x,
      top: y
    });

    gsap.timeline({ defaults: { overwrite: "auto" } })
      .to(circle, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out"
      }, 0)
      .to(label, {
        color: "#ffffff",
        duration: 0.16,
        ease: "power2.out"
      }, 0.04)
      .to(arrow, {
        x: 3,
        duration: 0.28,
        ease: "power3.out"
      }, 0.02);
  });

  button.addEventListener("pointerleave", () => {
    gsap.killTweensOf([circle, label, arrow]);

    /*
     * El círculo desaparece en el lugar por donde sale el cursor.
     * Esto produce el efecto orgánico del botón de GSAP.
     */
    gsap.timeline({ defaults: { overwrite: "auto" } })
      .to(circle, {
        scale: 0,
        duration: 0.2,
        ease: "power2.in"
      }, 0)
      .to(label, {
        color: "#0a0a0a",
        duration: 0.14,
        ease: "power2.out"
      }, 0.03)
      .to(arrow, {
        x: 0,
        duration: 0.24,
        ease: "power3.out"
      }, 0);
  });
});

document.querySelectorAll(".js-circle-button").forEach((button) => {
  const flair = button.querySelector(".button-circle");

  if (!flair || !window.gsap) {
    return;
  }

  const setX = gsap.quickSetter(flair, "xPercent");
  const setY = gsap.quickSetter(flair, "yPercent");

  function getXY(event) {
    const { left, top, width, height } = button.getBoundingClientRect();

    return {
      x: gsap.utils.clamp(
        0,
        100,
        gsap.utils.mapRange(0, width, 0, 100, event.clientX - left)
      ),
      y: gsap.utils.clamp(
        0,
        100,
        gsap.utils.mapRange(0, height, 0, 100, event.clientY - top)
      )
    };
  }

  button.addEventListener("pointerenter", (event) => {
    const { x, y } = getXY(event);

    setX(x);
    setY(y);

    gsap.to(flair, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true
    });
  });

  button.addEventListener("pointerleave", (event) => {
    const { x, y } = getXY(event);

    gsap.killTweensOf(flair);
    gsap.to(flair, {
      xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
      scale: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  button.addEventListener("pointermove", (event) => {
    const { x, y } = getXY(event);

    gsap.to(flair, {
      xPercent: x,
      yPercent: y,
      duration: 0.4,
      ease: "power2",
      overwrite: "auto"
    });
  });
});


(() => {
  const track = document.querySelector(".vitamin-marquee__track");

  if (!track || !window.gsap) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    return;
  }

  gsap.set(track, {
    xPercent: 0,
    force3D: true
  });

  gsap.to(track, {
    xPercent: -50,
    duration: 120, // Aumenta este valor para hacerlo aún más lento
    repeat: -1,
    ease: "none",
    force3D: true,
    overwrite: true
  });
})();

(() => {
  const visual = document.querySelector(".founder-story__visual");

  if (
    !visual ||
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let parallaxImage = visual.querySelector(".founder-story__parallax");

  if (!parallaxImage) {
    parallaxImage = document.createElement("div");
    parallaxImage.className = "founder-story__parallax";
    parallaxImage.setAttribute("aria-hidden", "true");
    visual.prepend(parallaxImage);
  }

  gsap.fromTo(
    parallaxImage,
    {
      scale: 1
    },
    {
      scale: 1.12,
      ease: "none",
      scrollTrigger: {
        trigger: visual,
        start: "top 85%",
        end: "bottom 15%",
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    }
  );

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
})();

(() => {
  const section = document.querySelector(".coverage-section");

  if (
    !section ||
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const headingElements = section.querySelectorAll(
    ".coverage-icon, " +
    ".coverage-eyebrow, " +
    ".coverage-heading h2, " +
    ".coverage-description, " +
    ".coverage-summary"
  );

  const panel = section.querySelector(".coverage-panel");
  const panelHeading = section.querySelector(".coverage-panel__heading");
  const districts = section.querySelectorAll(".coverage-district");
  const panelFooter = section.querySelector(".coverage-panel__footer");
  const decorations = section.querySelectorAll(
    ".coverage-decoration span"
  );

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      once: true
    },
    defaults: {
      ease: "power3.out"
    }
  });

  timeline
    .from(headingElements, {
      x: -38,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08
    })
    .from(
      panel,
      {
        x: 55,
        opacity: 0,
        scale: 0.975,
        duration: 1.1,
        ease: "power4.out"
      },
      0.12
    )
    .from(
      panelHeading,
      {
        y: 18,
        opacity: 0,
        duration: 0.65
      },
      0.5
    )
    .from(
      districts,
      {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.055
      },
      0.58
    )
    .from(
      panelFooter,
      {
        y: 12,
        opacity: 0,
        duration: 0.55
      },
      "-=0.3"
    );

  gsap.to(decorations, {
    yPercent: -12,
    rotation: 8,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.8
    }
  });
})();

(() => {
  const footer = document.querySelector(".site-footer");

  if (!footer) {
    return;
  }

  const desktop = window.matchMedia("(min-width: 768px)");

  const updateFooterSpace = () => {
    const footerSpace = desktop.matches ? footer.offsetHeight : 0;

    document.documentElement.style.setProperty(
      "--footer-reveal-height",
      `${footerSpace}px`
    );
  };

  updateFooterSpace();

  window.addEventListener("load", () => {
    updateFooterSpace();
  });

  window.addEventListener("resize", () => {
    updateFooterSpace();
  });
})();

(() => {
  const drawer = document.querySelector(".cart-drawer");
  const openButton = document.querySelector(".js-cart-open");
  const closeButtons = document.querySelectorAll(".js-cart-close");
  const shopButton = document.querySelector(".js-cart-shop");
  const itemsContainer = document.querySelector(".cart-items");
  const emptyState = document.querySelector(".cart-empty");
  const footer = document.querySelector(".cart-drawer__footer");
  const subtotal = document.querySelector(".cart-drawer__subtotal strong");
  const count = document.querySelector(".nav-cart-count");
  const addButtons = document.querySelectorAll(
    ".product-card__footer button"
  );

  if (!drawer || !openButton || !itemsContainer) {
    return;
  }

  const cart = new Map();
  let lastFocused = null;

  const money = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const getCartQuantity = () =>
    Array.from(cart.values()).reduce(
      (total, item) => total + item.quantity,
      0
    );

  const getCartSubtotal = () =>
    Array.from(cart.values()).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  const renderCart = () => {
    const hasItems = cart.size > 0;

    emptyState.hidden = hasItems;
    footer.hidden = !hasItems;
    count.textContent = getCartQuantity();
    count.classList.toggle("has-items", hasItems);
    subtotal.textContent = `S/ ${money.format(getCartSubtotal())}`;

    itemsContainer.innerHTML = Array.from(cart.values())
      .map(
        (item) => `
          <article class="cart-item" data-cart-id="${item.id}">
            <img class="cart-item__image" src="${item.image}" alt="">
            <div class="cart-item__copy">
              <h3>${item.name}</h3>
              <p>${item.format}</p>
              <div class="cart-item__controls" aria-label="Cantidad de ${item.name}">
                <button type="button" data-cart-action="decrease" aria-label="Disminuir cantidad">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-action="increase" aria-label="Aumentar cantidad">+</button>
              </div>
            </div>
            <div class="cart-item__aside">
              <strong class="cart-item__price">S/ ${money.format(item.price * item.quantity)}</strong>
              <button class="cart-item__remove" type="button" data-cart-action="remove" aria-label="Eliminar ${item.name}">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          </article>
        `
      )
      .join("");
  };

  const openCart = () => {
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    drawer.querySelector(".cart-drawer__close")?.focus();
  };

  const closeCart = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    lastFocused?.focus();
  };

  const addProduct = (button) => {
    const card = button.closest(".product-card");

    if (!card) {
      return;
    }

    const name = card.querySelector("h3")?.textContent.trim() || "Producto";
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const priceText = card.querySelector(".product-card__footer > span")
      ?.textContent.replace("S/", "")
      .replace(",", ".")
      .trim();
    const current = cart.get(id);

    if (current) {
      current.quantity += 1;
    } else {
      cart.set(id, {
        id,
        name,
        price: Number.parseFloat(priceText) || 0,
        image: card.querySelector(".product-card__image img")?.src || "",
        format:
          card.querySelector(".product-card__format")?.textContent.trim() || "",
        quantity: 1
      });
    }

    renderCart();
    openCart();
  };

  openButton.addEventListener("click", openCart);
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeCart);
  });

  addButtons.forEach((button) => {
    button.addEventListener("click", () => addProduct(button));
  });

  itemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    const itemElement = event.target.closest("[data-cart-id]");

    if (!button || !itemElement) {
      return;
    }

    const item = cart.get(itemElement.dataset.cartId);

    if (!item) {
      return;
    }

    if (button.dataset.cartAction === "increase") {
      item.quantity += 1;
    }

    if (button.dataset.cartAction === "decrease") {
      item.quantity -= 1;

      if (item.quantity < 1) {
        cart.delete(item.id);
      }
    }

    if (button.dataset.cartAction === "remove") {
      cart.delete(item.id);
    }

    renderCart();
  });

  shopButton?.addEventListener("click", () => {
    closeCart();
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) {
      closeCart();
    }
  });

  renderCart();
})();



