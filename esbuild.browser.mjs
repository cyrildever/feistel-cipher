// Browser test bundle.
//
// Replaces the old browserify pipeline. esbuild does not polyfill Node core
// modules out of the box, but the library genuinely depends on a few of them
// in the browser:
//   - `crypto`           -> SHA-256 in lib/src/typescript/utils/hash.ts
//   - `stream`/`events`  -> pulled in by keccak's readable-stream dependency
//   - `buffer`/`process` -> required by the crypto-browserify shim at runtime
//
// The two @esbuild-plugins packages reproduce browserify's automatic shimming.
//
// Note: `buffer` is intentionally left out of the globals polyfill. The library
// installs its own browser Buffer (`Buffer = require('buffer/').Buffer` guarded
// by `typeof window`), and injecting a second Buffer global would clash with
// that reassignment. The `buffer` module itself is still resolved by the
// modules polyfill for the crypto shim's internal use.
import { createRequire } from 'node:module'
import { build } from 'esbuild'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

const require = createRequire(import.meta.url)

// The modules polyfill ships an incomplete `crypto` shim (no createHash), so
// redirect `crypto` to the full crypto-browserify package — exactly what
// browserify did. This plugin is registered before the modules polyfill so its
// onResolve wins for the bare `crypto` specifier.
const cryptoBrowserify = {
  name: 'crypto-browserify-resolver',
  setup(build) {
    build.onResolve({ filter: /^crypto$/ }, () => ({
      path: require.resolve('crypto-browserify')
    }))
  }
}

await build({
  entryPoints: ['test/src/typescript/browser.spec.ts'],
  bundle: true,
  outfile: 'dist/test/src/typescript/index.js',
  platform: 'browser',
  format: 'iife',
  // The library installs its own browser Buffer via a bare global assignment
  // (`Buffer = require('buffer/').Buffer`). browserify injected a global Buffer
  // binding; esbuild does not, so the assignment would target an undeclared
  // variable and throw in the browser's strict mode. Declaring `var Buffer` at
  // the top of the IIFE gives that assignment a valid, bundle-wide target.
  banner: {
    js: 'var Buffer;'
  },
  plugins: [
    cryptoBrowserify,
    NodeModulesPolyfillPlugin(),
    NodeGlobalsPolyfillPlugin({ buffer: false, process: true })
  ]
})
