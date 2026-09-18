/*
  Warnings:

  - You are about to drop the column `searchVec` on the `Reference` table. All the data in the column will be lost.
  - You are about to drop the column `searchVec` on the `Tutorial` table. All the data in the column will be lost.
  - You are about to drop the `TutorialContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TutorialContent" DROP CONSTRAINT "TutorialContent_tutorialId_fkey";

-- DropIndex
DROP INDEX "Reference_searchVec_idx";

-- DropIndex
DROP INDEX "Tutorial_searchVec_idx";

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "searchVec";

-- AlterTable
ALTER TABLE "Tutorial" DROP COLUMN "searchVec";

-- DropTable
DROP TABLE "TutorialContent";

-- CreateTable
CREATE TABLE "ChapterGroup" (
    "id" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "groupId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "codeExample" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "codeExample" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinLockout" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PinLockout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorImage" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsorImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "imageId" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'partner',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChapterGroup_tutorialId_sortOrder_idx" ON "ChapterGroup"("tutorialId", "sortOrder");

-- CreateIndex
CREATE INDEX "Chapter_tutorialId_sortOrder_idx" ON "Chapter"("tutorialId", "sortOrder");

-- CreateIndex
CREATE INDEX "Chapter_groupId_idx" ON "Chapter"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_tutorialId_slug_key" ON "Chapter"("tutorialId", "slug");

-- CreateIndex
CREATE INDEX "Lesson_chapterId_sortOrder_idx" ON "Lesson"("chapterId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_chapterId_slug_key" ON "Lesson"("chapterId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorImage_hash_key" ON "SponsorImage"("hash");

-- CreateIndex
CREATE INDEX "SponsorImage_hash_idx" ON "SponsorImage"("hash");

-- CreateIndex
CREATE INDEX "Sponsor_isActive_priority_idx" ON "Sponsor"("isActive", "priority");

-- CreateIndex
CREATE INDEX "Sponsor_imageId_idx" ON "Sponsor"("imageId");

-- AddForeignKey
ALTER TABLE "ChapterGroup" ADD CONSTRAINT "ChapterGroup_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ChapterGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "SponsorImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
