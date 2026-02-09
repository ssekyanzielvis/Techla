import { supabase, DOCUMENTS_TABLE } from './supabase';
import { Document } from './types';

const LOCAL_STORAGE_KEY = 'techla-documents';

// Helper function to get documents from localStorage
function getLocalDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Helper function to save documents to localStorage
function saveLocalDocuments(documents: Document[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
}

// Save document to Supabase
export async function saveDocument(document: Document) {
  try {
    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .insert([
        {
          id: document.id,
          type: document.type,
          document_number: document.documentNumber,
          date: document.date,
          to_field: document.to,
          items: document.items,
          subtotal: document.subtotal,
          vat: document.vat,
          total: document.total,
          amount_in_words: document.amountInWords,
          signature: document.signature,
          created_at: document.createdAt
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase save failed, using localStorage:', error.message);
      // Fallback to localStorage
      const docs = getLocalDocuments();
      docs.unshift(document);
      saveLocalDocuments(docs);
      return [document];
    }

    return data;
  } catch (err) {
    console.warn('Database error, using localStorage:', err);
    // Fallback to localStorage
    const docs = getLocalDocuments();
    docs.unshift(document);
    saveLocalDocuments(docs);
    return [document];
  }
}

// Get all documents
export async function getDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch failed, using localStorage:', error.message);
      // Fallback to localStorage
      return getLocalDocuments();
    }

    // Transform database format to app format
    return (data || []).map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      documentNumber: doc.document_number,
      date: doc.date,
      to: doc.to_field,
      items: doc.items,
      subtotal: doc.subtotal,
      vat: doc.vat,
      total: doc.total,
      amountInWords: doc.amount_in_words,
      signature: doc.signature,
      createdAt: doc.created_at
    }));
  } catch (err) {
    console.warn('Database error, using localStorage:', err);
    // Fallback to localStorage
    return getLocalDocuments();
  }
}

// Delete document
export async function deleteDocument(id: string) {
  try {
    const { error } = await supabase
      .from(DOCUMENTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete failed, using localStorage:', error.message);
      // Fallback to localStorage
      const docs = getLocalDocuments();
      const filtered = docs.filter(doc => doc.id !== id);
      saveLocalDocuments(filtered);
      return true;
    }

    return true;
  } catch (err) {
    console.warn('Database error, using localStorage:', err);
    // Fallback to localStorage
    const docs = getLocalDocuments();
    const filtered = docs.filter(doc => doc.id !== id);
    saveLocalDocuments(filtered);
    return true;
  }
}

// Get document by ID
export async function getDocumentById(id: string): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.warn('Supabase fetch failed, using localStorage:', error.message);
      // Fallback to localStorage
      const docs = getLocalDocuments();
      return docs.find(doc => doc.id === id) || null;
    }

    if (!data) return null;

    return {
      id: data.id,
      type: data.type,
      documentNumber: data.document_number,
      date: data.date,
      to: data.to_field,
      items: data.items,
      subtotal: parseFloat(data.subtotal),
      vat: parseFloat(data.vat),
      total: parseFloat(data.total),
      amountInWords: data.amount_in_words,
      signature: data.signature || '',
      createdAt: data.created_at
    };
  } catch (err) {
    console.warn('Database error, using localStorage:', err);
    // Fallback to localStorage
    const docs = getLocalDocuments();
    return docs.find(doc => doc.id === id) || null;
  }
}
