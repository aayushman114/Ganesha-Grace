
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

    // ============================================
    // SECTION NAVIGATION (Tab switching)
    // ============================================

    const sections = {
        dashboard: document.getElementById("dashboard"),
        orders: document.getElementById("orders"),
        products: document.getElementById("products"),
        customers: document.getElementById("customers"),
        "categories-brands": document.getElementById("categories-brands")
    };

    const navLinks = document.querySelectorAll(".admin-nav a[href^='#']");

    function showSection(sectionId) {
        // Hide all sections
        Object.values(sections).forEach(section => {
            if (section) section.hidden = true;
        });

        // Show selected section
        const target = sections[sectionId];
        if (target) target.hidden = false;

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });

        // Update URL hash without scrolling
        history.replaceState(null, "", `#${sectionId}`);

        // Load section-specific data
        if (sectionId === "categories-brands") {
            loadCategories();
            loadBrands();
        }

    }

    // Click handlers for nav links
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const sectionId = link.getAttribute("href").slice(1);
            showSection(sectionId);
        });
    });

    // Handle initial hash on page load
    const initialHash = window.location.hash.slice(1) || "dashboard";
    if (sections[initialHash]) {
        showSection(initialHash);
    }

    // Product management elements
    const productsTableBody = document.getElementById("products-table-body");
    const productMessage = document.getElementById("product-message");
    const productSearchInput = document.getElementById("product-search");
    const productStatusFilter = document.getElementById("product-status-filter");
    const productStockFilter = document.getElementById("product-stock-filter");
    const refreshProductsButton = document.getElementById("refresh-products");
    // Inventory summary elements
    const inventoryTotal = document.getElementById("inventory-total");
    const inventoryAvailable = document.getElementById("inventory-available");
    const inventoryLow = document.getElementById("inventory-low");
    const inventoryOut = document.getElementById("inventory-out");
    // Inventory alert elements
    const inventoryAlerts = document.getElementById("inventory-alerts");
    const inventoryAlertMessage = document.getElementById("inventory-alert-message");
    // Add Product modal elements
    const productModal = document.getElementById("product-modal");
    const addProductButton = document.getElementById("add-product-button");
    const closeProductButton = document.getElementById("close-product-modal");
    const closeProductOverlay = document.getElementById("close-product-overlay");
    const cancelProductButton = document.getElementById("cancel-product-button");
    const addProductForm = document.getElementById("add-product-form");
    const saveProductButton = document.getElementById("save-product-button");
    const productFormFeedback = document.getElementById("product-form-feedback");
    const productCategorySelect = document.getElementById("product-category");
    const productBrandSelect = document.getElementById("product-brand");
    const productModalTitle = document.getElementById("product-modal-title");

    // Customer management elements
    const customersTableBody = document.getElementById("customers-table-body");
    const customerMessage = document.getElementById("customer-message");
    const customerSearchInput = document.getElementById("customer-search");
    const customerStatusFilter = document.getElementById("customer-status-filter");
    const refreshCustomersButton = document.getElementById("refresh-customers");

    let allCustomers = [];

    // Categories & Brands elements
    const categoriesTableBody = document.getElementById("categories-table-body");
    const categoryMessage = document.getElementById("category-message");
    const categorySearchInput = document.getElementById("category-search");
    const addCategoryButton = document.getElementById("add-category-button");
    const brandsTableBody = document.getElementById("brands-table-body");
    const brandMessage = document.getElementById("brand-message");
    const brandSearchInput = document.getElementById("brand-search");
    const addBrandButton = document.getElementById("add-brand-button");

    // Category modal
    const categoryModal = document.getElementById("category-modal");
    const categoryForm = document.getElementById("category-form");
    const categoryIdInput = document.getElementById("category-id");
    const categoryNameInput = document.getElementById("category-name");
    const categorySlugInput = document.getElementById("category-slug");
    const saveCategoryButton = document.getElementById("save-category-button");
    const cancelCategoryButton = document.getElementById("cancel-category-button");
    const closeCategoryButton = document.getElementById("close-category-modal");
    const closeCategoryOverlay = document.getElementById("close-category-overlay");
    const categoryModalTitle = document.getElementById("category-modal-title");
    const categoryFormFeedback = document.getElementById("category-form-feedback");

    // Brand modal
    const brandModal = document.getElementById("brand-modal");
    const brandForm = document.getElementById("brand-form");
    const brandIdInput = document.getElementById("brand-id");
    const brandNameInput = document.getElementById("brand-name");
    const saveBrandButton = document.getElementById("save-brand-button");
    const cancelBrandButton = document.getElementById("cancel-brand-button");
    const closeBrandButton = document.getElementById("close-brand-modal");
    const closeBrandOverlay = document.getElementById("close-brand-overlay");
    const brandModalTitle = document.getElementById("brand-modal-title");
    const brandFormFeedback = document.getElementById("brand-form-feedback");

    // Tabs
    const tabButtons = document.querySelectorAll(".admin-tab");
    const tabPanels = document.querySelectorAll(".admin-tab-panel");

    let editingCategoryId = null;
    let editingBrandId = null;



    // Customer orders modal elements
    const customerOrdersModal = document.getElementById("customer-orders-modal");
    const customerOrdersContent = document.getElementById("customer-orders-content");
    const closeCustomerOrdersButton = document.getElementById("close-customer-orders-modal");
    const closeCustomerOrdersOverlay = document.getElementById("close-customer-orders-overlay");
    const customerOrdersCustomerName = document.getElementById("customer-orders-customer-name");


    let editingProductId = null;

    let allProducts = [];
    let allCategories = [];
    let allBrands = [];

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

            // Only update if elements exist (old dashboard)
            if (totalOrdersElement) totalOrdersElement.textContent = results[0].pagination.totalOrders;
            if (pendingOrdersElement) pendingOrdersElement.textContent = results[1].pagination.totalOrders;
            if (processingOrdersElement) processingOrdersElement.textContent = results[2].pagination.totalOrders;
            if (deliveredOrdersElement) deliveredOrdersElement.textContent = results[3].pagination.totalOrders;

        } catch (error) {
            console.error("Dashboard statistics error:", error);

            if (totalOrdersElement) totalOrdersElement.textContent = "—";
            if (pendingOrdersElement) pendingOrdersElement.textContent = "—";
            if (processingOrdersElement) processingOrdersElement.textContent = "—";
            if (deliveredOrdersElement) deliveredOrdersElement.textContent = "—";
        }
    }


    
    // ============================================
    // PRODUCT MANAGEMENT
    // ============================================

    // Populate category and brand dropdowns
    function populateProductDropdowns() {
        productCategorySelect.replaceChildren();
        productBrandSelect.replaceChildren();

        const categoryPlaceholder = createElement(
            "option",
            "Select Category"
        );
        categoryPlaceholder.value = "";
        productCategorySelect.appendChild(categoryPlaceholder);

        allCategories.forEach(category => {
            const option = createElement("option", category.name);
            option.value = category.id;
            productCategorySelect.appendChild(option);
        });

        const brandPlaceholder = createElement(
            "option",
            "Select Brand"
        );
        brandPlaceholder.value = "";
        productBrandSelect.appendChild(brandPlaceholder);

        allBrands.forEach(brand => {
            const option = createElement("option", brand.name);
            option.value = brand.id;
            productBrandSelect.appendChild(option);
        });
    }

    // Open modal
    function openProductModal(product = null) {
    addProductForm.reset();

    editingProductId = product ? product.id : null;

    productFormFeedback.textContent = "";
    productFormFeedback.className = "product-form-feedback";

    populateProductDropdowns();

    if (product) {
        productModalTitle.textContent = "Edit Product";
        saveProductButton.textContent = "Update Product";

        addProductForm.elements.namedItem("name").value =
            product.name || "";

        addProductForm.elements.namedItem("description").value =
            product.description || "";

        addProductForm.elements.namedItem("price").value =
            product.price || "";

        addProductForm.elements.namedItem("rating").value =
            product.rating ?? "";

        addProductForm.elements.namedItem("imageUrl").value =
            product.imageUrl || "";

        addProductForm.elements.namedItem("stock").value =
            product.stock ?? 0;

        addProductForm.elements.namedItem("categoryId").value =
            String(product.categoryId);

        addProductForm.elements.namedItem("brandId").value =
            String(product.brandId);
        } else {
            productModalTitle.textContent = "Add New Product";
            saveProductButton.textContent = "Save Product";
        }

        productModal.hidden = false;
        document.getElementById("product-name").focus();
    }

    // Close modal
    function closeProductModal() {
        productModal.hidden = true;
    }

    addProductButton.addEventListener("click", openProductModal);
    closeProductButton.addEventListener("click", closeProductModal);
    closeProductOverlay.addEventListener("click", closeProductModal);
    cancelProductButton.addEventListener("click", closeProductModal);

    addProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    productFormFeedback.textContent = "";
    productFormFeedback.className = "product-form-feedback";

    const formData = new FormData(addProductForm);

    const productData = {
        name: formData.get("name").trim(),
        description: formData.get("description").trim() || null,
        price: formData.get("price"),
        rating: formData.get("rating") || null,
        imageUrl: formData.get("imageUrl").trim() || null,
        stock: Number(formData.get("stock")),
        categoryId: Number(formData.get("categoryId")),
        brandId: Number(formData.get("brandId"))
    };

    const isEditing = editingProductId !== null;

    saveProductButton.disabled = true;
    saveProductButton.textContent = isEditing
        ? "Updating..."
        : "Saving...";

    try {
        const endpoint = isEditing
            ? `${API_BASE_URL}/admin/products/${editingProductId}`
            : `${API_BASE_URL}/admin/products`;

        const response = await fetch(endpoint, {
            method: isEditing ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to save product."
            );
        }

        await loadProducts();

        closeProductModal();

        showProductMessage(
            isEditing
                ? "Product updated successfully."
                : "Product created successfully."
        );

        editingProductId = null;

    } catch (error) {
        console.error("Product save error:", error);

        productFormFeedback.textContent = error.message;
        productFormFeedback.classList.add("error");

    } finally {
        saveProductButton.disabled = false;
        saveProductButton.textContent = "Save Product";
    }
});

    function showProductMessage(message) {
        productMessage.textContent = message;
        productMessage.hidden = false;
    }

    function hideProductMessage() {
        productMessage.textContent = "";
        productMessage.hidden = true;
    }

    
    async function toggleProductStatus(product, button) {
        const newStatus = !product.isActive;

        const action = newStatus ? "activate" : "deactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${product.name}"?`
        );

        if (!confirmed) return;

        button.disabled = true;
        button.textContent = "Updating...";

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/products/${product.id}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        isActive: newStatus
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update product status."
                );
            }

            await loadProducts();

            showProductMessage(result.message);

        } catch (error) {
            console.error("Product status update error:", error);
            showProductMessage(error.message);
        } finally {
            button.disabled = false;
        }
    }

    async function saveProductStock(product, input, button) {
    const newStock = Number(input.value);

    if (!Number.isSafeInteger(newStock) || newStock < 0) {
        showProductMessage(
            "Stock must be a non-negative whole number."
        );
        return;
    }

    button.disabled = true;
    input.disabled = true;
    button.textContent = "Saving...";

    try {
        const response = await fetch(
            `${API_BASE_URL}/admin/products/${product.id}/stock`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stock: newStock
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to update stock."
            );
        }

        product.stock = result.data.product.stock;

        updateInventorySummary();
        renderProducts();

        showProductMessage(
            `${product.name} stock updated to ${product.stock}.`
        );

    } catch (error) {
        console.error("Stock update error:", error);
        showProductMessage(error.message);

    } finally {
        button.disabled = false;
    }
}

        function updateInventorySummary() {
    const total = allProducts.length;

    const available = allProducts.filter(
        product => Number(product.stock) > 5
    ).length;

    const low = allProducts.filter(
        product => {
            const stock = Number(product.stock);
            return stock > 0 && stock <= 5;
        }
    ).length;

    const out = allProducts.filter(
        product => Number(product.stock) === 0
    ).length;

    if (inventoryTotal) inventoryTotal.textContent = total;
    if (inventoryAvailable) inventoryAvailable.textContent = available;
    if (inventoryLow) inventoryLow.textContent = low;
    if (inventoryOut) inventoryOut.textContent = out;
     // Update inventory alerts
    const alertMessages = [];

    if (out > 0) {
        alertMessages.push(`${out} product(s) out of stock`);
    }

    if (low > 0) {
        alertMessages.push(`${low} product(s) with low stock`);
    }

    if (inventoryAlerts && inventoryAlertMessage) {
        if (alertMessages.length > 0) {
            inventoryAlerts.hidden = false;
            inventoryAlertMessage.textContent =
                `Inventory attention needed: ${alertMessages.join(" and ")}.`;
        } else {
            inventoryAlerts.hidden = true;
            inventoryAlertMessage.textContent = "";
        }
    }
}


    function renderProducts() {
        productsTableBody.replaceChildren();

       const search = productSearchInput.value.trim().toLowerCase();
        const status = productStatusFilter.value;
        const stockFilter = productStockFilter.value;

        const filteredProducts = allProducts.filter(product => {
            const stock = Number(product.stock);

            const matchesSearch =
                product.name.toLowerCase().includes(search) ||
                (product.brand?.name || "").toLowerCase().includes(search) ||
                (product.category?.name || "").toLowerCase().includes(search);

            const matchesStatus =
                status === "" ||
                String(product.isActive) === status;

            const matchesStock =
                stockFilter === "" ||
                (stockFilter === "available" && stock > 5) ||
                (stockFilter === "low" && stock > 0 && stock <= 5) ||
                (stockFilter === "out" && stock === 0);

            return matchesSearch && matchesStatus && matchesStock;
        });

        if (filteredProducts.length === 0) {
            const row = document.createElement("tr");
            const cell = createElement(
                "td",
                "No products found.",
                "admin-table-message"
            );

            cell.colSpan = 8;
            row.appendChild(cell);
            productsTableBody.appendChild(row);
            return;
        }

        filteredProducts.forEach(product => {
            const row = document.createElement("tr");

            // Product image
            const imageCell = document.createElement("td");
            const image = document.createElement("img");

            image.alt = product.name;
            image.width = 50;
            image.height = 50;
            image.loading = "lazy";
            image.style.objectFit = "cover";
            image.style.borderRadius = "6px";

            if (product.imageUrl) {
                try {
                    const imageUrl = new URL(
                        product.imageUrl,
                        window.location.origin
                    );

                    if (["http:", "https:"].includes(imageUrl.protocol)) {
                        image.src = imageUrl.href;
                    } else {
                        image.alt = "Invalid image URL";
                    }
                } catch {
                    image.alt = "Invalid image URL";
                }
            } else {
                image.alt = "No product image";
            }

            image.onerror = () => {
                image.removeAttribute("src");
                image.alt = "Image unavailable";
            };

            imageCell.appendChild(image);

            // Product information
            const productCell = document.createElement("td");
            productCell.appendChild(createElement("strong", product.name));

            if (product.description) {
                const description = createElement(
                    "small",
                    product.description
                );

                description.style.display = "block";
                description.style.maxWidth = "220px";
                description.style.marginTop = "5px";

                productCell.appendChild(description);
            }

            row.appendChild(imageCell);
            row.appendChild(productCell);

            row.appendChild(createElement(
                "td",
                product.brand?.name || "—"
            ));

            row.appendChild(createElement(
                "td",
                product.category?.name || "—"
            ));

            row.appendChild(createElement(
                "td",
                formatPrice(product.price)
            ));

            // Stock quantity and inventory status
            const stockCell = document.createElement("td");
            const stock = Number(product.stock);

            let stockStatus;
            let stockClass;

            if (stock === 0) {
                stockStatus = "Out of Stock";
                stockClass = "stock-out";
            } else if (stock <= 5) {
                stockStatus = "Low Stock";
                stockClass = "stock-low";
            } else {
                stockStatus = "In Stock";
                stockClass = "stock-available";
            }

            stockCell.appendChild(
                createElement("small", stockStatus, stockClass)
            );

            // Stock editor
            const stockEditor = createElement("div", "", "stock-editor");

            const stockInput = document.createElement("input");
            stockInput.type = "number";
            stockInput.min = "0";
            stockInput.step = "1";
            stockInput.value = String(stock);
            stockInput.className = "stock-input";
            stockInput.setAttribute("aria-label", `Stock quantity for ${product.name}`);

            const saveStockButton = createElement(
                "button",
                "Save",
                "admin-view-button"
            );

            saveStockButton.type = "button";

            saveStockButton.addEventListener("click", () => {
                saveProductStock(product, stockInput, saveStockButton);
            });

            stockEditor.append(stockInput, saveStockButton);
            stockCell.appendChild(stockEditor);

            row.appendChild(stockCell);

            row.appendChild(createElement(
                "td",
                product.isActive ? "Active" : "Inactive"
            ));

            const actionCell = document.createElement("td");

            const editButton = createElement(
                "button",
                "Edit",
                "admin-view-button"
            );

            editButton.type = "button";

            editButton.addEventListener("click", () => {
                openProductModal(product);
            });

            const statusButton = createElement(
                "button",
                product.isActive ? "Deactivate" : "Activate",
                "admin-view-button"
            );

            statusButton.type = "button";
            statusButton.style.marginLeft = "6px";

            statusButton.addEventListener("click", () => {
                toggleProductStatus(product, statusButton);
            });

            actionCell.append(editButton, statusButton);
            row.appendChild(actionCell);

            productsTableBody.appendChild(row);
        });
    }

    async function loadProducts() {
        hideProductMessage();

        refreshProductsButton.disabled = true;
        productsTableBody.replaceChildren();

        const loadingRow = document.createElement("tr");
        const loadingCell = createElement(
            "td",
            "Loading products...",
            "admin-table-message"
        );

        loadingCell.colSpan = 8;
        loadingRow.appendChild(loadingCell);
        productsTableBody.appendChild(loadingRow);

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/products`,
                {
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to load products."
                );
            }

            allProducts = result.data.products || [];
            allCategories = result.data.categories || [];
            allBrands = result.data.brands || [];

            updateInventorySummary();
            renderProducts();

        } catch (error) {
            console.error("Product loading error:", error);

            productsTableBody.replaceChildren();
            showProductMessage(error.message);

        } finally {
            refreshProductsButton.disabled = false;
        }
    }
        // ============================================
    // CUSTOMER MANAGEMENT
    // ============================================

    async function loadCustomers() {
        hideCustomerMessage();

        refreshCustomersButton.disabled = true;
        customersTableBody.replaceChildren();

        const loadingRow = document.createElement("tr");
        const loadingCell = createElement(
            "td",
            "Loading customers...",
            "admin-table-message"
        );

        loadingCell.colSpan = 6;
        loadingRow.appendChild(loadingCell);
        customersTableBody.appendChild(loadingRow);

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/customers`,
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load customers.");
            }

            allCustomers = result.data || [];
            renderCustomers();

        } catch (error) {
            console.error("Customer loading error:", error);

            customersTableBody.replaceChildren();
            showCustomerMessage(error.message);

        } finally {
            refreshCustomersButton.disabled = false;
        }
    }

    function renderCustomers() {
        customersTableBody.replaceChildren();

        const search = customerSearchInput.value.trim().toLowerCase();
        const status = customerStatusFilter.value;

        const filteredCustomers = allCustomers.filter(customer => {
            const matchesSearch =
                customer.name.toLowerCase().includes(search) ||
                customer.email.toLowerCase().includes(search);

            const matchesStatus =
                status === "" ||
                String(customer.isActive) === status;

            return matchesSearch && matchesStatus;
        });

        if (filteredCustomers.length === 0) {
            const row = document.createElement("tr");
            const cell = createElement(
                "td",
                "No customers found.",
                "admin-table-message"
            );

            cell.colSpan = 6;
            row.appendChild(cell);
            customersTableBody.appendChild(row);
            return;
        }

        filteredCustomers.forEach(customer => {
            const row = document.createElement("tr");

            row.appendChild(createElement("td", String(customer.id)));
            row.appendChild(createElement("td", customer.name));
            row.appendChild(createElement("td", customer.email));

            // Status with badge
            const statusCell = document.createElement("td");
            const statusBadge = createElement(
                "small",
                customer.isActive ? "Active" : "Inactive",
                customer.isActive ? "stock-available" : "stock-out"
            );
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            // Registration date
            row.appendChild(createElement("td", formatDate(customer.createdAt)));

            // Action buttons
            const actionCell = document.createElement("td");
            actionCell.style.display = "flex";
            actionCell.style.gap = "6px";
            actionCell.style.flexWrap = "wrap";

            const toggleButton = createElement(
                "button",
                customer.isActive ? "Deactivate" : "Activate",
                "admin-view-button"
            );
            toggleButton.type = "button";
            toggleButton.style.flex = "1";
            toggleButton.style.minWidth = "80px";

            toggleButton.addEventListener("click", () => {
                toggleCustomerStatus(customer, toggleButton);
            });

            const viewOrdersButton = createElement(
                "button",
                "View Orders",
                "admin-view-button"
            );
            viewOrdersButton.type = "button";
            viewOrdersButton.style.flex = "1";
            viewOrdersButton.style.minWidth = "80px";

            viewOrdersButton.addEventListener("click", () => {
                openCustomerOrders(customer);
            });

            actionCell.append(toggleButton, viewOrdersButton);
            row.appendChild(actionCell);


            customersTableBody.appendChild(row);
        });
    }

    function showCustomerMessage(message) {
        customerMessage.textContent = message;
        customerMessage.hidden = false;
    }

    function hideCustomerMessage() {
        customerMessage.textContent = "";
        customerMessage.hidden = true;
    }

    async function toggleCustomerStatus(customer, button) {
        const newStatus = !customer.isActive;

        const action = newStatus ? "activate" : "deactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${customer.name}"?`
        );

        if (!confirmed) return;

        button.disabled = true;
        button.textContent = "Updating...";

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/customers/${customer.id}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        isActive: newStatus
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update customer status."
                );
            }

            await loadCustomers();

            showCustomerMessage(result.message);

        } catch (error) {
            console.error("Customer status update error:", error);
            showCustomerMessage(error.message);
        } finally {
            button.disabled = false;
        }
    }
        // ============================================
    // CATEGORIES & BRANDS MANAGEMENT
    // ============================================

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.tab;
            tabButtons.forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
            tabPanels.forEach(p => p.hidden = p.id !== `${tab}-panel`);
        });
    });

    // Load categories
    async function loadCategories() {
        hideCategoryMessage();
        categoriesTableBody.replaceChildren(createLoadingRow(6, "Loading categories..."));

        try {
            const response = await fetch(`${API_BASE_URL}/admin/categories`, { credentials: "include" });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load categories.");
            }

            allCategories = result.data || [];
            renderCategories();

        } catch (error) {
            console.error("Categories load error:", error);
            categoriesTableBody.replaceChildren(createErrorRow(6, error.message));
        }
    }

    // Load brands
    async function loadBrands() {
        hideBrandMessage();
        brandsTableBody.replaceChildren(createLoadingRow(5, "Loading brands..."));

        try {
            const response = await fetch(`${API_BASE_URL}/admin/brands`, { credentials: "include" });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load brands.");
            }

            allBrands = result.data || [];
            renderBrands();

        } catch (error) {
            console.error("Brands load error:", error);
            brandsTableBody.replaceChildren(createErrorRow(5, error.message));
        }
    }

    function createLoadingRow(colspan, text) {
        const row = document.createElement("tr");
        const cell = createElement("td", text, "admin-table-message");
        cell.colSpan = colspan;
        row.appendChild(cell);
        return row;
    }

    function createErrorRow(colspan, text) {
        const row = document.createElement("tr");
        const cell = createElement("td", text, "admin-table-message");
        cell.colSpan = colspan;
        cell.style.color = "#b42318";
        row.appendChild(cell);
        return row;
    }

    // Render categories
    function renderCategories() {
        categoriesTableBody.replaceChildren();

        const search = categorySearchInput.value.trim().toLowerCase();
        const filtered = allCategories.filter(c =>
            c.name.toLowerCase().includes(search) || c.slug.toLowerCase().includes(search)
        );

        if (!filtered.length) {
            categoriesTableBody.appendChild(createErrorRow(6, "No categories found."));
            return;
        }

        filtered.forEach(category => {
            const row = document.createElement("tr");
            row.appendChild(createElement("td", String(category.id)));
            row.appendChild(createElement("td", category.name));
            row.appendChild(createElement("td", category.slug));
            row.appendChild(createElement("td", String(category.productCount)));
            row.appendChild(createElement("td", formatDate(category.createdAt)));

            const actionCell = document.createElement("td");
            actionCell.style.display = "flex";
            actionCell.style.gap = "6px";

            const editButton = createElement("button", "Edit", "admin-view-button");
            editButton.type = "button";
            editButton.addEventListener("click", () => openCategoryModal(category));

            const deleteButton = createElement("button", "Delete", "admin-view-button");
            deleteButton.type = "button";
            deleteButton.style.background = "#fff";
            deleteButton.style.color = "#dc2626";
            deleteButton.style.borderColor = "#dc2626";
            deleteButton.addEventListener("click", () => deleteCategory(category));

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);
            categoriesTableBody.appendChild(row);
        });
    }

    // Render brands
    function renderBrands() {
        brandsTableBody.replaceChildren();

        const search = brandSearchInput.value.trim().toLowerCase();
        const filtered = allBrands.filter(b =>
            b.name.toLowerCase().includes(search)
        );

        if (!filtered.length) {
            brandsTableBody.appendChild(createErrorRow(5, "No brands found."));
            return;
        }

        filtered.forEach(brand => {
            const row = document.createElement("tr");
            row.appendChild(createElement("td", String(brand.id)));
            row.appendChild(createElement("td", brand.name));
            row.appendChild(createElement("td", String(brand.productCount)));
            row.appendChild(createElement("td", formatDate(brand.createdAt)));

            const actionCell = document.createElement("td");
            actionCell.style.display = "flex";
            actionCell.style.gap = "6px";

            const editButton = createElement("button", "Edit", "admin-view-button");
            editButton.type = "button";
            editButton.addEventListener("click", () => openBrandModal(brand));

            const deleteButton = createElement("button", "Delete", "admin-view-button");
            deleteButton.type = "button";
            deleteButton.style.background = "#fff";
            deleteButton.style.color = "#dc2626";
            deleteButton.style.borderColor = "#dc2626";
            deleteButton.addEventListener("click", () => deleteBrand(brand));

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);
            brandsTableBody.appendChild(row);
        });
    }

    // Category modal
    function openCategoryModal(category = null) {
        categoryForm.reset();
        categoryFormFeedback.textContent = "";
        categoryFormFeedback.className = "product-form-feedback";
        editingCategoryId = category?.id || null;

        if (category) {
            categoryModalTitle.textContent = "Edit Category";
            saveCategoryButton.textContent = "Update Category";
            categoryIdInput.value = category.id;
            categoryNameInput.value = category.name;
            categorySlugInput.value = category.slug;
        } else {
            categoryModalTitle.textContent = "Add Category";
            saveCategoryButton.textContent = "Save Category";
            categoryIdInput.value = "";
        }

        categoryModal.hidden = false;
        categoryNameInput.focus();
    }

    function closeCategoryModal() {
        categoryModal.hidden = true;
        editingCategoryId = null;
    }

    closeCategoryButton.addEventListener("click", closeCategoryModal);
    closeCategoryOverlay.addEventListener("click", closeCategoryModal);
    cancelCategoryButton.addEventListener("click", closeCategoryModal);

    categoryForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        categoryFormFeedback.textContent = "";
        categoryFormFeedback.className = "product-form-feedback";

        const name = categoryNameInput.value.trim();
        const slug = categorySlugInput.value.trim();

        if (!name) {
            categoryFormFeedback.textContent = "Category name is required.";
            categoryFormFeedback.classList.add("error");
            return;
        }

        const isEditing = editingCategoryId !== null;
        const url = isEditing
            ? `${API_BASE_URL}/admin/categories/${editingCategoryId}`
            : `${API_BASE_URL}/admin/categories`;
        const method = isEditing ? "PUT" : "POST";

        saveCategoryButton.disabled = true;
        saveCategoryButton.textContent = isEditing ? "Updating..." : "Saving...";

        try {
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to save category.");
            }

            closeCategoryModal();
            await loadCategories();
            showCategoryMessage(isEditing ? "Category updated." : "Category created.");

        } catch (error) {
            console.error("Category save error:", error);
            categoryFormFeedback.textContent = error.message;
            categoryFormFeedback.classList.add("error");
        } finally {
            saveCategoryButton.disabled = false;
            saveCategoryButton.textContent = isEditing ? "Update Category" : "Save Category";
        }
    });

    // Brand modal
    function openBrandModal(brand = null) {
        brandForm.reset();
        brandFormFeedback.textContent = "";
        brandFormFeedback.className = "product-form-feedback";
        editingBrandId = brand?.id || null;

        if (brand) {
            brandModalTitle.textContent = "Edit Brand";
            saveBrandButton.textContent = "Update Brand";
            brandIdInput.value = brand.id;
            brandNameInput.value = brand.name;
        } else {
            brandModalTitle.textContent = "Add Brand";
            saveBrandButton.textContent = "Save Brand";
            brandIdInput.value = "";
        }

        brandModal.hidden = false;
        brandNameInput.focus();
    }

    function closeBrandModal() {
        brandModal.hidden = true;
        editingBrandId = null;
    }

    closeBrandButton.addEventListener("click", closeBrandModal);
    closeBrandOverlay.addEventListener("click", closeBrandModal);
    cancelBrandButton.addEventListener("click", closeBrandModal);

    brandForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        brandFormFeedback.textContent = "";
        brandFormFeedback.className = "product-form-feedback";

        const name = brandNameInput.value.trim();

        if (!name) {
            brandFormFeedback.textContent = "Brand name is required.";
            brandFormFeedback.classList.add("error");
            return;
        }

        const isEditing = editingBrandId !== null;
        const url = isEditing
            ? `${API_BASE_URL}/admin/brands/${editingBrandId}`
            : `${API_BASE_URL}/admin/brands`;
        const method = isEditing ? "PUT" : "POST";

        saveBrandButton.disabled = true;
        saveBrandButton.textContent = isEditing ? "Updating..." : "Saving...";

        try {
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to save brand.");
            }

            closeBrandModal();
            await loadBrands();
            showBrandMessage(isEditing ? "Brand updated." : "Brand created.");

        } catch (error) {
            console.error("Brand save error:", error);
            brandFormFeedback.textContent = error.message;
            brandFormFeedback.classList.add("error");
        } finally {
            saveBrandButton.disabled = false;
            saveBrandButton.textContent = isEditing ? "Update Brand" : "Save Brand";
        }
    });

    // Delete category
    async function deleteCategory(category) {
        if (!confirm(`Delete category "${category.name}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/categories/${category.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to delete category.");
            }

            await loadCategories();
            showCategoryMessage("Category deleted.");

        } catch (error) {
            console.error("Category delete error:", error);
            showCategoryMessage(error.message);
        }
    }

    // Delete brand
    async function deleteBrand(brand) {
        if (!confirm(`Delete brand "${brand.name}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/brands/${brand.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to delete brand.");
            }

            await loadBrands();
            showBrandMessage("Brand deleted.");

        } catch (error) {
            console.error("Brand delete error:", error);
            showBrandMessage(error.message);
        }
    }

    // Search handlers
    categorySearchInput.addEventListener("input", renderCategories);
    brandSearchInput.addEventListener("input", renderBrands);

    // Refresh buttons
    addCategoryButton.addEventListener("click", () => openCategoryModal());
    addBrandButton.addEventListener("click", () => openBrandModal());

    // Message helpers
    function showCategoryMessage(message) {
        categoryMessage.textContent = message;
        categoryMessage.hidden = false;
    }
    function hideCategoryMessage() {
        categoryMessage.textContent = "";
        categoryMessage.hidden = true;
    }
    function showBrandMessage(message) {
        brandMessage.textContent = message;
        brandMessage.hidden = false;
    }
    function hideBrandMessage() {
        brandMessage.textContent = "";
        brandMessage.hidden = true;
    }


    // ============================================
    // CUSTOMER ORDERS MODAL
    // ============================================

    function openCustomerOrders(customer) {
        customerOrdersCustomerName.textContent = customer.name;
        customerOrdersContent.replaceChildren();

        const loading = createElement("p", "Loading orders...", "admin-table-message");
        customerOrdersContent.appendChild(loading);

        customerOrdersModal.hidden = false;
        closeCustomerOrdersButton.focus();

        loadCustomerOrders(customer.id);
    }

    function closeCustomerOrders() {
        customerOrdersModal.hidden = true;
    }

    closeCustomerOrdersButton.addEventListener("click", closeCustomerOrders);
    closeCustomerOrdersOverlay.addEventListener("click", closeCustomerOrders);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !customerOrdersModal.hidden) {
            closeCustomerOrders();
        }
    });

    async function loadCustomerOrders(customerId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/customers/${customerId}/orders`,
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load customer orders.");
            }

            renderCustomerOrders(result.data);

        } catch (error) {
            console.error("Customer orders loading error:", error);
            customerOrdersContent.replaceChildren();
            customerOrdersContent.appendChild(
                createElement("p", error.message, "admin-table-message")
            );
        }
    }

    function renderCustomerOrders(data) {
        const { customer, orders, pagination } = data;

        customerOrdersContent.replaceChildren();

        // Customer info header
        const infoCard = createElement("div", "", "order-detail-card");
        infoCard.appendChild(createElement("h3", "Customer Information"));

        const namePara = document.createElement("p");
        const nameStrong = document.createElement("strong");
        nameStrong.textContent = "Name: ";
        namePara.append(nameStrong, document.createTextNode(customer.name));
        infoCard.appendChild(namePara);

        const emailPara = document.createElement("p");
        const emailStrong = document.createElement("strong");
        emailStrong.textContent = "Email: ";
        emailPara.append(emailStrong, document.createTextNode(customer.email));
        infoCard.appendChild(emailPara);

        customerOrdersContent.appendChild(infoCard);


        // Pagination info
        if (pagination.totalOrders > 0) {
            const paginationInfo = createElement(
                "p",
                `Showing page ${pagination.currentPage} of ${pagination.totalPages} (${pagination.totalOrders} total orders)`,
                "pagination-info"
            );
            paginationInfo.style.marginBottom = "16px";
            paginationInfo.style.color = "#75645e";
            paginationInfo.style.fontSize = "13px";
            customerOrdersContent.appendChild(paginationInfo);
        }

        // Orders heading
        customerOrdersContent.appendChild(
            createElement("h3", "Order History", "order-items-heading")
        );

        if (!orders.length) {
            customerOrdersContent.appendChild(
                createElement("p", "No orders found for this customer.", "admin-table-message")
            );
            return;
        }

        // Orders table
        const tableContainer = createElement("div", "");
        tableContainer.style.overflowX = "auto";

        const table = createElement("table", "", "order-items-table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        ["Order Number", "Date", "Status", "Payment", "Items", "Total"].forEach(label => {
            headerRow.appendChild(createElement("th", label));
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        orders.forEach(order => {
            const row = document.createElement("tr");

            const itemCount = (order.items || []).reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );

            row.appendChild(createElement("td", order.orderNumber));
            row.appendChild(createElement("td", formatDate(order.createdAt)));
            row.appendChild(createElement("td", order.status));
            row.appendChild(createElement("td", order.paymentMethod));
            row.appendChild(createElement("td", String(itemCount)));
            row.appendChild(createElement("td", formatPrice(order.total)));

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        customerOrdersContent.appendChild(tableContainer);

        // Pagination controls (if needed)
        if (pagination.totalPages > 1) {
            const paginationControls = createElement("div", "", "admin-pagination");
            paginationControls.style.marginTop = "20px";

            const prevButton = createElement("button", "Previous", "admin-pagination-button");
            prevButton.disabled = pagination.currentPage <= 1;
            prevButton.addEventListener("click", () => {
                loadCustomerOrdersPage(customer.id, pagination.currentPage - 1);
            });

            const nextButton = createElement("button", "Next", "admin-pagination-button");
            nextButton.disabled = pagination.currentPage >= pagination.totalPages;
            nextButton.addEventListener("click", () => {
                loadCustomerOrdersPage(customer.id, pagination.currentPage + 1);
            });

            const pageInfo = createElement("span", `Page ${pagination.currentPage} of ${pagination.totalPages}`);

            paginationControls.append(prevButton, pageInfo, nextButton);
            customerOrdersContent.appendChild(paginationControls);
        }
    }

    async function loadCustomerOrdersPage(customerId, page) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/customers/${customerId}/orders?page=${page}&limit=20`,
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load customer orders.");
            }

            renderCustomerOrders(result.data);

        } catch (error) {
            console.error("Customer orders pagination error:", error);
            customerOrdersContent.replaceChildren();
            customerOrdersContent.appendChild(
                createElement("p", error.message, "admin-table-message")
            );
        }
    }



    // Product search
    productSearchInput.addEventListener("input", renderProducts);

    // Product status filter
    productStatusFilter.addEventListener("change", renderProducts);

    // Product inventory filter
    productStockFilter.addEventListener("change", renderProducts);

    // Refresh products
    refreshProductsButton.addEventListener("click", loadProducts);

    // Customer search
    customerSearchInput.addEventListener("input", renderCustomers);

    // Customer status filter
    customerStatusFilter.addEventListener("change", renderCustomers);

    // Refresh customers
    refreshCustomersButton.addEventListener("click", loadCustomers);



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

    let revenueChart = null;

    async function initializeDashboard() {
        const hasAccess = await checkAdminAccess();

        if (!hasAccess) return;

        await Promise.all([
            loadOrders(),
            loadDashboardStats(),
            loadProducts(),
            loadCustomers(),
            loadCategories(),
            loadBrands()
        ]);

        // Load initial analytics for dashboard
        await loadDashboardAnalytics();

        // Period selector handler
        const periodSelect = document.getElementById("analytics-period");
        if (periodSelect) {
            periodSelect.addEventListener("change", loadDashboardAnalytics);
        }
    }

    async function loadDashboardAnalytics() {
        const periodSelect = document.getElementById("analytics-period");
        const period = periodSelect ? periodSelect.value : "month";

        try {
            // Load all analytics in parallel
            const [summaryRes, revenueRes, topProductsRes, conversionRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/analytics/summary?period=${period}`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/admin/analytics/revenue?period=${period}`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/admin/analytics/top-products?period=${period}`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/admin/analytics/conversion?period=${period}`, { credentials: "include" })
            ]);

            const [summary, revenue, topProducts, conversion] = await Promise.all([
                summaryRes.json(),
                revenueRes.json(),
                topProductsRes.json(),
                conversionRes.json()
            ]);

            if (summary.success) renderAnalyticsSummary(summary.data);
            if (revenue.success) renderRevenueChart(revenue.data);
            if (topProducts.success) renderTopProducts(topProducts.data);
            if (conversion.success) renderConversionFunnel(conversion.data);

        } catch (error) {
            console.error("Dashboard analytics error:", error);
        }
    }

    function renderAnalyticsSummary(data) {
        const container = document.getElementById("analytics-summary-cards");
        if (!container) return;

        const cards = [
            { label: "Total Revenue", value: formatPrice(data.totalRevenue), sub: `${data.period} revenue` },
            { label: "Total Orders", value: data.totalOrders, sub: `${data.period} orders` },
            { label: "Total Customers", value: data.totalCustomers, sub: "Registered users" },
            { label: "Active Products", value: data.totalProducts, sub: "Currently active" },
            { label: "Avg Order Value", value: formatPrice(data.avgOrderValue), sub: "Per order" },
            { label: "Conversion Rate", value: `${data.conversionRate}%`, sub: "Orders → Paid" }
        ];

        container.innerHTML = cards.map(card => `
            <article class="admin-stat-card">
                <p>${card.label}</p>
                <h3>${card.value}</h3>
                <span>${card.sub}</span>
            </article>
        `).join("");
    }

    function renderRevenueChart(data) {
        const ctx = document.getElementById("revenue-chart");
        if (!ctx) return;

        const labels = data.revenue.map(r => r.period);
        const revenueValues = data.revenue.map(r => r.revenue);
        const orderValues = data.revenue.map(r => r.orders);

        if (revenueChart) {
            revenueChart.destroy();
        }

        revenueChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Revenue (NPR)",
                        data: revenueValues,
                        backgroundColor: "rgba(156, 100, 116, 0.8)",
                        borderColor: "#9c6474",
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: "y"
                    },
                    {
                        label: "Orders",
                        data: orderValues,
                        type: "line",
                        fill: false,
                        borderColor: "#794653",
                        backgroundColor: "#794653",
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: "#794653",
                        tension: 0.2,
                        yAxisID: "y1"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { position: "top" },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `Revenue: ${formatPrice(context.raw)}`;
                                }
                                return `Orders: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: "linear",
                        position: "left",
                        beginAtZero: true,
                        title: { display: true, text: "Revenue (NPR)" },
                        ticks: { callback: (v) => formatPrice(v) }
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                        beginAtZero: true,
                        title: { display: true, text: "Orders" },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    function renderTopProducts(data) {
        const revenueBody = document.getElementById("top-products-revenue-body");
        const quantityBody = document.getElementById("top-products-quantity-body");

        if (revenueBody) {
            revenueBody.innerHTML = data.topByRevenue.length
                ? data.topByRevenue.map(p => `
                    <tr>
                        <td>${p.productName}</td>
                        <td>${p.totalQuantity}</td>
                        <td>${formatPrice(p.totalRevenue)}</td>
                        <td>${p.orderCount}</td>
                    </tr>
                `).join("")
                : '<tr><td colspan="4" class="admin-table-message">No data</td></tr>';
        }

        if (quantityBody) {
            quantityBody.innerHTML = data.topByQuantity.length
                ? data.topByQuantity.map(p => `
                    <tr>
                        <td>${p.productName}</td>
                        <td>${p.totalQuantity}</td>
                        <td>${formatPrice(p.totalRevenue)}</td>
                        <td>${p.orderCount}</td>
                    </tr>
                `).join("")
                : '<tr><td colspan="4" class="admin-table-message">No data</td></tr>';
        }
    }

    function renderConversionFunnel(data) {
        const elements = {
            sessions: document.getElementById("funnel-sessions"),
            orders: document.getElementById("funnel-orders"),
            paid: document.getElementById("funnel-paid"),
            delivered: document.getElementById("funnel-delivered"),
            sessionToOrder: document.getElementById("funnel-session-to-order"),
            orderToPayment: document.getElementById("funnel-order-to-payment"),
            orderToComplete: document.getElementById("funnel-order-to-complete")
        };

        if (elements.sessions) elements.sessions.textContent = data.totalSessions;
        if (elements.orders) elements.orders.textContent = data.totalOrders;
        if (elements.paid) elements.paid.textContent = data.paidOrders;
        if (elements.delivered) elements.delivered.textContent = data.completedOrders;
        if (elements.sessionToOrder) elements.sessionToOrder.textContent = `${data.sessionToOrderRate}%`;
        if (elements.orderToPayment) elements.orderToPayment.textContent = `${data.orderToPaymentRate}%`;
        if (elements.orderToComplete) elements.orderToComplete.textContent = `${data.orderToCompleteRate}%`;
    }

    initializeDashboard();

});
