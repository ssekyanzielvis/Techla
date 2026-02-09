import DocumentForm from '@/components/DocumentForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function QuotationPage() {
  return (
    <ProtectedRoute>
      <DocumentForm type="quotation" />
    </ProtectedRoute>
  );
}
