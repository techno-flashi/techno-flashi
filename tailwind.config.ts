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
        // نظام الألوان الحديث لعام 2025 - مريح للعين ومتطور
        primary: "#6366F1", // Indigo-500 - لون أساسي حديث ومريح
        "primary-hover": "#4F46E5", // Indigo-600 - للتفاعل
        "primary-light": "#EEF2FF", // Indigo-50 - خلفية فاتحة
        secondary: "#10B981", // Emerald-500 - أخضر حديث للنجاح
        accent: "#F59E0B", // Amber-500 - للتنبيهات والعناصر المهمة

        // ألوان النصوص المحدثة - مريحة للعين
        text: {
          primary: "#111827", // Gray-900 - نص رئيسي واضح
          secondary: "#374151", // Gray-700 - عناوين ثانوية
          description: "#6B7280", // Gray-500 - وصف ومعلومات إضافية
          muted: "#9CA3AF", // Gray-400 - نص خفيف
        },

        // خلفيات حديثة ومتدرجة
        background: {
          primary: "#FFFFFF", // أبيض نقي
          secondary: "#F9FAFB", // Gray-50 - خلفية ناعمة
          tertiary: "#F3F4F6", // Gray-100 - خلفية بديلة
          accent: "#F0F9FF", // Sky-50 - خلفية مميزة
        },

        // حدود وفواصل حديثة
        border: {
          light: "#E5E7EB", // Gray-200 - حدود فاتحة
          medium: "#D1D5DB", // Gray-300 - حدود متوسطة
          dark: "#9CA3AF", // Gray-400 - حدود داكنة
        },

        // ألوان الحالة الحديثة
        success: "#10B981", // Emerald-500
        warning: "#F59E0B", // Amber-500
        error: "#EF4444", // Red-500
        info: "#3B82F6", // Blue-500

        // للتوافق مع الكود الموجود - محدث بالألوان الجديدة
        light: {
          background: "#FFFFFF",
          card: "#F9FAFB",
          text: "#111827",
          "text-secondary": "#374151",
          border: "#E5E7EB",
        },
        dark: {
          background: "#FFFFFF", // نبقي على الوضع الفاتح
          card: "#F9FAFB",
          text: "#111827",
          "text-secondary": "#374151",
        },
      },

      fontFamily: {
        // نظام الخطوط المحلية الحديث لعام 2025
        sans: ["Cairo", "Roboto", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
        'arabic-modern': ["Cairo", "sans-serif"],
        english: ["Roboto", "system-ui", "sans-serif"],
        heading: ["Cairo", "sans-serif"],
        amiri: ["Amiri", "serif"],
        cairo: ["Cairo", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },

      fontSize: {
        // أحجام النصوص الثابتة حسب التعليمات
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h1-mobile': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h2-mobile': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3-mobile': ['18px', { lineHeight: '1.3', fontWeight: '500' }],
        'h4': ['18px', { lineHeight: '1.3', fontWeight: '500' }],
        'h4-mobile': ['16px', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-mobile': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
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
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // إضافة لتحسين مظهر النصوص الطويلة في المقالات
  ],
};
export default config;
