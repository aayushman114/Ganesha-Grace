const prisma = require("./config/prisma");

const products = [
    {
        name: "Gentle Daily Cleanser",
        description: "A demonstration product for everyday cleansing.",
        price: "650.00",
        rating: "4.5",
        imageUrl: "/images/cleanser.jpg",
        stock: 20,
        category: {
            name: "Face Wash",
            slug: "face-wash"
        },
        brand: "Glow Essentials"
    },
    {
        name: "Hydrating Face Moisturizer",
        description: "A demonstration product for daily moisturizing.",
        price: "850.00",
        rating: "4.7",
        imageUrl: "/images/moisturizer.jpg",
        stock: 15,
        category: {
            name: "Moisturizers",
            slug: "moisturizers"
        },
        brand: "Pure Botanics"
    },
    {
        name: "Daily Hydration Serum",
        description: "A demonstration product for a skincare routine.",
        price: "1100.00",
        rating: "4.6",
        imageUrl: "/images/serum.jpg",
        stock: 12,
        category: {
            name: "Serums",
            slug: "serums"
        },
        brand: "Skin Ritual"
    },
    {
        name: "Daily Sunscreen",
        description: "A demonstration product in the sun-care category.",
        price: "950.00",
        rating: "4.8",
        imageUrl: "/images/sunscreen.jpg",
        stock: 18,
        category: {
            name: "Sunscreens",
            slug: "sunscreens"
        },
        brand: "Sun Care"
    }
];

async function main() {
    for (const item of products) {
        const category = await prisma.category.upsert({
            where: {
                slug: item.category.slug
            },
            update: {
                name: item.category.name
            },
            create: item.category
        });

        const brand = await prisma.brand.upsert({
            where: {
                name: item.brand
            },
            update: {},
            create: {
                name: item.brand
            }
        });

        await prisma.product.upsert({
            where: {
                id: item === products[0] ? 1
                    : item === products[1] ? 2
                    : item === products[2] ? 3
                    : 4
            },
            update: {
                name: item.name,
                description: item.description,
                price: item.price,
                rating: item.rating,
                imageUrl: item.imageUrl,
                stock: item.stock,
                isActive: true,
                categoryId: category.id,
                brandId: brand.id
            },
            create: {
                name: item.name,
                description: item.description,
                price: item.price,
                rating: item.rating,
                imageUrl: item.imageUrl,
                stock: item.stock,
                isActive: true,
                categoryId: category.id,
                brandId: brand.id
            }
        });
    }

    console.log("Demo products seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });