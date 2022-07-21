const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
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
        white: colors.stone['50'],
        black: colors.stone['800'],
      },
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
