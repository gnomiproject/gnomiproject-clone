
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Family colors
				'family-a': '#00B0F0',  // Strategists
				'family-b': '#00B2B1',  // Pragmatists
				'family-c': '#FF8B91',  // Logisticians
				
				// Archetype specific colors
				'archetype-a1': '#EC7500', // Savvy Healthcare Navigators
				'archetype-a2': '#46E0D3', // Complex Condition Managers
				'archetype-a3': '#FFC600', // Proactive Care Consumers
				'archetype-b1': '#7030A0', // Resourceful Adapters
				'archetype-b2': '#FF8C91', // Healthcare Pragmatists
				'archetype-b3': '#0D41C0', // Care Channel Optimizers
				'archetype-c1': '#E40032', // Scalable Access Architects
				'archetype-c2': '#00B0F0', // Care Adherence Advocates
				'archetype-c3': '#870C0C',  // Engaged Healthcare Consumers
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out'
			},
			safelist: [
				// Make sure all our custom color classes are in the final CSS
				'bg-family-a',
				'bg-family-b',
				'bg-family-c',
				'text-family-a',
				'text-family-b',
				'text-family-c',
				'bg-archetype-a1',
				'bg-archetype-a2',
				'bg-archetype-a3',
				'bg-archetype-b1',
				'bg-archetype-b2',
				'bg-archetype-b3',
				'bg-archetype-c1',
				'bg-archetype-c2',
				'bg-archetype-c3',
				'text-archetype-a1',
				'text-archetype-a2',
				'text-archetype-a3',
				'text-archetype-b1',
				'text-archetype-b2',
				'text-archetype-b3',
				'text-archetype-c1',
				'text-archetype-c2',
				'text-archetype-c3',
				'hover:bg-archetype-a1',
				'hover:bg-archetype-a2',
				'hover:bg-archetype-a3',
				'hover:bg-archetype-b1',
				'hover:bg-archetype-b2',
				'hover:bg-archetype-b3',
				'hover:bg-archetype-c1',
				'hover:bg-archetype-c2',
				'hover:bg-archetype-c3',
				'hover:text-archetype-a1',
				'hover:text-archetype-a2',
				'hover:text-archetype-a3',
				'hover:text-archetype-b1',
				'hover:text-archetype-b2',
				'hover:text-archetype-b3',
				'hover:text-archetype-c1',
				'hover:text-archetype-c2',
				'hover:text-archetype-c3',
				'bg-archetype-a1/10',
				'bg-archetype-a2/10',
				'bg-archetype-a3/10',
				'bg-archetype-b1/10',
				'bg-archetype-b2/10',
				'bg-archetype-b3/10',
				'bg-archetype-c1/10',
				'bg-archetype-c2/10',
				'bg-archetype-c3/10',
				'bg-archetype-a1/20',
				'bg-archetype-a2/20',
				'bg-archetype-a3/20',
				'bg-archetype-b1/20',
				'bg-archetype-b2/20',
				'bg-archetype-b3/20',
				'bg-archetype-c1/20',
				'bg-archetype-c2/20',
				'bg-archetype-c3/20',
				'border-archetype-a1',
				'border-archetype-a2',
				'border-archetype-a3',
				'border-archetype-b1',
				'border-archetype-b2',
				'border-archetype-b3',
				'border-archetype-c1',
				'border-archetype-c2',
				'border-archetype-c3',
				'bg-family-a/10',
				'bg-family-b/10',
				'bg-family-c/10',
				'bg-family-a/20',
				'bg-family-b/20',
				'bg-family-c/20',
				'hover:bg-family-a/20',
				'hover:bg-family-b/20',
				'hover:bg-family-c/20',
			],
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

