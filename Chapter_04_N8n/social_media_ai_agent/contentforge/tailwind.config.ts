import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        app: {
          bg: "var(--app-bg)",
          surface: "var(--app-surface)",
          card: "var(--app-card)",
          border: "var(--app-border)",
          text: "var(--app-text)",
          subtle: "var(--app-subtle)",
          muted: "var(--app-muted)",
          accent: "var(--app-accent)",
          "accent-hover": "var(--app-accent-h)",
          input: "var(--app-input)",
          "input-b": "var(--app-input-b)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
