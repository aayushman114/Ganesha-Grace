"use strict";

// ============================================
// GANESHA GRACE - PRODUCT DETAIL PAGE
// ============================================

const API_BASE_URL = "http://127.0.0.1:3000/api";
const CART_STORAGE_KEY = "ganesh-grace-cart";

// HTML Elements
const breadcrumbList = document.getElementById("breadcrumb-list");
const productMainImage = document.getElementById("product-main-image");
const productThumbnails = document.getElementById("product-thumbnails");
const productCategory = document.getElementById("product-category");
const productTitle = document.getElementById("product-title");
const productBrand = document.getElementById("product-brand");
const productRating = document.getElementById("product-rating");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const productStock = document.getElementById("product-stock");
const productMeta = document.getElementById("product-meta");
const quantityInput = document.getElementById("quantity");
const qtyDecreaseBtn = document.getElementById("qty-decrease");
const qtyIncreaseBtn = document.getElementById("qty-increase");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const buyNowBtn = document.getElementById("buy-now-btn");
const relatedProductsGrid = document.getElementById("related-products-grid");
const currentYear = document.getElementById("current-year");
const cartCount = document.getElementById("cart-count");

let cart = new Map();
let currentProduct = null;
let currentImageIndex = 0;
let productImages = [];

// ============================================
// INITIALIZE PAGE
// ============================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        if (!Array.isArray(savedCart)) return new Map();
        return new Map(savedCart.filter(([id, qty]) => Number.isInteger(Number(id)) && Number.isInteger(qty) && Number(id) > 0 && qty > 0).map(([id, qty]) => [Number(id), qty]));
    } catch (e) {
        console.error("Unable to load cart:", e);
        return new Map();
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.from(cart.entries())));
    } catch (e) {
        console.error("Unable to save cart:", e);
    }
}

function updateCartCount() {
    if (!cartCount) return;
    const total = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
    cartCount.textContent = total;
}

// Get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id ? Number(id) : null;
}

// ============================================
// FETCH PRODUCT DATA
// ============================================

async function fetchProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.message || "Product not found");
        }

        return result.data;
    } catch (error) {
        console.error("Failed to fetch product:", error);
        throw error;
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP", { maximumFractionDigits: 2 })}`;
}

function renderBreadcrumb(product) {
    breadcrumbList.replaceChildren();

    // Home
    const homeItem = document.createElement("li");
    homeItem.innerHTML = '<a href="./index.html">Home</a>';
    breadcrumbList.appendChild(homeItem);

    // Category
    if (product.category) {
        const catItem = document.createElement("li");
        catItem.innerHTML = `<a href="./shop.html?category=${product.category.slug}">${product.category.name}</a>`;
        breadcrumbList.appendChild(catItem);
    }

    // Product name (current)
    const productItem = document.createElement("li");
    productItem.setAttribute("aria-current", "page");
    productItem.textContent = product.name;
    breadcrumbList.appendChild(productItem);
}

function renderProductGallery(product) {
    // Build images array from product
    productImages = [];

    if (product.imageUrl) {
        productImages.push(product.imageUrl);
    }

    // Add placeholder images for demo (in real app, these would come from product.images relation)
    // For now, use the main image as all thumbnails
    if (productImages.length === 1) {
        productImages = [
            product.imageUrl,
            product.imageUrl,
            product.imageUrl,
            product.imageUrl
        ];
    }

    currentImageIndex = 0;

    // Render main image
    renderMainImage(productImages[0], product.name);

    // Render thumbnails
    productThumbnails.replaceChildren();
    productImages.forEach((imgSrc, index) => {
        const thumb = document.createElement("button");
        thumb.className = `product-thumb ${index === 0 ? "active" : ""}`;
        thumb.type = "button";
        thumb.setAttribute("aria-label", `View image ${index + 1}`);
        thumb.setAttribute("aria-current", index === 0 ? "true" : "false");
        thumb.innerHTML = `<img src="${imgSrc}" alt="${product.name} - Image ${index + 1}" loading="lazy">`;
        thumb.addEventListener("click", () => switchImage(index));
        productThumbnails.appendChild(thumb);
    });
}

function renderMainImage(src, alt) {
    productMainImage.innerHTML = `<img src="${src}" alt="${alt}" id="main-product-img" loading="eager">`;
}

function switchImage(index) {
    if (index < 0 || index >= productImages.length) return;
    currentImageIndex = index;

    const mainImg = document.getElementById("main-product-img");
    if (mainImg) {
        mainImg.style.opacity = "0";
        setTimeout(() => {
            mainImg.src = productImages[index];
            mainImg.alt = `${currentProduct.name} - Image ${index + 1}`;
            mainImg.style.opacity = "1";
        }, 150);
    }

    // Update active thumbnail
    document.querySelectorAll(".product-thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
        thumb.setAttribute("aria-current", i === index ? "true" : "false");
    });
}

