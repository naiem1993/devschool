# 🚀 DevSchool Professional Performance & Accessibility Optimization Plan

**Target Audience:** AI Coding Assistant (Cursor / Copilot / Claude)
**Context:** The DevSchool project (Next.js 16, React 19, Tailwind v4, Prisma) scored 93 on PageSpeed Insights Mobile. To achieve a 100/100 professional standard, the AI must execute the following fixes strictly.

**GOLDEN RULES FOR AI:**
1. **DO NOT** change the visual design or layout (UI) unless specifically asked (like contrast).
2. **DO NOT** remove existing features. 
3. Make atomic changes. Fix one section, verify, then move to the next.
4. Always use modern Next.js App Router and React 19 best practices.

---

## 🎯 TASK 1: Accessibility (Target Score: 100)
*Current Issue:* Lighthouse flagged missing form labels and poor color contrast (91/100).

### 1.1 Fix Form Labels
- **Action:** Scan all files in `app/` and `components/` that contain `<input>`, `<select>`, or `<textarea>`.
- **Fix:** 
  - If a visible text label exists, link it using `htmlFor="id"` on `<label>` and `id="id"` on the input.
  - If it's a placeholder-only search input or icon button (e.g., `HomeSearch.tsx`, `SearchClient.tsx`), add `aria-label="Describe the action"` directly to the input/button.
- **Constraint:** Do not visually alter the layout. Use visually hidden classes (`sr-only`) if a label is required but not visually designed.

### 1.2 Fix Color Contrast (WCAG AA Standard)
- **Action:** In `app/globals.css` and Tailwind classes, identify colors that fail contrast.
- **Fix:**
  - For brand green text on dark backgrounds: Ensure it's at least `text-emerald-400` (not darker). If on a white background, use at least `text-emerald-600` or `text-emerald-700`.
  - Replace `text-slate-400` with `text-slate-500` on light mode where it's used for body text (to improve contrast).
  - In dark mode, ensure muted text uses `text-slate-300` or `text-slate-400`, never `text-slate-500` or darker.

---

## 🎯 TASK 2: Performance - LCP & Render Blocking
*Current Issue:* Largest Contentful Paint (LCP) is 2.7s (Target: < 2.5s). Render-blocking requests saving 540ms.

### 2.1 Optimize Fonts (Render Blocking)
- **Action:** Open `app/[locale]/layout.tsx` and `app/(admin)/layout.tsx`.
- **Fix:** The `Geist` and `Geist_Mono` font configurations currently lack the `display` property.
  - Add `display: 'swap'` to all `next/font/google` imports.
  - *Example:* `const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });`

### 2.2 Optimize Hero Image (LCP Breakdown)
- **Action:** Locate the main Hero image component (likely in `components/HeroSection.tsx` or similar).
- **Fix:** 
  - Ensure the primary image uses `next/image` (`import Image from 'next/image'`).
  - Add the `priority={true}` prop to this specific image. This tells Next.js to preload it.
  - Ensure the `sizes` attribute is correctly set (e.g., `sizes="(max-width: 768px) 100vw, 50vw"`).

---

## 🎯 TASK 3: Performance - JavaScript & Animations
*Current Issue:* 51 KiB of unused JavaScript. 1 non-composited animation.

### 3.1 Optimize Framer Motion (Unused JS)
- **Action:** Open `components/HeroSection.tsx`.
- **Fix:** Instead of importing `motion` directly from `framer-motion` (which loads the entire library), use `LazyMotion` and `domAnimation`.
  - Convert: `import { motion } from 'framer-motion'`
  - To: `import { LazyMotion, domAnimation, m } from 'framer-motion'`
  - Wrap the Hero content with `<LazyMotion features={domAnimation}>`.
  - Replace `<motion.div>` with `<m.div>`.
  - *Why?* This reduces the JS bundle size by ~50KB, making the page load instantly.

### 3.2 Fix Non-Composited Animations
- **Action:** Check `app/globals.css` for custom animations.
- **Fix:** Lighthouse flagged 1 animated element. Search `globals.css` for animations using `top`, `left`, `width`, `height`, or `margin`. Change these to use `transform: translate()` and `scale()`. 
  - `transform` is GPU-accelerated and won't block the main thread.
  - Add `will-change: transform;` to the CSS class if needed.

---

## 🧪 Verification Steps (For the Human User)
After the AI makes these changes:
1. Run `npm run build` to ensure there are no errors.
2. Deploy to Vercel.
3. Go to `pagespeed.web.dev` and test the live URL.
4. Target Score: 98-100.