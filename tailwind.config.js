/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 240s linear infinite",
        "background-slow": "bgMove 20s ease-in-out infinite",
      },
      keyframes: {
        bgMove: {
          "0%, 100%": {
            backgroundPosition: "0% 0%",
          },
          "50%": {
            backgroundPosition: "100% 100%",
          },
        },
      },
      fontFamily: {
        work: ['"Work Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
