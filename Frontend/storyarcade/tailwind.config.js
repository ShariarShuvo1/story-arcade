/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#264653ff',      // Primary color
        secondary: '#2a9d8fff',    // Secondary color
        accent: '#e9c46aff',       // Accent color
        highlight: '#f4a261ff',    // Highlight color
        danger: '#e76f51ff',       // Danger color

        background: '#f8fafc',     // Background color for the app
        text: {
          DEFAULT: '#2d3748',     // Default text color
          light: '#4a5568',       // Lighter text color for secondary content
          muted: '#6c757d',       // Muted text color for less important content
        },
        button: {
          primary: '#264653ff',   // Primary button color
          secondary: '#2a9d8fff', // Secondary button color
          text: '#ffffff',        // Text color for buttons
        },
        success: '#38c172',       // Success color for positive messages
        error: '#e3342f',         // Error color for error messages
        warning: '#f6993f',       // Warning color for warnings
        info: '#4dc0b5',          // Info color for informational messages
        link: '#1a202c',          // Link color for hyperlinks
      },
    },
  },
  plugins: [],
}
