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
      fontFamily: {
        // هنا نطلب من Tailwind استخدام متغيرات الخطوط التي أنشأناها في layout.tsx
        sans: ["var(--font-tajawal)", "var(--font-inter)"],
      },
      colors: {
        // هنا نضع الألوان الأساسية للمشروع لسهولة استخدامها
        primary: "#38BDF8",
        light: {
          background: "#FFFFFF",
          card: "#F8FAFC",
          text: "#1F2937",
          "text-secondary": "#6B7280",
          border: "#E5E7EB",
        },
        // Keep dark colors for reference but switch to light theme
        dark: {
          background: "#FFFFFF", // Changed to white
          card: "#F8FAFC", // Changed to light gray
          text: "#1F2937", // Changed to dark gray
          "text-secondary": "#6B7280", // Changed to medium gray
        },
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
