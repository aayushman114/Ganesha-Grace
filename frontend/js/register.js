const AUTH_API_URL = "http://localhost:3000/api";

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
            window.location.href = "login.html";
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