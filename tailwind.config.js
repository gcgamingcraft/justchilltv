/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'apple-dark': '#000000',
        'apple-light': '#f5f5f7',
        'apple-gray': '#1a1a1a',
        'apple-card': '#181818',
        'apple-accent': '#000000',
        'apple-accent-hover': '#222222',
        'apple-glass': 'rgba(36, 36, 36, 0.8)',
        'light-bg': '#f5f5f7',
        'light-card': '#ffffff',
        'light-text': '#1a1a1a',
        'light-gray': '#f2f2f7'
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-right': 'slideRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
        'scale-down': 'scaleDown 0.3s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        scaleUp: {
          '0%': { transform: 'scale(1)', 'box-shadow': '0 0 0 rgba(0,0,0,0)' },
          '100%': { transform: 'scale(1.05)', 'box-shadow': '0 10px 25px rgba(0,0,0,0.5)' }
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)', 'box-shadow': '0 10px 25px rgba(0,0,0,0.5)' },
          '100%': { transform: 'scale(1)', 'box-shadow': '0 0 0 rgba(0,0,0,0)' }
        }
      }
    }
  },
  plugins: []
}
