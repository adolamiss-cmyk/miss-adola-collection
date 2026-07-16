// Shopping Cart Management
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('missAdolaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('missAdolaCart', JSON.stringify(cart));
}

// Add to Cart
document.getElementById('addToCartBtn').addEventListener('click', () => {
    const productId = parseInt(document.getElementById('addToCartBtn').dataset.productId);
    const size = document.getElementById('sizeSelect').value;
    const color = document.getElementById('colorSelect').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if item with same specifications already exists
    const existingItem = cart.find(
        item => item.id === productId && item.size === size && item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            size: size,
            color: color,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    
    // Show success message
    showNotification('Added to cart successfully!');
    
    // Close modal
    document.getElementById('productModal').classList.remove('show');
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const total = document.getElementById('total');

    // Update cart count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Add items to get started!</p>
            </div>
        `;
        shipping.textContent = '$0.00';
        subtotal.textContent = '$0.00';
        total.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = '';
    let subtotalAmount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotalAmount += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size} | Color: ${item.color}</p>
                <p>Qty: ${item.quantity}</p>
                <p class="cart-item-price">$${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Calculate shipping (free over $50)
    const shippingAmount = subtotalAmount > 50 ? 0 : 10;
    const totalAmount = subtotalAmount + shippingAmount;

    subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    shipping.textContent = shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`;
    total.textContent = `$${totalAmount.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart');
}

// Open Cart Sidebar
document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('show');
    document.body.style.overflow = 'hidden';
});

// Close Cart Sidebar
document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close cart when clicking outside
document.getElementById('cartSidebar').addEventListener('click', (e) => {
    if (e.target === document.getElementById('cartSidebar')) {
        document.getElementById('cartSidebar').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Checkout Button
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Here you would integrate with Stripe or PayPal
    // For now, we'll show a checkout form
    alert('Proceeding to checkout...\\n\\nThis is where payment integration (Stripe/PayPal) would be implemented.');
    
    console.log('Cart items for checkout:', cart);
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.querySelector('.contact-form input[type="text"]').value;
    const email = document.querySelector('.contact-form input[type="email"]').value;
    const message = document.querySelector('.contact-form textarea').value;

    console.log('Contact form submitted:', { name, email, message });
    
    // Here you would send the data to your backend
    showNotification('Thank you! Your message has been sent.');
    
    document.getElementById('contactForm').reset();
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
