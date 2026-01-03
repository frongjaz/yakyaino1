'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth-client';
import AddCarForm from '@/components/Admin/AddCarForm';
import AddBlogForm from '@/components/Admin/AddBlogForm';
import LogoutButton from '@/components/Admin/LogoutButton';

interface Session {
  userId: number;
  username: string;
  role: string;
}

type TabType = 'car' | 'blog';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('car');

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const localSession = getSession();
    
    if (localSession) {
      try {
        const data = await apiGet<{ success: boolean; authenticated: boolean; user?: Session }>('/api/auth/check');
        
        if (data.success && data.authenticated && data.user) {
          setSession(data.user);
        } else {
          clearSession();
          router.push('/admin/login');
        }
      } catch (error) {
        setSession(localSession);
      }
    } else {
      router.push('/admin/login');
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-gray-dark dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-color dark:text-body-color-dark">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-gray-dark dark:to-black">
      {/* Header */}
      <div className="bg-white dark:bg-dark shadow-sm border-b border-stroke dark:border-stroke-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-body-color dark:text-body-color-dark">
                  จัดการข้อมูลระบบ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-dark dark:text-white">
                  {session.username}
                </p>
                <p className="text-xs text-body-color dark:text-body-color-dark">
                  Admin
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-dark rounded-lg shadow-three dark:shadow-two border border-stroke dark:border-stroke-dark">
          {/* Tab Navigation */}
          <div className="border-b border-stroke dark:border-stroke-dark">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('car')}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors
                  ${activeTab === 'car'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color dark:text-body-color-dark hover:text-primary hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>เพิ่มข้อมูลรถยนต์</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors
                  ${activeTab === 'blog'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body-color dark:text-body-color-dark hover:text-primary hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>เพิ่มบทความ</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'car' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                      เพิ่มข้อมูลรถยนต์
                    </h2>
                    <p className="text-sm text-body-color dark:text-body-color-dark">
                      กรอกข้อมูลรถยนต์ที่ต้องการเพิ่มลงในระบบ
                    </p>
                  </div>
                </div>
                <AddCarForm />
              </div>
            )}

            {activeTab === 'blog' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                      เพิ่มบทความ
                    </h2>
                    <p className="text-sm text-body-color dark:text-body-color-dark">
                      สร้างบทความใหม่สำหรับเว็บไซต์
                    </p>
                  </div>
                </div>
                <AddBlogForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

