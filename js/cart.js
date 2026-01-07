// Cart Data Definitions mapped by Page URL (roughly)
// Since we have specific pages for regular products, we can define the data here.
const PRODUCT_DATA = {
  // Candles
  "candle-1": { 
    id: "candle-1", 
    name: "COFFEE LATTE", 
    price: 32.0, 
    imageLight: "images/Products/Candles/Coffee-Latte-Light.png",
    imageDark: "images/Products/Candles/Coffee-Latte-Dark.png"
  },
  "candle-2": { 
    id: "candle-2", 
    name: "SUNBURST FLAVOUR", 
    price: 28.0, 
    imageLight: "images/Products/Candles/Sunburst-Flavour-Light.png",
    imageDark: "images/Products/Candles/Sunburst-Flavour-Dark.png"
  },
  "candle-3": { 
    id: "candle-3", 
    name: "STRAWBERRY SHORTCAKE", 
    price: 30.0, 
    imageLight: "images/Products/Candles/Strawberry-Shortcake-Light.png",
    imageDark: "images/Products/Candles/Strawberry-Shortcake-Dark.png"
  },
  "candle-4": { 
    id: "candle-4", 
    name: "MYSTIC OCEAN", 
    price: 34.0, 
    imageLight: "images/Products/Candles/Mystic-Ocean-Light.png",
    imageDark: "images/Products/Candles/Mystic-Ocean-Dark.png"
  },
  "candle-5": { 
    id: "candle-5", 
    name: "MERRY CHRISTMAS", 
    price: 35.0, 
    imageLight: "images/Products/Candles/Merry-Christmas-Light.png",
    imageDark: "images/Products/Candles/Merry-Christmas-Dark.png"
  },
  "candle-6": { 
    id: "candle-6", 
    name: "SIMPLE COOKIE", 
    price: 15.0, 
    imageLight: "images/Products/Candles/Simple-Cookie-Light.png",
    imageDark: "images/Products/Candles/Simple-Cookie-Dark.png"
  },
  "candle-7": { 
    id: "candle-7", 
    name: "SMALL SWAN", 
    price: 32.0, 
    imageLight: "images/Products/Candles/Small-Swan-Light.png",
    imageDark: "images/Products/Candles/Small-Swan-Dark.png"
  },
  "candle-8": { 
    id: "candle-8", 
    name: "MOON BLOOM", 
    price: 29.0, 
    imageLight: "images/Products/Candles/Moon-Bloom-Light.png",
    imageDark: "images/Products/Candles/Moon-Bloom-Dark.png"
  },

  // Diffusers
  "diffuser-1": { 
    id: "diffuser-1", 
    name: "ROOM AND BATHROOM DIFFUSERS", 
    price: 45.0, 
    imageLight: "images/Products/Diffusers/Room-And-Bathroom-Diffusers-Light.png",
    imageDark: "images/Products/Diffusers/Room-And-Bathroom-Diffusers-Dark.png"
  },
  "diffuser-2": { 
    id: "diffuser-2", 
    name: "CAR DIFFUSERS", 
    price: 25.0, 
    imageLight: "images/Products/Diffusers/Car-Diffusers-Light.png",
    imageDark: "images/Products/Diffusers/Car-Diffusers-Dark.png"
  },

  // Jars (now in Candles)
  "jar-1": { 
    id: "jar-1", 
    name: "SEA SHELL", 
    price: 20.0, 
    imageLight: "images/Products/Jars/Sea-Shell-Light.png",
    imageDark: "images/Products/Jars/Sea-Shell-Dark.png"
  },
  "jar-2": { 
    id: "jar-2", 
    name: "DIWALI LADOO", 
    price: 18.0, 
    imageLight: "images/Products/Jars/Diwali-Ladoo-Light.png",
    imageDark: "images/Products/Jars/Diwali-Ladoo-Dark.png"
  },
  "jar-3": { 
    id: "jar-3", 
    name: "FAIRYTALE WALTZ", 
    price: 24.0, 
    imageLight: "images/Products/Jars/Fairytale-Waltz-Light.png",
    imageDark: "images/Products/Jars/Fairytale-Waltz-Dark.png"
  },
  "jar-4": { 
    id: "jar-4", 
    name: "PAINTED TAPER", 
    price: 22.0, 
    imageLight: "images/Products/Jars/Painted-Taper-Light.png",
    imageDark: "images/Products/Jars/Painted-Taper-Dark.png"
  },
  "jar-5": { 
    id: "jar-5", 
    name: "SUNFLOWER BOQUET", 
    price: 26.0, 
    imageLight: "images/Products/Jars/Sunflower-Boquet-Light.png",
    imageDark: "images/Products/Jars/Sunflower-Boquet-Dark.png"
  },
  "jar-6": { 
    id: "jar-6", 
    name: "TULIP BOQUET", 
    price: 28.0, 
    imageLight: "images/Products/Jars/Tulip-Boquet-Light.png",
    imageDark: "images/Products/Jars/Tulip-Boquet-Dark.png"
  },

  // Hampers
  "hamper-1": { id: "hamper-1", name: "LUXURY GIFT HAMPER", price: 55.0, image: "images/hamper2.png" },
  "hamper-2": { id: "hamper-2", name: "SERENITY SCENTS TRIO", price: 42.0, image: "images/hamper1.png" },
  "hamper-3": { id: "hamper-3", name: "FESTIVE SPARKLE BOX", price: 48.0, image: "images/hamper.png" }
};

