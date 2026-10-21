/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: {
          dark: '#0f1115',
          card: 'rgba(26, 29, 36, 0.75)',
          gold: '#cba76b',
          stone: '#e5e2dc',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
