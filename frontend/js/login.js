// Use centralized config (loaded via config.js script)
const AUTH_API_URL = window.APP_CONFIG?.API_BASE_URL || "http://127.0.0.1:3002/api";

// Get redirect URL from query param or referrer
function getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) return redirect;

    // Fallback: use document.referrer if it's a local page
    if (document.referrer && document.referrer.startsWith(window.location.origin)) {
        try {
            const referrerUrl = new URL(document.referrer);
            // Don't redirect to login/register pages
            if (!referrerUrl.pathname.includes("login") && !referrerUrl.pathname.includes("register")) {
                return referrerUrl.pathname + referrerUrl.search;
            }
        } catch (e) {}
    }

    return null;
}

// Check if already logged in and redirect
async function checkAuthAndRedirect() {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include"
        });
        const result = await response.json();
        if (response.ok && result.success && result.data) {
            // Already logged in, redirect to intended page or role-based default
            const redirectUrl = getRedirectUrl() || (result.data.role === "ADMIN" ? "admin.html" : "index.html");
            window.location.href = redirectUrl;
            return true;
        }
    } catch (error) {
        // Not logged in, continue
    }
    return false;
}

// Run auth check before showing login form
checkAuthAndRedirect();

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

function showLoginMessage(message, isSuccess = false) {
    loginMessage.hidden = false;
    loginMessage.textContent = message;
    loginMessage.style.color = isSuccess ? "#247447" : "#b42318";
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showLoginMessage("Please enter your email and password.");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        const response = await fetch(`${AUTH_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            showLoginMessage(
                result.message || "Unable to log in. Please try again."
            );
            return;
        }

        showLoginMessage(
            `Welcome back, ${result.data.name}! Login successful.`,
            true
        );


        // Redirect using redirect parameter or role-based default
        const redirectUrl = getRedirectUrl() || (result.data.role === "ADMIN" ? "admin.html" : "index.html");
        window.setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1200);

    } catch (error) {
        console.error("Login request failed:", error);

        showLoginMessage(
            "Unable to connect to the server. Please check your connection."
        );
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Log In";
    }
});