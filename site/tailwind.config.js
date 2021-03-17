const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
    fontFamily: {
      sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      handwriting: ['Caveat', 'cursive'],
    },
    fontSize: {
      ...defaultTheme.fontSize,
      '10xl': '10rem',
      '11xl': '11rem',
      '12xl': '12rem',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
