import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#6D56F2',
          600: '#796DFE',
          700: '#6A5CFE',
        },
        gray: {
          50: '#F9FAFB',
          200: '#E7E4E8',
          300: '#9D95A0',
          400: '#757575',
          500: '#666666',
          600: '#2A1731',
          800: '#1F2937',
        },
        green: {
          300: '#26C760',
        },
        primary: "#6D56F2",
        secondary: "#2A1731",
        lightPurple: "#796DFE",
        background: "#FFFFFF",
        grayText: "#9D95A0",
        success: "#26C760",
      },
      borderRadius: {
        'lg': '8px',
        'full': '9999px',
        large: "30px",
        medium: "18px",
        small: "8px"
      },
      boxShadow: {
        'lg': '0px 0px 30px 0px rgba(106, 92, 254, 0.12)',
        card: "0px 0px 30px 0px rgba(106, 92, 254, 0.12)",
      },
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
