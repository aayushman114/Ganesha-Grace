"use strict";

// ============================================
// GANESHA GRACE - CHECKOUT
// ============================================

const API_BASE_URL = "http://127.0.0.1:3000/api";
const CART_STORAGE_KEY = "ganesh-grace-cart";

const cartCount = document.getElementById("cart-count");
const checkoutContent = document.getElementById("checkout-content");
const emptyCheckout = document.getElementById("empty-checkout");
const checkoutItems = document.getElementById("checkout-items");
const checkoutItemCount = document.getElementById("checkout-item-count");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutForm = document.getElementById("checkout-form");
const checkoutMessage = document.getElementById("checkout-message");
const placeOrderButton = document.getElementById("place-order-button");
const currentYear = document.getElementById("current-year");

let products = [];
let cart = new Map();
let submittingOrder = false;

// ============================================
// PRICE FORMAT
// ============================================

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// ============================================
// CART STORAGE
// ============================================

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) {
            return new Map();
        }

        const result = new Map();

        for (const item of savedCart) {
            if (
                !Array.isArray(item) ||
                item.length !== 2 ||
                !Number.isSafeInteger(Number(item[0])) ||
                !Number.isSafeInteger(item[1]) ||
                Number(item[0]) < 1 ||
                item[1] < 1
            ) {
                continue;
            }

            const productId = Number(item[0]);

            // Reject duplicate product IDs in saved cart data.
            if (result.has(productId)) {
                continue;
            }

            result.set(productId, item[1]);
        }

        return result;
    } catch (error) {
        console.error("Unable to read saved cart:", error);
        return new Map();
    }
}

function saveCart() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(Array.from(cart.entries()))
    );

    updateCartCount();
}

function updateCartCount() {
    const total = Array.from(cart.values()).reduce(
        (sum, quantity) => sum + quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = total;
    }
}

// ============================================
// MESSAGES
// ============================================

function showMessage(message, type = "error") {
    if (!checkoutMessage) return;

    checkoutMessage.textContent = message;
    checkoutMessage.className = `checkout-message ${type}`;
    checkoutMessage.hidden = false;
}

function clearMessage() {
    if (!checkoutMessage) return;

    checkoutMessage.textContent = "";
    checkoutMessage.hidden = true;
}

// ============================================
// FORM HELPERS
// ============================================

function getFieldValue(id) {
    const field = document.getElementById(id);

    if (!field) {
        throw new Error(
            `Checkout form field "${id}" was not found. Please check checkout.html.`
        );
    }

    return field.value.trim();
}

// ============================================
// INITIALIZE CHECKOUT
// ============================================

