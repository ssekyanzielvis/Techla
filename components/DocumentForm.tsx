'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, DocumentType, DocumentItem } from '@/lib/types';
import {
  calculateItemAmount,
  calculateSubtotal,
  calculateVAT,
  calculateTotal,
  numberToWords,
  formatCurrency,
  generateId,
  getDocumentTypeDisplayName
} from '@/lib/utils';
import { saveDocument as saveToDatabase } from '@/lib/database';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DocumentPDF } from './DocumentPDF';

interface DocumentFormProps {
  type: DocumentType;
}

export default function DocumentForm({ type }: DocumentFormProps) {
  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [to, setTo] = useState('');
  const [signature, setSignature] = useState('');
  const [items, setItems] = useState<DocumentItem[]>([
    { id: generateId(), itemNumber: '1', description: '', quantity: 0, rate: 0, amount: 0 }
  ]);

  const subtotal = calculateSubtotal(items);
  const vat = calculateVAT(subtotal);
  const total = calculateTotal(subtotal, vat);
  const amountInWords = numberToWords(total);

  // Add new item row
  const addItem = () => {
    const newItemNumber = (items.length + 1).toString();
    setItems([
      ...items,
      { id: generateId(), itemNumber: newItemNumber, description: '', quantity: 0, rate: 0, amount: 0 }
    ]);
  };

  // Remove item row
  const removeItem = (id: string) => {
    if (items.length > 1) {
      const updatedItems = items.filter(item => item.id !== id);
      // Renumber items
      const renumberedItems = updatedItems.map((item, index) => ({
        ...item,
        itemNumber: (index + 1).toString()
      }));
      setItems(renumberedItems);
    }
  };

  // Update item field
  const updateItem = (id: string, field: keyof DocumentItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = calculateItemAmount(
            Number(updatedItem.quantity),
            Number(updatedItem.rate)
          );
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Save document to Supabase
  const saveDocument = async () => {
    if (!documentNumber || !to) {
      alert('Please fill in Document Number and M/S fields');
      return;
    }

    const doc: Document = {
      id: generateId(),
      type,
      documentNumber,
      date,
      to,
      items,
      subtotal,
      vat,
      total,
      amountInWords,
      signature,
      createdAt: new Date().toISOString()
    };

    try {
      await saveToDatabase(doc);
      alert('Document saved successfully!');
      router.push('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Document saved to local storage. Database connection may be unavailable.');
      router.push('/documents');
    }
  };

  // Download document as PDF
  const downloadDocument = () => {
    if (!documentNumber || !to) {
      alert('Please fill in Document Number and M/S fields');
      return;
    }

    const doc: Document = {
      id: generateId(),
      type,
      documentNumber,
      date,
      to,
      items,
      subtotal,
      vat,
      total,
      amountInWords,
      signature,
      createdAt: new Date().toISOString()
    };

    // Trigger browser print dialog (user can save as PDF)
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const pdfContent = pdfRef.current;
      if (pdfContent) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${type}-${documentNumber}</title>
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${pdfContent.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Techla Header */}
      <div className="border border-gray-300 p-6 mb-0">
        {/* Top Section with Logo and Info */}
        <div className="flex justify-between items-start mb-4">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-[#0066CC] rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0066CC]">Techla</h1>
              <p className="text-xs text-gray-600 uppercase tracking-wide">DESIGN | PRINT | BRANDING | PROMOTION</p>
            </div>
          </div>
          
          {/* Date and Document Number */}
          <div className="text-right text-sm">
            <div className="mb-2">
              <label className="inline-block w-16 font-medium">DATE:</label>
              <input
                type="text"
                value={date.split('-').reverse().join(' / ')}
                onChange={(e) => {
                  const parts = e.target.value.split('/').map(p => p.trim());
                  if (parts.length === 3) {
                    setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
                  }
                }}
                className="w-32 px-2 py-1 border-b border-gray-400 focus:outline-none"
                placeholder="DD / MM / YYYY"
              />
            </div>
            <div>
              <label className="inline-block w-16 font-medium">NO:</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-32 px-2 py-1 border-b border-gray-400 focus:outline-none"
                placeholder="1791"
              />
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-4">
          <label className="inline-block font-medium text-sm mr-2">M/S:</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-2 py-1 border-b border-gray-400 focus:outline-none w-64"
            placeholder="Client name"
          />
        </div>

        {/* Document Type Banner */}
        <div className="bg-[#0066CC] text-white text-center py-2 font-bold text-lg uppercase tracking-wide -mx-6 mb-4">
          SERVICE {getDocumentTypeDisplayName(type).toUpperCase()}
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-[#0066CC] text-white">
                <th className="border border-gray-400 px-2 py-2 text-center text-sm w-12">Item</th>
                <th className="border border-gray-400 px-3 py-2 text-center text-sm">Description</th>
                <th className="border border-gray-400 px-2 py-2 text-center text-sm w-20">Quantity</th>
                <th className="border border-gray-400 px-2 py-2 text-center text-sm w-24">Rate</th>
                <th className="border border-gray-400 px-2 py-2 text-center text-sm w-28">Amount</th>
                <th className="border border-gray-400 px-2 py-2 text-center text-sm w-16">
                  <button
                    onClick={addItem}
                    className="text-white hover:text-gray-200"
                    title="Add Item"
                  >
                    <Plus size={16} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-400 px-2 py-2 text-center">
                    <input
                      type="text"
                      value={item.itemNumber}
                      onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                      className="w-full text-center px-1 py-1 focus:outline-none focus:bg-blue-50"
                    />
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-1 py-1 focus:outline-none focus:bg-blue-50"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-center px-1 py-1 focus:outline-none focus:bg-blue-50"
                      min="0"
                    />
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-1 py-1 focus:outline-none focus:bg-blue-50"
                      min="0"
                    />
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-right font-medium">
                    {formatCurrency(item.amount).replace('UGX ', '')}/-
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                  <td className="border border-gray-400 px-3 py-3">&nbsp;</td>
                  <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                  <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                  <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                  <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr>
                <td colSpan={3} className="border border-gray-400 px-3 py-2 text-left font-bold">
                  L&OE
                </td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold">Subtotal</td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold">
                  {formatCurrency(subtotal).replace('UGX ', '')}/-
                </td>
                <td className="border border-gray-400"></td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-gray-400"></td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold">VAT 18%</td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold">
                  {formatCurrency(vat).replace('UGX ', '')}/-
                </td>
                <td className="border border-gray-400"></td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-gray-400"></td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold text-lg">Total</td>
                <td className="border border-gray-400 px-2 py-2 text-right font-bold text-lg">
                  {formatCurrency(total).replace('UGX ', '')}/-
                </td>
                <td className="border border-gray-400"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Accounts Note */}
        <div className="text-center text-sm italic mb-3">
          Accounts due on Demand
        </div>

        {/* Amount in Words */}
        <div className="mb-4 text-sm">
          <span className="font-medium">Amount in words:</span>{' '}
          <span className="italic">{amountInWords}</span>
        </div>

        {/* Signature Line */}
        <div className="mb-6 text-sm">
          <span className="font-medium">Signature:</span>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="mx-2 px-2 py-1 border-b border-gray-400 focus:outline-none w-32"
            placeholder="____"
          />
          <span className="font-medium ml-8">All</span>
          <span className="mx-2 border-b border-gray-400 inline-block w-32"></span>
        </div>

        {/* Company Name */}
        <div className="text-center mb-4">
          <span className="font-bold text-[#0066CC]">FOR: Techla Solutions Limited.</span>
        </div>

        {/* Services Banner */}
        <div className="bg-[#FF6600] text-white text-center py-1 font-bold text-sm -mx-6 mb-3">
          OUR SERVICES
        </div>

        {/* Services and Contact */}
        <div className="bg-[#0066CC] text-white -mx-6 px-6 py-3">
          <div className="flex justify-between text-xs">
            <div className="flex-1">
              <p className="mb-1">
                <strong>Office Branding |</strong> Car Branding | <strong>Promotional Items |</strong> Civil Sign Boards |{' '}
                <strong>Tent Branding |</strong> Posters & Banners | <strong>Digital Marketing</strong>
              </p>
            </div>
            <div className="ml-6 text-right whitespace-nowrap">
              <p><strong>Tel:</strong> 0759101025 | 0777C279480</p>
              <p><strong>Email:</strong> techlauganda@gmail.com</p>
              <p><strong>Address:</strong> Hanuman Road Opp Cham Towers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end mt-6">
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={downloadDocument}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </Button>
        <Button
          onClick={saveDocument}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Document
        </Button>
      </div>

      {/* Hidden PDF Template for Download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <DocumentPDF
          ref={pdfRef}
          document={{
            id: generateId(),
            type,
            documentNumber,
            date,
            to,
            items,
            subtotal,
            vat,
            total,
            amountInWords,
            signature,
            createdAt: new Date().toISOString()
          }}
        />
      </div>
    </div>
  );
}
