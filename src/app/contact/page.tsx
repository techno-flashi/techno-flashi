import type { Metadata } from 'next';

// تعريف بيانات السيو للصفحة (تم تحديث الروابط لتناسب tfai.pro)
export const metadata: Metadata = {
  title: 'Business Contact | Techno Flash',
  description: 'Contact Techno Flash team for sponsorship opportunities, business partnerships, and media inquiries related to AI and technology.',
  keywords: 'Techno Flash, Contact, Business, Sponsorship, AI, Technology, Partnership',
  openGraph: {
    title: 'Business Contact | Techno Flash',
    description: 'Contact Techno Flash for business inquiries and sponsorship opportunities.',
    url: 'https://www.tfai.pro/contact',
    siteName: 'Techno Flash',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    // حاوية الصفحة الرئيسية بتصميم متجاوب
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Business Contact
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Partnership & Sponsorship Inquiries
          </p>
        </div>

        {/* الكارت الأساسي للمحتوى */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="p-8 sm:p-10">
            
            {/* نص الترحيب */}
            <div className="text-lg text-gray-700 dark:text-gray-200 space-y-4 leading-relaxed">
              <p>
                Thank you for your interest in <strong>Techno Flash</strong>.
              </p>
              <p>
                For sponsorship opportunities, business partnerships, media inquiries, or advertising proposals, please contact our team directly via our official email.
              </p>
            </div>

            {/* صندوق الإيميل المميز */}
            <div className="my-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl text-center border border-blue-200 dark:border-blue-700/50 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 flex items-center justify-center gap-2">
                📧 Official Business Email
              </h2>
              <a href="mailto:contact@tfai.pro" className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors break-all">
                contact@tfai.pro
              </a>
            </div>

            {/* صندوق التنويه الهام (الفلتر) */}
            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
                    IMPORTANT NOTE
                  </h3>
                  <div className="mt-2 text-red-700 dark:text-red-200/90 text-sm space-y-2">
                    <p>
                      Please note that Techno Flash is strictly an educational media platform.
                    </p>
                    <p className="font-semibold">We DO NOT provide:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>Personal technical support or troubleshooting.</li>
                      <li>Consultation for private projects.</li>
                    </ul>
                    <p className="font-bold mt-3 text-base">
                      Business and sponsorship inquiries only, please.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
