const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { randomBytes, createHash } = require("crypto");
require("dotenv").config();

const prisma = require("./config/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Idempotency-Key"
]
}));
app.use(express.json());
app.use(cookieParser());

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            message: "Ganesh Grace API and database are running"
        });
    } catch (error) {
        console.error("Database health check failed:", error.message);

        res.status(503).json({
            success: false,
            message: "Database is unavailable"
        });
    }
});

// ============================================
// GET ALL PRODUCTS
// ============================================

app.get("/api/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true
            },
            include: {
                category: true,
                brand: true
            },
            orderBy: {
                id: "asc"
            }
        });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Failed to fetch products:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve products"
        });
    }
});

// ============================================
// GET PRODUCT BY ID
// ============================================

app.get("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    try {
        const product = await prisma.product.findFirst({
            where: {
                id,
                isActive: true
            },
            include: {
                category: true,
                brand: true
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Failed to fetch product:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve product"
        });
    }
});


// ============================================
// ADMIN - GET ALL PRODUCTS, CATEGORIES AND BRANDS
// ============================================

app.get("/api/admin/products", async (req, res) => {
    try {
        // 1. Authenticate the admin session.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to access product management."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired."
            });
        }

        // 2. Only administrators can access this endpoint.
        if (session.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Administrator access required."
            });
        }

        // 3. Retrieve all products, including inactive products.
        const [products, categories, brands] = await Promise.all([
            prisma.product.findMany({
                include: {
                    category: true,
                    brand: true
                },
                orderBy: {
                    id: "desc"
                }
            }),

            prisma.category.findMany({
                orderBy: {
                    name: "asc"
                }
            }),

            prisma.brand.findMany({
                orderBy: {
                    name: "asc"
                }
            })
        ]);

        // 4. Return product management data.
        return res.status(200).json({
            success: true,
            data: {
                products,
                categories,
                brands
            }
        });

    } catch (error) {
        console.error("Admin product retrieval failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve product management data."
        });
    }
});


// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
    console.log(`Ganesh Grace API running at http://localhost:${PORT}`);
});

// GET /api/orders/:orderNumber
app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
        // 1. Require a valid customer session.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to view this order."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired. Please log in again."
            });
        }

        if (session.user.role !== "CUSTOMER") {
            return res.status(403).json({
                success: false,
                message: "A customer account is required."
            });
        }

        // 2. Find an order belonging to this authenticated customer.
        const order = await prisma.order.findFirst({
            where: {
                orderNumber: req.params.orderNumber,
                userId: session.user.id
            },
            select: {
                orderNumber: true,
                subtotal: true,
                deliveryCharge: true,
                total: true,
                paymentMethod: true,
                paymentStatus: true,
                status: true,
                createdAt: true,
                items: {
                    select: {
                        productName: true,
                        unitPrice: true,
                        quantity: true,
                        lineTotal: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // 3. Return only the order details needed by the customer.
        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Order retrieval failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve your order right now."
        });
    }
});
// GET /api/orders
// Retrieve orders belonging to the authenticated customer.
app.get("/api/orders", async (req, res) => {
    try {
        // 1. Check for the session cookie.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to view your orders."
            });
        }

        // 2. Hash the session token to find the database session.
        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        // 3. Validate the session and account.
        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired. Please log in again."
            });
        }

        if (session.user.role !== "CUSTOMER") {
            return res.status(403).json({
                success: false,
                message: "A customer account is required."
            });
        }

        // 4. Retrieve only this customer's orders.
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                orderNumber: true,
                subtotal: true,
                deliveryCharge: true,
                total: true,
                paymentMethod: true,
                paymentStatus: true,
                status: true,
                createdAt: true,
                items: {
                    select: {
                        productName: true,
                        unitPrice: true,
                        quantity: true,
                        lineTotal: true
                    }
                }
            }
        });

        // 5. Return the customer's order history.
        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error("My Orders retrieval failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve your orders right now."
        });
    }
});


// ============================================
// ADMIN - GET ALL CUSTOMER ORDERS
// ============================================

