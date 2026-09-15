import { registerHooks } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url));
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const target = sourceRoot + specifier.slice(2);
      const file = [target, target + '.js', target + '.jsx', target + '.ts', target + '.tsx'].find(existsSync);
      if (!file) throw new Error(`Unresolved Admin import: ${specifier}`);
      return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/src/app/apiClient.js')) {
      return {
        format: 'module', shortCircuit: true,
        source: readFileSync(new URL(url), 'utf8').replace('import.meta.env.VITE_API_URL', '"https://example.invalid"'),
      };
    }
    return nextLoad(url, context);
  },
});
