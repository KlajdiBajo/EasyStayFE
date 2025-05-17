/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#008080',
          dark: '#006666',
        },
        warm: {
          orange: '#FF914D',
        },
        charcoal: {
          gray: '#2C3E50',
        },
        light: {
          gray: '#EAEAEA',
        },
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
    },
  },
  plugins: [],
}
