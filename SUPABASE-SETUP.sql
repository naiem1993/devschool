-- =====================================================
-- DevSchool — Database Setup SQL (Supabase / PostgreSQL)
-- এই পুরো ফাইলটা Supabase SQL Editor-এ পেস্ট করে RUN করলেই টেবিল তৈরি হবে।
-- =====================================================

-- ---------- CATEGORY ----------
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_slug_idx" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");

-- ---------- TUTORIAL ----------
CREATE TABLE IF NOT EXISTS "Tutorial" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'beginner',
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "duration" INTEGER,
  "rating" DOUBLE PRECISION,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Tutorial_slug_key" ON "Tutorial"("slug");
CREATE INDEX IF NOT EXISTS "Tutorial_slug_idx" ON "Tutorial"("slug");
CREATE INDEX IF NOT EXISTS "Tutorial_categoryId_createdAt_idx" ON "Tutorial"("categoryId", "createdAt");
CREATE INDEX IF NOT EXISTS "Tutorial_isPublished_idx" ON "Tutorial"("isPublished");

-- ---------- TUTORIAL CONTENT ----------
CREATE TABLE IF NOT EXISTS "TutorialContent" (
  "id" TEXT NOT NULL,
  "tutorialId" TEXT NOT NULL,
  "chapterNo" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "codeExample" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TutorialContent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TutorialContent_tutorialId_chapterNo_idx" ON "TutorialContent"("tutorialId", "chapterNo");
CREATE UNIQUE INDEX IF NOT EXISTS "TutorialContent_tutorialId_chapterNo_key" ON "TutorialContent"("tutorialId", "chapterNo");

-- ---------- QUIZ QUESTION ----------
CREATE TABLE IF NOT EXISTS "QuizQuestion" (
  "id" TEXT NOT NULL,
  "tutorialId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "explanation" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "QuizQuestion_tutorialId_idx" ON "QuizQuestion"("tutorialId");

-- ---------- QUIZ OPTION ----------
CREATE TABLE IF NOT EXISTS "QuizOption" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  "optionOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "QuizOption_questionId_idx" ON "QuizOption"("questionId");

-- ---------- CODE CHALLENGE ----------
CREATE TABLE IF NOT EXISTS "CodeChallenge" (
  "id" TEXT NOT NULL,
  "tutorialId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "starterCode" TEXT,
  "solution" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'Easy',
  "points" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CodeChallenge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CodeChallenge_tutorialId_idx" ON "CodeChallenge"("tutorialId");

-- ---------- TEST CASE ----------
CREATE TABLE IF NOT EXISTS "TestCase" (
  "id" TEXT NOT NULL,
  "challengeId" TEXT NOT NULL,
  "input" TEXT NOT NULL,
  "expectedOutput" TEXT NOT NULL,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "testCaseOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TestCase_challengeId_idx" ON "TestCase"("challengeId");

-- ---------- REFERENCE ----------
CREATE TABLE IF NOT EXISTS "Reference" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "syntax" TEXT,
  "example" TEXT,
  "tags" TEXT[],
  "language" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Reference_slug_key" ON "Reference"("slug");
CREATE INDEX IF NOT EXISTS "Reference_slug_idx" ON "Reference"("slug");
CREATE INDEX IF NOT EXISTS "Reference_categoryId_idx" ON "Reference"("categoryId");

-- ---------- DONATION ----------
CREATE TABLE IF NOT EXISTS "Donation" (
  "id" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'BDT',
  "donorName" TEXT,
  "donorEmail" TEXT,
  "transactionId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "message" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Donation_transactionId_key" ON "Donation"("transactionId");
CREATE INDEX IF NOT EXISTS "Donation_status_idx" ON "Donation"("status");
CREATE INDEX IF NOT EXISTS "Donation_createdAt_idx" ON "Donation"("createdAt");

-- ---------- SITE SETTINGS ----------
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SiteSettings_key_key" ON "SiteSettings"("key");

-- ---------- ADMIN USER ----------
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX IF NOT EXISTS "AdminUser_email_idx" ON "AdminUser"("email");

-- ---------- QUIZ ATTEMPT ----------
CREATE TABLE IF NOT EXISTS "QuizAttempt" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "selectedId" TEXT,
  "isCorrect" BOOLEAN NOT NULL,
  "timeTakenSec" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "QuizAttempt_deviceId_createdAt_idx" ON "QuizAttempt"("deviceId", "createdAt");
CREATE INDEX IF NOT EXISTS "QuizAttempt_deviceId_questionId_idx" ON "QuizAttempt"("deviceId", "questionId");
CREATE INDEX IF NOT EXISTS "QuizAttempt_questionId_idx" ON "QuizAttempt"("questionId");

-- ---------- CHALLENGE ATTEMPT ----------
CREATE TABLE IF NOT EXISTS "ChallengeAttempt" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "challengeId" TEXT NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "passedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "codeSubmitted" TEXT,
  "timeTakenSec" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChallengeAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_deviceId_createdAt_idx" ON "ChallengeAttempt"("deviceId", "createdAt");
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_deviceId_challengeId_idx" ON "ChallengeAttempt"("deviceId", "challengeId");
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_challengeId_idx" ON "ChallengeAttempt"("challengeId");

-- ---------- FOREIGN KEYS ----------
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TutorialContent" ADD CONSTRAINT "TutorialContent_tutorialId_fkey"
  FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_tutorialId_fkey"
  FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CodeChallenge" ADD CONSTRAINT "CodeChallenge_tutorialId_fkey"
  FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_challengeId_fkey"
  FOREIGN KEY ("challengeId") REFERENCES "CodeChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_challengeId_fkey"
  FOREIGN KEY ("challengeId") REFERENCES "CodeChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------- DEFAULT SITE SETTINGS ----------
INSERT INTO "SiteSettings" ("id", "key", "value", "updatedAt")
VALUES ('settings-general', 'general', '{"siteName":"DevSchool","isDonationEnabled":true,"isAdsEnabled":true}', NOW())
ON CONFLICT ("key") DO NOTHING;

//
