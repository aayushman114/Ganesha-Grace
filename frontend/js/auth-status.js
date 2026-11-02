const AUTH_STATUS_API = "http://127.0.0.1:3000/api";

document.addEventListener("DOMContentLoaded", initializeAuthStatus);

async function initializeAuthStatus() {
    const authStatus = document.getElementById("auth-status");
    const logoutButton = document.getElementById("logout-button");

    // Pages without account controls do not need this script.
    if (!authStatus || !logoutButton) {
        return;
    }

    try {
        const response = await fetch(`${AUTH_STATUS_API}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            showLoggedOutState(authStatus, logoutButton);
            return;
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            showLoggedOutState(authStatus, logoutButton);
            return;
        }

        showLoggedInState(
            authStatus,
            logoutButton,
            result.data
        );

    } catch (error) {
        console.error("Unable to check login status:", error);

        // Keep login and registration links available if the API is offline.
        showLoggedOutState(authStatus, logoutButton);
    }

    logoutButton.addEventListener("click", handleLogout);
}

function showLoggedOutState(authStatus, logoutButton) {
    authStatus.replaceChildren();

    const loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.textContent = "Log In";

    const registerLink = document.createElement("a");
    registerLink.href = "./register.html";
    registerLink.textContent = "Create Account";

    authStatus.append(loginLink, registerLink);

    logoutButton.hidden = true;
}

function showLoggedInState(authStatus, logoutButton, user) {
    authStatus.replaceChildren();

    const accountLink = document.createElement("a");
    accountLink.href = "./account.html";
    accountLink.className = "account-name";
    accountLink.textContent = `Hello, ${user.name}`;

    authStatus.appendChild(accountLink);

    logoutButton.hidden = false;
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

        window.location.href = "./index.html";

    } catch (error) {
        console.error("Logout request failed:", error);

        alert("Unable to contact the server. Please try again.");

        logoutButton.disabled = false;
        logoutButton.textContent = "Log Out";
    }
}