'use client';

import { useEffect, useState } from 'react';

interface ConsoleError {
  type: 'error' | 'warning' | 'info';
  message: string;
  source?: string;
  line?: number;
  column?: number;
  timestamp: Date;
  stack?: string;
}

interface ConsoleErrorMonitorProps {
  enabled?: boolean;
  maxErrors?: number;
  showReport?: boolean;
}

export function ConsoleErrorMonitor({
  enabled = process.env.NODE_ENV === 'development',
  maxErrors = 50,
  showReport = false
}: ConsoleErrorMonitorProps) {
  const [errors, setErrors] = useState<ConsoleError[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Override console methods to capture errors
    console.error = (...args) => {
      const error: ConsoleError = {
        type: 'error',
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
        timestamp: new Date(),
        stack: new Error().stack
      };
      
      setErrors(prev => [...prev.slice(-(maxErrors - 1)), error]);
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const warning: ConsoleError = {
        type: 'warning',
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
        timestamp: new Date()
      };
      
      setErrors(prev => [...prev.slice(-(maxErrors - 1)), warning]);
      originalConsoleWarn.apply(console, args);
    };

    console.info = (...args) => {
      const info: ConsoleError = {
        type: 'info',
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
        timestamp: new Date()
      };
      
      setErrors(prev => [...prev.slice(-(maxErrors - 1)), info]);
      originalConsoleInfo.apply(console, args);
    };

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      const error: ConsoleError = {
        type: 'error',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: new Date(),
        stack: event.error?.stack
      };
      
      setErrors(prev => [...prev.slice(-(maxErrors - 1)), error]);
    };

    // Capture unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: ConsoleError = {
        type: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        stack: event.reason?.stack
      };
      
      setErrors(prev => [...prev.slice(-(maxErrors - 1)), error]);
    };

    // Capture network errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const error: ConsoleError = {
          type: 'error',
          message: `Failed to load resource: ${target.getAttribute('src') || target.getAttribute('href')}`,
          timestamp: new Date()
        };
        
        setErrors(prev => [...prev.slice(-(maxErrors - 1)), error]);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    document.addEventListener('error', handleResourceError, true);

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('error', handleResourceError, true);
    };
  }, [enabled, maxErrors]);

  const getErrorIcon = (type: ConsoleError['type']) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getErrorColor = (type: ConsoleError['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const exportErrors = () => {
    const errorData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: errors
    };
    
    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-errors-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!enabled) return null;

  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-16 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label={isVisible ? "إخفاء مراقب الأخطاء" : "عرض مراقب الأخطاء"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        {errors.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {errors.length}
          </span>
        )}
      </button>

      {/* Console error monitor panel */}
      {isVisible && (
        <div className="fixed top-28 right-4 z-40 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-xl max-w-lg max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm">مراقب أخطاء الكونسول</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportErrors}
                className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                title="تصدير الأخطاء"
                disabled={errors.length === 0}
              >
                📥
              </button>
              <button
                onClick={clearErrors}
                className="text-gray-400 hover:text-gray-300 transition-colors text-xs"
                title="مسح الأخطاء"
                disabled={errors.length === 0}
              >
                🗑️
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="إغلاق المراقب"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-red-400 font-bold">{errorCount}</div>
                <div className="text-gray-400">أخطاء</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">{warningCount}</div>
                <div className="text-gray-400">تحذيرات</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold">{errors.filter(e => e.type === 'info').length}</div>
                <div className="text-gray-400">معلومات</div>
              </div>
            </div>
          </div>

          {/* Error list */}
          {errors.length === 0 ? (
            <div className="text-green-400 text-sm text-center py-4">
              ✅ لا توجد أخطاء في الكونسول
            </div>
          ) : (
            <div className="space-y-2">
              {errors.slice(-10).reverse().map((error, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-3">
                  <div className={`font-medium text-xs ${getErrorColor(error.type)} flex items-center mb-1`}>
                    <span className="mr-2">{getErrorIcon(error.type)}</span>
                    <span className="flex-1 truncate">{error.message}</span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-1">
                    {error.timestamp.toLocaleTimeString('ar-SA')}
                  </div>
                  
                  {error.source && (
                    <div className="text-xs text-gray-500 font-mono">
                      {error.source}:{error.line}:{error.column}
                    </div>
                  )}
                  
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-400 cursor-pointer">Stack Trace</summary>
                      <pre className="text-xs text-gray-500 mt-1 overflow-x-auto whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
              
              {errors.length > 10 && (
                <div className="text-center text-xs text-gray-400">
                  ... و {errors.length - 10} أخطاء أخرى
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Hook لمراقبة الأخطاء
export function useConsoleErrorMonitor() {
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState<ConsoleError | null>(null);

  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      setErrorCount(prev => prev + 1);
      setLastError({
        type: 'error',
        message: args.join(' '),
        timestamp: new Date()
      });
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return { errorCount, lastError };
}
