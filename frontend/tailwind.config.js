/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // src 안에 있는 모든 파일 적용
    "./app/**/*.{js,ts,jsx,tsx}", // app router 사용 시 필요
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
