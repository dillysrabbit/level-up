/** @type {import('tailwindcss').Config} */
// Health-Angels-Look ("Paper & Ink"): warme Papier-/Ink-Töne statt kühler
// Slate-Grautöne, ein einziger Brombeer-Akzent (brand), Gold für Zahlen und
// Auszeichnung, ein ruhiges Grün für "erreicht/positiv". Die bestehenden
// Skalen-Namen (slate, emerald, amber, red) werden bewusst auf die warme
// Palette umgelenkt, damit der Look in der ganzen App greift.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm ink & paper (ersetzt slate)
        slate: {
          50: "#FAF9F6", // paper – Seitenhintergrund
          100: "#F3EFE8", // paper-3 – Hover-Wash, Meter-Track
          200: "#E7E1D8", // line – Haarlinien
          300: "#D8D0C4", // line-strong – Inputs, stärkere Rahmen
          400: "#A89E93", // ink-faint – Meta, Platzhalter
          500: "#6B6259", // ink-soft – Sekundärtext
          600: "#5A5048",
          700: "#453C35",
          800: "#322B25",
          900: "#211B18", // ink – Primärtext
        },
        // Brombeer/Berry – der eine Markenakzent
        brand: {
          50: "#FDF2F7",
          100: "#FCE7F0",
          200: "#F6CFDF",
          300: "#E9A3BF",
          400: "#C75E88",
          500: "#A8325F",
          600: "#8B1A4A",
          700: "#6D1039",
          800: "#570C2D",
          900: "#420921",
        },
        // Ruhiges Grün – "erreicht / positiv" (ersetzt emerald)
        emerald: {
          50: "#EDF4F0",
          100: "#DFEBE4",
          200: "#C2D8CC",
          300: "#9FC0AE",
          400: "#5F8F77",
          500: "#3B7A5E",
          600: "#2C5F4A",
          700: "#234C3B",
          800: "#1C3D30",
          900: "#152E24",
        },
        // Gold – Zahlen, Fälligkeit, Auszeichnung (ersetzt amber)
        amber: {
          50: "#FBF8EE",
          100: "#F5EDD3",
          200: "#EBDCA8",
          300: "#DFC97B",
          400: "#D4AD3E",
          500: "#C5982A",
          600: "#A67D1A",
          700: "#8A6715",
          800: "#6E5211",
          900: "#573F0D",
        },
        // Warmes Rostrot für destruktive Aktionen
        red: {
          50: "#FBF0EC",
          100: "#F7E0D8",
          200: "#EDC2B3",
          300: "#DE9A83",
          400: "#CC6D4E",
          500: "#B84F30",
          600: "#A03E24",
          700: "#82301C",
          800: "#672617",
          900: "#511E12",
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Newsreader Variable"', "Newsreader", "Georgia", "serif"],
      },
      boxShadow: {
        // Weiche, warme Schatten – nur für Elevation-Momente
        soft: "0 1px 2px 0 rgb(33 27 24 / 0.04), 0 1px 3px 0 rgb(33 27 24 / 0.05)",
        card: "0 2px 6px 0 rgb(33 27 24 / 0.05), 0 14px 34px -16px rgb(33 27 24 / 0.16)",
      },
    },
  },
  plugins: [],
};
