/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx, ts, tsx}"
  ],
  theme: {
    extend: {
      transform: {
        'center': 'translate(-50%, -50%)'
      }
    },
  },
  plugins: [],
}
