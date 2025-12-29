'use client';

import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const apiEndpoint = getApiUrl(endpoint);
      const response = await fetch(apiEndpoint, options);
      const contentType = response.headers.get('content-type');
      
      // ตรวจสอบว่า response เป็น HTML หรือไม่ (แสดงว่า API ไม่ทำงาน)
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        setResults({
          ...results,
          [endpoint]: {
            status: response.status,
            statusText: response.statusText,
            error: 'API ไม่ทำงาน - ได้ HTML กลับมาแทน JSON (Static hosting ไม่รองรับ API routes)',
            receivedHtml: text.substring(0, 200) + '...',
            timestamp: new Date().toLocaleString(),
            solution: 'ต้องใช้ Node.js hosting เพื่อให้ API routes ทำงาน',
          },
        });
        return;
      }

      const data = await response.json();
      
      setResults({
        ...results,
        [endpoint]: {
          status: response.status,
          statusText: response.statusText,
          data,
          timestamp: new Date().toLocaleString(),
        },
      });
    } catch (error: any) {
      // ตรวจสอบว่า error เกิดจาก HTML response หรือไม่
      if (error.message.includes('Unexpected token') || error.message.includes('DOCTYPE')) {
        setResults({
          ...results,
          [endpoint]: {
            error: 'API ไม่ทำงาน - Static hosting ไม่รองรับ API routes',
            details: 'เมื่อเรียก API จะได้ HTML (index.html) กลับมาแทน JSON response',
            timestamp: new Date().toLocaleString(),
            solution: 'ต้องใช้ Node.js hosting (DirectAdmin Node.js Selector) เพื่อให้ API routes ทำงาน',
          },
        });
      } else {
        setResults({
          ...results,
          [endpoint]: {
            error: error.message,
            timestamp: new Date().toLocaleString(),
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        
        <div className="bg-white dark:bg-dark rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ทดสอบ API Endpoints</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={() => testApi('/api/auth/check', 'GET')}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Test /api/auth/check
              </button>
            </div>

            <div>
              <button
                onClick={() => testApi('/api/auth/login', 'POST', { username: 'admin', password: 'test' })}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Test /api/auth/login
              </button>
            </div>

            <div>
              <button
                onClick={() => testApi('/api/cars', 'GET')}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Test /api/cars
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ผลลัพธ์</h2>
          
          {Object.keys(results).length === 0 ? (
            <p className="text-gray-500">ยังไม่ได้ทดสอบ API</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(results).map(([endpoint, result]: [string, any]) => (
                <div key={endpoint} className="border rounded p-4">
                  <h3 className="font-semibold mb-2">{endpoint}</h3>
                  <div className="text-sm">
                    {result.error ? (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        <p className="text-red-600 dark:text-red-400 font-semibold">
                          ❌ Error: {result.error}
                        </p>
                        {result.details && (
                          <p className="text-red-500 dark:text-red-300 mt-2 text-xs">
                            {result.details}
                          </p>
                        )}
                        {result.solution && (
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="text-blue-700 dark:text-blue-300 text-xs font-semibold">
                              💡 วิธีแก้ไข:
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                              {result.solution}
                            </p>
                          </div>
                        )}
                        {result.receivedHtml && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                              ดู HTML ที่ได้รับ
                            </summary>
                            <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                              {result.receivedHtml}
                            </pre>
                          </details>
                        )}
                        <p className="text-gray-500 mt-2 text-xs">เวลา: {result.timestamp}</p>
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <p className="text-green-600 dark:text-green-400">
                          ✅ Status: {result.status} {result.statusText}
                        </p>
                        <pre className="mt-2 text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                        <p className="text-gray-500 mt-1">เวลา: {result.timestamp}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>หมายเหตุ:</strong> ถ้า API ไม่ทำงาน (Error: Failed to fetch) แสดงว่าใช้ static hosting 
            ซึ่งไม่รองรับ API routes ต้องใช้ Node.js hosting แทน
          </p>
        </div>
      </div>
    </div>
  );
}

