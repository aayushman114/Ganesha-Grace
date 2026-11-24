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

// Run auth check before showing register form
checkAuthAndRedirect();

const registerForm = document.getElementById("register-form");
const registerButton = document.getElementById("register-button");
const registerMessage = document.getElementById("register-message");

function showRegisterMessage(message, isSuccess = false) {
    registerMessage.hidden = false;
    registerMessage.textContent = message;
    registerMessage.style.color = isSuccess ? "#247447" : "#b42318";
}

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (name.length < 2) {
        showRegisterMessage("Please enter your full name.");
        return;
    }

    if (new TextEncoder().encode(password).length > 72) {
        showRegisterMessage("Your password is too long. Please use a shorter password.");
        return;
    }

    if (password.length < 8) {
        showRegisterMessage("Your password must contain at least 8 characters.");
        return;
    }

    if (password !== confirmPassword) {
        showRegisterMessage("The passwords do not match.");
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";

    try {
        const response = await fetch(`${AUTH_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            showRegisterMessage(
                result.message || "Unable to create your account."
            );
            return;
        }

        registerForm.reset();

        showRegisterMessage(
            "Your account was created successfully! Redirecting to login...",
            true
        );

        window.setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect");
            window.location.href = redirect ? `login.html?redirect=${encodeURIComponent(redirect)}` : "login.html";
        }, 1500);

    } catch (error) {
        console.error("Registration request failed:", error);

        showRegisterMessage(
            "Unable to connect to the server. Please check that the backend is running."
        );
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});