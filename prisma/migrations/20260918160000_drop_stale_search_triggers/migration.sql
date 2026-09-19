-- Drop stale full-text-search triggers whose functions reference the
-- now-removed `searchVec` column on Tutorial and Reference.
--
-- Migration 20260918151014_nested_structure_chapter_lesson dropped the
-- `searchVec` column but left these triggers behind, which caused every
-- INSERT/UPDATE on those tables to fail with:
--   record "new" has no field "searchVec" (SQLSTATE 42703)
--
-- The search API (app/api/search/route.ts) already falls back to ILIKE
-- when searchVec is absent, so removing these is safe.

DROP TRIGGER IF EXISTS tutorial_search_vec_update ON "Tutorial";
DROP TRIGGER IF EXISTS reference_search_vec_update ON "Reference";

DROP FUNCTION IF EXISTS public.tutorial_search_vec_trigger();
DROP FUNCTION IF EXISTS public.reference_search_vec_trigger();
