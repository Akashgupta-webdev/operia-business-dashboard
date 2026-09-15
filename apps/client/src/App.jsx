import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes';
import useSessionEvents from '@/features/auth/hooks/useSessionEvents';

export default function App() {
  useSessionEvents();
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
