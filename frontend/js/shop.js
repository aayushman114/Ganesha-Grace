"use strict";

// ============================================
// GANESHA GRACE - SHOP PAGE
// ============================================

// Use centralized config (loaded via config.js script)
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://127.0.0.1:3002/api";

const currentYear = document.getElementById("current-year");
const cartCount = document.getElementById("cart-count");

const categoryGrid = document.getElementById("category-grid");
const brandGrid = document.getElementById("brand-grid");
const productGrid = document.getElementById("product-grid");
const productsSection = document.getElementById("products");
const productsSectionTitle = document.getElementById("products-section-title");
const productsSectionSubtitle = document.getElementById("products-section-subtitle");
const sortSelect = document.getElementById("sort-select");
const pagination = document.getElementById("pagination");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const backToCategoriesBtn = document.getElementById("back-to-categories");
const categoriesSection = document.getElementById("categories");
const brandsSection = document.getElementById("brands");

// Sidebar elements
const categoryTree = document.getElementById("category-tree");
const clearCategoryFilterBtn = document.getElementById("clear-category-filter");
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");
const applyPriceBtn = document.getElementById("apply-price");
const ratingFilter = document.getElementById("rating-filter");
const inStockOnly = document.getElementById("in-stock-only");
const clearAllFiltersBtn = document.getElementById("clear-all-filters");
const sidebarToggle = document.getElementById("sidebar-toggle");
const shopSidebar = document.getElementById("shop-sidebar");

const PRODUCTS_PER_PAGE = 12;
const CART_STORAGE_KEY = window.APP_CONFIG?.CART_STORAGE_KEY || "ganesh-grace-cart";

let cart = new Map();
let allCategories = [];
let allBrands = [];
let filteredProducts = [];
let currentPage = 1;
let totalPages = 1;

let currentFilter = {
    category: null,      // { type: 'main'|'sub', id, slug, name, parentSlug }
    brand: null,
    priceMin: null,
    priceMax: null,
    rating: null,        // minimum rating
    inStockOnly: true
};

// ============================================
// INITIALIZE PAGE
// ============================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        if (!Array.isArray(savedCart)) return new Map();
        return new Map(savedCart.filter(([id, qty]) => Number.isInteger(Number(id)) && Number.isInteger(qty) && Number(id) > 0 && qty > 0).map(([id, qty]) => [Number(id), qty]));
    } catch (e) {
        console.error("Unable to load cart:", e);
        return new Map();
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.from(cart.entries())));
    } catch (e) {
        console.error("Unable to save cart:", e);
    }
}

function updateCartCount() {
    if (!cartCount) return;
    const total = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
    cartCount.textContent = total;
}

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP")}`;
}

function getProductImage(product) {
    const imageNames = {
        1: "cleanser.jpg",
        2: "moisturizer.jpg",
        3: "serum.jpg",
        4: "sunscreen.jpg"
    };
    return imageNames[product.id] || "placeholder.jpg";
}

function getCategoryIcon(slug) {
    const icons = {
        "skincare": "🧴",
        "derma-cosmetics": "💊",
        "haircare": "🧴",
        "body-care": "🧴",
        "lip-care": "💄",
        "herbal-botanical-cosmetics": "🌿",
        "mens-grooming": "🪒",
        "fragrance-deodorants": "🌸",
        "makeup-beauty": "💄",
        "personal-hygiene": "🧼"
    };
    return icons[slug] || "📦";
}

// ============================================
// FETCH CATEGORIES (with hierarchy)
// ============================================

async function fetchCategories() {
    if (!categoryGrid && !categoryTree) return;

    if (categoryGrid) categoryGrid.innerHTML = '<div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #82716b;">Loading categories...</div>';
    if (categoryTree) categoryTree.innerHTML = '<li style="padding: 20px; text-align: center; color: #82716b;">Loading...</li>';

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid categories response");
        }

        allCategories = result.data;
        renderCategoryGrid(allCategories);
        renderCategoryTree(allCategories);

    } catch (error) {
        console.error("Unable to load categories:", error);
        if (categoryGrid) categoryGrid.innerHTML = '<div class="empty-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #b42318;">Could not load categories.</div>';
        if (categoryTree) categoryTree.innerHTML = '<li style="padding: 20px; text-align: center; color: #b42318;">Could not load categories.</li>';
    }
}

