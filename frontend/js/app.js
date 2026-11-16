"use strict";

// ============================================
// GANESH GRACE - FRONTEND APPLICATION
// ============================================

const API_BASE_URL = "http://localhost:3000/api";

const currentYear = document.getElementById("current-year");
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");

// ============================================
// INITIALIZE PAGE
// ============================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ============================================
// SHOPPING CART - PERSISTED IN LOCAL STORAGE
// ============================================

const CART_STORAGE_KEY = "ganesh-grace-cart";

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) {
            return new Map();
        }

        return new Map(
            savedCart
                .filter(
                    ([id, quantity]) =>
                        Number.isInteger(Number(id)) &&
                        Number.isInteger(quantity) &&
                        Number(id) > 0 &&
                        quantity > 0
                )
                .map(([id, quantity]) => [Number(id), quantity])
        );
    } catch (error) {
        console.error("Unable to load saved cart:", error);
        return new Map();
    }
}

const cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(Array.from(cart.entries()))
        );
    } catch (error) {
        console.error("Unable to save cart:", error);
    }
}

// ============================================
// FORMAT PRICE
// ============================================

function formatPrice(price) {
    return `NPR ${Number(price).toLocaleString("en-NP")}`;
}

// ============================================
// FETCH PRODUCTS FROM BACKEND
// ============================================

async function fetchProducts() {
    if (!productGrid) {
        console.error("Product grid element not found.");
        return;
    }

    productGrid.textContent = "Loading products...";

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid product response from API.");
        }

        renderProducts(result.data);

    } catch (error) {
        console.error("Unable to load products:", error);

        productGrid.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "We couldn't load our products. Please try again.";

        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.textContent = "Retry";
        retryButton.addEventListener("click", fetchProducts);

        productGrid.append(message, retryButton);
    }
}

const categoryGrid = document.getElementById("category-grid");
const brandGrid = document.getElementById("brand-grid");

// ============================================
// FETCH & RENDER CATEGORIES
// ============================================

async function fetchCategories() {
    if (!categoryGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid categories response");
        }

        renderCategories(result.data);
    } catch (error) {
        console.error("Unable to load categories:", error);
        categoryGrid.innerHTML = "<p>Could not load categories.</p>";
    }
}

function renderCategories(categories) {
    categoryGrid.replaceChildren();

    categories.forEach(category => {
        const card = document.createElement("article");
        card.className = "category-card";
        card.dataset.categorySlug = category.slug;

        const name = document.createElement("h3");
        name.textContent = category.name;

        const count = document.createElement("p");
        count.textContent = `${category.productCount} product${category.productCount !== 1 ? "s" : ""}`;

        card.append(name, count);
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            window.location.href = `./shop.html?category=${category.slug}`;
        });

        categoryGrid.appendChild(card);
    });
}

// ============================================
// FETCH & RENDER BRANDS
// ============================================

async function fetchBrands() {
    if (!brandGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid brands response");
        }

        renderBrands(result.data);
    } catch (error) {
        console.error("Unable to load brands:", error);
        brandGrid.innerHTML = "<p>Could not load brands.</p>";
    }
}

function renderBrands(brands) {
    brandGrid.replaceChildren();

    brands.forEach(brand => {
        const card = document.createElement("article");
        card.className = "brand-card";

        const name = document.createElement("h3");
        name.textContent = brand.name;

        const count = document.createElement("p");
        count.textContent = `${brand.productCount} product${brand.productCount !== 1 ? "s" : ""}`;

        card.append(name, count);
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            window.location.href = `./shop.html?brand=${brand.id}`;
        });

        brandGrid.appendChild(card);
    });
}


// ============================================
// RENDER PRODUCT CARDS
// ============================================

function renderProducts(products) {
    productGrid.replaceChildren();

    if (products.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No products are available right now.";

        productGrid.appendChild(message);
        return;
    }

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        // Product image
        const image = document.createElement("img");

        image.className = "product-image";
        image.src = `./images/${getProductImage(product)}`;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.removeAttribute("src");
            image.alt = `${product.name} image unavailable`;
        }, { once: true });

        // Product information container
        const info = document.createElement("div");
        info.className = "product-info";

        // Brand
        const brand = document.createElement("p");
        brand.className = "product-brand";
        brand.textContent = product.brand?.name || "Ganesh Grace"

        // Product name
        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        // Rating
        const rating = document.createElement("p");
        rating.className = "product-rating";

        if (Number.isFinite(Number(product.rating))) {
            rating.textContent =
                `★ ${Number(product.rating).toFixed(1)} / 5`;
        } else {
            rating.textContent = "New arrival";
        }

        // Price
        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        // Product action buttons
        const productActions = document.createElement("div");
        productActions.className = "product-actions";

        // Add to Cart button
        const addToCartButton = document.createElement("button");

        addToCartButton.className = "add-to-cart";
        addToCartButton.type = "button";
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        // Buy Now button
        const buyNowButton = document.createElement("button");

        buyNowButton.className = "buy-now";
        buyNowButton.type = "button";
        buyNowButton.textContent = "Buy Now";

        buyNowButton.addEventListener("click", () => {
            buyNow(product.id);
        });

        productActions.append(addToCartButton, buyNowButton);

        info.append(brand, name, rating, price, productActions);
        card.append(image, info);

        productGrid.appendChild(card);
    });
}

