import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Color Tokens ──────────────────────────────────────────────
      colors: {
        /**
         * brand.*  — primary blue used in the BrandPanel gradient,
         *            brand buttons, and link accents.
         */
        brand: {
          DEFAULT: "#0575e6",   // primary blue
          hover:   "#0463c4",   // hover state
          dark:    "#02298a",   // gradient mid-stop
          darker:  "#021b79",   // gradient end-stop
          fg:      "#ffffff",   // foreground on brand bg
        },

        /**
         * ink.*  — all text / foreground colours.
         * Replaces the mix of #0a0a0a, #333, gray-*, slate-* used for text.
         */
        ink: {
          DEFAULT: "#0a0a0a",   // primary body text
          secondary: "#525252", // subtitles, secondary labels
          muted:     "#737373", // helper text, captions
          placeholder: "#a3a3a3", // input placeholders
          disabled:  "#c4c4c4", // disabled state text
          inverse:   "#ffffff", // text on dark surfaces
        },

        /**
         * surface.*  — background / container colours.
         * Replaces white, #f5f5f5, slate-50, and arbitrary bg tokens.
         */
        surface: {
          DEFAULT: "#ffffff",   // page background
          subtle:  "#f9f9f9",   // very light container
          muted:   "#f5f5f5",   // input backgrounds, card fills
          inverse: "#0a0a0a",   // dark surface (black button)
        },

        /**
         * border.*  — stroke / divider colours.
         */
        border: {
          DEFAULT: "#e5e5e5",   // default border
          strong:  "#c4c4c4",   // stronger divider
          focus:   "#0a0a0a",   // focus ring on light bg
          brand:   "#0575e6",   // focus ring on brand-accented elements
        },

        /**
         * status.*  — semantic feedback colours.
         * Replaces raw red-* and emerald-* palette classes.
         */
        success: {
          DEFAULT: "#059669",
          bg:      "#ecfdf5",
          border:  "#a7f3d0",
          text:    "#065f46",
        },
        error: {
          DEFAULT: "#dc2626",
          bg:      "#fef2f2",
          border:  "#fecaca",
          text:    "#b91c1c",
        },
        warning: {
          DEFAULT: "#d97706",
          bg:      "#fffbeb",
          border:  "#fde68a",
          text:    "#92400e",
        },
      },

      // ─── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans:  ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },

      /**
       * Semantic font-size scale.
       * [size, { lineHeight, fontWeight? }]
       */
      fontSize: {
        display: ["42px", { lineHeight: "1.15", fontWeight: "400" }], // auth form title
        heading: ["32px", { lineHeight: "1.2",  fontWeight: "700" }], // page headings
        title:   ["24px", { lineHeight: "1.3",  fontWeight: "700" }], // section titles
        lead:    ["18px", { lineHeight: "1.5",  fontWeight: "400" }], // brand panel tagline
        base:    ["14px", { lineHeight: "1.55", fontWeight: "400" }], // default body / inputs
        label:   ["14px", { lineHeight: "1.4",  fontWeight: "500" }], // form labels
        caption: ["13px", { lineHeight: "1.4",  fontWeight: "400" }], // footer links, help text
        micro:   ["12px", { lineHeight: "1.4",  fontWeight: "400" }], // badges, timestamps
      },

      // ─── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        input:  "8px",   // form inputs, banners, cards
        button: "8px",   // primary / secondary buttons
        pill:   "30px",  // BrandPanel "Read More" pill button
        badge:  "20px",  // tags and badges
      },

      // ─── Box Shadow ────────────────────────────────────────────────
      boxShadow: {
        card:    "0 2px 8px  rgba(0,0,0,0.06)",
        panel:   "0 4px 24px rgba(0,0,0,0.08)",
        modal:   "0 8px 40px rgba(0,0,0,0.14)",
        "input-focus": "0 0 0 3px rgba(5,117,230,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
