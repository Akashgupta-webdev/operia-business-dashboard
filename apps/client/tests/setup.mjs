import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = fileURLToPath(new URL('../src/', import.meta.url));
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/') || (specifier.startsWith('.') && context.parentURL?.includes('/apps/client/src/'))) {
      const target = specifier.startsWith('@/') ? pathToFileURL(root + specifier.slice(2)).href : new URL(specifier, context.parentURL).href;
      const match = [target, target + '.js'].find(url => existsSync(new URL(url)));
      if (match) return nextResolve(match, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/src/app/apiClient.js')) return {format:'module', shortCircuit:true, source:readFileSync(new URL(url),'utf8').replace('import.meta.env.VITE_API_URL', '"https://example.invalid"').replace('window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))','void UNAUTHORIZED_EVENT')};
    return nextLoad(url, context);
  },
});
