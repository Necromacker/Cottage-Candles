// Lumina Luxury Candles - JavaScript

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initTheme();
  initNavigation();
  initScrollAnimations();
  initCarousel();
  initNewsletter();
  initScrollEffects();

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.querySelector("#theme-toggle-mobile");
  const body = document.body;

  // Check for saved theme or default to light
  const savedTheme = localStorage.getItem("lumina-theme") || "light";
  body.classList.toggle("dark", savedTheme === "dark");

  function toggleTheme() {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("lumina-theme", isDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", toggleTheme);
  }
}

// Navigation Management
function initNavigation() {
  const navigation = document.getElementById("navigation");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  // Mobile menu toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.contains("open");

      if (isOpen) {
        mobileMenu.classList.remove("open");
        mobileMenuToggle.classList.remove("mobile-menu-open");
      } else {
        mobileMenu.classList.add("open");
        mobileMenuToggle.classList.add("mobile-menu-open");
      }
    });
  }

  // Close mobile menu when clicking on links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      mobileMenuToggle.classList.remove("mobile-menu-open");
    });
  });

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll Effects
function initScrollEffects() {
  const navigation = document.getElementById("navigation");

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navigation background on scroll
    if (navigation) {
      if (scrollY > 20) {
        navigation.classList.add("scrolled");
      } else {
        navigation.classList.remove("scrolled");
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Call once on load
}

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-delay") || 0;

        setTimeout(() => {
          entry.target.classList.add("visible");
        }, parseInt(delay));

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Category cards animation
  const categoryCards = document.querySelectorAll(".category-card");
  const categoryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll(".category-card");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "1";
              card.classList.add("animate-slide-up");
            }, index * 200);
          });
          categoryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const categoriesSection = document.querySelector(".categories");
  if (categoriesSection) {
    categoryObserver.observe(categoriesSection);
  }
}

// Carousel Management
function initCarousel() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const productsGrid = document.getElementById("products-grid");
  const dots = document.querySelectorAll(".dot");

  const products = [
    {
      name: "Midnight Amber",
      price: "$48",
      description: "Rich amber and vanilla notes",
      src: "/images/1.jpg",
    },
    {
      name: "Sage & Sea Salt",
      price: "$52",
      description: "Fresh coastal breeze scent",
      src: "/images/2.jpg",
    },
    {
      name: "Cedarwood Dreams",
      price: "$45",
      description: "Warm woody aromatics",
      src: "/images/3.jpg",
    },
    {
      name: "Lavender Fields",
      price: "$50",
      description: "Calming lavender essence",
      src: "/images/4.jpg",
    },
    {
      name: "Citrus Bloom",
      price: "$46",
      description: "Energizing citrus blend",
      src: "/images/5.jpg",
    },
  ];

  let currentSlide = 0;

  function updateProducts() {
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    // Get 3 products starting from current slide
    for (let i = 0; i < 3; i++) {
      const productIndex = (currentSlide + i) % products.length;
      const product = products[productIndex];

      const productCard = document.createElement("div");
      productCard.className = "product-card animate-scale-in";
      productCard.setAttribute("data-delay", i * 100);

      productCard.innerHTML = `
                <div class="product-image-placeholder">
                    <div class="candle-placeholder">
                        <div class="candle-body"></div>
                              <img
                      src=${product.src}
                      alt="Girl in a jacket"
                      width="500"
                      height="600"
                    />
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price}</div>
                </div>
                <button class="add-to-cart-btn">Add to Cart</button>
            `;

      productsGrid.appendChild(productCard);
    }

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % products.length;
    updateProducts();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + products.length) % products.length;
    updateProducts();
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateProducts();
    });
  });

  // Auto-play carousel
  setInterval(nextSlide, 5000);

  // Initialize first set of products
  updateProducts();
}

// Newsletter Management
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const submitBtn = document.getElementById("newsletter-submit");
  const successMessage = document.getElementById("newsletter-success");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email || !isValidEmail(email)) {
        return;
      }

      // Disable form
      emailInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Welcome!";

      // Show success message
      successMessage.classList.add("visible");

      // Reset form after 3 seconds
      setTimeout(() => {
        emailInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Subscribe";
        emailInput.value = "";
        successMessage.classList.remove("visible");
      }, 3000);
    });
  }
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Smooth scrolling polyfill for older browsers
function smoothScrollTo(targetY, duration = 500) {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  function step() {
    const progress = (performance.now() - startTime) / duration;
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  step();
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Intersection Observer polyfill fallback
if (!window.IntersectionObserver) {
  function fallbackAnimation() {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    function checkVisibility() {
      animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !element.classList.contains("visible")) {
          const delay = element.getAttribute("data-delay") || 0;
          setTimeout(() => {
            element.classList.add("visible");
          }, parseInt(delay));
        }
      });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Check on load
  }

  // Use fallback if IntersectionObserver is not available
  fallbackAnimation();
}

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
  // Any additional scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener("scroll", debouncedScrollHandler, { passive: true });
