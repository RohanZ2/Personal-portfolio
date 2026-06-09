/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5500', // Neon orange
        secondary: '#f59e0b', // Amber LED
        accent: '#ef4444', // Red LED
        dark: '#0a0a0c', // Charcoal base
        panel: '#141416', // Brushed metal panel
        screen: '#1c1c22', // CRT screen background
        metal: {
          light: '#2a2a30',
          dark: '#121215',
        }
      },
      boxShadow: {
        'led-orange': '0 0 8px #ff5500, 0 0 16px rgba(255, 85, 0, 0.4)',
        'led-amber': '0 0 8px #f59e0b, 0 0 16px rgba(245, 158, 11, 0.4)',
        'led-red': '0 0 8px #ef4444, 0 0 16px rgba(239, 68, 68, 0.4)',
        'led-green': '0 0 8px #22c55e, 0 0 16px rgba(34, 197, 94, 0.4)',
        'crt-glow': 'inset 0 0 20px rgba(255, 85, 0, 0.15), 0 0 10px rgba(255, 85, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
