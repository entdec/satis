const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './test/dummy/public/*.html',
    './test/dummy/app/helpers/**/*.rb',
    './test/dummy/app/javascript/**/*.js',
    './test/dummy/app/views/**/*.{erb,haml,html,slim}',
    // Satis content
    "./app/views/**/*",
    "./app/helpers/**/*",
    "./app/controllers/**/*",
    "./app/components/**/*",
    "./app/javascript/**/*.js",
    "./app/assets/**/satis.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
}
