// Sample Products Data
const products = [
    {
        id: 1,
        name: "Luxe Black Bikini",
        category: "bikinis",
        price: 89.99,
        originalPrice: 129.99,
        description: "An elegant black bikini set featuring premium fabric with a bold, confident cut. Perfect for beach days or pool parties.",
        badge: "Sale"
    },
    {
        id: 2,
        name: "Gold Luxury One-Piece",
        category: "one-piece",
        price: 149.99,
        originalPrice: 199.99,
        description: "Stunning gold one-piece swimsuit with a sophisticated design. Offers perfect coverage and comfort.",
        badge: "Sale"
    },
    {
        id: 3,
        name: "Silk Lingerie Set",
        category: "lingerie",
        price: 119.99,
        originalPrice: null,
        description: "Luxurious silk lingerie set designed for ultimate comfort and elegance. Perfect for special occasions.",
        badge: null
    },
    {
        id: 4,
        name: "Beach Cover-Up",
        category: "accessories",
        price: 59.99,
        originalPrice: null,
        description: "Stylish beach cover-up that complements any swimwear. Made with breathable material.",
        badge: null
    },
    {
        id: 5,
        name: "Bold Pink Bikini",
        category: "bikinis",
        price: 94.99,
        originalPrice: 134.99,
        description: "Make a statement with this bold pink bikini. Perfect for the confident woman.",
        badge: "Sale"
    },
    {
        id: 6,
        name: "Navy One-Piece",
        category: "one-piece",
        price: 139.99,
        originalPrice: null,
        description: "Timeless navy one-piece with elegant detailing. Classic and sophisticated.",
        badge: null
    },
    {
        id: 7,
        name: "Lace Lingerie Bra",
        category: "lingerie",
        price: 79.99,
        originalPrice: null,
        description: "Delicate lace bra with premium support. Elegant and comfortable design.",
        badge: null
    },
    {
        id: 8,
        name: "Beach Hat",
        category: "accessories",
        price: 44.99,
        originalPrice: null,
        description: "Stylish beach hat to protect you from the sun while looking fabulous.",
        badge: null
    },
    {
        id: 9,
        name: "Metallic Gold Bikini",
        category: "bikinis",
        price: 104.99,
        originalPrice: 154.99,
        description: "Eye-catching metallic gold bikini for those who love to shine.",
        badge: "Sale"
    },
    {
        id: 10,
        name: "White Elegant One-Piece",
        category: "one-piece",
        price: 144.99,
        originalPrice: null,
        description: "Pure and elegant white one-piece swimsuit. Timeless beauty.",
        badge: null
    },
    {
        id: 11,
        name: "Black Lace Lingerie Set",
        category: "lingerie",
        price: 129.99,
        originalPrice: 179.99,
        description: "Premium black lace lingerie set. Elegant, bold, and luxurious.",
        badge: "Sale"
    },
    {
        id: 12,
        name: "Sunglasses",
        category: "accessories",
        price: 89.99,
        originalPrice: null,
        description: "UV-protected sunglasses with elegant frames. Complete your beach look.",
        badge: null
    }
];

// Display Products
function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No products found in this category.</p>
            </div>\n        `;\n        return;\n    }\n\n    filteredProducts.forEach(product => {\n        const productCard = document.createElement('div');\n        productCard.className = 'product-card';\n        productCard.innerHTML = `\n            <div class=\"product-image\">\n                <div class=\"image-placeholder\">\n                    <i class=\"fas fa-image\"></i>\n                </div>\n                ${product.badge ? `<span class=\"product-badge\">${product.badge}</span>` : ''}\n            </div>\n            <div class=\"product-info\">\n                <h3 class=\"product-name\">${product.name}</h3>\n                <p class=\"product-category\">${product.category}</p>\n                <div class=\"product-rating\">\n                    <i class=\"fas fa-star\"></i>\n                    <i class=\"fas fa-star\"></i>\n                    <i class=\"fas fa-star\"></i>\n                    <i class=\"fas fa-star\"></i>\n                    <i class=\"fas fa-star-half-alt\"></i>\n                    <span>(${Math.floor(Math.random() * 200) + 50} reviews)</span>\n                </div>\n                <div class=\"product-price-section\">\n                    <span class=\"product-price\">$${product.price.toFixed(2)}</span>\n                    ${product.originalPrice ? `<span class=\"product-original-price\">$${product.originalPrice.toFixed(2)}</span>` : ''}\n                </div>\n                <button class=\"product-action-btn\" onclick=\"openProductModal(${product.id})\">View & Buy</button>\n            </div>\n        `;\n        productsGrid.appendChild(productCard);\n    });\n}\n\n// Open Product Modal\nfunction openProductModal(productId) {\n    const product = products.find(p => p.id === productId);\n    if (!product) return;\n\n    document.getElementById('modalProductName').textContent = product.name;\n    document.getElementById('modalProductCategory').textContent = product.category;\n    document.getElementById('modalProductDescription').textContent = product.description;\n    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;\n    document.getElementById('modalProductOriginalPrice').textContent = product.originalPrice \n        ? `$${product.originalPrice.toFixed(2)}` \n        : '';\n\n    // Store current product ID for add to cart\n    document.getElementById('addToCartBtn').dataset.productId = productId;\n\n    // Reset selections\n    document.getElementById('sizeSelect').value = 'M';\n    document.getElementById('colorSelect').value = 'Black';\n    document.getElementById('quantityInput').value = 1;\n\n    // Show modal\n    document.getElementById('productModal').classList.add('show');\n}\n\n// Close Product Modal\ndocument.getElementById('closeModal').addEventListener('click', () => {\n    document.getElementById('productModal').classList.remove('show');\n});\n\n// Close modal when clicking outside\ndocument.getElementById('productModal').addEventListener('click', (e) => {\n    if (e.target === document.getElementById('productModal')) {\n        document.getElementById('productModal').classList.remove('show');\n    }\n});\n\n// Filter Products\ndocument.querySelectorAll('.filter-btn').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));\n        e.target.classList.add('active');\n        displayProducts(e.target.dataset.filter);\n    });\n});\n\n// Initialize products on page load\ndocument.addEventListener('DOMContentLoaded', () => {\n    displayProducts();\n});
