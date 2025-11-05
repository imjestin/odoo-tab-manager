/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./newtab.html",
    "./src/ts/**/*.ts"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2B2B2B',
        'card-bg': '#3B3B3B',
        'odoo-purple': '#714B67',
        'odoo-purple-light': '#9A6B99',
        'odoo-purple-lighter': '#E2D4E1',
        'odoo-gray': '#F6F6F6',
        'accent-blue': '#714B67', // Using Odoo purple as accent
        'accent-purple': '#9A6B99',
        'accent-green': '#714B67' // Using Odoo purple for consistency
      },
      animation: {
        'slow-spin': 'spin 60s linear infinite',
        'pulse-slow': 'pulse 10s ease-in-out infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.15' },
        },
      }
    },
  },
  plugins: [],
}