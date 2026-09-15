import { FolderKanban } from 'lucide-react';
import FeaturePage from '@/components/feature-page';

export default function ApplicationsPage() {
  return <FeaturePage title="My Applications" description="Follow the progress of your applications." icon={FolderKanban} message="Your applications and their progress will be available here." />;
}