function renderCategoryGrid(categories) {
    if (!categoryGrid) return;
    categoryGrid.replaceChildren();

    if (categories.length === 0) {
        categoryGrid.innerHTML = '<div class="empty-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #82716b;">No categories available.</div>';
        return;
    }

    categories.forEach(category => {
        const card = document.createElement("a");
        card.className = "category-card";
        card.href = `./shop.html?category=${category.slug}`;

        const image = document.createElement("div");
        image.className = "category-image";
        image.style.display = "flex";
        image.style.alignItems = "center";
        image.style.justifyContent = "center";
        image.style.fontSize = "32px";
        image.textContent = getCategoryIcon(category.slug);

        const name = document.createElement("h3");
        name.textContent = category.name;

        const count = document.createElement("p");
        count.textContent = `${category.productCount} product${category.productCount !== 1 ? "s" : ""}`;

        card.append(image, name, count);
        categoryGrid.appendChild(card);
    });
}

function renderCategoryTree(categories) {
    if (!categoryTree) return;
    categoryTree.replaceChildren();

    categories.forEach(mainCat => {
        const item = document.createElement("li");
        item.className = "category-tree-item";

        // Main category button
        const mainBtn = document.createElement("button");
        mainBtn.className = "category-tree-main";
        mainBtn.type = "button";
        mainBtn.dataset.mainSlug = mainCat.slug;

        const icon = document.createElement("span");
        icon.textContent = getCategoryIcon(mainCat.slug);
        icon.style.marginRight = "10px";
        icon.style.fontSize = "18px";

        const name = document.createElement("span");
        name.textContent = mainCat.name;

        const count = document.createElement("span");
        count.className = "category-tree-child-count";
        count.textContent = mainCat.productCount;

        const toggle = document.createElement("button");
        toggle.className = "category-tree-toggle";
        toggle.type = "button";
        toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';

        mainBtn.append(icon, name, count, toggle);

        // Subcategories list
        const childrenList = document.createElement("ul");
        childrenList.className = "category-tree-children";

        if (mainCat.children && mainCat.children.length > 0) {
            mainCat.children.forEach(subCat => {
                const childItem = document.createElement("li");
                childItem.className = "category-tree-child";

                const childBtn = document.createElement("button");
                childBtn.className = "category-tree-child-btn";
                childBtn.type = "button";
                childBtn.dataset.subSlug = subCat.slug;
                childBtn.dataset.parentSlug = mainCat.slug;

                const childName = document.createElement("span");
                childName.textContent = subCat.name;

                const childCount = document.createElement("span");
                childCount.className = "category-tree-child-count";
                childCount.textContent = subCat.productCount;

                childBtn.append(childName, childCount);
                childBtn.addEventListener("click", () => filterBySubCategory(mainCat, subCat));

                childItem.appendChild(childBtn);
                childrenList.appendChild(childItem);
            });
        }

        // Toggle handler
        mainBtn.addEventListener("click", (e) => {
            if (e.target === toggle || e.target.closest('.category-tree-toggle')) {
                mainBtn.classList.toggle("expanded");
            } else {
                filterByMainCategory(mainCat);
            }
        });

        item.append(mainBtn, childrenList);
        categoryTree.appendChild(item);
    });
}

// ============================================
// FETCH BRANDS
// ============================================

async function fetchBrands() {
    if (!brandGrid) return;

    brandGrid.innerHTML = '<div class="loading-message">Loading brands...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid brands response");
        }

        allBrands = result.data;
        renderBrands(allBrands);

    } catch (error) {
        console.error("Unable to load brands:", error);
        brandGrid.innerHTML = '<div class="empty-message">Could not load brands.</div>';
    }
}

