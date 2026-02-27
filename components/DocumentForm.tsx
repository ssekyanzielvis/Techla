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
      alert('Please fill in Document Number and TO fields');
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
      alert('Please fill in Document Number and TO fields');
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
    <div className="max-w-5xl mx-auto p-3 sm:p-6 bg-white">
      {/* Techla Header */}
      <div className="border border-gray-300 p-3 sm:p-6 mb-0">
        {/* Top Section with Logo and Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
          {/* Logo and Branding */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 sm:w-[70px] sm:h-[70px] bg-[#0066CC] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"/>
                <path d="M9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z"/>
                <path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-[32px] font-bold text-[#0066CC]" style={{letterSpacing: '1px', lineHeight: '1.2'}}>Techla</h1>
              <p className="text-[12px] font-bold text-[#FF6600]" style={{letterSpacing: '0.5px', marginTop: '0px'}}>SOLUTIONS LIMITED</p>
              <p className="text-[8px] text-gray-600 uppercase" style={{letterSpacing: '1.5px', marginTop: '2px'}}>DESIGN | PRINT | BRANDING | PROMOTION</p>
            </div>
          </div>
          
          {/* Date, NO, and TO fields */}
          <div className="text-left sm:text-right text-[10px] w-full sm:w-auto sm:min-w-[350px]">
            <div className="mb-2 flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-1">
              <div className="whitespace-nowrap">
                <label className="inline-block font-bold mr-2">DATE:</label>
                <input
                  type="text"
                  value={date.split('-').reverse().join(' / ')}
                  onChange={(e) => {
                    const parts = e.target.value.split('/').map(p => p.trim());
                    if (parts.length === 3) {
                      setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                  }}
                  className="w-24 px-2 py-1 border-b border-black focus:outline-none text-center"
                  placeholder="19 / 01 /2026"
                />
                <label className="inline-block font-bold ml-6 mr-2">NO:</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-16 px-1 py-1 focus:outline-none text-red-600 font-bold"
                  placeholder="1791"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center">
              <label className="inline-block font-bold mr-2">TO:</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="px-2 py-1 border-b border-black focus:outline-none w-full sm:w-[300px] text-center"
                placeholder="Ms. Mariam"
              />
            </div>
          </div>
        </div>

        {/* Document Type Banner */}
        <div className="bg-[#0066CC] text-white text-center py-2 font-bold text-sm uppercase -mx-3 sm:-mx-6 mb-2.5" style={{letterSpacing: '1px'}}>
           {getDocumentTypeDisplayName(type).toUpperCase()}
        </div>

        {/* Items Table */}
        <div className="mb-3 overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full border-collapse border-2 border-black min-w-[600px]">
            <thead>
              <tr className="bg-[#0066CC] text-white">
                <th className="border border-black px-2 py-2.5 text-center text-xs font-bold w-12">Item</th>
                <th className="border border-black px-3 py-2.5 text-center text-xs font-bold">Description</th>
                <th className="border border-black px-2 py-2.5 text-center text-xs font-bold w-20">Quantity</th>
                <th className="border border-black px-2 py-2.5 text-center text-xs font-bold w-24">Rate</th>
                <th className="border border-black px-2 py-2.5 text-center text-xs font-bold w-28">Amount</th>
                <th className="border border-black px-2 py-2.5 text-center text-xs font-bold w-16">
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
                  <td className="border border-black px-2 py-2 text-center">
                    <input
                      type="text"
                      value={item.itemNumber}
                      onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                      className="w-full text-center px-1 py-1 focus:outline-none focus:bg-blue-50 text-[11px] font-medium"
                    />
                  </td>
                  <td className="border border-black px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-1 py-1 focus:outline-none focus:bg-blue-50 text-[11px]"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="border border-black px-2 py-2">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-center px-1 py-1 focus:outline-none focus:bg-blue-50 text-[11px]"
                      min="0"
                    />
                  </td>
                  <td className="border border-black px-2 py-2">
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-1 py-1 focus:outline-none focus:bg-blue-50 text-[11px]"
                      min="0"
                    />
                  </td>
                  <td className="border border-black px-2 py-2 text-right font-semibold text-[11px]">
                    {formatCurrency(item.amount).replace('UGX ', '')}=/=
                  </td>
                  <td className="border border-black px-2 py-2 text-center">
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
                  <td className="border border-black px-2 py-2.5">&nbsp;</td>
                  <td className="border border-black px-3 py-2.5">&nbsp;</td>
                  <td className="border border-black px-2 py-2.5">&nbsp;</td>
                  <td className="border border-black px-2 py-2.5">&nbsp;</td>
                  <td className="border border-black px-2 py-2.5">&nbsp;</td>
                  <td className="border border-black px-2 py-2.5">&nbsp;</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr>
                <td className="border border-black px-3 py-2 text-left font-bold text-[11px]">
                  E&OE
                </td>
                <td colSpan={2} className="border border-black px-3 py-2"></td>
                <td className="border border-black px-2 py-2 text-right font-bold text-[11px]">Subtotal</td>
                <td className="border border-black px-2 py-2 text-right font-bold text-[11px]">
                  {formatCurrency(subtotal).replace('UGX ', '')}=/=
                </td>
                <td className="border border-black"></td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black"></td>
                <td className="border border-black px-2 py-2 text-right font-bold text-[11px]">VAT 18%</td>
                <td className="border border-black px-2 py-2 text-right font-bold text-[11px]">
                  {vat === 0 ? '-' : formatCurrency(vat).replace('UGX ', '') + '=/='}
                </td>
                <td className="border border-black"></td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black"></td>
                <td className="border border-black px-2 py-2 text-right font-bold text-xs">Total</td>
                <td className="border border-black px-2 py-2 text-right font-bold text-xs">
                  {formatCurrency(total).replace('UGX ', '')}=/=
                </td>
                <td className="border border-black"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Accounts Note */}
        <div className="text-center text-[10px] mb-3 mt-2">
          Accounts due on Demand
        </div>

        {/* Amount in Words */}
        <div className="mb-1 text-[10px]">
          <span className="font-bold">Amount in words:</span>
          <span className="border-b border-dotted border-black inline-block ml-1" style={{minWidth: 'calc(100% - 130px)', paddingBottom: '3px'}}>
            {amountInWords}
          </span>
        </div>
        <div className="border-b border-dotted border-black mb-4" style={{paddingTop: '2px'}}></div>

        {/* Signature Line */}
        <div className="mb-5 text-[10px]">
          <span className="font-bold">Signature:</span>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="mx-2 px-2 py-1 border-b border-dotted border-black focus:outline-none text-center"
            style={{minWidth: 'calc(100% - 90px)', paddingBottom: '3px'}}
            placeholder="Ali"
          />
        </div>

        {/* Company Name */}
        <div className="text-center mb-4">
          <span className="font-bold text-[#0066CC] text-[11px]">FOR: Techla Solutions Limited.</span>
        </div>

        {/* Services Banner and Contact */}
        <div className="flex -mx-3 sm:-mx-6 mb-0">
          <div className="bg-[#FF6600] text-white font-bold text-[10px] flex items-center justify-center" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '1.5px', padding: '10px 6px', minWidth: '35px'}}>
            OUR SERVICES
          </div>
          <div className="bg-[#0066CC] text-white flex-1 flex flex-col sm:flex-row justify-between gap-2 px-3 sm:px-4 py-2.5 text-[8px]" style={{lineHeight: '1.8'}}>
            <div className="flex-1">
              <div><strong>Office Branding |</strong> Car branding  | <strong>Promotional items |</strong> Out door  Signages</div>
              <div><strong>Stationary Supply |</strong> Graphic Design  | <strong>Offset Printing |</strong> Digital Marketing.</div>
            </div>
            <div className="text-left sm:text-right sm:border-l sm:border-white/20 sm:pl-3 sm:ml-3 sm:min-w-[180px]">
              <div><strong>Tel:</strong> 0751205012 | 0773099480</div>
              <div><strong>Email:</strong> techlasolutionsltd@gmail.com</div>
              <div>Suite G02 and F05 Light Arcade</div>
              <div><strong>Nkrumah Road Opp Charm Towers</strong></div>
            </div>
          </div>
        </div>
        <div className="bg-[#0066CC] h-2 -mx-3 sm:-mx-6"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-end mt-6">
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={downloadDocument}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </Button>
        <Button
          onClick={saveDocument}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
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