app.get("/api/admin/orders", async (req, res) => {
    try {
        // 1. Authenticate using the existing session cookie.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to access the admin dashboard."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired."
            });
        }

        // 2. Only administrators can access this endpoint.
        if (session.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Administrator access required."
            });
        }

        // 3. Validate pagination.
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);

        if (
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters."
            });
        }

        // 4. Validate optional status filter.
        const allowedStatuses = [
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        const status = req.query.status
            ? String(req.query.status).toUpperCase()
            : null;

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        // 5. Validate optional search term.
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";

        if (search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search term must not exceed 100 characters."
            });
        }

        // 6. Build database filters.
        const where = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                {
                    orderNumber: {
                        contains: search
                    }
                },
                {
                    customerName: {
                        contains: search
                    }
                },
                {
                    email: {
                        contains: search
                    }
                }
            ];
        }

        // 7. Fetch orders and total count.
        const [orders, totalOrders] = await prisma.$transaction([
            prisma.order.findMany({
                where,
                orderBy: {
                    createdAt: "desc"
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    orderNumber: true,
                    customerName: true,
                    email: true,
                    phone: true,
                    address: true,
                    city: true,
                    postalCode: true,
                    subtotal: true,
                    deliveryCharge: true,
                    total: true,
                    paymentMethod: true,
                    paymentStatus: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    items: {
                        select: {
                            productName: true,
                            unitPrice: true,
                            quantity: true,
                            lineTotal: true
                        }
                    }
                }
            }),

            prisma.order.count({ where })
        ]);

        // 8. Return paginated results.
        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit)
            }
        });

    } catch (error) {
        console.error("Admin order retrieval failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve customer orders."
        });
    }
});



// ============================================
// CANCEL CUSTOMER ORDER
// ============================================

app.post("/api/orders/:orderNumber/cancel", async (req, res) => {
    try {
        // 1. Authenticate the customer.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to cancel your order."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired. Please log in again."
            });
        }

        if (session.user.role !== "CUSTOMER") {
            return res.status(403).json({
                success: false,
                message: "A customer account is required."
            });
        }

        // 2. Validate the order number.
        const orderNumber = req.params.orderNumber;

        if (
            typeof orderNumber !== "string" ||
            !orderNumber.trim() ||
            orderNumber.length > 40
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order number."
            });
        }

        // 3. Restore stock and cancel the order atomically.
        const cancelledOrder = await prisma.$transaction(async (tx) => {

            // Find an order belonging to this customer.
            const order = await tx.order.findFirst({
                where: {
                    orderNumber: orderNumber.trim(),
                    userId: session.user.id
                },
                include: {
                    items: {
                        select: {
                            productId: true,
                            productName: true,
                            quantity: true
                        }
                    }
                }
            });

            if (!order) {
                const error = new Error("Order not found.");
                error.statusCode = 404;
                throw error;
            }

            // Only pending orders can be cancelled.
            if (order.status !== "PENDING") {
                const error = new Error(
                    `This order cannot be cancelled because its current status is ${order.status}.`
                );
                error.statusCode = 409;
                throw error;
            }

            // Conditional update prevents duplicate stock restoration
            // if cancellation requests arrive simultaneously.
            const statusUpdate = await tx.order.updateMany({
                where: {
                    id: order.id,
                    userId: session.user.id,
                    status: "PENDING"
                },
                data: {
                    status: "CANCELLED"
                }
            });

            if (statusUpdate.count !== 1) {
                const error = new Error(
                    "This order has already been cancelled or its status has changed."
                );
                error.statusCode = 409;
                throw error;
            }

            // Restore the stock for every ordered product.
            for (const item of order.items) {
                await tx.product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }

            return {
                orderNumber: order.orderNumber,
                status: "CANCELLED"
            };
        });

        return res.status(200).json({
            success: true,
            message: "Your order has been cancelled successfully. Stock has been restored.",
            data: cancelledOrder
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error("Order cancellation failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel your order right now."
        });
    }
});



