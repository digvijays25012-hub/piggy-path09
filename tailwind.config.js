/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141416',
        primary: '#3772FF',
        secondary: '#777E90',
        success: '#45B26B',
        error: '#EF466F',
        card: '#1F2128',
        border: 'rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(55, 114, 255, 0.15)',
        'premium': '0 10px 30px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