function renderBrands(brands) {
    brandGrid.replaceChildren();

    if (brands.length === 0) {
        brandGrid.innerHTML = '<div class="empty-message">No brands available.</div>';
        return;
    }

    brands.forEach(brand => {
        const card = document.createElement("a");
        card.className = "brand-card";
        card.href = `./shop.html?brand=${brand.id}`;

        const name = document.createElement("h3");
        name.textContent = brand.name;

        const count = document.createElement("p");
        count.textContent = `${brand.productCount} product${brand.productCount !== 1 ? "s" : ""}`;

        card.append(name, count);
        card.addEventListener("click", (e) => {
            e.preventDefault();
            filterByBrand(brand);
        });

        brandGrid.appendChild(card);
    });
}

// ============================================
// FILTER HANDLERS
// ============================================

function filterByMainCategory(mainCat) {
    currentFilter.category = { type: "main", id: mainCat.id, slug: mainCat.slug, name: mainCat.name, parentSlug: null };
    productsSectionTitle.textContent = mainCat.name;
    productsSectionSubtitle.textContent = `All products in ${mainCat.name}`;
    updateCategoryTreeSelection();
    clearCategoryFilterBtn.hidden = false;
    loadFilteredProducts();
    showProductsSection();
}

function filterBySubCategory(mainCat, subCat) {
    currentFilter.category = { type: "sub", id: subCat.id, slug: subCat.slug, name: subCat.name, parentSlug: mainCat.slug };
    productsSectionTitle.textContent = subCat.name;
    productsSectionSubtitle.textContent = `${subCat.name} · ${mainCat.name}`;
    updateCategoryTreeSelection();
    clearCategoryFilterBtn.hidden = false;
    loadFilteredProducts();
    showProductsSection();
}

function filterByBrand(brand) {
    currentFilter.brand = { id: brand.id, name: brand.name };
    productsSectionTitle.textContent = brand.name;
    productsSectionSubtitle.textContent = `All products from ${brand.name}`;
    renderBrands(allBrands); // refresh to show active
    loadFilteredProducts();
    showProductsSection();
}

