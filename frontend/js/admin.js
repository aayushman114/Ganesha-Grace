
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
                method: "GET",
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
            showMessage("Unable to verify your account. Please try again.");
            return false;
        }
    }

    function formatPrice(amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "NPR",
            maximumFractionDigits: 2
        }).format(Number(amount));
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

    function createCell(value, className = "") {
        const cell = document.createElement("td");
        cell.textContent = value ?? "—";

        if (className) {
            cell.className = className;
        }

        return cell;
    }

    function renderOrders(orders) {
        tableBody.replaceChildren();

        if (!orders.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.className = "admin-table-message";
            cell.textContent = "No orders found.";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        orders.forEach(order => {
            const row = document.createElement("tr");

            const itemCount = Array.isArray(order.items)
                ? order.items.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                )
                : 0;

            row.appendChild(createCell(order.orderNumber));
            row.appendChild(createCell(
                `${order.customerName}\n${order.email}`
            ));
            row.appendChild(createCell(itemCount));
            row.appendChild(createCell(formatPrice(order.total)));
            row.appendChild(createCell(order.status));
            row.appendChild(createCell(formatDate(order.createdAt)));
            row.appendChild(createCell("Details coming soon"));

            tableBody.appendChild(row);
        });
    }

    async function loadOrders() {
        hideMessage();

        refreshButton.disabled = true;
        applyFiltersButton.disabled = true;

        tableBody.replaceChildren();

        const loadingRow = document.createElement("tr");
        const loadingCell = document.createElement("td");

        loadingCell.colSpan = 7;
        loadingCell.className = "admin-table-message";
        loadingCell.textContent = "Loading orders...";

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
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load orders.");
            }

            renderOrders(result.data);

            totalPages = Math.max(
                1,
                result.pagination.totalPages
            );

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
        const statuses = [
            "PENDING",
            "PROCESSING",
            "DELIVERED"
        ];

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
                responses.map(response => {
                    if (!response.ok) {
                        throw new Error("Unable to load dashboard statistics.");
                    }
                    return response.json();
                })
            );

            results.forEach(result => {
                if (!result.success) {
                    throw new Error("Statistics response was unsuccessful.");
                }
            });

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
