"use strict";

// ============================================
// GANESH GRACE - FRONTEND APPLICATION
// ============================================

const API_BASE_URL = "http://localhost:3000/api";

const currentYear = document.getElementById("current-year");
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");

// ============================================
// INITIALIZE PAGE
// ============================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ============================================
// SHOPPING CART - PERSISTED IN LOCAL STORAGE
// ============================================

const CART_STORAGE_KEY = "ganesh-grace-cart";

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) {
            return new Map();
        }

        return new Map(
            savedCart
                .filter(
                    ([id, quantity]) =>
                        Number.isInteger(Number(id)) &&
                        Number.isInteger(quantity) &&
                        Number(id) > 0 &&
                        quantity > 0
                )
                .map(([id, quantity]) => [Number(id), quantity])
        );
    } catch (error) {
        console.error("Unable to load saved cart:", error);
        return new Map();
    }
}

const cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(Array.from(cart.entries()))
        );
    } catch (error) {
        console.error("Unable to save cart:", error);
    }
}

// ============================================
// FORMAT PRICE
// ============================================

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP")}`;
}

// ============================================
// FETCH PRODUCTS FROM BACKEND
// ============================================

async function fetchProducts() {
    if (!productGrid) {
        console.error("Product grid element not found.");
        return;
    }

    productGrid.textContent = "Loading products...";

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid product response from API.");
        }

        renderProducts(result.data);

    } catch (error) {
        console.error("Unable to load products:", error);

        productGrid.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "We couldn't load our products. Please try again.";

        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.textContent = "Retry";
        retryButton.addEventListener("click", fetchProducts);

        productGrid.append(message, retryButton);
    }
}

// ============================================
// RENDER PRODUCT CARDS
// ============================================

function renderProducts(products) {
    productGrid.replaceChildren();

    if (products.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No products are available right now.";

        productGrid.appendChild(message);
        return;
    }

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        // Product image
        const image = document.createElement("img");

        image.className = "product-image";
        image.src = `./images/${getProductImage(product)}`;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.removeAttribute("src");
            image.alt = `${product.name} image unavailable`;
        }, { once: true });

        // Product information container
        const info = document.createElement("div");
        info.className = "product-info";

        // Brand
        const brand = document.createElement("p");
        brand.className = "product-brand";
        brand.textContent = product.brand?.name || "Ganesh Grace"

        // Product name
        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        // Rating
        const rating = document.createElement("p");
        rating.className = "product-rating";

        if (Number.isFinite(Number(product.rating))) {
            rating.textContent =
                `★ ${Number(product.rating).toFixed(1)} / 5`;
        } else {
            rating.textContent = "New arrival";
        }

        // Price
        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        // Product action buttons
        const productActions = document.createElement("div");
        productActions.className = "product-actions";

        // Add to Cart button
        const addToCartButton = document.createElement("button");

        addToCartButton.className = "add-to-cart";
        addToCartButton.type = "button";
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        // Buy Now button
        const buyNowButton = document.createElement("button");

        buyNowButton.className = "buy-now";
        buyNowButton.type = "button";
        buyNowButton.textContent = "Buy Now";

        buyNowButton.addEventListener("click", () => {
            buyNow(product.id);
        });

        productActions.append(addToCartButton, buyNowButton);

        info.append(brand, name, rating, price, productActions);
        card.append(image, info);

        productGrid.appendChild(card);
    });
}

// ============================================
// TEMPORARY PRODUCT IMAGE MAPPING
// ============================================

function getProductImage(product) {
    const imageNames = {
        1: "cleanser.jpg",
        2: "moisturizer.jpg",
        3: "serum.jpg",
        4: "sunscreen.jpg"
    };

    return imageNames[product.id] || "placeholder.jpg";
}

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================

function addToCart(productId) {
    const currentQuantity = cart.get(productId) || 0;

    cart.set(productId, currentQuantity + 1);

    saveCart();
    updateCartCount();

    console.log("Cart updated:", Array.from(cart.entries()));
}

function buyNow(productId) {
    const checkoutSelection = {
        productId: Number(productId),
        quantity: 1
    };

    try {
        sessionStorage.setItem(
            "gg_buy_now",
            JSON.stringify(checkoutSelection)
        );

        window.location.href = "./checkout.html";
    } catch (error) {
        console.error("Unable to prepare Buy Now checkout:", error);
        alert("Unable to start checkout. Please try again.");
    }
}

function updateCartCount() {
    if (!cartCount) return;

    const totalItems = Array.from(cart.values()).reduce(
        (total, quantity) => total + quantity,
        0
    );

    cartCount.textContent = totalItems;
}

function getCartSubtotal(products) {
    return products.reduce((total, product) => {
        const quantity = cart.get(product.id) || 0;

        return total + Number(product.price) * quantity;
    }, 0);
}

// ============================================
// START APPLICATION
// ============================================

fetchProducts();
updateCartCount();