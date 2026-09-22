-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "codeExampleEn" TEXT,
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "ChapterGroup" ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "CodeChallenge" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "codeExampleEn" TEXT,
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "QuizOption" ADD COLUMN     "textEn" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "explanationEn" TEXT,
ADD COLUMN     "questionEn" TEXT;

-- AlterTable
ALTER TABLE "Reference" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "exampleEn" TEXT,
ADD COLUMN     "syntaxEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Tutorial" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "titleEn" TEXT;
