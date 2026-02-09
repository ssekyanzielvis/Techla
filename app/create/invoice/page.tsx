import DocumentForm from '@/components/DocumentForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InvoicePage() {
  return (
    <ProtectedRoute>
      <DocumentForm type="invoice" />
    </ProtectedRoute>
  );
}
