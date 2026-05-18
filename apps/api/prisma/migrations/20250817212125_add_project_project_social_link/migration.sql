/*
  Warnings:

  - You are about to drop the `project_link_click` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectlink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project_link_click` DROP FOREIGN KEY `project_link_click_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `project_link_click` DROP FOREIGN KEY `project_link_click_project_link_id_fkey`;

-- DropForeignKey
ALTER TABLE `projectlink` DROP FOREIGN KEY `ProjectLink_profileId_fkey`;

-- AlterTable
ALTER TABLE `sociallink` ADD COLUMN `label` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `project_link_click`;

-- DropTable
DROP TABLE `projectlink`;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` ENUM('MANUFACTURING', 'TRADING', 'SALES', 'SERVICES', 'SOFTWARE', 'OTHER') NOT NULL,
    `targetIndustry` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `locationLat` DOUBLE NULL,
    `locationLng` DOUBLE NULL,
    `longDescription` VARCHAR(191) NULL,
    `startedOn` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `coverImageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectSocialLink` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `platform` ENUM('WEBSITE', 'X', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'GITHUB', 'TELEGRAM', 'WHATSAPP', 'DRIBBLE', 'BEHANCE', 'REDDIT', 'OTHER') NOT NULL,
    `label` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProjectSocialLink_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_click` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_click_profile_id_created_at_idx`(`profile_id`, `created_at`),
    INDEX `project_click_profile_id_project_id_idx`(`profile_id`, `project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSocialLink` ADD CONSTRAINT `ProjectSocialLink_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_click` ADD CONSTRAINT `project_click_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_click` ADD CONSTRAINT `project_click_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
