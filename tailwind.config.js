/** Tether design tokens. Change the look here, not in components. */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        limestone: '#E8E6E1', // canvas
        chalk: '#F6F5F2',     // surfaces
        flint: '#CFCBC3',     // lines
        ink: '#141A17',       // text
        ultramarine: '#2B3BE6', // AI holds the thread
        persimmon: '#F2603C',   // your team holds the thread
        straw: '#E5B93C',       // AI is unsure
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // customer voice
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'], // AI voice
        serif: ['var(--font-serif)', 'Georgia', 'serif'],        // team voice
      },
      keyframes: {
        draw: { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        knot: { '0%': { transform: 'scale(0.6)' }, '60%': { transform: 'scale(1.25)' }, '100%': { transform: 'scale(1)' } },
        fray: { '0%,100%': { strokeDashoffset: '0' }, '50%': { strokeDashoffset: '6' } },
      },
      animation: {
        draw: 'draw 1.2s ease-out forwards',
        knot: 'knot 0.5s ease-out both',
        fray: 'fray 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
