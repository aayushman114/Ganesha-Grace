const prisma = require("./config/prisma");

// ============================================
// 10 MAIN CATEGORIES WITH SUBCATEGORIES
// ============================================
const categoryHierarchy = [
    {
        name: "Skincare",
        slug: "skincare",
        children: [
            { name: "Face wash and cleansers", slug: "face-wash-cleansers" },
            { name: "Moisturizers", slug: "moisturizers" },
            { name: "Face serums", slug: "face-serums" },
            { name: "Sunscreens", slug: "sunscreens" },
            { name: "Toners and essences", slug: "toners-essences" },
            { name: "Face masks", slug: "face-masks" }
        ]
    },
    {
        name: "Derma Cosmetics",
        slug: "derma-cosmetics",
        children: [
            { name: "Anti-acne products", slug: "anti-acne-products" },
            { name: "Pigmentation creams", slug: "pigmentation-creams" },
            { name: "Dark spot correctors", slug: "dark-spot-correctors" },
            { name: "Barrier repair creams", slug: "barrier-repair-creams" },
            { name: "Sensitive skin products", slug: "sensitive-skin-products" },
            { name: "Anti-aging formulations", slug: "anti-aging-formulations" }
        ]
    },
    {
        name: "Haircare",
        slug: "haircare",
        children: [
            { name: "Shampoos", slug: "shampoos" },
            { name: "Conditioners", slug: "conditioners" },
            { name: "Hair oils", slug: "hair-oils" },
            { name: "Hair growth cosmetic serums", slug: "hair-growth-serums" },
            { name: "Hair masks", slug: "hair-masks" },
            { name: "Anti-dandruff cosmetic products", slug: "anti-dandruff-products" },
            { name: "Hair styling products", slug: "hair-styling-products" }
        ]
    },
    {
        name: "Body Care",
        slug: "body-care",
        children: [
            { name: "Body lotions", slug: "body-lotions" },
            { name: "Body washes", slug: "body-washes" },
            { name: "Body scrubs", slug: "body-scrubs" },
            { name: "Body butters", slug: "body-butters" },
            { name: "Hand creams", slug: "hand-creams" },
            { name: "Foot creams", slug: "foot-creams" },
            { name: "Body oils", slug: "body-oils" }
        ]
    },
    {
        name: "Lip Care",
        slug: "lip-care",
        children: [
            { name: "Lip balms", slug: "lip-balms" },
            { name: "Lip masks", slug: "lip-masks" },
            { name: "Lip scrubs", slug: "lip-scrubs" },
            { name: "Tinted lip balms", slug: "tinted-lip-balms" },
            { name: "Lip repair products", slug: "lip-repair-products" }
        ]
    },
    {
        name: "Herbal & Botanical Cosmetics",
        slug: "herbal-botanical-cosmetics",
        children: [
            { name: "Aloe vera gels", slug: "aloe-vera-gels" },
            { name: "Herbal face packs", slug: "herbal-face-packs" },
            { name: "Botanical creams", slug: "botanical-creams" },
            { name: "Herbal shampoos", slug: "herbal-shampoos" },
            { name: "Natural face cleansers", slug: "natural-face-cleansers" },
            { name: "Botanical oils", slug: "botanical-oils" }
        ]
    },
    {
        name: "Men's Grooming",
        slug: "mens-grooming",
        children: [
            { name: "Men's face wash", slug: "mens-face-wash" },
            { name: "Beard oils", slug: "beard-oils" },
            { name: "Beard balms", slug: "beard-balms" },
            { name: "Aftershave products", slug: "aftershave-products" },
            { name: "Men's moisturizers", slug: "mens-moisturizers" },
            { name: "Hair styling products", slug: "mens-hair-styling-products" }
        ]
    },
    {
        name: "Fragrance & Deodorants",
        slug: "fragrance-deodorants",
        children: [
            { name: "Body mists", slug: "body-mists" },
            { name: "Deodorants", slug: "deodorants" },
            { name: "Perfumes", slug: "perfumes" },
            { name: "Roll-on fragrances", slug: "roll-on-fragrances" },
            { name: "Fragrance lotions", slug: "fragrance-lotions" }
        ]
    },
    {
        name: "Makeup & Beauty",
        slug: "makeup-beauty",
        children: [
            { name: "Foundations", slug: "foundations" },
            { name: "Lipsticks", slug: "lipsticks" },
            { name: "Concealers", slug: "concealers" },
            { name: "Mascaras", slug: "mascaras" },
            { name: "Blushes", slug: "blushes" },
            { name: "Compact powders", slug: "compact-powders" },
            { name: "Makeup removers", slug: "makeup-removers" }
        ]
    },
    {
        name: "Personal Hygiene",
        slug: "personal-hygiene",
        children: [
            { name: "Intimate hygiene washes", slug: "intimate-hygiene-washes" },
            { name: "Feminine hygiene products", slug: "feminine-hygiene-products" },
            { name: "Hand washes", slug: "hand-washes" },
            { name: "Foot hygiene products", slug: "foot-hygiene-products" },
            { name: "Gentle cleansing products", slug: "gentle-cleansing-products" }
        ]
    }
];

