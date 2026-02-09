export type DocumentType = 'invoice' | 'receipt' | 'quotation';

export interface DocumentItem {
  id: string;
  itemNumber: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number; // Auto-calculated: quantity × rate
}

export interface Document {
  id: string;
  type: DocumentType;
  documentNumber: string;
  date: string;
  to: string;
  items: DocumentItem[];
  subtotal: number; // Auto-calculated
  vat: number; // Auto-calculated (18%)
  total: number; // Auto-calculated
  amountInWords: string;
  signature: string;
  createdAt: string;
}
