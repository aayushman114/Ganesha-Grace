-- AlterTable
ALTER TABLE `product` ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `onSale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalPrice` DECIMAL(10, 2) NULL;

-- CreateIndex
CREATE INDEX `Product_onSale_idx` ON `Product`(`onSale`);

-- CreateIndex
CREATE INDEX `Product_featured_idx` ON `Product`(`featured`);
