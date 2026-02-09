import DocumentForm from '@/components/DocumentForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReceiptPage() {
  return (
    <ProtectedRoute>
      <DocumentForm type="receipt" />
    </ProtectedRoute>
  );
}
