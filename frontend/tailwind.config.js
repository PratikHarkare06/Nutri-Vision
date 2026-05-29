/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background palette (cream/sage)
        background: "#F6F8F3",      // Main page background
        surface: "#FFFFFF",          // Card/sidebar background
        surfaceAlt: "#F5F5F0",       // Subtle card variant
        sidebar: "#FFFFFF",          // Sidebar bg
        // Borders
        border: "#E2E4DC",           // Default border
        borderStrong: "#C8CBBC",     // Stronger border
        // Primary green accent
        primary: "#7A9E7E",          // Active nav, primary buttons
        primaryDark: "#5C7A60",      // Hover states
        primaryLight: "#D4E6D5",     // Light green bg for highlights
        primaryBg: "#EBF2EB",        // Very light green bg
        // Text
        textHeading: "#2C2C2C",      // Page titles, large headings
        textBody: "#4A4A4A",         // Body text
        textMuted: "#888888",        // Labels, subtitles
        textLight: "#AAAAAA",        // Placeholder
        // Accents
        orange: "#E8815A",           // Calorie icons
        orangeLight: "#FEF0EB",      // Calorie icon bg
        amber: "#D4A847",            // Protein/macro icons
        amberLight: "#FDF5E0",       // Amber icon bg
        rose: "#D47A7A",             // Fat/alert icons
        roseLight: "#FDEAEA",        // Rose icon bg
        blue: "#7A9EBE",             // Water icons
        blueLight: "#EBF2F8",        // Blue icon bg
        sage: "#9DB89F",             // Lighter green
        sageDark: "#5A7A5C",         // Darker sage
        // Legacy aliases for compat
        panel: "#FFFFFF",
        panelBorder: "#E2E4DC",
        success: "#7A9E7E",
        danger: "#D47A7A",
        warning: "#D4A847",
        textMain: "#2C2C2C",
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "sans-serif"],
        heading: ["DM Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.06)",
        cardHover: "0 4px 16px rgba(0,0,0,0.10)",
        sidebar: "2px 0 8px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
