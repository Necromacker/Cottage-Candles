document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Initial Setup
  const products = gsap.utils.toArray(".product-item");
  const infos = gsap.utils.toArray(".product-info");
  const priceItems = gsap.utils.toArray(".price-item");

  // Hide all products initially except the first one
  gsap.set(products, { y: window.innerHeight, opacity: 1 });
  gsap.set(products[0], { y: 0, opacity: 1 });

  infos.forEach((info, i) => {
    const texts = [
      ...info.querySelectorAll(".anim-text"),
      ...priceItems[i].querySelectorAll(".anim-text"),
    ];
    if (i === 0) {
      gsap.set(texts, { y: "0%" });
    } else {
      gsap.set(texts, { y: "200%" });
    }
  });

  // Initial Intro Animation
  const introTl = gsap.timeline();
  introTl
    .from(".block", {
      scale: 1.1,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut",
    })
    .from(
      products[0],
      {
        x: -50,
        opacity: 0,
        rotation: -5,
        duration: 1.5,
        ease: "elastic.out(1, 0.8)",
      },
      "-=0.5"
    )
    .from(".navbar", { y: -20, opacity: 0, duration: 0.8 }, "-=1")
    .from(
      [
        ...infos[0].querySelectorAll(".anim-text"),
        ...priceItems[0].querySelectorAll(".anim-text"),
      ],
      {
        y: "100%",
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=1"
    )
    .from(".bottom-bar", { x: 50, opacity: 0, duration: 0.8 }, "-=0.8");

  // Scroll Animation
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-spacer",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    },
  });

  // Timeline Sequence
  // 1. Hold P1
  // 2. Transition P1 -> P2
  // 3. Hold P2
  // 4. Transition P2 -> P3

  scrollTl
    // 1. Hold Product 1 (The "Stick" requested)
    .to({}, { duration: 1 })

    // Track Product Index
    .call(() => (window.activeProductIndex = 0), null, 0)
    
    // 2. Transition 1: P1 -> P2
    .addLabel("transition1")
    .call(() => (window.activeProductIndex = 1), null, "transition1")
    // Block Colors 1 -> 2 (Sliding)
    .to(
      ".p2-bg-1",
      { height: "100%", duration: 2, ease: "power2.inOut" },
      "transition1"
    )
    .to(
      ".p2-bg-3",
      { width: "100%", duration: 2, ease: "power2.inOut" },
      "transition1"
    )
    .to(
      ".p2-bg-4",
      { height: "100%", duration: 2, ease: "power2.inOut" },
      "transition1"
    )
    // Text 1 Exits
    .to(
      [
        ...infos[0].querySelectorAll(".anim-text"),
        ...priceItems[0].querySelectorAll(".anim-text"),
      ],
      {
        y: "-105%",
        stagger: 0.02,
        duration: 1,
        ease: "power2.inOut",
      },
      "transition1"
    )
    // Products Move
    .to(
      products[0],
      {
        y: -window.innerHeight * 1.2,
        rotation: 5,
        ease: "power1.inOut",
        duration: 2,
      },
      "transition1"
    )
    .to(
      products[1],
      { y: 0, rotation: 0, ease: "power1.inOut", duration: 2 },
      "transition1"
    )
    // Text 2 Enters (Delayed to ensure P1 text is out)
    .to(
      [
        ...infos[1].querySelectorAll(".anim-text"),
        ...priceItems[1].querySelectorAll(".anim-text"),
      ],
      {
        y: "0%",
        stagger: 0.05,
        duration: 1,
        ease: "power2.out",
      },
      "transition1+=1"
    )

    // 3. Hold Product 2
    .to({}, { duration: 1 })

    // 4. Transition 2: P2 -> P3
    .addLabel("transition2")
    .call(() => (window.activeProductIndex = 2), null, "transition2")
    // Block Colors 2 -> 3 (Sliding)
    .to(
      ".p3-bg-1",
      { width: "100%", duration: 2, ease: "power2.inOut" },
      "transition2"
    )
    .to(
      ".p3-bg-3",
      { height: "100%", duration: 2, ease: "power2.inOut" },
      "transition2"
    )
    .to(
      ".p3-bg-4",
      { width: "100%", duration: 2, ease: "power2.inOut" },
      "transition2"
    )
    // Text 2 Exits
    .to(
      [
        ...infos[1].querySelectorAll(".anim-text"),
        ...priceItems[1].querySelectorAll(".anim-text"),
      ],
      {
        y: "-105%",
        stagger: 0.02,
        duration: 1,
        ease: "power2.inOut",
      },
      "transition2"
    )
    // Products Move
    .to(
      products[1],
      {
        y: -window.innerHeight * 1.2,
        rotation: 5,
        ease: "power1.inOut",
        duration: 2,
      },
      "transition2"
    )
    .to(
      products[2],
      { y: 0, rotation: 0, ease: "power1.inOut", duration: 2 },
      "transition2"
    )
    // Text 3 Enters
    .to(
      [
        ...infos[2].querySelectorAll(".anim-text"),
        ...priceItems[2].querySelectorAll(".anim-text"),
      ],
      {
        y: "0%",
        stagger: 0.05,
        duration: 1,
        ease: "power2.out",
      },
      "transition2+=1"
    );

  // Continuous Floating Animation for Particles
  gsap.utils.toArray(".leaf").forEach((leaf, i) => {
    gsap.to(leaf, {
      y: "-=15",
      rotation: i % 2 === 0 ? 10 : -10,
      duration: 2 + i,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2,
    });
  });
});
