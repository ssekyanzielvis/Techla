# Techla Solutions - Document Management System

A professional Next.js web application for generating, managing, and storing business documents including Service Invoices, Service Receipts, and Service Quotations with Supabase database integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)

---

## 🎯 Features

### 🔐 Authentication
- **Hardcoded secure login** with credentials:
  - Username: `techlaug`
  - Password: `techla123`
- Protected routes with automatic redirect
- Session persistence across browser refreshes
- Logout functionality

### 📊 Document Types
- **Service Invoice** - Professional invoices for billing clients
- **Service Receipt** - Payment receipts for completed transactions
- **Service Quotation** - Price quotations for prospective clients

### 🧮 Automatic Calculations
- **Real-time arithmetic**: Quantity × Rate = Amount
- **Subtotal** - Sum of all line items
- **VAT** - 18% tax calculation
- **Total** - Subtotal + VAT
- **Amount in Words** - Automatic conversion (e.g., "Fifty Thousand Only")

### 💾 Database Integration
- **Supabase PostgreSQL** database
- Real-time data synchronization
- Automatic document saving
- Persistent storage
- Fast query performance with indexes

### 📄 Document Management
- Create unlimited documents
- View all saved documents with preview
- Download documents as JSON files
- Delete documents from database
- Search and filter capabilities
- Responsive document list

### 🎨 Professional Design
- Clean **light blue and white** color scheme (3 colors max)
- Fully responsive layout (mobile, tablet, desktop)
- Modern UI with smooth animations
- Professional typography
- Accessible design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone or navigate to the project:**
```bash
cd techla-documents
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Supabase database:**
   - See [SETUP.md](SETUP.md) for detailed instructions
   - Create Supabase project
   - Run SQL to create tables
   - Get API credentials

4. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

5. **Run the development server:**
```bash
npm run dev
```

6. **Open the application:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Login with username: `techlaug` and password: `techla123`

---

## 📖 Full Documentation

For detailed setup instructions, database schema, and troubleshooting, see:
- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Full technical documentation

---

## 🏗️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Supabase** | PostgreSQL database & backend |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting |

---

## 📁 Project Structure

```
techla-documents/
├── app/                        # Next.js app directory
│   ├── login/                  # Login page
│   ├── create/                 # Document creation pages
│   │   ├── invoice/
│   │   ├── receipt/
│   │   └── quotation/
│   ├── documents/              # Document management
│   ├── page.tsx                # Homepage
│   └── layout.tsx              # Root layout with auth
├── components/                 # React components
│   ├── DocumentForm.tsx        # Main form component
│   ├── Navigation.tsx          # Nav bar
│   ├── ProtectedRoute.tsx      # Auth guard
│   └── ui/                     # Reusable UI components
├── lib/                        # Utilities & configuration
│   ├── auth.tsx                # Authentication context
│   ├── database.ts             # Supabase operations
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Helper functions
├── .env.local                  # Environment variables (create this)
├── .env.example                # Environment template
└── package.json                # Dependencies
```

---

## 🔐 Authentication

### Login Credentials
```
Username: techlaug
Password: techla123
```

### How It Works
- Client-side authentication using React Context
- Session stored in localStorage
- All routes (except `/login`) are protected
- Automatic redirect to login if not authenticated
- Logout clears session and redirects

---

## 💻 Usage

### Creating a Document

1. **Select Document Type**
   - From homepage, choose: Invoice, Receipt, or Quotation

2. **Fill Document Details**
   - Date
   - Document Number
   - To (client/company name)

3. **Add Line Items**
   - Item Number (auto-numbered)
   - Description
   - Quantity
   - Rate
   - Amount (calculated automatically)

4. **Review Calculations**
   - Subtotal, VAT (18%), Total displayed in real-time
   - Amount in words auto-generated

5. **Complete & Save**
   - Add signature
   - Click "Save Document" (saves to database)
   - Or "Download" (saves as JSON file)

### Managing Documents

1. Navigate to "Documents" page
2. View list of all saved documents
3. Click document to preview full details
4. Download or delete as needed

---

## 🗄️ Database

### Supabase Setup Required

The application uses Supabase for document storage. You need to:

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL script (provided in [SETUP.md](SETUP.md))
4. Add credentials to `.env.local`

### Documents Table Schema

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  date DATE NOT NULL,
  to_field TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  vat DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  amount_in_words TEXT NOT NULL,
  signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3b82f6` - Buttons, headings, accents
- **Light Blue**: `#eff6ff` - Backgrounds, highlights
- **White**: `#ffffff` - Cards, main backgrounds

### Typography
- Headings: Bold, Blue
- Body: Regular, Gray
- Inputs: Medium, Dark Gray

---

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Documents not saving
- **Solution:** Check Supabase credentials in `.env.local`
- Verify database table exists
- Check browser console for errors

**Problem:** Login not working
- **Solution:** Ensure you're using correct credentials
- Clear browser localStorage
- Check browser console

**Problem:** Build errors
- **Solution:** Delete `.next` folder and `node_modules`
- Run `npm install` again
- Run `npm run dev`

For more troubleshooting, see [SETUP.md](SETUP.md)

---

## 📝 License

© 2026 Techla Solutions. All rights reserved.

---

## 🤝 Support

For setup help or issues:
1. Review [SETUP.md](SETUP.md)
2. Check [DOCUMENTATION.md](DOCUMENTATION.md)
3. Review Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**

