import Link from 'next/link';
import Card from '@/components/ui/Card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, Receipt, FileSpreadsheet } from 'lucide-react';

export default function Home() {
  const documentTypes = [
    {
      type: 'invoice',
      title: 'Service Invoice',
      description: 'Create professional invoices for your services',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      type: 'receipt',
      title: 'Service Receipt',
      description: 'Generate receipts for completed transactions',
      icon: Receipt,
      color: 'bg-blue-400'
    },
    {
      type: 'quotation',
      title: 'Service Quotation',
      description: 'Prepare quotations for potential clients',
      icon: FileSpreadsheet,
      color: 'bg-blue-600'
    }
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-3 sm:mb-4">
            TECHLA 
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            Document Management System
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            Professional document generation made simple
          </p>
        </div>

        {/* Document Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {documentTypes.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.type} href={`/create/${doc.type}`}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                  <div className="flex flex-col items-center text-center p-4 sm:p-6">
                    <div className={`${doc.color} p-3 sm:p-4 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {doc.description}
                    </p>
                    <div className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-500 font-medium group-hover:text-blue-600">
                      Create Now →
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View Documents Button */}
        <div className="text-center">
          <Link href="/documents">
            <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              View Saved Documents
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl mb-2">📊</div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Auto Calculate</h4>
            <p className="text-xs sm:text-sm text-gray-600">Automatic arithmetic calculations</p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl mb-2">💾</div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Save & Store</h4>
            <p className="text-xs sm:text-sm text-gray-600">Save documents for later use</p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl mb-2">⬇️</div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Download</h4>
            <p className="text-xs sm:text-sm text-gray-600">Export to local storage</p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl mb-2">✨</div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Professional</h4>
            <p className="text-xs sm:text-sm text-gray-600">Clean and accurate templates</p>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
