/*
  Warnings:

  - You are about to alter the column `isPublished` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `project` MODIFY `isPublished` BOOLEAN NOT NULL DEFAULT false;
