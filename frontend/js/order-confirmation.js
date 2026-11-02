const ORDER_API_URL = "http://127.0.0.1:3000/api";

document.addEventListener("DOMContentLoaded", loadOrderConfirmation);

async function loadOrderConfirmation() {
    const title = document.getElementById("confirmation-title");
    const message = document.getElementById("confirmation-message");
    const details = document.getElementById("order-details");

    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get("orderNumber");

    if (!orderNumber || orderNumber.length > 100) {
        title.textContent = "Order Not Found";
        message.textContent =
            "No valid order number was provided. Please check your order confirmation link.";
        return;
    }

    try {
        const response = await fetch(
            `${ORDER_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            if (response.status === 401) {
                title.textContent = "Please Log In";
                message.textContent =
                    "Log in with the account used to place this order, then open your confirmation link again.";
                return;
            }

            title.textContent = "Unable to Load Order";
            message.textContent =
                result.message || "We could not retrieve this order.";
            return;
        }

        renderOrder(result.data);

        title.textContent = "Thank You for Your Order!";
        message.textContent =
            "Your order has been placed successfully. Here are your order details.";
        details.hidden = false;

    } catch (error) {
        console.error("Order confirmation loading failed:", error);

        title.textContent = "Connection Error";
        message.textContent =
            "We could not connect to the server. Please refresh the page and try again.";
    }
}

function renderOrder(order) {
    document.getElementById("order-number").textContent =
        order.orderNumber;

    document.getElementById("order-date").textContent =
        new Date(order.createdAt).toLocaleString();

    document.getElementById("order-status").textContent =
        formatStatus(order.status);

    document.getElementById("payment-method").textContent =
        order.paymentMethod === "COD"
            ? "Cash on Delivery"
            : order.paymentMethod;

    document.getElementById("payment-status").textContent =
        formatStatus(order.paymentStatus);

    document.getElementById("order-subtotal").textContent =
        formatPrice(order.subtotal);

    document.getElementById("delivery-charge").textContent =
        formatPrice(order.deliveryCharge);

    document.getElementById("order-total").textContent =
        formatPrice(order.total);

    const itemsContainer = document.getElementById("order-items");
    itemsContainer.replaceChildren();

    for (const item of order.items) {
        const row = document.createElement("div");
        row.className = "order-item-row";

        const information = document.createElement("div");

        const name = document.createElement("div");
        name.className = "order-item-name";
        name.textContent = item.productName;

        const meta = document.createElement("div");
        meta.className = "order-item-meta";
        meta.textContent =
            `${formatPrice(item.unitPrice)} × ${item.quantity}`;

        const lineTotal = document.createElement("div");
        lineTotal.className = "order-item-total";
        lineTotal.textContent = formatPrice(item.lineTotal);

        information.append(name, meta);
        row.append(information, lineTotal);
        itemsContainer.appendChild(row);
    }
}

function formatStatus(value) {
    if (!value) return "Unknown";

    return value
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatPrice(value) {
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value));
}