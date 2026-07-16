// Main JavaScript for general functionality

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality (placeholder)
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = prompt('What are you looking for?');
    if (query) {
        console.log('Searching for:', query);
        showNotification(`Searching for "${query}"...`);
    }
});

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Add active class to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active class styling to CSS
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--secondary-color) !important;
        border-bottom: 2px solid var(--secondary-color);
    }
`;
document.head.appendChild(style);

// Handle window resize to close mobile menu
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
        }
        lastWidth = window.innerWidth;
    }
});

// Analytics tracking (can be integrated with Google Analytics)
function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
    // Integrate with your analytics service here
}

// Track product views
document.addEventListener('click', (e) => {
    if (e.target.closest('.product-card')) {
        const productName = e.target.closest('.product-card').querySelector('.product-name').textContent;
        trackEvent('product_viewed', { product: productName });
    }
});

// Track add to cart
const originalAddToCart = document.getElementById('addToCartBtn')?.onclick;
document.addEventListener('click', (e) => {
    if (e.target.id === 'addToCartBtn') {
        const productName = document.getElementById('modalProductName').textContent;
        const price = document.getElementById('modalProductPrice').textContent;
        trackEvent('add_to_cart', { product: productName, price: price });
    }
});

// Notification System (already used in cart.js, adding global function)
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Add to Window object for global access
window.removeFromCart = removeFromCart;
window.openProductModal = openProductModal;

// Performance: Debounce scroll events
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

// Accessibility: Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes modal and cart
    if (e.key === 'Escape') {
        document.getElementById('productModal').classList.remove('show');
        document.getElementById('cartSidebar').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Add ARIA labels for better accessibility
document.querySelectorAll('button').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
        const text = btn.textContent.trim() || btn.title;
        if (text) btn.setAttribute('aria-label', text);
    }
});

// Console message for developers
console.log('%cMiss Adola Collections', 'font-size: 20px; font-weight: bold; color: #ff006e;');
console.log('%cElegance Meets Bold', 'font-size: 14px; color: #d4af37; font-style: italic;');
console.log('%cPowered by HTML, CSS & JavaScript', 'color: #666;');

// Version info
const siteVersion = '1.0.0';
console.log(`Site Version: ${siteVersion}`);
