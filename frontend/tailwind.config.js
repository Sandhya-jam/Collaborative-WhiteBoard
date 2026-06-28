/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
    colors: {
      background: "#0D1117",
      surface: "#161B22",
      border: "#30363D",

      primary: "#7C3AED",
      secondary: "#3B82F6",

      success: "#10B981",

      text: "#F8FAFC",
      muted: "#94A3B8",
    },

    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },

    boxShadow: {
      glow: "0 0 40px rgba(124,58,237,.25)",
    },
  },
  },
  plugins: [],
}

