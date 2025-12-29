'use client';

import { useState } from 'react';

export default function DebugEnvPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnv = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-env');
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 ตรวจสอบ Environment Variables</h1>
        
        <div className="bg-white dark:bg-dark rounded-lg shadow p-6 mb-6">
          <button
            onClick={checkEnv}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ Environment Variables'}
          </button>
        </div>

        {result && (
          <div className="bg-white dark:bg-dark rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">ผลลัพธ์</h2>
            
            {result.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    ✅ API ทำงานได้ (Server-side)
                  </p>
                </div>

                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-3">Database Configuration:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">DB_HOST:</span>
                      <span className={result.env.hasDbHost ? 'text-green-600' : 'text-red-600'}>
                        {result.env.dbHost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">DB_USER:</span>
                      <span className={result.env.hasDbUser ? 'text-green-600' : 'text-red-600'}>
                        {result.env.dbUser}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">DB_PASSWORD:</span>
                      <span className={result.env.hasDbPassword ? 'text-green-600' : 'text-red-600'}>
                        {result.env.hasDbPassword ? '*** (มีค่า)' : 'ไม่พบ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">DB_NAME:</span>
                      <span className={result.env.hasDbName ? 'text-green-600' : 'text-red-600'}>
                        {result.env.dbName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">DB_PORT:</span>
                      <span>{result.env.dbPort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">DB_SOCKET_PATH:</span>
                      <span>{result.env.dbSocket}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-3">Next.js Configuration:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">NODE_ENV:</span>
                      <span>{result.env.nodeEnv || 'ไม่พบ'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">PORT:</span>
                      <span>{result.env.port || 'ไม่พบ'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                    <strong>หมายเหตุ:</strong> ถ้าเห็น &quot;ไม่พบ&quot; แสดงว่า environment variable นั้นไม่ได้ถูกโหลด
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  เวลา: {new Date(result.timestamp).toLocaleString('th-TH')}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                <p className="text-red-600 dark:text-red-400">
                  ❌ Error: {result.error}
                </p>
                <p className="text-red-500 dark:text-red-300 mt-2 text-sm">
                  ถ้าเห็น error นี้ แสดงว่า API ไม่ทำงาน (อาจเป็น static hosting)
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">💡 วิธีแก้ไข:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>ตรวจสอบว่าไฟล์ `.env.local` อยู่ใน `/domains/checkkub.com/public_html/`</li>
            <li>ตรวจสอบว่า permissions เป็น `600`</li>
            <li>ตรวจสอบว่าใช้ Node.js hosting (ไม่ใช่ static export)</li>
            <li>Restart application (PM2 หรือ Node.js Selector)</li>
            <li>ตรวจสอบว่า environment variables ถูกโหลดใน PM2/Node.js Selector</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

