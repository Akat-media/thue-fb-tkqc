/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 240s linear infinite",
        "background-slow": "bgMove 20s ease-in-out infinite",
        // "float": "float 20s ease-in-out infinite",
        float: 'float 3s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        work: ['"Work Sans"', "sans-serif"],
      },
      colors: {
        revenue: "#4CAF50",
        adCost: "#FF5252",
        reach: "#2196F3",
        engagement: "#AB47BC",
      },
      // fontFamily: {
      //   sans: ["Poppins", "ui-sans-serif", "system-ui"],
      // },
    },
  },
  plugins: [],
};
