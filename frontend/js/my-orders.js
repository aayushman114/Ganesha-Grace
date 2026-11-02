const API_BASE_URL = "http://127.0.0.1:3000/api";

document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
    const loadingElement = document.getElementById("orders-loading");
    const errorElement = document.getElementById("orders-error");
    const emptyElement = document.getElementById("orders-empty");
    const ordersListElement = document.getElementById("orders-list");

    loadingElement.hidden = false;
    errorElement.hidden = true;
    emptyElement.hidden = true;
    ordersListElement.replaceChildren();

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        });

        const result = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load your orders.");
        }

        const orders = Array.isArray(result.data) ? result.data : [];

        loadingElement.hidden = true;

        if (orders.length === 0) {
            emptyElement.hidden = false;
            return;
        }

        orders.forEach(order => {
            ordersListElement.appendChild(createOrderCard(order));
        });

    } catch (error) {
        loadingElement.hidden = true;
        errorElement.textContent =
            error.message || "Something went wrong while loading your orders.";
        errorElement.hidden = false;

        console.error("My Orders error:", error);
    }
}

function createOrderCard(order) {
    const card = document.createElement("article");
    card.className = "order-card";

    const heading = document.createElement("div");
    heading.className = "order-card-header";

    const orderInfo = document.createElement("div");

    const orderNumber = document.createElement("h2");
    orderNumber.textContent = `Order ${order.orderNumber}`;

    const orderDate = document.createElement("p");
    orderDate.className = "order-date";
    orderDate.textContent = `Placed on ${formatOrderDate(order.createdAt)}`;

    orderInfo.append(orderNumber, orderDate);

    const status = document.createElement("span");
    status.className = `order-status status-${String(order.status).toLowerCase()}`;
    status.textContent = formatLabel(order.status);

    heading.append(orderInfo, status);

    const details = document.createElement("div");
    details.className = "order-details";

    details.append(
        createDetail("Payment method", formatLabel(order.paymentMethod)),
        createDetail("Payment status", formatLabel(order.paymentStatus)),
        createDetail("Delivery charge", formatPrice(order.deliveryCharge))
    );

    const itemsHeading = document.createElement("h3");
    itemsHeading.className = "order-items-heading";
    itemsHeading.textContent = "Items";

    const itemsList = document.createElement("ul");
    itemsList.className = "order-items";

    (Array.isArray(order.items) ? order.items : []).forEach(item => {
        const listItem = document.createElement("li");

        const itemName = document.createElement("span");
        itemName.textContent = `${item.productName} × ${item.quantity}`;

        const itemPrice = document.createElement("span");
        itemPrice.textContent = formatPrice(item.lineTotal);

        listItem.append(itemName, itemPrice);
        itemsList.appendChild(listItem);
    });

    const total = document.createElement("div");
    total.className = "order-total";

    const totalLabel = document.createElement("strong");
    totalLabel.textContent = "Order total";

    const totalAmount = document.createElement("strong");
    totalAmount.textContent = formatPrice(order.total);

    total.append(totalLabel, totalAmount);

    const actions = document.createElement("div");
    actions.className = "order-actions";

    const viewOrderLink = document.createElement("a");
    viewOrderLink.className = "btn";
    viewOrderLink.href =
        `order-confirmation.html?orderNumber=${encodeURIComponent(order.orderNumber)}`;
    viewOrderLink.textContent = "View Order Details";

    actions.appendChild(viewOrderLink);

    card.append(
        heading,
        details,
        itemsHeading,
        itemsList,
        total,
        actions
    );

    return card;
}

function createDetail(label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "order-detail";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent = value;

    wrapper.append(labelElement, valueElement);

    return wrapper;
}

function formatPrice(value) {
    const amount = Number(value);

    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 2
    }).format(Number.isFinite(amount) ? amount : 0);
}

function formatOrderDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatLabel(value) {
    if (!value) {
        return "Unknown";
    }

    return String(value)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, character => character.toUpperCase());
}