// ============================================
// DEMO PRODUCTS (mapped to new subcategories)
// ============================================
const products = [
    {
        name: "Gentle Daily Cleanser",
        description: "A demonstration product for everyday cleansing.",
        price: "650.00",
        originalPrice: "750.00",
        rating: "4.5",
        imageUrl: "/images/cleanser.jpg",
        stock: 20,
        categorySlug: "face-wash-cleansers",
        brand: "Glow Essentials",
        onSale: true,
        featured: true
    },
    {
        name: "Hydrating Face Moisturizer",
        description: "A demonstration product for daily moisturizing.",
        price: "850.00",
        originalPrice: "950.00",
        rating: "4.7",
        imageUrl: "/images/moisturizer.jpg",
        stock: 15,
        categorySlug: "moisturizers",
        brand: "Pure Botanics",
        onSale: true,
        featured: true
    },
    {
        name: "Daily Hydration Serum",
        description: "A demonstration product for a skincare routine.",
        price: "1100.00",
        originalPrice: "1250.00",
        rating: "4.6",
        imageUrl: "/images/serum.jpg",
        stock: 12,
        categorySlug: "face-serums",
        brand: "Skin Ritual",
        onSale: true,
        featured: true
    },
    {
        name: "Daily Sunscreen",
        description: "A demonstration product in the sun-care category.",
        price: "950.00",
        rating: "4.8",
        imageUrl: "/images/sunscreen.jpg",
        stock: 18,
        categorySlug: "sunscreens",
        brand: "Sun Care",
        onSale: false,
        featured: true
    }
];

async function main() {
    // Create category hierarchy
    const categoryMap = new Map(); // slug -> category id
    const now = new Date();

    for (const mainCat of categoryHierarchy) {
        // Create main category
        const parent = await prisma.category.upsert({
            where: { slug: mainCat.slug },
            update: { name: mainCat.name, updatedAt: now },
            create: { name: mainCat.name, slug: mainCat.slug, parentId: null, updatedAt: now }
        });
        categoryMap.set(mainCat.slug, parent.id);

        // Create subcategories
        for (const child of mainCat.children) {
            const sub = await prisma.category.upsert({
                where: { slug: child.slug },
                update: { name: child.name, updatedAt: now },
                create: { name: child.name, slug: child.slug, parentId: parent.id, updatedAt: now }
            });
            categoryMap.set(child.slug, sub.id);
        }
    }

    // Seed products mapped to subcategories
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const categoryId = categoryMap.get(item.categorySlug);

        if (!categoryId) {
            console.warn(`Category not found for slug: ${item.categorySlug}`);
            continue;
        }

        const brand = await prisma.brand.upsert({
            where: { name: item.brand },
            update: { updatedAt: now },
            create: { name: item.brand, updatedAt: now }
        });

        await prisma.product.upsert({
            where: { id: i + 1 },
            update: {
                name: item.name,
                description: item.description,
                price: item.price,
                originalPrice: item.originalPrice,
                rating: item.rating,
                imageUrl: item.imageUrl,
                stock: item.stock,
                isActive: true,
                onSale: item.onSale,
                featured: item.featured,
                categoryId: categoryId,
                brandId: brand.id,
                updatedAt: now
            },
            create: {
                name: item.name,
                description: item.description,
                price: item.price,
                originalPrice: item.originalPrice,
                rating: item.rating,
                imageUrl: item.imageUrl,
                stock: item.stock,
                isActive: true,
                onSale: item.onSale,
                featured: item.featured,
                categoryId: categoryId,
                brandId: brand.id,
                updatedAt: now
            }
        });
    }

    console.log("Demo products seeded successfully with full category hierarchy.");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });