-- AlterTable
ALTER TABLE `profile` ADD COLUMN `referrer` VARCHAR(191) NULL,
    ADD COLUMN `session_id` VARCHAR(64) NULL,
    ADD COLUMN `utm_campaign` VARCHAR(128) NULL,
    ADD COLUMN `utm_content` VARCHAR(128) NULL,
    ADD COLUMN `utm_medium` VARCHAR(128) NULL,
    ADD COLUMN `utm_source` VARCHAR(128) NULL,
    ADD COLUMN `utm_term` VARCHAR(128) NULL;