function renderProductInfo(product) {
    // Category
    if (product.category) {
        productCategory.textContent = product.category.name;
        productCategory.style.display = "inline-block";
        productCategory.style.cursor = "pointer";
        productCategory.addEventListener("click", () => {
            window.location.href = `./shop.html?category=${product.category.slug}`;
        });
    } else {
        productCategory.textContent = "";
    }

    // Title
    productTitle.textContent = product.name;

    // Brand
    if (product.brand) {
        const brandName = productBrand.querySelector(".brand-name");
        if (brandName) {
            brandName.textContent = product.brand.name;
            productBrand.style.display = "flex";
            productBrand.style.cursor = "pointer";
            productBrand.addEventListener("click", () => {
                window.location.href = `./shop.html?brand=${product.brand.id}`;
            });
        }
    } else {
        productBrand.style.display = "none";
    }

    // Rating
    renderRating(product.rating);

    // Price
    renderPrice(product);

    // Description
    const descP = productDescription.querySelector("p");
    if (descP) {
        descP.textContent = product.description || "No description available.";
    }

    // Stock
    renderStock(product.stock);

    // Meta
    renderMeta(product);
}

function renderRating(rating) {
    const ratingValue = Number(rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = "";
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<svg class="star full" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    if (hasHalfStar) {
        starsHtml += '<svg class="star half" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<svg class="star empty" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }

    productRating.innerHTML = `
        <div class="rating-stars" aria-label="${ratingValue} out of 5 stars">${starsHtml}</div>
        <span class="rating-value">${ratingValue.toFixed(1)}</span>
        <span class="rating-count">(${ratingValue >= 4 ? "Excellent" : ratingValue >= 3 ? "Good" : "Average"})</span>
    `;
}

function renderPrice(product) {
    const price = Number(product.price);
    const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

    if (originalPrice && originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        productPrice.innerHTML = `
            <span class="current-price">${formatPrice(price)}</span>
            <span class="original-price">${formatPrice(originalPrice)}</span>
            <span class="discount-badge">-${discount}%</span>
        `;
    } else {
        productPrice.innerHTML = `<span class="current-price">${formatPrice(price)}</span>`;
    }
}

function renderStock(stock) {
    const stockCount = Number(stock) || 0;

    if (stockCount <= 0) {
        productStock.innerHTML = '<span class="stock-status out-of-stock">Out of Stock</span>';
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = "Out of Stock";
        buyNowBtn.disabled = true;
        buyNowBtn.textContent = "Unavailable";
        quantityInput.max = 0;
    } else if (stockCount <= 5) {
        productStock.innerHTML = `<span class="stock-status low-stock">Only ${stockCount} left in stock</span>`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> Add to Cart';
        buyNowBtn.disabled = false;
        buyNowBtn.textContent = "Buy Now";
        quantityInput.max = stockCount;
    } else {
        productStock.innerHTML = `<span class="stock-status in-stock">In Stock (${stockCount} available)</span>`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> Add to Cart';
        buyNowBtn.disabled = false;
        buyNowBtn.textContent = "Buy Now";
        quantityInput.max = stockCount;
    }
}

function renderMeta(product) {
    let metaHtml = "";

    if (product.category) {
        metaHtml += `<div class="meta-item"><span class="meta-label">Category:</span> <span class="meta-value">${product.category.name}</span></div>`;
    }

    if (product.brand) {
        metaHtml += `<div class="meta-item"><span class="meta-label">Brand:</span> <span class="meta-value">${product.brand.name}</span></div>`;
    }

    if (product.id) {
        metaHtml += `<div class="meta-item"><span class="meta-label">Product ID:</span> <span class="meta-value">#${product.id}</span></div>`;
    }

    productMeta.innerHTML = metaHtml;
}

// ============================================
// QUANTITY SELECTOR
// ============================================

function initQuantitySelector() {
    qtyDecreaseBtn.addEventListener("click", () => {
        const current = parseInt(quantityInput.value) || 1;
        const min = parseInt(quantityInput.min) || 1;
        if (current > min) {
            quantityInput.value = current - 1;
        }
    });

    qtyIncreaseBtn.addEventListener("click", () => {
        const current = parseInt(quantityInput.value) || 1;
        const max = parseInt(quantityInput.max) || 99;
        if (current < max) {
            quantityInput.value = current + 1;
        }
    });

    quantityInput.addEventListener("change", () => {
        const value = parseInt(quantityInput.value) || 1;
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 99;
        quantityInput.value = Math.max(min, Math.min(max, value));
    });
}

// ============================================
// CART OPERATIONS
// ============================================

function addToCart(productId, quantity) {
    const currentQty = cart.get(productId) || 0;
    const newQty = currentQty + quantity;
    const maxStock = quantityInput.max ? parseInt(quantityInput.max) : 99;

    if (newQty > maxStock) {
        showNotification(`Cannot add more than ${maxStock} items (stock limit).`, "error");
        return false;
    }

    cart.set(productId, newQty);
    saveCart();
    updateCartCount();
    showNotification("Added to cart!", "success");
    return true;
}

function buyNow(productId, quantity) {
    // Add to cart first, then redirect to checkout
    if (addToCart(productId, quantity)) {
        window.location.href = "./checkout.html";
    }
}

function showNotification(message, type = "info") {
    // Remove existing notification
    const existing = document.querySelector(".notification-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `notification-toast ${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// RELATED PRODUCTS
// ============================================

async function fetchRelatedProducts(categoryId, excludeId, limit = 4) {
    try {
        const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}&limit=${limit + 1}&featured=false`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            return [];
        }

        // Filter out current product
        return result.data.filter(p => p.id !== excludeId).slice(0, limit);
    } catch (error) {
        console.error("Failed to fetch related products:", error);
        return [];
    }
}

function renderRelatedProducts(products) {
    relatedProductsGrid.replaceChildren();

    if (products.length === 0) {
        document.getElementById("related-products").style.display = "none";
        return;
    }

    document.getElementById("related-products").style.display = "block";

    products.forEach(product => {
        const card = createProductCard(product);
        relatedProductsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
        <a href="./product.html?id=${product.id}" class="product-link" aria-label="${product.name}">
            <div class="product-image">
                <img src="${product.imageUrl || getPlaceholderImage()}" alt="${product.name}" loading="lazy">
                ${product.onSale ? '<span class="sale-badge">Sale</span>' : ''}
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand?.name || "Ganesha Grace"}</p>
                <div class="product-rating">
                    ${renderRatingStars(product.rating)}
                </div>
                <div class="product-price">
                    ${renderPriceHtml(product)}
                </div>
            </div>
        </a>
        <button class="btn btn-secondary add-to-cart-btn" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
        </button>
    `;

    // Add to cart button handler
    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
    });

    return card;
}

function renderRatingStars(rating) {
    const ratingValue = Number(rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = "";
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<svg class="star full" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    if (hasHalfStar) {
        starsHtml += '<svg class="star half" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<svg class="star empty" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    return starsHtml;
}

function renderPriceHtml(product) {
    const price = Number(product.price);
    const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

    if (originalPrice && originalPrice > price) {
        return `<span class="current-price">${formatPrice(price)}</span><span class="original-price">${formatPrice(originalPrice)}</span>`;
    }
    return `<span class="current-price">${formatPrice(price)}</span>`;
}

function getPlaceholderImage() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23f5efe6' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%239c6474'%3EGanesha Grace%3C/text%3E%3C/svg%3E";
}

// ============================================
// MAIN INITIALIZATION
// ============================================

async function init() {
    // Load cart
    cart = loadCart();
    updateCartCount();

    // Initialize quantity selector
    initQuantitySelector();

    // Get product ID from URL
    const productId = getProductIdFromUrl();

    if (!productId) {
        showErrorState("No product ID specified.");
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        // Fetch product data
        const product = await fetchProduct(productId);
        currentProduct = product;

        // Render product page
        renderBreadcrumb(product);
        renderProductGallery(product);
        renderProductInfo(product);

        // Set up action buttons
        setupActionButtons(product);

        // Fetch and render related products
        if (product.category?.id) {
            const related = await fetchRelatedProducts(product.category.id, product.id);
            renderRelatedProducts(related);
        }

        // Update page title
        document.title = `${product.name} | Ganesha Grace`;

    } catch (error) {
        showErrorState(error.message || "Failed to load product.");
    }
}

function setupActionButtons(product) {
    addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart(product.id, quantity);
    });

    buyNowBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value) || 1;
        buyNow(product.id, quantity);
    });
}

function showLoadingState() {
    productTitle.textContent = "Loading...";
    productPrice.innerHTML = '<span class="loading-skeleton"></span>';
    productDescription.querySelector("p").textContent = "Loading product details...";
}

function showErrorState(message) {
    productMainImage.innerHTML = `<div class="error-state"><p>${message}</p><a href="./shop.html" class="btn btn-primary">Continue Shopping</a></div>`;
    productInfo.style.display = "none";
    document.getElementById("related-products").style.display = "none";
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", init);