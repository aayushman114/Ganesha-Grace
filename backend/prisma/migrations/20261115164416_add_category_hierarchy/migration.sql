/*
  Warnings:

  - A unique constraint covering the columns `[parentId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Category_name_key` ON `category`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `parentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_parentId_name_key` ON `Category`(`parentId`, `name`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
