const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.cyan['50'],
          DEFAULT: colors.cyan['100'],
          dark: colors.cyan['200'],
        },
        secondary: {
          light: colors.rose['50'],
          DEFAULT: colors.rose['100'],
          dark: colors.rose['200'],
        },
        white: colors.warmGray['50'],
        black: colors.warmGray['800'],
      },
    },
    fontFamily: {
      sans: ['Vollkorn', ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
