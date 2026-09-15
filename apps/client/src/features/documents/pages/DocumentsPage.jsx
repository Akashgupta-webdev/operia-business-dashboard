import { FileText } from 'lucide-react';
import FeaturePage from '@/components/feature-page';

export default function DocumentsPage() {
  return <FeaturePage title="My Documents" description="Access the documents shared with you." icon={FileText} message="Your document library will be available here." />;
}
