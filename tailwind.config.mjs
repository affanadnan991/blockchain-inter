/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A86B',
          dark: '#006644',
          light: '#E8F5E9',
        },
        secondary: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
          light: '#FFF3E0',
        },
        accent: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}