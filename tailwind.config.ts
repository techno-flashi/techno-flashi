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
        // نظام الألوان الموحد حسب التعليمات النهائية
        primary: "#3333FF", // لون الروابط الأساسي
        "primary-hover": "#3399FF", // لون الروابط عند التمرير
        secondary: "#FF5722", // للعناصر الثانوية (CTA)

        // ألوان النصوص الأساسية
        text: {
          primary: "#1C1C1C", // النص الرئيسي
          secondary: "#4A4A4A", // العناوين الثانوية
          description: "#666666", // الوصف/الحواشي/Metadata
        },

        // الخلفيات الثابتة
        background: {
          primary: "#FFFFFF", // خلفية الموقع العامة
          secondary: "#F9F9F9", // خلفيات الصناديق والعناصر الفرعية
          tertiary: "#FAFAFA", // خلفية بديلة للعناصر
        },

        // للتوافق مع الكود الموجود
        light: {
          background: "#FFFFFF",
          card: "#F9F9F9",
          text: "#1C1C1C",
          "text-secondary": "#4A4A4A",
          border: "#E1E5E9",
        },
        dark: {
          background: "#FFFFFF",
          card: "#F9F9F9",
          text: "#1C1C1C",
          "text-secondary": "#4A4A4A",
        },
      },

      fontFamily: {
        // نظام الخطوط الموحد حسب التعليمات
        sans: ["Cairo", "Tajawal", "Noto Kufi Arabic", "Inter", "Roboto", "Open Sans", "system-ui", "sans-serif"],
        arabic: ["Cairo", "Tajawal", "Noto Kufi Arabic", "system-ui", "sans-serif"],
        english: ["Inter", "Roboto", "Open Sans", "system-ui", "sans-serif"],
        heading: ["Cairo", "Tajawal", "Noto Kufi Arabic", "system-ui", "sans-serif"],
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
