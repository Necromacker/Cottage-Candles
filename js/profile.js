const API_BASE = window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5001/api'
    : 'http://localhost:5001/api';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    initTabs();
    loadProfile();
    setupEventListeners();

    // Handle tab from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        const tabBtn = document.querySelector(`.nav-item[data-tab="${tab}"]`);
        if (tabBtn) tabBtn.click();
    }
});

function initTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(tab).classList.add('active');

            // Load specific tab data
            if (tab === 'cart') loadCart();
            if (tab === 'orders') loadOrders();
            if (tab === 'addresses') loadAddresses();
        });
    });
}

async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/user/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to load profile');

        currentUser = await res.json();
        document.getElementById('user-name').innerText = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('user-email').innerText = currentUser.email;

        // Populate form
        document.getElementById('firstName').value = currentUser.firstName;
        document.getElementById('lastName').value = currentUser.lastName;
        document.getElementById('email').value = currentUser.email;
        document.getElementById('contact').value = currentUser.contact || '';
    } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = 'auth.html';
    }
}

function setupEventListeners() {
    // Profile Update
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch(`${API_BASE}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert('Profile updated successfully!');
            loadProfile();
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Address Modal
    const modal = document.getElementById('address-modal');
    const closeBtn = document.querySelector('.close');
    const addBtn = document.getElementById('add-address-btn');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    // Add Address
    const addressForm = document.getElementById('address-form');
    addressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addressForm);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch(`${API_BASE}/user/addresses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            modal.style.display = 'none';
            addressForm.reset();
            loadAddresses();
        }
    });

    // Checkout Button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        handleCheckout();
    });
}

async function loadCart() {
    const res = await fetch(`${API_BASE}/user/cart`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const cart = await res.json();
    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        const isDark = document.body.classList.contains('dark-theme');
        const itemImage = isDark
            ? item.productId?.imageDark || item.productId?.images?.[0]
            : item.productId?.imageLight || item.productId?.images?.[0];

        itemEl.innerHTML = `
            <img src="${itemImage || 'images/placeholder.jpg'}" class="item-img">
            <div class="item-details">
                <h4>${item.productId?.name || 'Product'}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <button class="btn-delete" onclick="removeFromCart('${item._id}')"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(itemEl);
    });

    document.getElementById('cart-total').innerText = `₹${total.toFixed(2)}`;
}

window.removeFromCart = async (id) => {
    await fetch(`${API_BASE}/user/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadCart();
};

async function loadAddresses() {
    const res = await fetch(`${API_BASE}/user/addresses`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const addresses = await res.json();
    const container = document.getElementById('addresses-list');
    container.innerHTML = '';

    addresses.forEach(addr => {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.innerHTML = `
            <p>${addr.street}</p>
            <p>${addr.city}, ${addr.state} - ${addr.zipCode}</p>
            <p>${addr.country}</p>
            <div class="address-actions">
                <button class="btn-delete" onclick="deleteAddress('${addr._id}')">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

window.deleteAddress = async (id) => {
    await fetch(`${API_BASE}/user/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadAddresses();
};

async function loadOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const orders = await res.json();
    const container = document.getElementById('orders-list');
    container.innerHTML = '';

    orders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'order-card';
        orderEl.style = "border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;";
        orderEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; margin-bottom: 10px;">
                <strong>Order #${order._id.slice(-8)}</strong>
                <span>${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
                ${order.items.map(item => `<div>${item.name} x ${item.quantity} - ₹${item.price}</div>`).join('')}
            </div>
            <div style="margin-top: 10px; font-weight: 700;">Total: ₹${order.totalAmount}</div>
            <div style="margin-top: 5px; color: ${order.paymentStatus === 'paid' ? 'green' : 'orange'}">Payment: ${order.paymentStatus}</div>
        `;
        container.appendChild(orderEl);
    });
}

async function handleCheckout() {
    const res = await fetch(`${API_BASE}/user/cart`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const cart = await res.json();
    if (cart.length === 0) return alert('Cart is empty');

    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);

    // Select address
    const addrRes = await fetch(`${API_BASE}/user/addresses`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const addresses = await addrRes.json();
    if (addresses.length === 0) return alert('Please add an address first');

    // For simplicity, pick first address (or show a prompt)
    const selectedAddress = addresses[0];

    // Create Razorpay Order
    const orderRes = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: total })
    });
    const rzpOrder = await orderRes.json();

    // Get Razorpay Key from backend
    const keyRes = await fetch(`${API_BASE}/payments/key`);
    const { key } = await keyRes.json();

    const options = {
        key: key,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Cottage Candles",
        description: "Purchase Candles",
        order_id: rzpOrder.id,
        handler: async function (response) {
            // Verify payment
            const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            if (verifyRes.ok) {
                // Save Order to DB
                await fetch(`${API_BASE}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        items: cart.map(i => ({ productId: i.productId._id, name: i.productId.name, quantity: i.quantity, price: i.price })),
                        totalAmount: total,
                        shippingAddress: selectedAddress,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id
                    })
                });
                alert('Order placed successfully!');
                window.location.reload();
            } else {
                alert('Payment verification failed');
            }
        },
        prefill: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            email: currentUser.email,
            contact: currentUser.contact
        },
        theme: { color: "#d4a373" }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}
