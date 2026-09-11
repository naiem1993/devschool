-- ==========================================
--  Phase 2: Full-Text Search + Attempt Tracking
-- ==========================================

-- 1. Attempt tables
CREATE TABLE "QuizAttempt" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "selectedId" TEXT,
  "isCorrect" BOOLEAN NOT NULL,
  "timeTakenSec" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuizAttempt_deviceId_createdAt_idx" ON "QuizAttempt"("deviceId", "createdAt");
CREATE INDEX "QuizAttempt_deviceId_questionId_idx" ON "QuizAttempt"("deviceId", "questionId");
CREATE INDEX "QuizAttempt_questionId_idx" ON "QuizAttempt"("questionId");

ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ChallengeAttempt" (
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

CREATE INDEX "ChallengeAttempt_deviceId_createdAt_idx" ON "ChallengeAttempt"("deviceId", "createdAt");
CREATE INDEX "ChallengeAttempt_deviceId_challengeId_idx" ON "ChallengeAttempt"("deviceId", "challengeId");
CREATE INDEX "ChallengeAttempt_challengeId_idx" ON "ChallengeAttempt"("challengeId");

ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_challengeId_fkey"
  FOREIGN KEY ("challengeId") REFERENCES "CodeChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ==========================================
--  2. Full-Text Search on Tutorial
-- ==========================================
-- Using 'simple' config so it works for both Bangla + English without stemming issues.

ALTER TABLE "Tutorial" ADD COLUMN IF NOT EXISTS "searchVec" tsvector;

UPDATE "Tutorial"
SET "searchVec" =
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("difficulty", '')), 'C');

CREATE INDEX IF NOT EXISTS "Tutorial_searchVec_idx" ON "Tutorial" USING GIN ("searchVec");

CREATE OR REPLACE FUNCTION tutorial_search_vec_trigger() RETURNS trigger AS $$
BEGIN
  NEW."searchVec" :=
    setweight(to_tsvector('simple', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW."description", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW."difficulty", '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tutorial_search_vec_update ON "Tutorial";
CREATE TRIGGER tutorial_search_vec_update
  BEFORE INSERT OR UPDATE OF "title", "description", "difficulty"
  ON "Tutorial"
  FOR EACH ROW
  EXECUTE FUNCTION tutorial_search_vec_trigger();

-- ==========================================
--  3. Full-Text Search on Reference
-- ==========================================
ALTER TABLE "Reference" ADD COLUMN IF NOT EXISTS "searchVec" tsvector;

UPDATE "Reference"
SET "searchVec" =
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("language", '')), 'C') ||
  setweight(to_tsvector('simple', array_to_string(coalesce("tags", '{}'), ' ')), 'B');

CREATE INDEX IF NOT EXISTS "Reference_searchVec_idx" ON "Reference" USING GIN ("searchVec");

CREATE OR REPLACE FUNCTION reference_search_vec_trigger() RETURNS trigger AS $$
BEGIN
  NEW."searchVec" :=
    setweight(to_tsvector('simple', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW."description", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW."language", '')), 'C') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(NEW."tags", '{}'), ' ')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reference_search_vec_update ON "Reference";
CREATE TRIGGER reference_search_vec_update
  BEFORE INSERT OR UPDATE OF "title", "description", "language", "tags"
  ON "Reference"
  FOR EACH ROW
  EXECUTE FUNCTION reference_search_vec_trigger();
