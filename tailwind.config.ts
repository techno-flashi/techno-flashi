// **ملف جديد أو محدث**
// هذا الملف يقوم بإعداد Tailwind CSS ليفهم الخطوط التي أضفناها
// ويستخدمها في كل الموقع. هذا جزء أساسي لربط الخطوط بالتصميم.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      colors: {
        // Modern tech website color scheme inspired by TechCrunch/The Verge
        primary: "#0077C8", // Professional tech blue for links and buttons
        secondary: "#FF5722", // Modern orange for CTA elements

        // Main color palette
        tech: {
          white: "#FFFFFF", // Clean white background
          text: "#1C1C1C", // Dark gray-black for main text
          "text-secondary": "#666666", // Medium gray for paragraphs
          "text-light": "#999999", // Light gray for captions
          background: "#FFFFFF", // Main background
          card: "#F5F7FA", // Light gray for cards/blocks
          border: "#E1E5E9", // Subtle borders
          hover: "#F0F2F5", // Hover states
        },

        // Keep existing structure for compatibility
        light: {
          background: "#FFFFFF",
          card: "#F5F7FA",
          text: "#1C1C1C",
          "text-secondary": "#666666",
          border: "#E1E5E9",
        },
        dark: {
          background: "#FFFFFF",
          card: "#F5F7FA",
          text: "#1C1C1C",
          "text-secondary": "#666666",
        },
      },

      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-tajawal)", "var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "var(--font-tajawal)", "system-ui", "sans-serif"],
        tech: ["var(--font-cairo)", "var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-cairo)", "var(--font-tajawal)", "system-ui", "sans-serif"],
      },

      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // إضافة لتحسين مظهر النصوص الطويلة في المقالات
  ],
};
export default config;
