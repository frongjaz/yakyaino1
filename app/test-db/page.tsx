import { testConnection, query } from '@/lib/db';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ทดสอบการเชื่อมต่อฐานข้อมูล',
  description: 'หน้าเพจสำหรับทดสอบการเชื่อมต่อฐานข้อมูล',
};

export default async function TestDbPage() {
  let connectionStatus = false;
  let dbInfo: any = null;
  let error: string | null = null;

  try {
    // ทดสอบการเชื่อมต่อ
    connectionStatus = await testConnection();

    if (connectionStatus) {
      // ดึงข้อมูล database version
      const versionRows = await query('SELECT VERSION() as version');
      const tables = await query('SHOW TABLES');

      // แปลงเป็น array ถ้ายังไม่ใช่
      const tablesArray = Array.isArray(tables) ? tables : [];
      const versionArray = Array.isArray(versionRows) ? versionRows : [];

      dbInfo = {
        version: versionArray[0]?.version || null,
        tablesCount: tablesArray.length,
        tables: tablesArray.map((table: any) => {
          // SHOW TABLES returns different formats depending on database
          const values = Object.values(table);
          return values[0] || table.Tables_in_checkk_dbdemo || table[`Tables_in_${process.env.DB_NAME}`] || null;
        }).filter(Boolean),
      };
    }
  } catch (err: any) {
    error = err.message;
    connectionStatus = false;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ทดสอบการเชื่อมต่อฐานข้อมูล</h1>

        {/* Connection Status */}
        <div className={`p-6 rounded-lg mb-6 ${
          connectionStatus 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {connectionStatus ? '✅' : '❌'}
            </span>
            <div>
              <h2 className="text-xl font-semibold">
                {connectionStatus 
                  ? 'เชื่อมต่อฐานข้อมูลสำเร็จ' 
                  : 'การเชื่อมต่อล้มเหลว'}
              </h2>
              {error && (
                <p className="text-red-600 mt-2">ข้อผิดพลาด: {error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Database Info */}
        {connectionStatus && dbInfo && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold mb-4">ข้อมูลฐานข้อมูล</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">MySQL Version</p>
                <p className="text-lg font-medium">{dbInfo.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">จำนวนตาราง</p>
                <p className="text-lg font-medium">{dbInfo.tablesCount} ตาราง</p>
              </div>
            </div>

            {/* Connection Config */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">การตั้งค่าการเชื่อมต่อ</p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm">
                  <strong>Host:</strong> {process.env.DB_HOST || 'N/A'}
                </p>
                <p className="text-sm">
                  <strong>Port:</strong> {process.env.DB_PORT || 'N/A'}
                </p>
                <p className="text-sm">
                  <strong>Database:</strong> {process.env.DB_NAME || 'N/A'}
                </p>
                <p className="text-sm">
                  <strong>User:</strong> {process.env.DB_USER || 'N/A'}
                </p>
              </div>
            </div>

            {/* Tables List */}
            {dbInfo.tables.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">รายชื่อตาราง</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dbInfo.tables.map((table: string, index: number) => (
                    <div
                      key={index}
                      className="bg-blue-50 px-3 py-2 rounded text-sm font-mono"
                    >
                      {table}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>หมายเหตุ:</strong> หากโปรเจกต์ใช้ static export (output: &apos;export&apos;) 
            หน้านี้อาจไม่ทำงานใน production ควรใช้ script สำหรับทดสอบแทน
          </p>
        </div>
      </div>
    </div>
  );
}

