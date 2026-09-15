import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('client-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('client-theme', theme); } catch { /* Theme still works when storage is unavailable. */ }
  }, [theme]);
  return { theme, toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark') };
}
