'use client';

import MarkdownPreview from '@/components/MarkdownPreview';

export default function TestYouTubePage() {
  const testContent = `# اختبار فيديو يوتيوب

هذا مقال تجريبي لاختبار دعم فيديو يوتيوب في المقالات.

## فيديو تجريبي

[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]

هذا الفيديو يجب أن يظهر بشكل صحيح في المعاينة.

## مميزات أخرى

- **نص عريض**
- *نص مائل*
- \`كود\`
- [رابط](https://technoflash.net)

\`\`\`javascript
console.log("هذا كود تجريبي");
\`\`\`

## فيديو آخر

[youtube]https://youtu.be/dQw4w9WgXcQ[/youtube]

## رابط خاطئ

[youtube]https://example.com/not-youtube[/youtube]
`;

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار فيديو يوتيوب</h1>
            <p className="text-dark-text-secondary">صفحة تجريبية لاختبار دعم فيديو YouTube في المقالات</p>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
            <MarkdownPreview content={testContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
