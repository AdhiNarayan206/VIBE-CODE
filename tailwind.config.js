/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        dozy: {
          lavender: {
            light: '#E6E6FA',
            DEFAULT: '#9E9EFF',
            dark: '#7575CF'
          },
          sage: {
            light: '#D6EBE0',
            DEFAULT: '#5DBB8A',
            dark: '#4A9570'
          },
          peach: {
            light: '#FFDAB9',
            DEFAULT: '#FFBD88',
            dark: '#E8A878'
          },
          background: {
            light: '#F8F9FA',
            dark: '#0E1B1F'
          },
          surface: {
            light: '#FFFFFF',
            dark: '#10191B'
          },
          text: {
            light: '#333333',
            dark: '#E0E0E0'
          },
          secondary: {
            light: '#6B7280',
            dark: '#9CA3AF'
          }
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'sage': '0 0 20px rgba(93, 187, 138, 0.3)',
        'sage-sm': '0 0 10px rgba(93, 187, 138, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-left': 'slideLeft 0.5s ease-in-out',
        'slide-right': 'slideRight 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}