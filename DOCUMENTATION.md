# Techla Solutions - Document Management System

A professional Next.js web application for generating, managing, and downloading business documents including Service Invoices, Service Receipts, and Service Quotations.

## 🎯 Features

### Document Types
- **Service Invoice** - Professional invoices for billing clients
- **Service Receipt** - Payment receipts for completed transactions
- **Service Quotation** - Price quotations for prospective clients

### Core Functionality
✅ **Automatic Calculations**
- Quantity × Rate = Amount (auto-calculated for each item)
- Subtotal calculation
- VAT calculation (18%)
- Total calculation
- Amount in words conversion

✅ **Document Management**
- Save documents to browser localStorage
- Download documents as JSON files
- View all saved documents
- Delete documents from system
- Document preview with full details

✅ **Professional Design**
- Clean light blue and white color scheme (max 3 colors)
- Responsive layout for all devices
- Professional templates
- Smooth transitions and hover effects

### Document Fields
Each document includes:
- **Date** - Document date
- **Document Number** - Unique identifier
- **To** - Client/Company name
- **Items Table** with columns:
  - Item Number
  - Description
  - Quantity
  - Rate
  - Amount (auto-calculated)
- **Subtotal** (auto-calculated)
- **VAT 18%** (auto-calculated)
- **Total** (auto-calculated)
- **Amount in Words** (auto-generated)
- **Signature** - Authorized signature

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Navigate to project directory:**
```bash
cd techla-documents
```

2. **Install dependencies (if not already installed):**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open your browser:**
```
http://localhost:3000
```

## 📂 Project Structure

```
techla-documents/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Homepage with document type selection
│   ├── globals.css             # Global styles
│   ├── create/
│   │   ├── invoice/page.tsx    # Invoice creation page
│   │   ├── receipt/page.tsx    # Receipt creation page
│   │   └── quotation/page.tsx  # Quotation creation page
│   └── documents/page.tsx      # Document management page
├── components/
│   ├── DocumentForm.tsx        # Main form component
│   └── ui/
│       ├── Button.tsx          # Button component
│       ├── Card.tsx            # Card component
│       └── Input.tsx           # Input component
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
└── package.json                # Project dependencies
```

## 💻 Usage Guide

### Creating a Document

1. **Choose Document Type**
   - From the homepage, click on one of the three document cards:
     - Service Invoice
     - Service Receipt
     - Service Quotation

2. **Fill in Document Information**
   - Enter the **Date**
   - Enter the **Document Number**
   - Enter the **To** field (client/company name)

3. **Add Items**
   - Fill in the items table:
     - Item Number (auto-numbered)
     - Description
     - Quantity
     - Rate
   - Amount is calculated automatically
   - Click "Add Item" to add more rows
   - Click trash icon to remove items

4. **Review Calculations**
   - Subtotal is calculated automatically
   - VAT (18%) is calculated automatically
   - Total is calculated automatically
   - Amount in words is generated automatically

5. **Add Signature**
   - Enter name or signature in the Signature field

6. **Save or Download**
   - Click **"Save Document"** to save to the system
   - Click **"Download"** to download as JSON file
   - Click **"Cancel"** to return to homepage

### Managing Documents

1. **View Saved Documents**
   - Click "View Saved Documents" on homepage
   - Or click "Documents" in the navigation menu

2. **View Document Details**
   - Click on any document card to preview details
   - Full document preview appears on the right

3. **Download a Document**
   - Click the download icon (⬇️) on a document card
   - Or click "Download" button in the preview panel
   - Document is saved as JSON file to your computer

4. **Delete a Document**
   - Click the trash icon (🗑️) on a document card
   - Or click "Delete" button in the preview panel
   - Confirm deletion when prompted

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3b82f6` (rgb(59, 130, 246))
- **Light Blue**: `#eff6ff` (rgb(239, 246, 255))
- **White**: `#ffffff` (rgb(255, 255, 255))

### Typography
- Headings: Bold, Blue (#3b82f6)
- Body Text: Gray (#374151)
- Labels: Medium weight, Dark gray (#1f2937)

## 🔧 Technical Details

### Technologies Used
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting

### Data Storage
- **LocalStorage** - Browser-based storage for documents
- Documents are stored as JSON in `techla-documents` key
- Persistent across browser sessions
- No server required

### Calculations
All calculations are performed in real-time:
```typescript
Amount = Quantity × Rate
Subtotal = Sum of all item amounts
VAT = Subtotal × 0.18 (18%)
Total = Subtotal + VAT
```

### Number to Words
Converts numeric totals to written format:
- Example: `50000` → "Fifty Thousand Only"
- Supports billions, millions, thousands
- Handles decimal cents (e.g., "and 50/100")

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🔒 Data Security

- All data is stored locally in the browser
- No data is sent to external servers
- Documents remain private on your device
- Clear browser data to remove all documents

## 🐛 Troubleshooting

### Development server won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Documents not saving
- Check browser console for errors
- Ensure localStorage is enabled in browser
- Try clearing browser cache

### Calculations not working
- Ensure Quantity and Rate are valid numbers
- Check browser console for JavaScript errors

## 📄 License

© 2026 Techla Solutions. All rights reserved.

## 👨‍💻 Development

### Building for Production
```bash
npm run build
npm start
```

### Code Structure
- All components use TypeScript
- Client components are marked with `'use client'`
- Utilities are pure functions
- Components are modular and reusable

## 🎯 Future Enhancements

Potential features for future versions:
- PDF export functionality
- Email documents directly
- Database integration
- User authentication
- Document templates
- Multi-currency support
- Tax rate customization
- Company logo upload

---

**Built with ❤️ using Next.js**