// ============================================
// TEMPORARY PRODUCT IMAGE MAPPING
// ============================================

function getProductImage(product) {
    const imageNames = {
        1: "cleanser.jpg",
        2: "moisturizer.jpg",
        3: "serum.jpg",
        4: "sunscreen.jpg"
    };

    return imageNames[product.id] || "placeholder.jpg";
}

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================

function addToCart(productId) {
    const currentQuantity = cart.get(productId) || 0;

    cart.set(productId, currentQuantity + 1);

    saveCart();
    updateCartCount();

    console.log("Cart updated:", Array.from(cart.entries()));
}

function buyNow(productId) {
    const checkoutSelection = {
        productId: Number(productId),
        quantity: 1
    };

    try {
        sessionStorage.setItem(
            "gg_buy_now",
            JSON.stringify(checkoutSelection)
        );

        window.location.href = "./checkout.html";
    } catch (error) {
        console.error("Unable to prepare Buy Now checkout:", error);
        alert("Unable to start checkout. Please try again.");
    }
}

function updateCartCount() {
    if (!cartCount) return;

    const totalItems = Array.from(cart.values()).reduce(
        (total, quantity) => total + quantity,
        0
    );

    cartCount.textContent = totalItems;
}

function getCartSubtotal(products) {
    return products.reduce((total, product) => {
        const quantity = cart.get(product.id) || 0;

        return total + Number(product.price) * quantity;
    }, 0);
}

// ============================================
// HERO BANNER SLIDER
// ============================================

const heroBannerTrack = document.getElementById("hero-banner-track");
const heroBannerNav = document.getElementById("hero-banner-nav");
const heroBannerPrev = document.getElementById("hero-banner-prev");
const heroBannerNext = document.getElementById("hero-banner-next");

let heroCurrentSlide = 0;
let heroSlideInterval = null;
const HERO_AUTO_SLIDE_DELAY = 5000;

async function fetchHeroBanners() {
    if (!heroBannerTrack) return;

    try {
        const response = await fetch(`${API_BASE_URL}/hero-banners`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid hero banners response");
        }

        renderHeroBanners(result.data);
    } catch (error) {
        console.error("Unable to load hero banners:", error);
        // Fallback to static banners
        renderHeroBanners(getFallbackHeroBanners());
    }
}

function getFallbackHeroBanners() {
    return [
        {
            id: 1,
            title: "New Arrivals",
            subtitle: "Discover the latest in skincare",
            image: "./images/hero-banner-1.jpg",
            link: "./shop.html?new=true"
        },
        {
            id: 2,
            title: "Summer Essentials",
            subtitle: "Protect & glow all season",
            image: "./images/hero-banner-2.jpg",
            link: "./shop.html?category=sun-protection"
        },
        {
            id: 3,
            title: "Best Sellers",
            subtitle: "Customer favorites at great prices",
            image: "./images/hero-banner-3.jpg",
            link: "./shop.html?sort=featured"
        }
    ];
}

function renderHeroBanners(banners) {
    if (!heroBannerTrack || !heroBannerNav) return;

    heroBannerTrack.innerHTML = "";
    heroBannerNav.innerHTML = "";

    banners.forEach((banner, index) => {
        // Create slide
        const slide = document.createElement("div");
        slide.className = "hero-banner-slide";
        slide.innerHTML = `
            <a href="${banner.link}" aria-label="${banner.title}">
                <img
                    class="hero-banner-image"
                    src="${banner.image}"
                    alt="${banner.title}"
                    loading="${index === 0 ? 'eager' : 'lazy'}"
                >
            </a>
        `;
        heroBannerTrack.appendChild(slide);

        // Create dot
        const dot = document.createElement("button");
        dot.className = "hero-banner-dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => goToSlide(index));
        heroBannerNav.appendChild(dot);
    });

    // Start auto-slide
    startHeroAutoSlide();
}