const PAGE_PRODUCT_MAP = {
    "candles.html": ["candle-3", "candle-2", "candle-1", "candle-4", "candle-5", "candle-6", "candle-7", "candle-8", "jar-5", "jar-2", "jar-3", "jar-4", "jar-1", "jar-6"],
    "diffuser.html": ["diffuser-1", "diffuser-2"],
    "hampers.html": ["hamper-1", "hamper-2", "hamper-3"],
    "jar.html": ["jar-5", "jar-2", "jar-3", "jar-4", "jar-1", "jar-6"] // Legacy support
};

class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cottageCart")) || [];
    this.init();
  }

  init() {
    this.injectCartHTML();
    this.renderCart();
    this.setupEventListeners();
    this.setupThemeObserver();
  }

  setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          this.renderCart();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  injectCartHTML() {
    const cartHTML = `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="cart-drawer" id="cartDrawer">
                <div class="cart-header">
                    <h2>Your Bag</h2>
                    <button class="close-cart-btn" id="closeCart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="cart-items" id="cartItems">
                    <!-- Items injected here -->
                </div>
                <div class="cart-footer">
                    <div class="subtotal-row">
                        <span>Subtotal</span>
                        <span id="cartSubtotal">$0.00</span>
                    </div>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", cartHTML);
  }

  setupEventListeners() {
    // Toggle Button (Nav Icon)
    const cartBtn = document.querySelector('button[aria-label="Shopping cart"]');
    if (cartBtn) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openCart();
      });
    }

    // Close Button & Overlay
    document
      .getElementById("closeCart")
      .addEventListener("click", () => this.closeCart());
    document
      .getElementById("cartOverlay")
      .addEventListener("click", () => this.closeCart());

    // Add To Cart (Product Pages)
    const addBtns = document.querySelectorAll(".add-btn");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.handleAddToCart());
    });

    // Cart Items Container (Delegation)
    const itemsContainer = document.getElementById("cartItems");
    itemsContainer.addEventListener("click", (e) => {
      const target = e.target;
      const itemRow = target.closest(".cart-item");
      if (!itemRow) return;
      const id = itemRow.dataset.id;

      if (target.closest(".plus-btn")) {
        this.updateQuantity(id, 1);
      } else if (target.closest(".minus-btn")) {
        this.updateQuantity(id, -1);
      } else if (target.closest(".remove-item-btn")) {
        this.removeItem(id);
      }
    });

    // Quantity Selector on Product Page (if available) - This just updates display, logic handles actual add
    // Note: The original page static .qty-selector isn't interactive yet. Let's make it interactive?
    // For now, let's just assume qty 1 or implement click handlers if needed.
  }

  // Handle Add from Scroll Page (context based)
  handleAddToCart() {
    const path = window.location.pathname.split("/").pop();
    const productIds = PAGE_PRODUCT_MAP[path];
    
    if (productIds) {
        const index = window.activeProductIndex || 0;
        const productId = productIds[index];
        if (productId) {
            this.handleDirectAdd(productId);
        } else {
            console.error("Product ID not found for index:", index);
        }
    } else {
        // Fallback for pages not in map or if called incorrectly
        console.warn("No product map for this page, check PAGE_PRODUCT_MAP in cart.js");
    }
  }

  // Handle Direct Add by ID (for Collection Pages)
  handleDirectAdd(productId) {
      const product = PRODUCT_DATA[productId];
      if (product) {
          this.addItem(product);
          this.openCart();
      } else {
          console.error("Product not found:", productId);
      }
  }

  addItem(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.renderCart();
  }

  removeItem(id) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(id, change) {
    const item = this.cart.find((item) => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.saveCart();
        this.renderCart();
      }
    }
  }

  saveCart() {
    localStorage.setItem("cottageCart", JSON.stringify(this.cart));
  }

  renderCart() {
    const container = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("cartSubtotal");
    container.innerHTML = "";

    let total = 0;
    const isDark = document.body.classList.contains("dark-theme");

    if (this.cart.length === 0) {
      container.innerHTML =
        '<p class="empty-cart-message">Your bag is empty.</p>';
    } else {
      this.cart.forEach((item) => {
        const data = PRODUCT_DATA[item.id] || item;
        total += item.price * item.quantity;
        const itemImage = isDark
          ? data.imageDark || data.image || item.image
          : data.imageLight || data.image || item.image;

        const html = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${itemImage}" alt="${
          item.name
        }" class="cart-item-image">
                        <div class="cart-item-details">
                            <div>
                                <h3 class="item-name">${item.name}</h3>
                                <div class="item-price">$${item.price.toFixed(
                                  2
                                )}</div>
                            </div>
                            <div class="item-controls">
                                <div class="quantity-controls">
                                    <button class="qty-btn minus-btn">-</button>
                                    <span class="item-qty">${
                                      item.quantity
                                    }</span>
                                    <button class="qty-btn plus-btn">+</button>
                                </div>
                                <button class="remove-item-btn">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
        container.insertAdjacentHTML("beforeend", html);
      });
    }

    subtotalEl.textContent = `$${total.toFixed(2)}`;
  }

  openCart() {
    document.getElementById("cartOverlay").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
  }

  closeCart() {
    document.getElementById("cartOverlay").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
  }
}

// Initialize on load
// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  window.cartInstance = new ShoppingCart();
});

// Global Function for Buy Now Buttons
window.addToCart = function(productId) {
    if (window.cartInstance) {
        window.cartInstance.handleDirectAdd(productId);
    }
};
