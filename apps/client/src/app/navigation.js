import { Bell, Building2, CircleHelp, FileText, FolderKanban, LayoutDashboard, RefreshCw, UserCircle } from 'lucide-react';

export const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Company', url: '/my-company', icon: Building2 },
  { title: 'My Applications', url: '/my-applications', icon: FolderKanban },
  { title: 'My Documents', url: '/my-documents', icon: FileText },
  { title: 'Renewals', url: '/renewals', icon: RefreshCw },
  { title: 'Requests & Support', url: '/requests-support', icon: CircleHelp, badge: 'support' },
  { title: 'Notifications', url: '/notifications', icon: Bell, badge: 'notifications' },
  { title: 'Profile', url: '/profile', icon: UserCircle },
];
