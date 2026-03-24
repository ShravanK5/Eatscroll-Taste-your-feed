/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        // FIX: 'amber', 'dark-2', 'dark-3' were used in Cart, OrderSuccess,
        //      OwnerDashboard, OwnerLogin, OwnerUpload etc. but were never defined
        //      here — Tailwind silently dropped those classes (invisible styling bugs).
        amber: '#F59E0B',
        'dark-2': '#1E1E1E',
        'dark-3': '#2A2A2A',
      },
      fontFamily: {
        body: ['Outfit', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}