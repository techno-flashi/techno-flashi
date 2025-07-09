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
        dark: {
          background: "#0D1117",
          card: "#161B22",
          text: "#E6EDF3",
          "text-secondary": "#8B949E",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // إضافة لتحسين مظهر النصوص الطويلة في المقالات
  ],
};
export default config;