function updateCategoryTreeSelection() {
    // Main categories
    document.querySelectorAll(".category-tree-main").forEach(btn => {
        const slug = btn.dataset.mainSlug;
        if (currentFilter.category && currentFilter.category.parentSlug === slug) {
            btn.classList.add("expanded");
            btn.classList.add("active");
        } else if (currentFilter.category && currentFilter.category.slug === slug && currentFilter.category.type === "main") {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Subcategories
    document.querySelectorAll(".category-tree-child-btn").forEach(btn => {
        const subSlug = btn.dataset.subSlug;
        const parentSlug = btn.dataset.parentSlug;
        if (currentFilter.category && currentFilter.category.slug === subSlug && currentFilter.category.parentSlug === parentSlug) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function clearCategoryFilter() {
    currentFilter.category = null;
    clearCategoryFilterBtn.hidden = true;
    updateCategoryTreeSelection();
    if (!currentFilter.brand) {
        hideProductsSection();
    } else {
        loadFilteredProducts();
    }
}

function clearAllFilters() {
    currentFilter = {
        category: null,
        brand: null,
        priceMin: null,
        priceMax: null,
        rating: null,
        inStockOnly: true
    };
    clearCategoryFilterBtn.hidden = true;
    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";
    if (ratingFilter) ratingFilter.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    if (inStockOnly) inStockOnly.checked = true;
    updateCategoryTreeSelection();
    renderBrands(allBrands);
    hideProductsSection();
}

function showProductsSection() {
    categoriesSection.hidden = true;
    brandsSection.hidden = true;
    productsSection.hidden = false;
    if (backToCategoriesBtn) backToCategoriesBtn.hidden = false;
    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideProductsSection() {
    categoriesSection.hidden = false;
    brandsSection.hidden = false;
    productsSection.hidden = true;
    if (backToCategoriesBtn) backToCategoriesBtn.hidden = true;
    currentPage = 1;
    categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================
// LOAD FILTERED PRODUCTS
// ============================================

async function loadFilteredProducts() {
    currentPage = 1;
    productGrid.innerHTML = '<div class="loading-message">Loading products...</div>';
    pagination.hidden = true;

    try {
        const params = new URLSearchParams();

        if (currentFilter.category) {
            params.set("category", currentFilter.category.slug);
            if (currentFilter.category.type === "main") {
                params.set("categoryTree", "true");
            }
        }

        if (currentFilter.brand) {
            params.set("brand", currentFilter.brand.id);
        }

        if (currentFilter.priceMin) params.set("priceMin", currentFilter.priceMin);
        if (currentFilter.priceMax) params.set("priceMax", currentFilter.priceMax);
        if (currentFilter.rating) params.set("rating", currentFilter.rating);
        if (currentFilter.inStockOnly) params.set("inStock", "true");

        const url = `${API_BASE_URL}/products?${params.toString()}`;
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid products response");
        }

        filteredProducts = result.data;
        applySort();
        renderProductsPage();

    } catch (error) {
        console.error("Unable to load products:", error);
        productGrid.innerHTML = `<div class="empty-message">Could not load products.<br><button class="retry-button" onclick="loadFilteredProducts()">Retry</button></div>`;
        pagination.hidden = true;
    }
}

function applySort() {
    const sort = sortSelect?.value || "featured";

    filteredProducts.sort((a, b) => {
        switch (sort) {
            case "price-asc": return Number(a.price) - Number(b.price);
            case "price-desc": return Number(b.price) - Number(a.price);
            case "rating": return Number(b.rating || 0) - Number(a.rating || 0);
            case "newest": return b.id - a.id;
            default: return 0;
        }
    });
}

function renderProductsPage() {
    productGrid.replaceChildren();

    totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = filteredProducts.slice(start, end);

    if (pageProducts.length === 0) {
        productGrid.innerHTML = '<div class="empty-message">No products found.</div>';
        pagination.hidden = true;
        return;
    }

    pageProducts.forEach(product => renderProductCard(product));

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    pagination.hidden = false;
}

function renderProductCard(product) {
    const card = document.createElement("article");
    // Show discount styling if product has originalPrice and is on sale
    if (product.originalPrice && product.originalPrice > product.price) {
        card.className = "product-card has-discount";
    } else {
        card.className = "product-card";
    }

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = `./images/${getProductImage(product)}`;
    image.alt = product.name;
    image.loading = "lazy";
    image.addEventListener("error", () => {
        image.removeAttribute("src");
        image.alt = `${product.name} image unavailable`;
    }, { once: true });

    const info = document.createElement("div");
    info.className = "product-info";

    const brand = document.createElement("p");
    brand.className = "product-brand";
    brand.textContent = product.brand?.name || "Ganesh Grace";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const rating = document.createElement("p");
    rating.className = "product-rating";
    if (Number.isFinite(Number(product.rating))) {
        rating.textContent = `★ ${Number(product.rating).toFixed(1)} / 5`;
    } else {
        rating.textContent = "New arrival";
    }

    // Price row with original price and discount
    const priceRow = document.createElement("div");
    priceRow.className = "product-price-row";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    priceRow.appendChild(price);

    // Original price and discount if on sale
    if (product.originalPrice && product.originalPrice > product.price) {
        const originalPrice = document.createElement("p");
        originalPrice.className = "product-original-price";
        originalPrice.textContent = formatPrice(product.originalPrice);

        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const discount = document.createElement("p");
        discount.className = "product-discount";
        discount.textContent = `-${discountPercent}%`;

        priceRow.append(originalPrice, discount);
    }

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const addToCartBtn = document.createElement("button");
    addToCartBtn.className = "add-to-cart";
    addToCartBtn.type = "button";
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product.id);
    });

    const buyNowBtn = document.createElement("button");
    buyNowBtn.className = "buy-now";
    buyNowBtn.type = "button";
    buyNowBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7H7l-2 8h16l-2-8z"></path>
            <circle cx="11" cy="16" r="1"></circle>
            <circle cx="19" cy="16" r="1"></circle>
        </svg>
        Buy Now
    `;
    buyNowBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        buyNow(product.id);
    });

    actions.append(addToCartBtn, buyNowBtn);
    info.append(brand, name, rating, priceRow, actions);
    card.append(image, info);

    // Make card clickable to go to product detail page
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
        window.location.href = `./product.html?id=${product.id}`;
    });

    productGrid.appendChild(card);
}

// ============================================
// CART FUNCTIONS
// ============================================

function addToCart(productId) {
    const currentQty = cart.get(productId) || 0;
    cart.set(productId, currentQty + 1);
    saveCart();
    updateCartCount();

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.style.background = "#22c55e";
    btn.style.borderColor = "#22c55e";
    btn.style.color = "#fff";
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
    }, 1500);
}

function buyNow(productId) {
    const checkoutSelection = { productId: Number(productId), quantity: 1 };
    try {
        sessionStorage.setItem("gg_buy_now", JSON.stringify(checkoutSelection));
        window.location.href = "./checkout.html";
    } catch (e) {
        console.error("Unable to prepare Buy Now:", e);
        alert("Unable to start checkout. Please try again.");
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

sortSelect?.addEventListener("change", () => {
    applySort();
    currentPage = 1;
    renderProductsPage();
});

prevPageBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProductsPage();
        productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

nextPageBtn?.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderProductsPage();
        productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

backToCategoriesBtn?.addEventListener("click", () => {
    hideProductsSection();
    currentFilter.category = null;
    clearCategoryFilterBtn.hidden = true;
});

clearCategoryFilterBtn?.addEventListener("click", clearCategoryFilter);
clearAllFiltersBtn?.addEventListener("click", clearAllFilters);

applyPriceBtn?.addEventListener("click", () => {
    const min = priceMin?.value ? Number(priceMin.value) : null;
    const max = priceMax?.value ? Number(priceMax.value) : null;
    if (min !== null && max !== null && min > max) {
        alert("Min price cannot be greater than max price");
        return;
    }
    currentFilter.priceMin = min;
    currentFilter.priceMax = max;
    loadFilteredProducts();
});

ratingFilter?.addEventListener("change", () => {
    const checked = ratingFilter.querySelectorAll('input[type="checkbox"]:checked');
    currentFilter.rating = checked.length > 0 ? Math.min(...Array.from(checked).map(cb => Number(cb.value))) : null;
    loadFilteredProducts();
});

inStockOnly?.addEventListener("change", () => {
    currentFilter.inStockOnly = inStockOnly.checked;
    loadFilteredProducts();
});

// Mobile sidebar toggle
if (sidebarToggle && shopSidebar) {
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    sidebarToggle.addEventListener("click", () => {
        shopSidebar.classList.toggle("open");
        overlay.classList.toggle("open");
    });

    overlay.addEventListener("click", () => {
        shopSidebar.classList.remove("open");
        overlay.classList.remove("open");
    });
}

// Handle URL params on load
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const catSlug = params.get("category");
    const brandId = params.get("brand");

    if (catSlug) {
        const mainCat = allCategories.find(c => c.slug === catSlug && c.parentId === null);
        const subCat = allCategories.find(c => c.slug === catSlug && c.parentId !== null);
        if (mainCat) {
            filterByMainCategory(mainCat);
        } else if (subCat) {
            const parent = allCategories.find(c => c.id === subCat.parentId);
            if (parent) filterBySubCategory(parent, subCat);
        }
    } else if (brandId) {
        const brand = allBrands.find(b => b.id === Number(brandId));
        if (brand) filterByBrand(brand);
    }
}

// ============================================
// START
// ============================================

cart = loadCart();
updateCartCount();
fetchCategories().then(() => {
    fetchBrands();
    handleUrlParams();
});
