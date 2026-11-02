"use strict";

// ============================================
// GANESH GRACE - SHOPPING CART
// ============================================

const API_BASE_URL = "http://localhost:3000/api";
const CART_STORAGE_KEY = "ganesh-grace-cart";

// HTML elements
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartContent = document.getElementById("cart-content");
const emptyCart = document.getElementById("empty-cart");
const summaryItems = document.getElementById("summary-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const checkoutButton = document.getElementById("checkout-button");
const currentYear = document.getElementById("current-year");

// Product image mapping
const productImages = {
    1: "cleanser.jpg",
    2: "moisturizer.jpg",
    3: "serum.jpg",
    4: "sunscreen.jpg"
};

// ============================================
// LOAD AND SAVE CART
// ============================================

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
                .filter(([id, quantity]) =>
                    Number.isInteger(Number(id)) &&
                    Number.isInteger(quantity) &&
                    Number(id) > 0 &&
                    quantity > 0
                )
                .map(([id, quantity]) => [Number(id), quantity])
        );
    } catch (error) {
        console.error("Unable to load cart:", error);
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
        return true;
    } catch (error) {
        console.error("Unable to save cart:", error);
        alert("Unable to save your cart. Please check your browser storage.");
        return false;
    }
}

// ============================================
// FORMAT PRICE
// ============================================

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP", {
        maximumFractionDigits: 2
    })}`;
}

// ============================================
// UPDATE CART COUNT
// ============================================

function updateCartCount() {
    const totalItems = Array.from(cart.values()).reduce(
        (total, quantity) => total + quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// ============================================
// PRODUCT IMAGE
// ============================================

function getProductImage(product) {
    return productImages[product.id] || "placeholder.jpg";
}

// ============================================
// FETCH PRODUCTS AND RENDER CART
// ============================================

async function initializeCart() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    updateCartCount();

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid product response from API.");
        }

        renderCart(result.data);

    } catch (error) {
        console.error("Unable to load cart products:", error);

        cartContent.hidden = false;
        emptyCart.hidden = true;
        cartItemsContainer.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "Unable to load your cart products. Make sure the backend server is running and try refreshing.";

        cartItemsContainer.appendChild(message);
    }
}

// ============================================
// RENDER CART
// ============================================

function renderCart(products) {
    cartItemsContainer.replaceChildren();

    // Keep only products that still exist and are active.
    const availableProducts = products.filter(
        product => product.isActive && Number(product.stock) > 0
    );

    for (const productId of cart.keys()) {
        const product = availableProducts.find(
            item => item.id === productId
        );

        if (!product) {
            cart.delete(productId);
            continue;
        }

        // Prevent quantities exceeding the current stock.
        if (cart.get(productId) > product.stock) {
            cart.set(productId, product.stock);
        }
    }

    saveCart();
    updateCartCount();

    const cartProducts = availableProducts.filter(
        product => cart.has(product.id)
    );

    if (cartProducts.length === 0) {
        cartContent.hidden = true;
        emptyCart.hidden = false;

        updateSummary(0, 0);
        return;
    }

    cartContent.hidden = false;
    emptyCart.hidden = true;

    let totalItems = 0;
    let subtotal = 0;

    cartProducts.forEach(product => {
        const quantity = cart.get(product.id);
        const price = Number(product.price);
        const stock = Number(product.stock);

        totalItems += quantity;
        subtotal += price * quantity;

        const item = document.createElement("article");
        item.className = "cart-item";

        // Product image
        const image = document.createElement("img");
        image.className = "cart-item-image";
        image.src = `./images/${getProductImage(product)}`;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.removeAttribute("src");
            image.alt = `${product.name} image unavailable`;
        }, { once: true });

        // Product details
        const details = document.createElement("div");
        details.className = "cart-item-details";

        const brand = document.createElement("p");
        brand.className = "product-brand";
        brand.textContent = product.brand?.name || "Ganesh Grace";

        const name = document.createElement("h3");
        name.className = "cart-item-name";
        name.textContent = product.name;

        const unitPrice = document.createElement("p");
        unitPrice.className = "cart-item-price";
        unitPrice.textContent = formatPrice(price);

        const lineTotal = document.createElement("p");
        lineTotal.className = "cart-item-total";
        lineTotal.textContent = `Total: ${formatPrice(price * quantity)}`;

        // Quantity controls
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            `Decrease quantity of ${product.name}`
        );
        decreaseButton.disabled = quantity <= 1;

        decreaseButton.addEventListener("click", () => {
            changeQuantity(product.id, -1, products);
        });

        const quantityDisplay = document.createElement("span");
        quantityDisplay.textContent = quantity;
        quantityDisplay.setAttribute("aria-label", "Quantity");

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            `Increase quantity of ${product.name}`
        );
        increaseButton.disabled = quantity >= stock;

        increaseButton.addEventListener("click", () => {
            changeQuantity(product.id, 1, products);
        });

        quantityControls.append(
            decreaseButton,
            quantityDisplay,
            increaseButton
        );

        // Remove button
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-cart-item";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${product.name} from cart`
        );

        removeButton.addEventListener("click", () => {
            removeFromCart(product.id, products);
        });

        details.append(
            brand,
            name,
            unitPrice,
            quantityControls,
            lineTotal,
            removeButton
        );

        item.append(image, details);
        cartItemsContainer.appendChild(item);
    });

    updateSummary(totalItems, subtotal);

    // Checkout is not implemented yet.
    if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.title = "Checkout has not been implemented yet.";
    }
}

// ============================================
// CHANGE QUANTITY
// ============================================

function changeQuantity(productId, change, products) {
    const currentQuantity = cart.get(productId) || 0;

    const product = products.find(
        item => item.id === productId
    );

    if (!product || !product.isActive) {
        alert("This product is currently unavailable.");
        return;
    }

    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
        return;
    }

    if (newQuantity > product.stock) {
        alert(`Only ${product.stock} units are currently in stock.`);
        return;
    }

    cart.set(productId, newQuantity);

    if (saveCart()) {
        renderCart(products);
    }
}

// ============================================
// REMOVE PRODUCT
// ============================================

function removeFromCart(productId, products) {
    cart.delete(productId);

    if (saveCart()) {
        renderCart(products);
    }
}

// ============================================
// UPDATE ORDER SUMMARY
// ============================================

function updateSummary(totalItems, subtotal) {
    if (summaryItems) {
        summaryItems.textContent = totalItems;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }
}

// ============================================
// START APPLICATION
// ============================================

initializeCart();