/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
            'primary': '#4285f4', // Header Blue from image
            'secondary': '#606060', // Gray
            'accent': {
                50: '#fef2f2',
                100: '#fee2e2',
                200: '#fecaca',
                300: '#fca5a5',
                400: '#f87171',
                500: '#ef4444',
                600: '#dc2626',
                700: '#b91c1c',
                800: '#991b1b',
                900: '#7f1d1d',
                950: '#450a0a',
              }, // Red
            'button': {
                start: '#e63946', // Lighter Red (Start of gradient)
                end: '#7a1921', // Darker Red (End of gradient)
            },
            'neutral': '#ffffff', // White
            'base': '#0f172a', // Dark Blue/Navy for dark mode
        },
    },
  },
  plugins: [],
};