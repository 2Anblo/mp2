import { copyFile } from 'node:fs/promises'

// GitHub Pages serves this file for paths such as /mp2/pokemon/1.
// Loading the built app lets BrowserRouter handle the original URL.
await copyFile(
  new URL('../dist/index.html', import.meta.url),
  new URL('../dist/404.html', import.meta.url),
)