// GET /api/auth/me
app.get("/api/auth/me", async (req, res) => {
    try {
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired. Please log in again."
            });
        }

        return res.status(200).json({
            success: true,
            message: "You are logged in.",
            data: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role
            }
        });
    } catch (error) {
        console.error("Session verification failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify your session right now."
        });
    }
});

// POST /api/auth/logout
app.post("/api/auth/logout", async (req, res) => {
    try {
        const sessionToken = req.cookies?.gg_session;

        if (sessionToken) {
            const tokenHash = createHash("sha256")
                .update(sessionToken)
                .digest("hex");

            await prisma.session.deleteMany({
                where: { tokenHash }
            });
        }

        res.clearCookie("gg_session", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "You have logged out successfully."
        });
    } catch (error) {
        console.error("Logout failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to log out right now."
        });
    }
});


// ============================================
// ADMIN - UPDATE ORDER STATUS
// ============================================

app.patch("/api/admin/orders/:orderNumber/status", async (req, res) => {
    try {
        // 1. Authenticate administrator.
        const sessionToken = req.cookies?.gg_session;

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: "Please log in to access this feature."
            });
        }

        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired."
            });
        }

        if (session.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Administrator access required."
            });
        }

        // 2. Validate order number and requested status.
        const orderNumber = req.params.orderNumber?.trim();
        const newStatus = req.body?.status;

        if (
            !orderNumber ||
            orderNumber.length > 40
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order number."
            });
        }

        const allowedStatuses = [
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        if (
            typeof newStatus !== "string" ||
            !allowedStatuses.includes(newStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        // 3. Define permitted status transitions.
        const allowedTransitions = {
            PENDING: ["PROCESSING", "CANCELLED"],
            PROCESSING: ["SHIPPED", "CANCELLED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };

        // 4. Update status inside a database transaction.
        const updatedOrder = await prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: { orderNumber },
                include: {
                    items: {
                        select: {
                            productId: true,
                            productName: true,
                            quantity: true
                        }
                    }
                }
            });

            if (!order) {
                const error = new Error("Order not found.");
                error.statusCode = 404;
                throw error;
            }

            if (!allowedTransitions[order.status]?.includes(newStatus)) {
                const error = new Error(
                    `Cannot change order status from ${order.status} to ${newStatus}.`
                );
                error.statusCode = 409;
                throw error;
            }

            // Conditional update protects against concurrent changes.
            const statusUpdate = await tx.order.updateMany({
                where: {
                    id: order.id,
                    status: order.status
                },
                data: {
                    status: newStatus
                }
            });

            if (statusUpdate.count !== 1) {
                const error = new Error(
                    "The order status changed during this request. Refresh and try again."
                );
                error.statusCode = 409;
                throw error;
            }

            // Restore product stock only when cancelling.
            if (newStatus === "CANCELLED") {
                for (const item of order.items) {
                    await tx.product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    });
                }
            }

            return {
                orderNumber: order.orderNumber,
                previousStatus: order.status,
                status: newStatus
            };
        });

        return res.status(200).json({
            success: true,
            message: newStatus === "CANCELLED"
                ? "Order cancelled successfully. Product stock has been restored."
                : "Order status updated successfully.",
            data: updatedOrder
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error("Admin order status update failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update order status."
        });
    }
});


// ============================================
// CUSTOMER REGISTRATION
// ============================================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        // Validate required fields.
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must contain between 2 and 100 characters."
            });
        }

        if (
            cleanEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // bcrypt uses only the first 72 bytes of a password.
        // Reject longer UTF-8 passwords rather than silently
        // accepting passwords that hash identically after truncation.
        const passwordBytes = Buffer.byteLength(password, "utf8");

        if (passwordBytes < 8 || passwordBytes > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes."
            });
        }

        // Check whether the email is already registered.
        const existingUser = await prisma.user.findUnique({
            where: {
                email: cleanEmail
            },
            select: {
                id: true
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash the password before saving it.
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                passwordHash,
                role: "CUSTOMER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Your account was created successfully. Please log in.",
            data: user
        });

    } catch (error) {
        // A concurrent registration may win the unique-email race.
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        console.error("Registration failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create your account right now."
        });
    }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        // Use the same response for an unknown email and an incorrect password.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate a random session token.
        const sessionToken = randomBytes(32).toString("hex");

        // Store only its SHA-256 hash in the database.
        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        // Session expires in 7 days.
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await prisma.session.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt
            }
        });

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("gg_session", sessionToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            expires: expiresAt
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to log in right now."
        });
    }
});