async function initializeCheckout() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Check whether the customer selected Buy Now.
    let buyNowSelection = null;

    try {
        const storedSelection = sessionStorage.getItem("gg_buy_now");

        if (storedSelection) {
            buyNowSelection = JSON.parse(storedSelection);

            if (
                !buyNowSelection ||
                !Number.isInteger(Number(buyNowSelection.productId)) ||
                Number(buyNowSelection.productId) <= 0 ||
                !Number.isInteger(Number(buyNowSelection.quantity)) ||
                Number(buyNowSelection.quantity) <= 0
            ) {
                buyNowSelection = null;
                sessionStorage.removeItem("gg_buy_now");
            }
        }
    } catch (error) {
        console.error("Unable to read Buy Now selection:", error);
        sessionStorage.removeItem("gg_buy_now");
    }
    // Always load the customer's actual saved cart first.
    cart = loadCart();

    // Keep the cart counter accurate.
    updateCartCount();

    // For Buy Now, temporarily use only the selected product
    // for the checkout display and order payload.
    if (buyNowSelection) {
        cart = new Map([
            [
                Number(buyNowSelection.productId),
                Number(buyNowSelection.quantity)
            ]
        ]);
    }

    if (placeOrderButton) {
        placeOrderButton.disabled = true;
        placeOrderButton.textContent = "Loading Checkout...";
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error(`Product API returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid product API response.");
        }

        products = result.data;

        // Verify that the selected Buy Now product exists.
        if (
        buyNowSelection &&
        !products.some(
            product =>
                Number(product.id) ===
                Number(buyNowSelection.productId) &&
                product.isActive &&
                Number(product.stock) > 0
        )
    ) {
        // Keep the Buy Now selection separate.
        // Do not silently switch to the customer's regular cart.
        cart.clear();

        if (checkoutContent) checkoutContent.hidden = true;
        if (emptyCheckout) emptyCheckout.hidden = false;

        showMessage(
            "This product is currently unavailable. Please choose another product."
        );

        if (placeOrderButton) {
            placeOrderButton.disabled = true;
            placeOrderButton.textContent = "Product Unavailable";
        }

        return;
    }

        renderCheckout();
    } catch (error) {
        console.error("Unable to initialize checkout:", error);

        if (checkoutContent) checkoutContent.hidden = true;
        if (emptyCheckout) emptyCheckout.hidden = false;

        showMessage(
            "Unable to load products. Check that the backend server is running, then refresh this page."
        );

        if (placeOrderButton) {
            placeOrderButton.disabled = true;
            placeOrderButton.textContent = "Checkout Unavailable";
        }
    }
}

// ============================================
// RENDER ORDER SUMMARY
// ============================================

function renderCheckout() {
    if (!checkoutItems) return;

    checkoutItems.replaceChildren();

    const availableProducts = products.filter(
        product => product.isActive && Number(product.stock) > 0
    );

    const isBuyNowCheckout =
    sessionStorage.getItem("gg_buy_now") !== null;

    for (const productId of cart.keys()) {
        const product = availableProducts.find(
            item => Number(item.id) === Number(productId)
        );

        if (!product) {
            if (!isBuyNowCheckout) {
                cart.delete(productId);
            }
            continue;
        }

        if (cart.get(productId) > Number(product.stock)) {
            if (!isBuyNowCheckout) {
                cart.set(productId, Number(product.stock));
            }
        }
    }


    // Buy Now must never overwrite the customer's saved cart.

    if (!isBuyNowCheckout) {
        saveCart();
    }

    const cartProducts = availableProducts.filter(
        product => cart.has(product.id)
    );

    if (cartProducts.length === 0) {
        if (checkoutContent) checkoutContent.hidden = true;
        if (emptyCheckout) emptyCheckout.hidden = false;

        if (placeOrderButton) {
            placeOrderButton.disabled = true;
            placeOrderButton.textContent = "Your Cart Is Empty";
        }

        return;
    }

    if (checkoutContent) checkoutContent.hidden = false;
    if (emptyCheckout) emptyCheckout.hidden = true;

    let totalItems = 0;
    let subtotalCents = 0;

    for (const product of cartProducts) {
        const quantity = cart.get(product.id);

        // Convert displayed prices to integer cents for arithmetic.
        const priceCents = Math.round(Number(product.price) * 100);
        const lineTotalCents = priceCents * quantity;

        totalItems += quantity;
        subtotalCents += lineTotalCents;

        const row = document.createElement("div");
        row.className = "checkout-item";

        const details = document.createElement("div");
        details.className = "checkout-item-details";

        const name = document.createElement("p");
        name.className = "checkout-item-name";
        name.textContent = product.name;

        const quantityText = document.createElement("p");
        quantityText.className = "checkout-item-quantity";
        quantityText.textContent = `Qty: ${quantity}`;

        const linePrice = document.createElement("p");
        linePrice.className = "checkout-item-price";
        linePrice.textContent = formatPrice(lineTotalCents / 100);

        details.append(name, quantityText);
        row.append(details, linePrice);
        checkoutItems.appendChild(row);
    }

    if (checkoutItemCount) {
        checkoutItemCount.textContent = totalItems;
    }

    if (checkoutSubtotal) {
        checkoutSubtotal.textContent = formatPrice(subtotalCents / 100);
    }

    if (placeOrderButton && !submittingOrder) {
        placeOrderButton.disabled = false;
        placeOrderButton.textContent = "Place Order";
        placeOrderButton.title = "Place your Cash on Delivery order.";
    }
}
function getIdempotencyKey(payload) {
    const payloadFingerprint = JSON.stringify({
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        postalCode: payload.postalCode,
        paymentMethod: payload.paymentMethod,
        items: [...payload.items].sort(
            (a, b) => a.productId - b.productId
        )
    });

    const savedAttempt = sessionStorage.getItem(
        "gg_checkout_attempt"
    );

    if (savedAttempt) {
        try {
            const attempt = JSON.parse(savedAttempt);

            if (
                attempt.key &&
                attempt.fingerprint === payloadFingerprint
            ) {
                return attempt.key;
            }
        } catch (error) {
            console.error("Invalid checkout attempt:", error);
        }
    }

    const key = crypto.randomUUID();

    sessionStorage.setItem(
        "gg_checkout_attempt",
        JSON.stringify({
            key,
            fingerprint: payloadFingerprint
        })
    );

    return key;
}

// ============================================
// SUBMIT ORDER
// ============================================

async function submitOrder(event) {
    event.preventDefault();

    if (submittingOrder) return;
    const isBuyNowCheckout = sessionStorage.getItem("gg_buy_now") !== null;

    clearMessage();

    if (cart.size === 0) {
        showMessage("Your cart is empty.");
        return;
    }

    let payload;

    try {
        payload = {
        customerName: getFieldValue("customer-name"),
        email: getFieldValue("customer-email"),
        phone: getFieldValue("customer-phone"),
        address: getFieldValue("delivery-address"),
        city: getFieldValue("delivery-city"),
        postalCode: getFieldValue("delivery-postal"),
        paymentMethod: "COD",
        items: Array.from(cart.entries()).map(
            ([productId, quantity]) => ({
                productId,
                quantity
            })
        )
    };
    } catch (error) {
        showMessage(error.message);
        return;
    }

    submittingOrder = true;
    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Placing Order...";

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Idempotency-Key": getIdempotencyKey(payload)
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error("The server returned an invalid response.");
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to place your order."
            );
        }


    const order = result.data;
    sessionStorage.removeItem("gg_checkout_attempt");

    // Clear only the purchase selection that was successfully submitted.
    if (isBuyNowCheckout) {
    // Buy Now: preserve the regular saved cart.
    sessionStorage.removeItem("gg_buy_now");

    cart = loadCart();
    updateCartCount();
    } else {
        // Normal cart checkout: clear the purchased cart.
        cart.clear();
        saveCart();
    }

    checkoutForm.reset();

    // Prevent another submission while redirecting.
    placeOrderButton.textContent = "Order Placed";
    placeOrderButton.disabled = true;

    // Open the dedicated confirmation page for this order.
    const confirmationUrl = new URL(
        "./order-confirmation.html",
        window.location.href
    );

    confirmationUrl.searchParams.set("orderNumber", order.orderNumber);

    window.location.assign(confirmationUrl.href);
    return;

    } catch (error) {
        console.error("Order submission failed:", error);

        showMessage(
            error.message ||
            "Unable to place your order. Please try again."
        );

        placeOrderButton.disabled = false;
        placeOrderButton.textContent = "Try Again";
    } finally {
        submittingOrder = false;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

if (checkoutForm) {
    checkoutForm.addEventListener("submit", submitOrder);
}

// ============================================
// START
// ============================================

initializeCheckout();