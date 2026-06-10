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
        phosphor: {
          DEFAULT: '#00ff9d', // Terminal green
          dim: '#00b86f',
          dark: '#0a3d2a',
        },
        magenta: '#ff2975',
        caution: '#ffd000',
        alert: '#ff3b3b',
        grape: '#b14aff',
        bg: {
          DEFAULT: '#050807',
          panel: '#070d0a',
          raised: '#0b1410',
        },
        grid: '#123524', // Border tone
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'cursive'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 8px rgba(0, 255, 157, 0.6), 0 0 24px rgba(0, 255, 157, 0.25)',
        'glow-magenta': '0 0 8px rgba(255, 41, 117, 0.6), 0 0 24px rgba(255, 41, 117, 0.25)',
        'glow-yellow': '0 0 8px rgba(255, 208, 0, 0.6), 0 0 20px rgba(255, 208, 0, 0.25)',
        'glow-red': '0 0 8px rgba(255, 59, 59, 0.6), 0 0 20px rgba(255, 59, 59, 0.25)',
        'glow-purple': '0 0 8px rgba(177, 74, 255, 0.6), 0 0 20px rgba(177, 74, 255, 0.25)',
        'led-cyan': '0 0 8px #00ff9d',
      }
    },
  },
  plugins: [],
}
