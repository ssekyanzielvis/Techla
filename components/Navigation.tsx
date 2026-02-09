'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LogOut } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  // Don't show navigation on login page
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b-2 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">TECHLA </h1>
          </Link>
          
          {isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="flex gap-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
                <Link 
                  href="/documents" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
                >
                  Documents
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 sm:border-l sm:pl-4">
                <span className="text-xs sm:text-sm text-gray-600 text-center">
                  Welcome, <strong>{user?.username}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors text-sm sm:text-base"
                >
                  <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
