'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearSession } from '@/lib/auth-client';
import { apiPost } from '@/lib/api';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Clear localStorage session
      clearSession();
      
      // Call logout API (optional, for server-side cleanup)
      try {
        await apiPost('/api/auth/logout', {});
      } catch (error) {
        // Ignore API errors, we've already cleared local session
        console.error('Logout API error:', error);
      }
      
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      clearSession();
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
    </button>
  );
}

