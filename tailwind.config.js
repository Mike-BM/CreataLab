/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			grotesk: ['"Space Grotesk"', 'sans-serif'], // We'll keep this but use sans primarily
		},
		colors: {
			background: '#F9FAFB', // Light gray/off-white
			surface: '#FFFFFF',
			foreground: '#1F2937', // Dark gray
			muted: '#6B7280',
			accent: {
				DEFAULT: '#4dc9e6', // Logo color
				hover: '#2baece', // Darker shade for hover
			},
			primary: {
				DEFAULT: '#4dc9e6',
				foreground: '#FFFFFF'
			},
			card: {
				DEFAULT: '#FFFFFF',
				foreground: '#1F2937'
			},
			border: '#E5E7EB',
			input: '#E5E7EB',
			ring: '#4dc9e6',
		},
		boxShadow: {
			'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
			'2xl': '1rem',
			'3xl': '1.5rem',
		},
		keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
}