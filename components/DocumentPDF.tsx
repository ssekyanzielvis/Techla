'use client';

import React from 'react';
import { Document } from '@/lib/types';
import { formatCurrency, getDocumentTypeDisplayName } from '@/lib/utils';

interface DocumentPDFProps {
  document: Document;
}

export const DocumentPDF = React.forwardRef<HTMLDivElement, DocumentPDFProps>(
  ({ document }, ref) => {
    const formatDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      const day = parts[2].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[0];
      return `${day} / ${month} / ${year}`;
    };

    // Calculate empty rows needed
    const filledRows = document.items.length;
    const emptyRowsCount = Math.max(0, 8 - filledRows);

    return (
      <div ref={ref} className="bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '0', margin: '0 auto' }}>
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          .pdf-container {
            font-family: Arial, sans-serif;
            padding: 15mm 15mm;
            position: relative;
          }
          .pdf-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            border: 2px solid #000;
          }
          .pdf-table th,
          .pdf-table td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 11px;
            line-height: 1.4;
          }
          .pdf-table th {
            background-color: #0066CC;
            color: white;
            font-weight: bold;
            text-align: center;
            padding: 10px 8px;
            font-size: 12px;
          }
          .blue-banner {
            background-color: #0066CC;
            color: white;
            text-align: center;
            padding: 8px 10px;
            font-weight: bold;
            font-size: 14px;
            margin: 0 -15mm 10px -15mm;
            letter-spacing: 1px;
          }
          .orange-banner {
            background-color: #FF6600;
            color: white;
            text-align: center;
            padding: 4px;
            font-weight: bold;
            font-size: 12px;
            margin: 15px -15mm 10px -15mm;
          }
          .blue-footer {
            background-color: #0066CC;
            color: white;
            padding: 12px;
            margin: 0 -15mm 0 -15mm;
            font-size: 9px;
          }
          .logo-box {
            width: 70px;
            height: 70px;
            background-color: #0066CC;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .company-name {
            color: #0066CC;
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            line-height: 1.2;
            letter-spacing: 1px;
          }
          .tagline {
            font-size: 8px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 2px;
          }
        `}</style>

        <div className="pdf-container">
          {/* Header Section */}
          <div style={{ marginBottom: '12px' }}>
            {/* Logo and Company Name + Date/NO/TO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Left: Logo and Company Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div className="logo-box">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                    {/* WiFi Icon */}
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z" fill="white"/>
                    <path d="M9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z" fill="white"/>
                    <path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h1 className="company-name">Techla</h1>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF6600', marginTop: '0px', letterSpacing: '0.5px' }}>SOLUTIONS LIMITED</div>
                  <p className="tagline">DESIGN | PRINT | BRANDING | PROMOTION</p>
                </div>
              </div>

              {/* Right: Date, NO, and TO fields */}
              <div style={{ textAlign: 'right', fontSize: '10px', minWidth: '350px' }}>
                <div style={{ marginBottom: '8px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '8px' }}>DATE:</span>
                  <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '95px', textAlign: 'center', paddingBottom: '1px' }}>
                    {formatDate(document.date)}
                  </span>
                  <span style={{ fontWeight: 'bold', margin: '0 8px 0 25px' }}>NO:</span>
                  <span style={{ color: '#FF0000', fontWeight: 'bold', fontSize: '11px' }}>
                    {document.documentNumber}
                  </span>
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '8px' }}>TO:</span>
                  <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '300px', textAlign: 'center', paddingBottom: '1px' }}>
                    {document.to}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Type Banner */}
          <div className="blue-banner">
            {getDocumentTypeDisplayName(document.type).toUpperCase()}
          </div>

          {/* Items Table */}
          <table className="pdf-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Item</th>
                <th style={{ textAlign: 'left', paddingLeft: '12px' }}>Description</th>
                <th style={{ width: '80px' }}>Quantity</th>
                <th style={{ width: '95px' }}>Rate</th>
                <th style={{ width: '110px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {document.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>{item.itemNumber}</td>
                  <td style={{ paddingLeft: '12px' }}>{item.description}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', paddingRight: '12px' }}>{formatCurrency(item.rate).replace('UGX ', '')}=/=</td>
                  <td style={{ textAlign: 'right', fontWeight: '600', paddingRight: '12px' }}>{formatCurrency(item.amount).replace('UGX ', '')}=/=</td>
                </tr>
              ))}
              {/* Empty rows */}
              {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ height: '26px', border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                </tr>
              ))}
              {/* Totals */}
              <tr>
                <td style={{ fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px', border: '1px solid #000', borderRight: 'none' }}>E&OE</td>
                <td colSpan={2} style={{ border: '1px solid #000', borderLeft: 'none', borderRight: 'none' }}>&nbsp;</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', border: '1px solid #000', borderLeft: 'none' }}>Subtotal</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', border: '1px solid #000' }}>{formatCurrency(document.subtotal).replace('UGX ', '')}=/=</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', borderTop: '1px solid #000', borderRight: 'none' }}>&nbsp;</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', border: '1px solid #000', borderLeft: 'none' }}>VAT 18%</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', border: '1px solid #000' }}>{document.vat === 0 ? '-' : formatCurrency(document.vat).replace('UGX ', '') + '=/='}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', borderTop: '1px solid #000', borderRight: 'none' }}>&nbsp;</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', fontSize: '12px', border: '1px solid #000', borderLeft: 'none' }}>Total</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '12px', fontSize: '12px', border: '1px solid #000' }}>{formatCurrency(document.total).replace('UGX ', '')}=/=</td>
              </tr>
            </tbody>
          </table>

          {/* Accounts Note */}
          <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '12px', marginTop: '8px' }}>
            Accounts due on Demand
          </div>

          {/* Amount in Words */}
          <div style={{ fontSize: '10px', marginBottom: '2px' }}>
            <span style={{ fontWeight: 'bold' }}>Amount in words:</span>
            <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: 'calc(100% - 130px)', marginLeft: '5px', paddingBottom: '3px' }}>
              {document.amountInWords}
            </span>
          </div>
          <div style={{ borderBottom: '1px dotted #000', marginBottom: '18px', paddingTop: '2px' }}></div>

          {/* Signature Line */}
          <div style={{ fontSize: '10px', marginBottom: '22px' }}>
            <span style={{ fontWeight: 'bold' }}>Signature:</span>
            <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: 'calc(100% - 90px)', marginLeft: '10px', paddingBottom: '3px', textAlign: 'center' }}>
              {document.signature || 'Ali'}
            </span>
          </div>

          {/* Company Name */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <span style={{ fontWeight: 'bold', color: '#0066CC', fontSize: '11px' }}>FOR: Techla Solutions Limited.</span>
          </div>

          {/* Services and Contact Footer */}
          <div style={{ margin: '0 -15mm' }}>
            {/* OUR SERVICES Header */}
            <div style={{ 
              backgroundColor: '#FF6600', 
              color: 'white',
              padding: '4px 15px', 
              fontWeight: 'bold', 
              fontSize: '10px', 
              letterSpacing: '1.5px',
              textAlign: 'center'
            }}>
              OUR SERVICES
            </div>
            {/* Services and Contact Content */}
            <div style={{ display: 'flex', backgroundColor: '#0066CC', color: 'white' }}>
              <div style={{ flex: 1, padding: '10px 15px', fontSize: '8px', lineHeight: '1.8' }}>
                <div><strong>Office Branding</strong> | Car branding | <strong>Promotional items</strong> | Out door Signages</div>
                <div><strong>Stationary Supply</strong> | Graphic Design | <strong>Offset Printing</strong> | Digital Marketing</div>
              </div>
              <div style={{ padding: '10px 15px', fontSize: '8px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '1.8', borderLeft: '1px solid rgba(255,255,255,0.2)', minWidth: '180px' }}>
                <div><strong>Tel:</strong> 0751205012 | 0773099480</div>
                <div><strong>Email:</strong> techlasolutionsltd@gmail.com</div>
                <div>Suite G02 and F05 Light Arcade</div>
                <div>Nkrumah Road Opp Cham Towers</div>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#0066CC', height: '8px', margin: '0 -15mm' }}></div>
        </div>
      </div>
    );
  }
);

DocumentPDF.displayName = 'DocumentPDF';
