'use client';

import { useState } from 'react';

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

      const response = await fetch(endpoint, options);
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
      setResults({
        ...results,
        [endpoint]: {
          error: error.message,
          timestamp: new Date().toLocaleString(),
        },
      });
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
                        <p className="text-red-600 dark:text-red-400">
                          ❌ Error: {result.error}
                        </p>
                        <p className="text-gray-500 mt-1">เวลา: {result.timestamp}</p>
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

