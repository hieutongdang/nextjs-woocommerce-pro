/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b70002',
        secondary: '#4b5563',
        success: '#16a34a', 
        warning: '#f59e0b', 
        alert: '#dc2626', 
        info: '#2563eb',   
        light: '#f9fafb',   
        dark: '#111827',  
      }
      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 