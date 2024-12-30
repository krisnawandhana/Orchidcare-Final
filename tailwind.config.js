/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      container: {
        center: true, // Otomatis center container
        padding: "1rem", // Padding default
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  plugins: [],
}