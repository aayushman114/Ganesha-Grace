const AUTH_API_URL = "http://127.0.0.1:3000/api";

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

        // Redirect to the homepage after successful login.
        window.setTimeout(() => {
            window.location.href = "index.html";
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