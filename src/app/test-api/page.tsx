'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    if (!email) {
      alert('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: 'Test User',
          source: 'test-api'
        }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        data: data
      });

    } catch (error) {
      setResult({
        status: 'error',
        data: { message: 'خطأ في الشبكة: ' + error }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          اختبار API النشرة البريدية
        </h1>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={testAPI}
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-300"
          >
            {loading ? 'جاري الاختبار...' : 'اختبار API'}
          </button>

          {result && (
            <div className="mt-6">
              <h3 className="text-white font-medium mb-3">النتيجة:</h3>
              <div className="bg-dark-background rounded-lg p-4 border border-gray-700">
                <div className="mb-2">
                  <span className="text-dark-text-secondary">الحالة: </span>
                  <span className={`font-medium ${
                    result.status === 200 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div>
                  <span className="text-dark-text-secondary">البيانات: </span>
                  <pre className="text-white text-sm mt-2 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/test-newsletter"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
          >
            العودة لصفحة الاختبار الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
