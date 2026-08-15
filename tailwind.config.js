/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict 4-Color Botanical & Earth Design System
        forest: {
          DEFAULT: '#1D4533',
          900: '#153426',
          800: '#1D4533',
          700: '#265741',
          600: '#306A50',
          500: '#3B7D60',
        },
        linen: {
          DEFAULT: '#F7EAE0',
          50: '#FDF8F5',
          100: '#F7EAE0',
          200: '#EBD7CA',
          300: '#DFC2B3',
        },
        peach: {
          DEFAULT: '#F9D2BA',
          400: '#FCE0D0',
          500: '#F9D2BA',
          600: '#F5C2A4',
          700: '#EFA67B',
        },
        espresso: {
          DEFAULT: '#5E3122',
          950: '#3A1E14',
          900: '#48271A',
          800: '#5E3122',
          700: '#753E2B',
          600: '#8C4C36',
        },
        // Backward compatibility mappings strictly bounded to the 4 colors
        graphite: {
          950: '#1D4533',
          900: '#153426',
          800: '#5E3122',
          700: '#5E3122',
          600: '#5E3122',
          500: '#5E3122',
        },
        electric: {
          DEFAULT: '#1D4533',
          400: '#1D4533',
          500: '#1D4533',
          600: '#153426',
          700: '#5E3122',
        },
        brand: {
          500: '#1D4533',
          600: '#153426',
        }
      },
      borderRadius: {
        'card': '20px',
        'button': '14px',
        'input': '14px',
        'dialog': '24px',
        'pill': '999px',
      },
      boxShadow: {
        'forest-glow': '0 10px 30px rgba(29, 69, 51, 0.25)',
        'peach-glow': '0 10px 30px rgba(249, 210, 186, 0.35)',
        'espresso-glow': '0 10px 30px rgba(94, 49, 34, 0.25)',
        'card-glow': '0 10px 30px rgba(29, 69, 51, 0.15)',
        'cred': '0 15px 35px rgba(94, 49, 34, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
