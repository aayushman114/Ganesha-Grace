
const API_BASE_URL = "http://127.0.0.1:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("orders-table-body");
    const messageBox = document.getElementById("admin-message");

    const totalOrdersElement = document.getElementById("total-orders");
    const pendingOrdersElement = document.getElementById("pending-orders");
    const processingOrdersElement = document.getElementById("processing-orders");
    const deliveredOrdersElement = document.getElementById("delivered-orders");

    const searchInput = document.getElementById("order-search");
    const statusFilter = document.getElementById("status-filter");

    const refreshButton = document.getElementById("refresh-orders");
    const applyFiltersButton = document.getElementById("apply-filters");
    const previousButton = document.getElementById("previous-page");
    const nextButton = document.getElementById("next-page");
    const paginationInfo = document.getElementById("pagination-info");

    // Modal elements
    const orderModal = document.getElementById("order-details-modal");
    const orderDetailsContent = document.getElementById("order-details-content");
    const closeModalButton = document.getElementById("close-order-modal");
    const closeOverlay = document.getElementById("close-order-overlay");

    let currentPage = 1;
    const pageSize = 20;
    let totalPages = 1;

    function showMessage(message) {
        messageBox.textContent = message;
        messageBox.hidden = false;
    }

    function hideMessage() {
        messageBox.textContent = "";
        messageBox.hidden = true;
    }

    async function checkAdminAccess() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: "include"
            });

            if (!response.ok) {
                window.location.href = "./index.html";
                return false;
            }

            const result = await response.json();

            if (!result.success || result.data.role !== "ADMIN") {
                alert("Administrator access required.");
                window.location.href = "./index.html";
                return false;
            }

            return true;
        } catch (error) {
            console.error("Admin authentication error:", error);
            showMessage("Unable to verify your account.");
            return false;
        }
    }

    function formatPrice(amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "NPR",
            maximumFractionDigits: 2
        }).format(Number(amount) || 0);
    }

    function formatDate(dateValue) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function createElement(tag, text = "", className = "") {
        const element = document.createElement(tag);
        element.textContent = text;

        if (className) {
            element.className = className;
        }

        return element;
    }

    function addDetail(parent, label, value) {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        paragraph.append(strong, document.createTextNode(value ?? "—"));

        parent.appendChild(paragraph);
    }

    function createDetailCard(title, details) {
        const card = createElement("div", "", "order-detail-card");
        card.appendChild(createElement("h3", title));

        details.forEach(([label, value]) => {
            addDetail(card, label, value);
        });

        return card;
    }

    function openOrderDetails(order) {
        orderDetailsContent.replaceChildren();

        document.getElementById("order-modal-title").textContent =
            `Order ${order.orderNumber}`;

        const detailGrid = createElement("div", "", "order-detail-grid");

        // Customer information
        detailGrid.appendChild(createDetailCard("Customer Information", [
            ["Name", order.customerName],
            ["Email", order.email],
            ["Phone", order.phone]
        ]));

        // Delivery information
        detailGrid.appendChild(createDetailCard("Delivery Address", [
            ["Address", order.address],
            ["City", order.city],
            ["Postal Code", order.postalCode || "Not provided"]
        ]));

        // Order information
        detailGrid.appendChild(createDetailCard("Order Information", [
            ["Order Number", order.orderNumber],
            ["Order Date", formatDate(order.createdAt)],
            ["Last Updated", formatDate(order.updatedAt)],
            ["Status", order.status]
        ]));

        // Payment information
        detailGrid.appendChild(createDetailCard("Payment Information", [
            ["Payment Method", order.paymentMethod],
            ["Payment Status", order.paymentStatus]
        ]));

        orderDetailsContent.appendChild(detailGrid);

                // Admin order status management
        const statusEditor = createElement("section", "", "order-status-editor");
        statusEditor.appendChild(createElement("h3", "Manage Order Status"));

        const currentStatus = createElement(
            "p",
            `Current status: ${order.status}`,
            "current-order-status"
        );
        statusEditor.appendChild(currentStatus);

        const allowedTransitions = {
            PENDING: ["PROCESSING", "CANCELLED"],
            PROCESSING: ["SHIPPED", "CANCELLED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };

        const availableStatuses = allowedTransitions[order.status] || [];

        if (availableStatuses.length === 0) {
            statusEditor.appendChild(
                createElement("p", "No further status changes are available.")
            );
        } else {
            const statusLabel = createElement("label", "New status");
            statusLabel.htmlFor = "new-order-status";

            const statusSelect = document.createElement("select");
            statusSelect.id = "new-order-status";
            statusSelect.className = "admin-status-select";

            availableStatuses.forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });

            const updateButton = createElement(
                "button",
                "Update Status",
                "admin-update-status-button"
            );
            updateButton.type = "button";

            const statusFeedback = createElement(
                "p",
                "",
                "order-status-feedback"
            );
            statusFeedback.setAttribute("role", "status");
            statusFeedback.setAttribute("aria-live", "polite");

            updateButton.addEventListener("click", async () => {
                const newStatus = statusSelect.value;

                if (
                    newStatus === "CANCELLED" &&
                    !window.confirm(
                        "Are you sure you want to cancel this order? Product stock will be restored."
                    )
                ) {
                    return;
                }

                updateButton.disabled = true;
                statusSelect.disabled = true;
                statusFeedback.textContent = "Updating order status...";

                try {
                    const response = await fetch(
                        `${API_BASE_URL}/admin/orders/${encodeURIComponent(order.orderNumber)}/status`,
                        {
                            method: "PATCH",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                status: newStatus
                            })
                        }
                    );

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message || "Unable to update order status."
                        );
                    }

                    order.status = result.data.status;
                    order.updatedAt = new Date().toISOString();

                    openOrderDetails(order);

                    const updatedFeedback = createElement(
                        "p",
                        result.message || "Order status updated successfully.",
                        "order-status-feedback success"
                    );

                    orderDetailsContent
                        .querySelector(".order-status-editor")
                        .appendChild(updatedFeedback);

                    await Promise.all([
                        loadOrders(),
                        loadDashboardStats()
                    ]);

                } catch (error) {
                    console.error("Order status update error:", error);
                    statusFeedback.textContent = error.message;
                    statusFeedback.classList.add("error");
                    updateButton.disabled = false;
                    statusSelect.disabled = false;
                }
            });

            statusEditor.append(
                statusLabel,
                statusSelect,
                updateButton,
                statusFeedback
            );
        }

        orderDetailsContent.appendChild(statusEditor);

        // Product items heading
        orderDetailsContent.appendChild(
            createElement("h3", "Ordered Products", "order-items-heading")
        );

        // Product table
        const tableContainer = createElement("div", ""); 
        tableContainer.style.overflowX = "auto";

        const itemsTable = createElement("table", "", "order-items-table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        ["Product", "Unit Price", "Quantity", "Line Total"].forEach(label => {
            headerRow.appendChild(createElement("th", label));
        });

        thead.appendChild(headerRow);
        itemsTable.appendChild(thead);

        const tbody = document.createElement("tbody");

        (order.items || []).forEach(item => {
            const row = document.createElement("tr");

            row.appendChild(createElement("td", item.productName));
            row.appendChild(createElement("td", formatPrice(item.unitPrice)));
            row.appendChild(createElement("td", String(item.quantity)));
            row.appendChild(createElement("td", formatPrice(item.lineTotal)));

            tbody.appendChild(row);
        });

        if (!order.items || order.items.length === 0) {
            const row = document.createElement("tr");
            const cell = createElement("td", "No product items found.");

            cell.colSpan = 4;
            row.appendChild(cell);
            tbody.appendChild(row);
        }

        itemsTable.appendChild(tbody);
        tableContainer.appendChild(itemsTable);
        orderDetailsContent.appendChild(tableContainer);

        // Order total summary
        const summary = createElement("div", "", "order-total-summary");

        const totals = [
            ["Subtotal", order.subtotal],
            ["Delivery Charge", order.deliveryCharge]
        ];

        totals.forEach(([label, amount]) => {
            const row = createElement("div", "", "order-total-row");
            row.appendChild(createElement("span", label));
            row.appendChild(createElement("span", formatPrice(amount)));
            summary.appendChild(row);
        });

        const grandTotal = createElement("div", "", "order-total-row grand-total");
        grandTotal.appendChild(createElement("span", "Grand Total"));
        grandTotal.appendChild(createElement("span", formatPrice(order.total)));

        summary.appendChild(grandTotal);
        orderDetailsContent.appendChild(summary);

        orderModal.hidden = false;
        closeModalButton.focus();
    }

    function closeOrderDetails() {
        orderModal.hidden = true;
    }

    closeModalButton.addEventListener("click", closeOrderDetails);
    closeOverlay.addEventListener("click", closeOrderDetails);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !orderModal.hidden) {
            closeOrderDetails();
        }
    });

    function renderOrders(orders) {
        tableBody.replaceChildren();

        if (!orders.length) {
            const row = document.createElement("tr");
            const cell = createElement("td", "No orders found.", "admin-table-message");

            cell.colSpan = 7;
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        orders.forEach(order => {
            const row = document.createElement("tr");

            const itemCount = (order.items || []).reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );

            row.appendChild(createElement("td", order.orderNumber));
            row.appendChild(createElement(
                "td",
                `${order.customerName}\n${order.email}`
            ));
            row.appendChild(createElement("td", String(itemCount)));
            row.appendChild(createElement("td", formatPrice(order.total)));
            row.appendChild(createElement("td", order.status));
            row.appendChild(createElement("td", formatDate(order.createdAt)));

            const actionCell = document.createElement("td");
            const viewButton = createElement(
                "button",
                "View Details",
                "admin-view-button"
            );

            viewButton.type = "button";
            viewButton.addEventListener("click", () => {
                openOrderDetails(order);
            });

            actionCell.appendChild(viewButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    async function loadOrders() {
        hideMessage();

        refreshButton.disabled = true;
        applyFiltersButton.disabled = true;

        tableBody.replaceChildren();

        const loadingRow = document.createElement("tr");
        const loadingCell = createElement(
            "td",
            "Loading orders...",
            "admin-table-message"
        );

        loadingCell.colSpan = 7;
        loadingRow.appendChild(loadingCell);
        tableBody.appendChild(loadingRow);

        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageSize)
            });

            const search = searchInput.value.trim();
            const status = statusFilter.value;

            if (search) params.set("search", search);
            if (status) params.set("status", status);

            const response = await fetch(
                `${API_BASE_URL}/admin/orders?${params.toString()}`,
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load orders.");
            }

            renderOrders(result.data);

            totalPages = Math.max(1, result.pagination.totalPages);

            paginationInfo.textContent =
                `Page ${currentPage} of ${totalPages}`;

            previousButton.disabled = currentPage <= 1;
            nextButton.disabled = currentPage >= totalPages;

        } catch (error) {
            console.error("Order loading error:", error);
            tableBody.replaceChildren();
            showMessage(error.message);
        } finally {
            refreshButton.disabled = false;
            applyFiltersButton.disabled = false;
        }
    }

    async function loadDashboardStats() {
        const statuses = ["PENDING", "PROCESSING", "DELIVERED"];

        try {
            const requests = [
                fetch(`${API_BASE_URL}/admin/orders?page=1&limit=1`, {
                    credentials: "include"
                }),
                ...statuses.map(status =>
                    fetch(
                        `${API_BASE_URL}/admin/orders?page=1&limit=1&status=${status}`,
                        { credentials: "include" }
                    )
                )
            ];

            const responses = await Promise.all(requests);

            const results = await Promise.all(
                responses.map(async response => {
                    if (!response.ok) {
                        throw new Error("Unable to load dashboard statistics.");
                    }

                    return response.json();
                })
            );

            if (results.some(result => !result.success)) {
                throw new Error("Statistics response was unsuccessful.");
            }

            totalOrdersElement.textContent =
                results[0].pagination.totalOrders;

            pendingOrdersElement.textContent =
                results[1].pagination.totalOrders;

            processingOrdersElement.textContent =
                results[2].pagination.totalOrders;

            deliveredOrdersElement.textContent =
                results[3].pagination.totalOrders;

        } catch (error) {
            console.error("Dashboard statistics error:", error);

            totalOrdersElement.textContent = "—";
            pendingOrdersElement.textContent = "—";
            processingOrdersElement.textContent = "—";
            deliveredOrdersElement.textContent = "—";
        }
    }

    refreshButton.addEventListener("click", () => {
        loadOrders();
        loadDashboardStats();
    });

    applyFiltersButton.addEventListener("click", () => {
        currentPage = 1;
        loadOrders();
    });

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            currentPage = 1;
            loadOrders();
        }
    });

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadOrders();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadOrders();
        }
    });

    async function initializeDashboard() {
        const hasAccess = await checkAdminAccess();

        if (!hasAccess) return;

        await Promise.all([
            loadOrders(),
            loadDashboardStats()
        ]);
    }

    initializeDashboard();
});
