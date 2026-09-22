/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Reference` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Tutorial` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tutorialId` to the `Reference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Tutorial" DROP CONSTRAINT "Tutorial_categoryId_fkey";

-- DropIndex
DROP INDEX "Reference_categoryId_idx";

-- DropIndex
DROP INDEX "Tutorial_categoryId_createdAt_idx";

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "categoryId",
ADD COLUMN     "tutorialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tutorial" DROP COLUMN "categoryId",
ADD COLUMN     "icon" TEXT;

-- DropTable
DROP TABLE "Category";

-- CreateIndex
CREATE INDEX "Reference_tutorialId_idx" ON "Reference"("tutorialId");

-- CreateIndex
CREATE INDEX "Tutorial_createdAt_idx" ON "Tutorial"("createdAt");

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
