/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: '#F8F6F2',
        offwhiteWarm: '#F2EFE8',
        darkgreen: '#2D4A3E',
        darkgreenMuted: '#4A6B5A',
        textPrimary: '#1A1A1A',
        textSecondary: '#5C5C5C',
        borderSoft: '#E5E2DC',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06)',
        softMd: '0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
