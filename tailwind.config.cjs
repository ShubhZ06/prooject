/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ocean: '#0EA5E9',
        teal: '#14B8A6',
        deep: '#0A0E1A',
        surface: '#131824',
        coral: '#F97316',
        emerald: '#10B981',
        rose: '#FB7185',
        amber: '#FBBF24',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)',
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
