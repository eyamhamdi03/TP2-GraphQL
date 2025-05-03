/*
  Warnings:

  - You are about to drop the column `name` on the `skill` table. All the data in the column will be lost.
  - Added the required column `age` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cv` ADD COLUMN `age` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `skill` DROP COLUMN `name`,
    ADD COLUMN `designation` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NULL;
