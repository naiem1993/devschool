import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // react-hooks/set-state-in-effect is too aggressive for our SSR-heavy
  // architecture. We use setState-in-effect for several canonical cases that
  // React's own docs endorse:
  //   1. Hydrating React state from browser-only sources (localStorage,
  //      window.location, matchMedia) after mount — otherwise SSR/CSR
  //      mismatch. React docs: "Subscribing to an external store".
  //   2. Prop→state resets when the selected item changes in an admin editor
  //      (a `key={id}` refactor is tracked separately).
  //   3. Timer/animation loops (typing effect) whose state advances per frame.
  // Every existing usage is documented inline. Re-enable per-file if any
  // future code does NOT fit the above categories.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
