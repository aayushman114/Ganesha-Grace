const bcrypt = require("bcryptjs");
const prisma = require("./src/config/prisma");

async function seedUsers() {
    const now = new Date();
    const passwordHash = await bcrypt.hash("password123", 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: "admin@ganeshgrace.com" },
        update: {
            name: "Admin User",
            passwordHash,
            role: "ADMIN",
            isActive: true,
            updatedAt: now
        },
        create: {
            email: "admin@ganeshgrace.com",
            name: "Admin User",
            passwordHash,
            role: "ADMIN",
            isActive: true,
            createdAt: now,
            updatedAt: now
        }
    });
    console.log("Admin user created:", admin.email);

    // Create customer user
    const customer = await prisma.user.upsert({
        where: { email: "customer@test.com" },
        update: {
            name: "Test Customer",
            passwordHash,
            role: "CUSTOMER",
            isActive: true,
            updatedAt: now
        },
        create: {
            email: "customer@test.com",
            name: "Test Customer",
            passwordHash,
            role: "CUSTOMER",
            isActive: true,
            createdAt: now,
            updatedAt: now
        }
    });
    console.log("Customer user created:", customer.email);

    // Create another customer user
    const customer2 = await prisma.user.upsert({
        where: { email: "john@example.com" },
        update: {
            name: "John Doe",
            passwordHash,
            role: "CUSTOMER",
            isActive: true,
            updatedAt: now
        },
        create: {
            email: "john@example.com",
            name: "John Doe",
            passwordHash,
            role: "CUSTOMER",
            isActive: true,
            createdAt: now,
            updatedAt: now
        }
    });
    console.log("Customer user created:", customer2.email);

    await prisma.$disconnect();
}

seedUsers().catch(e => {
    console.error(e);
    process.exit(1);
});