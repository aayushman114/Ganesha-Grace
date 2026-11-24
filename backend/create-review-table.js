const prisma = require('./src/config/prisma');

async function createTable() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`review\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`productId\` INT NOT NULL,
            \`userId\` INT NOT NULL,
            \`rating\` TINYINT NOT NULL,
            \`title\` VARCHAR(200) NULL,
            \`comment\` TEXT NULL,
            \`isApproved\` BOOLEAN NOT NULL DEFAULT false,
            \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            \`updatedAt\` DATETIME(3) NOT NULL,
            PRIMARY KEY (\`id\`),
            INDEX \`Review_productId_idx\` (\`productId\`),
            INDEX \`Review_userId_idx\` (\`userId\`),
            INDEX \`Review_isApproved_idx\` (\`isApproved\`),
            CONSTRAINT \`Review_productId_fkey\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE,
            CONSTRAINT \`Review_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Review table created');
    await prisma.$disconnect();
}

createTable().catch(e => { console.error(e); process.exit(1); });