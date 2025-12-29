'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth-client';
import AddCarForm from '@/components/Admin/AddCarForm';
import LogoutButton from '@/components/Admin/LogoutButton';

interface Session {
  userId: number;
  username: string;
  role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // First check localStorage
    const localSession = getSession();
    
    if (localSession) {
      // Verify with API
      try {
        const data = await apiGet<{ success: boolean; authenticated: boolean; user?: Session }>('/api/auth/check');
        
        if (data.success && data.authenticated && data.user) {
          setSession(data.user);
        } else {
          // API says not authenticated, clear local session
          clearSession();
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On error, try to use local session (offline mode)
        setSession(localSession);
      }
    } else {
      // No local session, redirect to login
      router.push('/admin/login');
    }
    
    setLoading(false);
  };

  // Show loading state while checking auth
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

  // If no session, don't render (will redirect)
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
                  จัดการข้อมูลรถยนต์
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
        <div className="bg-white dark:bg-dark rounded-lg shadow-three dark:shadow-two p-8 border border-stroke dark:border-stroke-dark">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stroke dark:border-stroke-dark">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-7 w-7 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                เพิ่มข้อมูลรถยนต์
              </h2>
              <p className="text-sm text-body-color dark:text-body-color-dark mt-1">
                กรอกข้อมูลรถยนต์ที่ต้องการเพิ่มลงในระบบ
              </p>
            </div>
          </div>
          <AddCarForm />
        </div>
      </div>
    </div>
  );
}