function goToSlide(index) {
    const slides = heroBannerTrack.querySelectorAll(".hero-banner-slide");
    const dots = heroBannerNav.querySelectorAll(".hero-banner-dot");

    if (slides.length === 0) return;

    heroCurrentSlide = (index + slides.length) % slides.length;

    heroBannerTrack.style.transform = `translateX(-${heroCurrentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === heroCurrentSlide);
    });

    resetHeroAutoSlide();
}

function nextSlide() {
    goToSlide(heroCurrentSlide + 1);
}

function prevSlide() {
    goToSlide(heroCurrentSlide - 1);
}

function startHeroAutoSlide() {
    heroSlideInterval = setInterval(nextSlide, HERO_AUTO_SLIDE_DELAY);
}

function resetHeroAutoSlide() {
    clearInterval(heroSlideInterval);
    startHeroAutoSlide();
}

// Hero banner event listeners
if (heroBannerPrev) {
    heroBannerPrev.addEventListener("click", prevSlide);
}
if (heroBannerNext) {
    heroBannerNext.addEventListener("click", nextSlide);
}

// Pause auto-slide on hover
if (heroBannerTrack) {
    heroBannerTrack.addEventListener("mouseenter", () => clearInterval(heroSlideInterval));
    heroBannerTrack.addEventListener("mouseleave", startHeroAutoSlide);
}

// ============================================
// CATEGORY SHORTCUTS (Horizontal Scroll)
// ============================================

const categoryShortcutsTrack = document.getElementById("category-shortcuts-track");

async function fetchCategoryShortcuts() {
    if (!categoryShortcutsTrack) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid categories response");
        }

        // Only show top-level categories (no parent) for shortcuts
        const topLevelCategories = result.data.filter(c => !c.parentId);
        renderCategoryShortcuts(topLevelCategories);
    } catch (error) {
        console.error("Unable to load category shortcuts:", error);
        categoryShortcutsTrack.innerHTML = "<p>Could not load categories.</p>";
    }
}

function renderCategoryShortcuts(categories) {
    categoryShortcutsTrack.replaceChildren();

    categories.forEach(category => {
        const card = document.createElement("a");
        card.className = "category-shortcut-card";
        card.href = `./shop.html?category=${category.slug}`;
        card.setAttribute("aria-label", `Shop ${category.name}`);

        // Use category image if available, otherwise placeholder
        const imageUrl = category.image
            ? `./images/categories/${category.image}`
            : `./images/category-${category.slug}.jpg`;

        card.innerHTML = `
            <img
                class="category-shortcut-image"
                src="${imageUrl}"
                alt="${category.name}"
                loading="lazy"
            >
            <span class="category-shortcut-name">${category.name}</span>
        `;

        card.addEventListener("error", (e) => {
            if (e.target.tagName === "IMG") {
                e.target.src = "./images/placeholder-category.jpg";
            }
        }, true);

        categoryShortcutsTrack.appendChild(card);
    });
}

// ============================================
// FEATURED CATEGORIES
// ============================================

const featuredCategoriesGrid = document.getElementById("featured-categories-grid");

async function fetchFeaturedCategories() {
    if (!featuredCategoriesGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid categories response");
        }

        // Show categories with most products (top 5)
        const sorted = [...result.data].sort((a, b) => b.productCount - a.productCount);
        const featured = sorted.slice(0, 5);
        renderFeaturedCategories(featured);
    } catch (error) {
        console.error("Unable to load featured categories:", error);
        featuredCategoriesGrid.innerHTML = "<p>Could not load featured categories.</p>";
    }
}

function renderFeaturedCategories(categories) {
    featuredCategoriesGrid.replaceChildren();

    categories.forEach(category => {
        const card = document.createElement("a");
        card.className = "featured-category-card";
        card.href = `./shop.html?category=${category.slug}`;
        card.setAttribute("aria-label", `Shop ${category.name} (${category.productCount} products)`);

        const imageUrl = category.image
            ? `./images/categories/${category.image}`
            : `./images/category-${category.slug}.jpg`;

        card.innerHTML = `
            <img
                class="featured-category-image"
                src="${imageUrl}"
                alt="${category.name}"
                loading="lazy"
            >
            <span class="featured-category-name">${category.name}</span>
        `;

        featuredCategoriesGrid.appendChild(card);
    });
}

// ============================================
// PROMO BANNER
// ============================================

const promoBannerCard = document.getElementById("promo-banner-card");

async function fetchPromoBanner() {
    if (!promoBannerCard) return;

    try {
        const response = await fetch(`${API_BASE_URL}/promo-banner`);
        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error("Invalid promo banner response");
        }

        renderPromoBanner(result.data);
    } catch (error) {
        console.error("Unable to load promo banner:", error);
        // Fallback
        renderPromoBanner({
            title: "Summer Sale",
            subtitle: "Up to 50% off selected items",
            image: "./images/promo-banner.jpg",
            link: "./shop.html?sale=true"
        });
    }
}

function renderPromoBanner(banner) {
    promoBannerCard.innerHTML = `
        <a class="promo-banner-link" href="${banner.link}" aria-label="${banner.title}">
            <img
                class="promo-banner-image"
                src="${banner.image}"
                alt="${banner.title}"
                loading="eager"
            >
        </a>
    `;
}

// ============================================
// SPECIAL OFFERS
// ============================================

const specialOffersGrid = document.getElementById("special-offers-grid");

async function fetchSpecialOffers() {
    if (!specialOffersGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products?onSale=true&limit=8`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid special offers response");
        }

        renderSpecialOffers(result.data);
    } catch (error) {
        console.error("Unable to load special offers:", error);
        specialOffersGrid.innerHTML = "<p>Could not load special offers.</p>";
    }
}

