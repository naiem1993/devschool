-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "chapterId" TEXT;

-- CreateIndex
CREATE INDEX "QuizQuestion_chapterId_orderIndex_idx" ON "QuizQuestion"("chapterId", "orderIndex");

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
