// Use centralized config (loaded via config.js script)
const AUTH_API_URL = window.APP_CONFIG?.API_BASE_URL || "http://127.0.0.1:3002/api";

// Get redirect URL from query param
function getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) return redirect;
    return "admin.html";
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
            // Already logged in
            const redirectUrl = getRedirectUrl();
            if (result.data.role === "ADMIN") {
                window.location.href = redirectUrl;
            } else {
                window.location.href = "index.html";
            }
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
    loginButton.textContent = "Signing in...";

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

        // Check if user is admin
        if (result.data.role !== "ADMIN") {
            showLoginMessage("Access denied. Admin privileges required.");
            return;
        }

        showLoginMessage(
            `Welcome, ${result.data.name}! Admin login successful.`,
            true
        );

        // Redirect to admin dashboard after successful login
        window.setTimeout(() => {
            const redirectUrl = getRedirectUrl();
            window.location.href = redirectUrl;
        }, 1200);

    } catch (error) {
        console.error("Admin login request failed:", error);

        showLoginMessage(
            "Unable to connect to the server. Please check your connection."
        );
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Sign In to Dashboard";
    }
});