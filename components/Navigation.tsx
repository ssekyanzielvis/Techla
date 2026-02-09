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
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">TECHLA SOLUTIONS</h1>
          </Link>
          
          {isAuthenticated && (
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/documents" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Documents
                </Link>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <span className="text-sm text-gray-600">
                  Welcome, <strong>{user?.username}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut size={18} />
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
