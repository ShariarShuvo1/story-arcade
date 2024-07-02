/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7DF9FF',      // Electric Blue
        secondary: '#39FF14',    // Neon Green
        accent: '#FF69B4',       // Hot Pink
        highlight: '#FDFF00',    // Lemon Yellow
        danger: '#00FFFF',       // Cyan

        background: '#FF00FF',   // Magenta
        text: {
          DEFAULT: '#00FF7F',    // Spring Green
          light: '#FFA500',      // Orange Peel
          muted: '#BFFF00',      // Lime
        },
        button: {
          primary: '#FF00FF',    // Fuchsia
          secondary: '#40E0D0',  // Turquoise
          text: '#800080',       // Purple
        },
        success: '#00BFFF',      // Deep Sky Blue
        error: '#7FFF00',        // Chartreuse
        warning: '#FF7F50',      // Coral
        info: '#E6E6FA',         // Lavender
        link: '#00FFFF',         // Aqua
      },
    },
  },
  plugins: [],
}
