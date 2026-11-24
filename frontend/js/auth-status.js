// Use centralized config (loaded via config.js script)
const AUTH_STATUS_API = window.APP_CONFIG?.API_BASE_URL || "http://127.0.0.1:3002/api";
const CART_STORAGE_KEY = window.APP_CONFIG?.CART_STORAGE_KEY || "ganesh-grace-cart";

// Run immediately (scripts have defer, so DOM is ready)
initializeAuthStatus();
initializeCartCount();

async function initializeAuthStatus() {
    const authStatus = document.getElementById("auth-status");
    const logoutButton = document.getElementById("logout-button");
    const myOrdersLink = document.getElementById("my-orders-link");
    const adminLink = document.getElementById("admin-link");

    // Pages without account controls do not need this script.
    if (!authStatus || !logoutButton) {
        console.log("[auth-status] Required elements not found, skipping");
        return;
    }

    try {
        const response = await fetch(`${AUTH_STATUS_API}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            console.log("[auth-status] Not logged in (response not ok)");
            showLoggedOutState(authStatus, logoutButton, myOrdersLink, adminLink);
            return;
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            console.log("[auth-status] Not logged in (no data)");
            showLoggedOutState(authStatus, logoutButton, myOrdersLink, adminLink);
            return;
        }

        console.log("[auth-status] Logged in as:", result.data.name, result.data.role);
        showLoggedInState(
            authStatus,
            logoutButton,
            myOrdersLink,
            adminLink,
            result.data
        );

    } catch (error) {
        console.error("[auth-status] Unable to check login status:", error);

        // Keep login and registration links available if the API is offline.
        showLoggedOutState(authStatus, logoutButton, myOrdersLink, adminLink);
    }

    logoutButton.addEventListener("click", handleLogout);
}

function showLoggedOutState(authStatus, logoutButton, myOrdersLink, adminLink) {
    authStatus.replaceChildren();

    const loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.id = "account-link";
    loginLink.textContent = "Log In";

    const registerLink = document.createElement("a");
    registerLink.href = "./register.html";
    registerLink.id = "register-link";
    registerLink.textContent = "Create Account";

    authStatus.append(loginLink, registerLink);

    logoutButton.hidden = true;

    // Hide My Orders link when logged out
    if (myOrdersLink) {
        myOrdersLink.hidden = true;
    }

    // Hide admin link when logged out
    if (adminLink) {
        adminLink.hidden = true;
    }
}

function showLoggedInState(authStatus, logoutButton, myOrdersLink, adminLink, user) {
    authStatus.replaceChildren();

    const accountLink = document.createElement("a");
    accountLink.href = "./my-orders.html";
    accountLink.className = "account-name";
    accountLink.textContent = `Hello, ${user.name}`;

    authStatus.appendChild(accountLink);

    logoutButton.hidden = false;

    // Show My Orders link when logged in
    if (myOrdersLink) {
        myOrdersLink.hidden = false;
    }

    // Show admin link for admin users
    if (adminLink) {
        if (user.role === "ADMIN") {
            adminLink.hidden = false;
        } else {
            adminLink.hidden = true;
        }
    }
}

async function handleLogout() {
    const logoutButton = document.getElementById("logout-button");

    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    try {
        const response = await fetch(`${AUTH_STATUS_API}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Unable to log out.");
            logoutButton.disabled = false;
            logoutButton.textContent = "Log Out";
            return;
        }

        // Clear cart on logout (use key from centralized config)
        const cartStorageKey = window.APP_CONFIG?.CART_STORAGE_KEY || "ganesh-grace-cart";
        localStorage.removeItem(cartStorageKey);

        window.location.href = "./index.html";

    } catch (error) {
        console.error("Logout request failed:", error);

        alert("Unable to contact the server. Please try again.");

        logoutButton.disabled = false;
        logoutButton.textContent = "Log Out";
    }
}

function initializeCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        const totalItems = Array.isArray(savedCart)
            ? savedCart.reduce((total, [, quantity]) => total + Number(quantity), 0)
            : 0;
        cartCount.textContent = totalItems;
    } catch (error) {
        console.error("Unable to load cart count:", error);
        cartCount.textContent = 0;
    }
}

// Export for other scripts to use
window.updateCartCount = initializeCartCount;