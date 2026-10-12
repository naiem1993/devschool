-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "lessonId" TEXT;

-- CreateIndex
CREATE INDEX "QuizQuestion_lessonId_orderIndex_idx" ON "QuizQuestion"("lessonId", "orderIndex");

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
