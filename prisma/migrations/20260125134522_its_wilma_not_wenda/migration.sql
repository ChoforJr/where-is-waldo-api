/*
  Warnings:

  - You are about to drop the column `wenda` on the `Gameplay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gameplay" DROP COLUMN "wenda",
ADD COLUMN     "wilma" BOOLEAN NOT NULL DEFAULT false;