function renderSpecialOffers(products) {
    specialOffersGrid.replaceChildren();

    if (products.length === 0) {
        specialOffersGrid.innerHTML = "<p>No special offers available right now.</p>";
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product, true);
        specialOffersGrid.appendChild(card);
    });
}

// ============================================
// RECOMMENDED PRODUCTS
// ============================================

const recommendedGrid = document.getElementById("recommended-grid");

async function fetchRecommendedProducts() {
    if (!recommendedGrid) return;

    try {
        // For now, fetch featured/bestselling products
        // In future, this could be personalized based on user history
        const response = await fetch(`${API_BASE_URL}/products?featured=true&limit=8`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid recommended products response");
        }

        renderRecommendedProducts(result.data);
    } catch (error) {
        console.error("Unable to load recommended products:", error);
        recommendedGrid.innerHTML = "<p>Could not load recommendations.</p>";
    }
}

function renderRecommendedProducts(products) {
    recommendedGrid.replaceChildren();

    if (products.length === 0) {
        recommendedGrid.innerHTML = "<p>No recommendations available.</p>";
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product, false);
        recommendedGrid.appendChild(card);
    });
}

// ============================================
// SHARED PRODUCT CARD CREATION
// ============================================

function createProductCard(product, isSpecialOffer = false) {
    const card = document.createElement("article");
    card.className = "product-card" + (isSpecialOffer && product.originalPrice ? " has-discount" : "");

    // Product image
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = `./images/${getProductImage(product)}`;
    image.alt = product.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.removeAttribute("src");
        image.alt = `${product.name} image unavailable`;
    }, { once: true });

    // Product information container
    const info = document.createElement("div");
    info.className = "product-info";

    // Brand
    const brand = document.createElement("p");
    brand.className = "product-brand";
    brand.textContent = product.brand?.name || "Ganesh Grace";

    // Product name
    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    // Rating
    const rating = document.createElement("p");
    rating.className = "product-rating";

    if (Number.isFinite(Number(product.rating))) {
        rating.textContent = `★ ${Number(product.rating).toFixed(1)} / 5`;
    } else {
        rating.textContent = "New arrival";
    }

    // Price row
    const priceRow = document.createElement("div");
    priceRow.className = "product-price-row";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    priceRow.appendChild(price);

    // Original price and discount if on sale
    if (isSpecialOffer && product.originalPrice && product.originalPrice > product.price) {
        const originalPrice = document.createElement("p");
        originalPrice.className = "product-original-price";
        originalPrice.textContent = formatPrice(product.originalPrice);

        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const discount = document.createElement("p");
        discount.className = "product-discount";
        discount.textContent = `-${discountPercent}%`;

        priceRow.append(originalPrice, discount);
    }

    // Add to cart button
    const addToCartButton = document.createElement("button");
    addToCartButton.className = "add-to-cart";
    addToCartButton.type = "button";
    addToCartButton.textContent = "Add to Cart";

    addToCartButton.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product.id);
    });

    info.append(brand, name, rating, priceRow, addToCartButton);
    card.append(image, info);

    // Make card clickable to go to product detail
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
            window.location.href = `./product.html?id=${product.id}`;
        }
    });

    return card;
}

// ============================================
// SEARCH FUNCTIONALITY (Header Search Form)
// ============================================

const headerSearchForm = document.getElementById("header-search-form");
const headerSearchInput = document.getElementById("header-search-input");

if (headerSearchForm) {
    headerSearchForm.addEventListener("submit", (e) => {
        const query = headerSearchInput?.value?.trim();
        if (!query) {
            e.preventDefault();
            headerSearchInput?.focus();
        }
        // Form naturally submits to shop.html with ?search= query param
    });
}

// ============================================
// START APPLICATION
// ============================================

// Homepage-specific initializations
if (document.getElementById("hero-banner-track")) {
    fetchHeroBanners();
    fetchCategoryShortcuts();
    fetchFeaturedCategories();
    fetchPromoBanner();
    fetchSpecialOffers();
    fetchRecommendedProducts();
}

// Legacy product grid (for backward compatibility)
fetchProducts();
fetchCategories();
fetchBrands();
updateCartCount();
