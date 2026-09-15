export function getReturnPath(location) {
  const pathname = location?.pathname;
  if (!pathname || !pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('\\') || pathname === '/login') return '/dashboard';
  return pathname + (location.search || '') + (location.hash || '');
}
