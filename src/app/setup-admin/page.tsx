// صفحة إرشادات إنشاء مستخدم مدير
export default function SetupAdminPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            إعداد مستخدم المدير
          </h1>
          <p className="text-xl text-dark-text-secondary">
            اتبع هذه الخطوات لإنشاء مستخدم مدير في Supabase
          </p>
        </div>

        <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">خطوات الإعداد:</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  افتح Supabase Dashboard
                </h3>
                <p className="text-dark-text-secondary mb-2">
                  اذهب إلى رابط مشروعك في Supabase:
                </p>
                <a 
                  href="https://supabase.com/dashboard/project/zgktrwpladrkhhemhnni" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  فتح Supabase Dashboard
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  انتقل إلى قسم Authentication
                </h3>
                <p className="text-dark-text-secondary">
                  في الشريط الجانبي، اضغط على <strong className="text-white">Authentication</strong> ثم <strong className="text-white">Users</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  أنشئ مستخدم جديد
                </h3>
                <p className="text-dark-text-secondary mb-3">
                  اضغط على زر <strong className="text-white">"Add user"</strong> وأدخل البيانات التالية:
                </p>
                <div className="bg-dark-background p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email:
                      </label>
                      <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                        admin@technoflash.com
                      </code>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Password:
                      </label>
                      <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                        Admin123456!
                      </code>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center text-sm text-gray-300">
                      <input type="checkbox" checked disabled className="mr-2" />
                      Auto Confirm User (مفعل)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  احفظ المستخدم
                </h3>
                <p className="text-dark-text-secondary">
                  اضغط على <strong className="text-white">"Create user"</strong> لحفظ المستخدم
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  اختبر تسجيل الدخول
                </h3>
                <p className="text-dark-text-secondary mb-3">
                  الآن يمكنك تسجيل الدخول باستخدام البيانات المنشأة:
                </p>
                <a 
                  href="/login" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  اذهب لصفحة تسجيل الدخول
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ملاحظات مهمة */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            ⚠️ ملاحظات مهمة:
          </h3>
          <ul className="space-y-2 text-dark-text-secondary">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              تأكد من تفعيل "Auto Confirm User" لتجنب الحاجة لتأكيد البريد الإلكتروني
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              استخدم كلمة مرور قوية في البيئة الإنتاجية
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              يمكنك تغيير البريد الإلكتروني وكلمة المرور لاحقاً من Supabase Dashboard
            </li>
          </ul>
        </div>

        {/* روابط مفيدة */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">روابط مفيدة:</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://supabase.com/dashboard/project/zgktrwpladrkhhemhnni/auth/users" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              إدارة المستخدمين في Supabase
            </a>
            <a 
              href="/login" 
              className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              صفحة تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