// ============================================
// CREATE ORDER - CASH ON DELIVERY
// ============================================

app.post("/api/orders", async (req, res) => {

    // ----------------------------------------
    // 0. Require an authenticated customer
    // ----------------------------------------

    const sessionToken = req.cookies?.gg_session;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: "Please log in before placing an order."
        });
    }

    let authenticatedUser;

    try {
        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (
            !session ||
            session.expiresAt <= new Date() ||
            !session.user.isActive
        ) {
            return res.status(401).json({
                success: false,
                message: "Your session is invalid or expired. Please log in again."
            });
        }

        if (session.user.role !== "CUSTOMER") {
            return res.status(403).json({
                success: false,
                message: "A customer account is required to place an order."
            });
        }

        authenticatedUser = session.user;

    } catch (error) {
        console.error("Order authentication failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify your account. Please try again."
        });
    }

    // ----------------------------------------
    // Read checkout details
    // ----------------------------------------

    const {
        phone,
        address,
        city,
        postalCode,
        paymentMethod,
        items
    } = req.body || {};

    // ----------------------------------------
    // 1. Validate customer information
    // ----------------------------------------

    const requiredFields = [
    ["phone", phone],
    ["address", address],
    ["city", city]
    ];

    for (const [field, value] of requiredFields) {
        if (typeof value !== "string" || !value.trim()) {
            return res.status(400).json({
                success: false,
                message: `${field} is required.`
            });
        }
    }

    // Identity comes from the verified account, not the browser.
    const cleanName = authenticatedUser.name;
    const cleanEmail = authenticatedUser.email;

    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();

    if (cleanName.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must not exceed 100 characters."
        });
    }

    if (
        cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    if (
        cleanPhone.length > 20 ||
        !/^[+0-9()\-\s]{7,20}$/.test(cleanPhone)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid phone number."
        });
    }

    if (cleanAddress.length > 500) {
        return res.status(400).json({
            success: false,
            message: "Address must not exceed 500 characters."
        });
    }

    if (cleanCity.length > 100) {
        return res.status(400).json({
            success: false,
            message: "City must not exceed 100 characters."
        });
    }

    let cleanPostalCode = null;

    if (postalCode !== undefined && postalCode !== null) {
        if (typeof postalCode !== "string") {
            return res.status(400).json({
                success: false,
                message: "Postal code must be text."
            });
        }

        cleanPostalCode = postalCode.trim() || null;

        if (cleanPostalCode && cleanPostalCode.length > 20) {
            return res.status(400).json({
                success: false,
                message: "Postal code must not exceed 20 characters."
            });
        }
    }

    // COD is the only payment method supported currently.
    if (paymentMethod !== "COD") {
        return res.status(400).json({
            success: false,
            message: "Only Cash on Delivery is currently supported."
        });
    }

    // ----------------------------------------
    // 2. Validate cart items
    // ----------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Your cart is empty."
        });
    }

    if (items.length > 50) {
        return res.status(400).json({
            success: false,
            message: "An order cannot contain more than 50 different products."
        });
    }

    const requestedItems = new Map();

    for (const item of items) {
        if (!item || typeof item !== "object") {
            return res.status(400).json({
                success: false,
                message: "Invalid cart item."
            });
        }

        const { productId, quantity } = item;

        if (
            !Number.isSafeInteger(productId) ||
            productId < 1 ||
            !Number.isSafeInteger(quantity) ||
            quantity < 1 ||
            quantity > 99
        ) {
            return res.status(400).json({
                success: false,
                message: "Each item must have a valid product ID and quantity between 1 and 99."
            });
        }

        if (requestedItems.has(productId)) {
            return res.status(400).json({
                success: false,
                message: "Duplicate product IDs are not allowed."
            });
        }

        requestedItems.set(productId, quantity);
    }

    // Convert database prices to integer cents to avoid
    // floating-point arithmetic when calculating totals.
    function priceToCents(price) {
        const value = String(price);
        const [whole, fraction = ""] = value.split(".");

        return (
            Number(whole) * 100 +
            Number((fraction + "00").slice(0, 2))
        );
    }

    function centsToDecimal(cents) {
        return (cents / 100).toFixed(2);
    }
    // ----------------------------------------
