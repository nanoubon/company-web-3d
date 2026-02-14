import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0B3D91',
          navy: '#072A63',
          orange: '#F97316',
          sky: '#E6EEF9'
        }
      },
      boxShadow: {
        card: '0 20px 40px -28px rgba(7,42,99,0.45)'
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(11,61,145,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,0.06) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
