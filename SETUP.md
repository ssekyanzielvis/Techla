# Techla Solutions - Setup Instructions

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned (takes about 2 minutes)

### Step 3: Create Database Table

1. In your Supabase project, go to the **SQL Editor**
2. Run this SQL query to create the documents table:

```sql
-- Create the documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_date ON documents(date);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON documents
  FOR ALL USING (true);
```

### Step 4: Get Your Supabase Credentials

1. In your Supabase project, click on the **Settings** icon (gear icon in sidebar)
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### Step 5: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 6: Run the Application

```bash
npm run dev
```

### Step 7: Login and Use

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You'll be redirected to the login page
3. Use these credentials:
   - **Username:** `techlaug`
   - **Password:** `techla123`
4. Start creating documents!

---

## 📋 Features Checklist

✅ **Authentication System**
- Hardcoded login with username: `techlaug` and password: `techla123`
- Protected routes - must login to access the app
- Logout functionality
- Session persistence

✅ **Database Integration**
- Supabase PostgreSQL database
- Real-time document storage
- CRUD operations (Create, Read, Delete)
- Automatic data synchronization

✅ **Document Types**
- Service Invoice
- Service Receipt
- Service Quotation

✅ **Automatic Calculations**
- Quantity × Rate = Amount
- Subtotal calculation
- VAT 18% calculation
- Total calculation
- Amount to words conversion

✅ **Document Management**
- Save documents to database
- View all saved documents
- Download documents as JSON
- Delete documents
- Document preview

✅ **Professional Design**
- Light blue and white color scheme
- Responsive layout
- Clean, modern interface
- Loading states
- Error handling

---

## 🔧 Troubleshooting

### Issue: "Failed to save document"

**Solution:** Check that:
1. Your `.env.local` file has the correct Supabase credentials
2. The documents table was created successfully
3. RLS policies are set correctly
4. Your internet connection is active

### Issue: "Failed to load documents"

**Solution:**
1. Check browser console for errors
2. Verify Supabase credentials
3. Check that the documents table exists
4. Ensure RLS policies allow reading

### Issue: Cannot login

**Solution:**
- Make sure you're using the correct credentials:
  - Username: `techlaug`
  - Password: `techla123`
- Check browser console for errors

### Issue: App not starting

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🗄️ Database Schema

### documents Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| type | TEXT | Document type (invoice, receipt, quotation) |
| document_number | TEXT | User-provided document number |
| date | DATE | Document date |
| to_field | TEXT | Client/company name |
| items | JSONB | Array of line items |
| subtotal | DECIMAL(10,2) | Calculated subtotal |
| vat | DECIMAL(10,2) | Calculated VAT (18%) |
| total | DECIMAL(10,2) | Calculated total |
| amount_in_words | TEXT | Total in words |
| signature | TEXT | Signature field |
| created_at | TIMESTAMP | Auto-generated timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

---

## 🔐 Security Notes

### Current Implementation (Development)
- Hardcoded authentication (username: techlaug, password: techla123)
- RLS policy allows all operations
- Client-side route protection

### For Production (Recommendations)
1. Implement proper user authentication (Supabase Auth)
2. Add user-specific RLS policies
3. Hash passwords if using custom auth
4. Use environment variables for sensitive data
5. Enable HTTPS
6. Add rate limiting
7. Implement proper error logging

---

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.x.x",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "lucide-react": "^0.563.0",
  "date-fns": "^4.1.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## 🎨 Color Scheme

- **Primary Blue:** `#3b82f6` (Buttons, headings, accents)
- **Light Blue:** `#eff6ff` (Backgrounds, highlights)
- **White:** `#ffffff` (Cards, main backgrounds)

---

## 📝 Usage Examples

### Creating a Document

1. Login with credentials
2. Click on a document type (Invoice, Receipt, or Quotation)
3. Fill in:
   - Date
   - Document Number
   - To (client name)
4. Add items:
   - Description
   - Quantity
   - Rate
   - (Amount is calculated automatically)
5. Click "Add Item" for more rows
6. Review calculations (Subtotal, VAT, Total)
7. Add signature
8. Click "Save Document" or "Download"

### Managing Documents

1. Click "View Saved Documents" or "Documents" in navigation
2. Click on any document to view details
3. Use download icon to save as JSON
4. Use trash icon to delete

---

## 🛠️ Development

### File Structure
```
techla-documents/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── create/
│   │   ├── invoice/page.tsx    # Protected
│   │   ├── receipt/page.tsx    # Protected
│   │   └── quotation/page.tsx  # Protected
│   ├── documents/page.tsx      # Protected
│   └── page.tsx                # Protected homepage
├── components/
│   ├── DocumentForm.tsx        # Main form
│   ├── Navigation.tsx          # Nav bar with logout
│   ├── ProtectedRoute.tsx      # Auth guard
│   └── ui/                     # UI components
├── lib/
│   ├── auth.tsx                # Auth context
│   ├── database.ts             # Supabase operations
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Helper functions
└── .env.local                  # Environment variables
```

### Adding Features

To add a new document type:
1. Add to `DocumentType` in `lib/types.ts`
2. Update `getDocumentTypeDisplayName` in `lib/utils.ts`
3. Create new page in `app/create/[type]/page.tsx`
4. Add card to homepage

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Check Next.js documentation: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**© 2026 Techla Solutions. All rights reserved.**
