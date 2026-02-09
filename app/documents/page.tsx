'use client';

import React, { useState, useEffect } from 'react';
import { Document } from '@/lib/types';
import { formatCurrency, formatDate, getDocumentTypeDisplayName } from '@/lib/utils';
import { getDocuments, deleteDocument as deleteFromDatabase } from '@/lib/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, Trash2, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      alert('Failed to load documents. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteFromDatabase(id);
        await loadDocuments();
        if (selectedDocument?.id === id) {
          setSelectedDocument(null);
        }
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const downloadDocument = (doc: Document) => {
    const dataStr = JSON.stringify(doc, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const linkElement = window.document.createElement('a');
    linkElement.href = url;
    linkElement.download = `${doc.type}-${doc.documentNumber}-${doc.date}.json`;
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button variant="secondary" className="mb-4 flex items-center gap-2 text-sm sm:text-base">
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Saved Documents</h1>
          <p className="text-sm sm:text-base text-gray-600">View, download, and manage your documents</p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </Card>
        ) : documents.length === 0 ? (
          <Card className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Documents Yet</h3>
            <p className="text-gray-500 mb-6">Create your first document to get started</p>
            <Link href="/">
              <Button>Create Document</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Documents List */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                All Documents ({documents.length})
              </h2>
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedDocument?.id === doc.id
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-100 text-blue-700">
                          {getDocumentTypeDisplayName(doc.type)}
                        </span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1">
                        {doc.documentNumber}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">To: {doc.to}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Date: {formatDate(doc.date)}</p>
                      <p className="text-base sm:text-lg font-semibold text-blue-600 mt-2">
                        Total: {formatCurrency(doc.total)}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadDocument(doc);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Document Preview */}
            <div className="lg:sticky lg:top-4 h-fit">
              {selectedDocument ? (
                <Card>
                  <div className="border-b-2 border-blue-500 pb-3 sm:pb-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">TECHLA SOLUTIONS</h2>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                      {getDocumentTypeDisplayName(selectedDocument.type)}
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Date:</p>
                        <p className="text-sm sm:text-base font-semibold">{formatDate(selectedDocument.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          {getDocumentTypeDisplayName(selectedDocument.type)} No.:
                        </p>
                        <p className="text-sm sm:text-base font-semibold">{selectedDocument.documentNumber}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">To:</p>
                      <p className="text-sm sm:text-base font-semibold">{selectedDocument.to}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-4 sm:mb-6 overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full border-collapse text-xs sm:text-sm min-w-[500px]">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-gray-300 px-2 py-2 text-left">No.</th>
                          <th className="border border-gray-300 px-2 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-2 py-2 text-right">Qty</th>
                          <th className="border border-gray-300 px-2 py-2 text-right">Rate</th>
                          <th className="border border-gray-300 px-2 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocument.items.map((item) => (
                          <tr key={item.id}>
                            <td className="border border-gray-300 px-2 py-2">{item.itemNumber}</td>
                            <td className="border border-gray-300 px-2 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-2 py-2 text-right">{item.quantity}</td>
                            <td className="border border-gray-300 px-2 py-2 text-right">
                              {formatCurrency(item.rate)}
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-4 sm:mb-6">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(selectedDocument.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">VAT (18%):</span>
                      <span className="font-semibold">{formatCurrency(selectedDocument.vat)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-blue-500">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-blue-600">
                        {formatCurrency(selectedDocument.total)}
                      </span>
                    </div>
                  </div>

                  {/* Amount in Words */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Amount in Words:</p>
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-300">
                      <p className="font-medium text-xs sm:text-sm">{selectedDocument.amountInWords}</p>
                    </div>
                  </div>

                  {/* Signature */}
                  {selectedDocument.signature && (
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Signature:</p>
                      <p className="text-sm sm:text-base font-semibold">{selectedDocument.signature}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                    <Button
                      onClick={() => downloadDocument(selectedDocument)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteDocument(selectedDocument.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Select a document to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
