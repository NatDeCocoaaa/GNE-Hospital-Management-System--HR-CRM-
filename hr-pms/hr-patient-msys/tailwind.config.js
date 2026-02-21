/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",   // ← Brand Primary Blue
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        danger: {
          50:  "#fff1f2",
          100: "#ffe4e6",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        warning: {
          50:  "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
        surface: {
          50:  "#f8fafc",   // page background
          100: "#f1f5f9",   // sidebar background
          200: "#e2e8f0",   // dividers / borders
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Sora'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgb(0 0 0 / .08), 0 1px 2px -1px rgb(0 0 0 / .06)",
        sidebar: "2px 0 12px 0 rgb(0 0 0 / .06)",
        topbar:  "0 1px 4px 0 rgb(0 0 0 / .07)",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
    },
  },
  plugins: [],
};