// 3. Validate idempotency key
// ----------------------------------------

const idempotencyKey = req.get("Idempotency-Key");

if (
    typeof idempotencyKey !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)
) {
    return res.status(400).json({
        success: false,
        message: "A valid idempotency key is required."
    });
}

// ----------------------------------------
// 4. Calculate request fingerprint
// ----------------------------------------

const normalizedItems = Array.from(requestedItems.entries())
    .sort(([idA], [idB]) => idA - idB)
    .map(([productId, quantity]) => ({
        productId,
        quantity
    }));

const requestFingerprint = createHash("sha256")
    .update(JSON.stringify({
        userId: authenticatedUser.id,
        phone: cleanPhone,
        address: cleanAddress,
        city: cleanCity,
        postalCode: cleanPostalCode,
        paymentMethod: "COD",
        items: normalizedItems
    }))
    .digest("hex");

    // ----------------------------------------
    // 3. Create order and reserve stock
    //    inside one database transaction
    // ----------------------------------------

    try {
    const existingOrder = await prisma.order.findUnique({
        where: {
            idempotencyKey
        },
        select: {
            userId: true,
            idempotencyRequestHash: true,
            id: true,
            orderNumber: true,
            subtotal: true,
            deliveryCharge: true,
            total: true,
            paymentMethod: true,
            paymentStatus: true,
            status: true,
            createdAt: true,
            items: {
                select: {
                    productName: true,
                    unitPrice: true,
                    quantity: true,
                    lineTotal: true
                }
            }
        }
    });

    if (existingOrder) {
        if (existingOrder.userId !== authenticatedUser.id) {
            return res.status(409).json({
                success: false,
                message: "This checkout key has already been used."
            });
        }

        if (existingOrder.idempotencyRequestHash !== requestFingerprint) {
            return res.status(409).json({
                success: false,
                message: "This checkout key belongs to a different order request."
            });
        }

        const {
            userId,
            idempotencyRequestHash,
            ...orderData
        } = existingOrder;

        return res.status(200).json({
            success: true,
            message: "This order was already placed successfully.",
            data: orderData
        });
    }

    const result = await prisma.$transaction(async (tx) => {
            const productIds = Array.from(requestedItems.keys());

            const products = await tx.product.findMany({
                where: {
                    id: {
                        in: productIds
                    },
                    isActive: true
                }
            });

            if (products.length !== productIds.length) {
                const error = new Error(
                    "One or more products no longer exist or are unavailable."
                );
                error.statusCode = 409;
                throw error;
            }

            let subtotalCents = 0;

            const orderItems = products.map((product) => {
                const quantity = requestedItems.get(product.id);

                if (product.stock < quantity) {
                    const error = new Error(
                        `${product.name} does not have enough stock. Available: ${product.stock}.`
                    );
                    error.statusCode = 409;
                    throw error;
                }

                const unitPriceCents = priceToCents(product.price);
                const lineTotalCents = unitPriceCents * quantity;

                subtotalCents += lineTotalCents;

                return {
                    productId: product.id,
                    productName: product.name,
                    unitPrice: centsToDecimal(unitPriceCents),
                    quantity,
                    lineTotal: centsToDecimal(lineTotalCents)
                };
            });

            // Avoid creating an order with an invalid total.
            if (
                !Number.isSafeInteger(subtotalCents) ||
                subtotalCents <= 0
            ) {
                const error = new Error(
                    "Unable to calculate the order total."
                );
                error.statusCode = 400;
                throw error;
            }

            // ----------------------------------------
            // Create the order and claim its unique
            // idempotency key before deducting stock.
            // ----------------------------------------

            const orderNumber =
                `GG-${Date.now()}-${randomBytes(4)
                    .toString("hex")
                    .toUpperCase()}`;

            const deliveryChargeCents = 0;
            const totalCents = subtotalCents + deliveryChargeCents;

            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: authenticatedUser.id,
                    idempotencyKey,
                    idempotencyRequestHash: requestFingerprint,

                    customerName: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    address: cleanAddress,
                    city: cleanCity,
                    postalCode: cleanPostalCode,

                    subtotal: centsToDecimal(subtotalCents),
                    deliveryCharge: centsToDecimal(deliveryChargeCents),
                    total: centsToDecimal(totalCents),

                    paymentMethod: "COD",
                    paymentStatus: "PENDING",
                    status: "PENDING",

                    items: {
                        create: orderItems
                    }
                },
                select: {
                    id: true,
                    orderNumber: true,
                    subtotal: true,
                    deliveryCharge: true,
                    total: true,
                    paymentMethod: true,
                    paymentStatus: true,
                    status: true,
                    createdAt: true,
                    items: {
                        select: {
                            productName: true,
                            unitPrice: true,
                            quantity: true,
                            lineTotal: true
                        }
                    }
                }
            });

        // ----------------------------------------
        // Atomically deduct stock.
        // If any update fails, the entire
        // transaction (including order creation)
        // will roll back.
        // ----------------------------------------

        for (const item of orderItems) {
            const stockUpdate = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    isActive: true,
                    stock: {
                        gte: item.quantity
                    }
                },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });

            if (stockUpdate.count !== 1) {
                const error = new Error(
                    `Stock for ${item.productName} changed. Please refresh your cart and try again.`
                );

                error.statusCode = 409;
                throw error;
            }
        }

        return order;
        });

        // Return confirmation only after the transaction succeeds.
        return res.status(201).json({
            success: true,
            message: "Your order has been placed successfully.",
            data: result
        });

    } catch (error) {

    // Handle business validation errors.
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    // Handle simultaneous requests using the same idempotency key.
    const isIdempotencyConflict =
    error.code === "P2002" &&
    (
        Array.isArray(error.meta?.target)
            ? error.meta.target.includes("idempotencyKey")
            : String(error.meta?.target || "").includes("idempotencyKey")
    );

    if (isIdempotencyConflict) {
        try {
            const existingOrder = await prisma.order.findUnique({
                where: {
                    idempotencyKey
                },
                select: {
                    userId: true,
                    idempotencyRequestHash: true,
                    id: true,
                    orderNumber: true,
                    subtotal: true,
                    deliveryCharge: true,
                    total: true,
                    paymentMethod: true,
                    paymentStatus: true,
                    status: true,
                    createdAt: true,
                    items: {
                        select: {
                            productName: true,
                            unitPrice: true,
                            quantity: true,
                            lineTotal: true
                        }
                    }
                }
            });

            if (existingOrder) {

                if (existingOrder.userId !== authenticatedUser.id) {
                    return res.status(409).json({
                        success: false,
                        message: "This checkout key has already been used."
                    });
                }

                if (
                    existingOrder.idempotencyRequestHash !== requestFingerprint
                ) {
                    return res.status(409).json({
                        success: false,
                        message: "This checkout key belongs to a different order request."
                    });
                }

                const {
                    userId,
                    idempotencyRequestHash,
                    ...orderData
                } = existingOrder;

                return res.status(200).json({
                    success: true,
                    message: "This order was already placed successfully.",
                    data: orderData
                });
            }

        } catch (lookupError) {
            console.error(
                "Duplicate order lookup failed:",
                lookupError
            );
        }
    }

    console.error("Order creation failed:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to place your order. Please try again."
    });
}
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

async function shutdown() {
    console.log("Shutting down Ganesh Grace API...");

    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);