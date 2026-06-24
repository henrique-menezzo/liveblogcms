import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact tokens read from Figma frame 142:5747
        canvas: "#f0eeee", // page background (warm gray)
        topbar: "#ececec", // global top navigation bar (Figma "Navigation")
        feed: "#fafafa", // Live Blog Article card surface (Figma)
        surface: "#f0f0f0", // feed scroll surface + unselected post panel (Figma)
        panelSel: "#e6e6e6", // selected post panel (Figma)
        ink: "#18181b", // primary text (zinc-900)
        black: "#0a0909", // buttons / headings
        subtle: "#525252", // secondary text
        muted: "#8f8f8f", // tertiary / inline placeholders
        line: "#e4e4e7", // borders
        dashed: "#b8b8b8", // upload zone border
        label: "#1f1f1f", // form labels
        // Status accents
        success: "#16a34a",
        successBg: "#53ff84", // Figma "Published" tag is bright green
        danger: "#db3d3b",
        warning: "#ea580c",
      },
      fontFamily: {
        sans: ["var(--font-franklin)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
