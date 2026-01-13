'use client';

import { trackDownload } from '@/lib/gtag';

interface DownloadTrackerProps {
  fileName: string;
  fileUrl: string;
  children: React.ReactNode;
}

export default function DownloadTracker({ fileName, fileUrl, children }: DownloadTrackerProps) {
  const handleDownload = () => {
    // تتبع التحميل
    trackDownload(fileName);
    
    // فتح الرابط
    window.open(fileUrl, '_blank');
  };

  return (
    <div onClick={handleDownload} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}
