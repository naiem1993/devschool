-- AlterTable
ALTER TABLE "Tutorial" ADD COLUMN "duration" INTEGER,
ADD COLUMN "rating" DOUBLE PRECISION,
ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizOption" ADD COLUMN "optionOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CodeChallenge" ADD COLUMN "difficulty" TEXT NOT NULL DEFAULT 'Easy';

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN "testCaseOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reference" ADD COLUMN "language" TEXT;

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN "message" TEXT,
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Tutorial_isPublished_idx" ON "Tutorial"("isPublished");
