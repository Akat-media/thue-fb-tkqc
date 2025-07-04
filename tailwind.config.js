/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 240s linear infinite',
        'background-slow': 'bgMove 20s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        scroll: 'scroll 30s linear infinite',
      },
      keyframes: {
        bgMove: {
          '0%, 100%': {
            backgroundPosition: '0% 0%',
          },
          '50%': {
            backgroundPosition: '100% 100%',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      fontFamily: {
        work: ['"Work Sans"', 'sans-serif'],
        sans: [
          '"Noto Sans Vietnamese"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        hubot: ['"Hubot Sans"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        revenue: '#4CAF50',
        adCost: '#FF5252',
        reach: '#2196F3',
        engagement: '#AB47BC',
      },
      screens: {
        customScreen: '1510px',
      },
    },
  },
  plugins: [
    // require('tailwind-scrollbar'),
  ],
};
