import { DocumentItem } from './types';

// Calculate amount for a single item
export function calculateItemAmount(quantity: number, rate: number): number {
  return quantity * rate;
}

// Calculate subtotal from all items
export function calculateSubtotal(items: DocumentItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

// Calculate VAT (18%)
export function calculateVAT(subtotal: number): number {
  return subtotal * 0.18;
}

// Calculate total
export function calculateTotal(subtotal: number, vat: number): number {
  return subtotal + vat;
}

// Convert number to words (for amounts)
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  function convertHundreds(n: number): string {
    let str = '';
    
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
      return str.trim();
    }
    
    if (n > 0) {
      str += ones[n] + ' ';
    }
    
    return str.trim();
  }

  const billion = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = Math.floor(num % 1000);
  const cents = Math.round((num % 1) * 100);

  let result = '';

  if (billion > 0) {
    result += convertHundreds(billion) + ' Billion ';
  }
  if (million > 0) {
    result += convertHundreds(million) + ' Million ';
  }
  if (thousand > 0) {
    result += convertHundreds(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertHundreds(remainder);
  }

  result = result.trim();
  
  if (cents > 0) {
    result += ' and ' + cents + '/100';
  }

  return result + ' Only';
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get document type display name
export function getDocumentTypeDisplayName(type: string): string {
  const names: { [key: string]: string } = {
    invoice: 'Service Invoice',
    receipt: 'Service Receipt',
    quotation: 'Service Quotation'
  };
  return names[type] || type;
}
