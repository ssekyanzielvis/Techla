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
      return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
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
            padding: 20mm 15mm;
          }
          .pdf-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .pdf-table th,
          .pdf-table td {
            border: 1px solid #666;
            padding: 6px 8px;
            font-size: 11px;
          }
          .pdf-table th {
            background-color: #0066CC;
            color: white;
            font-weight: bold;
            text-align: center;
          }
          .blue-banner {
            background-color: #0066CC;
            color: white;
            text-align: center;
            padding: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 0 -15mm 15px -15mm;
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
            width: 60px;
            height: 60px;
            background-color: #0066CC;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            vertical-align: top;
          }
          .company-name {
            color: #0066CC;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            line-height: 1;
          }
          .tagline {
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
          }
        `}</style>

        <div className="pdf-container">
          {/* Header Section */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            {/* Logo and Company Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="logo-box">
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" fill="white" opacity="0.3"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h1 className="company-name">Techla</h1>
                  <p className="tagline">DESIGN | PRINT | BRANDING | PROMOTION</p>
                </div>
              </div>

              {/* Date and Document Number */}
              <div style={{ textAlign: 'right', fontSize: '11px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', display: 'inline-block', width: '50px' }}>DATE:</span>
                  <span style={{ borderBottom: '1px solid #666', display: 'inline-block', minWidth: '100px', paddingLeft: '5px' }}>
                    {formatDate(document.date)}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'inline-block', width: '50px' }}>NO:</span>
                  <span style={{ borderBottom: '1px solid #666', display: 'inline-block', minWidth: '100px', paddingLeft: '5px' }}>
                    {document.documentNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ fontSize: '11px', marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>M/S:</span>
              <span style={{ borderBottom: '1px solid #666', display: 'inline-block', minWidth: '300px', paddingLeft: '5px' }}>
                {document.to}
              </span>
            </div>
          </div>

          {/* Document Type Banner */}
          <div className="blue-banner">
            SERVICE {getDocumentTypeDisplayName(document.type).toUpperCase()}
          </div>

          {/* Items Table */}
          <table className="pdf-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Item</th>
                <th>Description</th>
                <th style={{ width: '70px' }}>Quantity</th>
                <th style={{ width: '90px' }}>Rate</th>
                <th style={{ width: '100px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {document.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center' }}>{item.itemNumber}</td>
                  <td>{item.description}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.rate).replace('UGX ', '')}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatCurrency(item.amount).replace('UGX ', '')}/-</td>
                </tr>
              ))}
              {/* Empty rows */}
              {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ height: '30px' }}>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
              {/* Totals */}
              <tr>
                <td colSpan={3} style={{ fontWeight: 'bold', textAlign: 'left' }}>L&OE</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>Subtotal</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(document.subtotal).replace('UGX ', '')}/-</td>
              </tr>
              <tr>
                <td colSpan={3}></td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>VAT 18%</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(document.vat).replace('UGX ', '')}/-</td>
              </tr>
              <tr>
                <td colSpan={3}></td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px' }}>Total</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px' }}>{formatCurrency(document.total).replace('UGX ', '')}/-</td>
              </tr>
            </tbody>
          </table>

          {/* Accounts Note */}
          <div style={{ textAlign: 'center', fontSize: '10px', fontStyle: 'italic', marginBottom: '12px' }}>
            Accounts due on Demand
          </div>

          {/* Amount in Words */}
          <div style={{ fontSize: '11px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>Amount in words:</span>{' '}
            <span style={{ fontStyle: 'italic' }}>{document.amountInWords}</span>
          </div>

          {/* Signature Line */}
          <div style={{ fontSize: '11px', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>Signature:</span>
            <span style={{ borderBottom: '1px solid #666', display: 'inline-block', minWidth: '120px', marginLeft: '10px', paddingLeft: '5px' }}>
              {document.signature || '____'}
            </span>
            <span style={{ fontWeight: 'bold', marginLeft: '60px' }}>All</span>
            <span style={{ borderBottom: '1px solid #666', display: 'inline-block', minWidth: '120px', marginLeft: '10px' }}></span>
          </div>

          {/* Company Name */}
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', color: '#0066CC' }}>FOR: Techla Solutions Limited.</span>
          </div>

          {/* Services Banner */}
          <div className="orange-banner">
            OUR SERVICES
          </div>

          {/* Services and Contact Footer */}
          <div className="blue-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <strong>Office Branding |</strong> Car Branding | <strong>Promotional Items |</strong> Civil Sign Boards |{' '}
                <strong>Tent Branding |</strong> Posters & Banners | <strong>Digital Marketing</strong>
              </div>
              <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <div><strong>Tel:</strong> 0759101025 | 0777C279480</div>
                <div><strong>Email:</strong> techlauganda@gmail.com</div>
                <div><strong>Address:</strong> Hanuman Road Opp Cham Towers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DocumentPDF.displayName = 'DocumentPDF';
