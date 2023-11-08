/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')


module.exports = {
  important:true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend:{
      objectFit: ['contain'],
      colors: {
        'b-p-grad': 'linear-gradient(90deg, blue, pink)',
      },
  },
},
  variants: {},
  plugins: [
    // Add the 'important' plugin
    require('tailwindcss-important')(),
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl') },
        'h2': { fontSize: theme('fontSize.xl') },
        'h3': { fontSize: theme('fontSize.lg') },
      })
    }),
  ],
}

 