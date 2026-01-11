/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Jost',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      colors: {
        primary: '#DD8190',
        secondary: '#DB2777',
        tertiary: '#F50057',
        mainBackground: '#FEF5F7',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #DD8190 0%, #B8606E 100%)',
      },
    },
  },
  plugins: [],
}

