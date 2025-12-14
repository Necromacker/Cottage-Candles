// Cart Data Definitions mapped by Page URL (roughly)
// Since we have specific pages for regular products, we can define the data here.
const PRODUCT_DATA = {
  "candles.html": [
    {
      id: "candle-1",
      name: "Sweet Strawberry",
      price: 32.0,
      image: "images/Product-1.png",
    },
    {
      id: "candle-2",
      name: "Cold Brew Classic",
      price: 28.0,
      image: "images/Product-2.png",
    },
    {
      id: "candle-3",
      name: "Strawberry Shortcake",
      price: 30.0,
      image: "images/Product-3.png",
    },
  ],
  "diffuser.html": [
    {
      id: "diffuser-1",
      name: "Wild Berry Mist",
      price: 45.0,
      image: "images/diffuser1.png",
    },
    {
      id: "diffuser-2",
      name: "Calming Brew",
      price: 42.0,
      image: "images/diffuser2.png",
    },
    {
      id: "diffuser-3",
      name: "Vanilla Bean",
      price: 48.0,
      image: "images/diffuser3.png",
    },
  ],
  "hamper.html": [
    {
      id: "hamper-1",
      name: "Luxury Spa Collection",
      price: 85.0,
      image: "images/hamper.png",
    },
    {
      id: "hamper-2",
      name: "Evening Unwind",
      price: 65.0,
      image: "images/hamper2.png",
    },
    {
      id: "hamper-3",
      name: "Festive Joy",
      price: 95.0,
      image: "images/hamper1.png",
    },
  ],
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

  handleAddToCart() {
    // 1. Identify Page
    const path = window.location.pathname.split("/").pop();
    const pageData = PRODUCT_DATA[path] || PRODUCT_DATA["candles.html"]; // Fallback

    // 2. Identify Active Product Index
    // JS files need to update window.activeProductIndex
    const index = window.activeProductIndex || 0;

    if (pageData && pageData[index]) {
      const product = pageData[index];
      this.addItem(product);
      this.openCart();
    } else {
      console.error("Product data not found for index:", index);
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

    if (this.cart.length === 0) {
      container.innerHTML =
        '<p class="empty-cart-message">Your bag is empty.</p>';
    } else {
      this.cart.forEach((item) => {
        total += item.price * item.quantity;
        const html = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${
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
document.addEventListener("DOMContentLoaded", () => {
  new ShoppingCart();
});
