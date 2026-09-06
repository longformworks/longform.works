// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://longform.works',
  trailingSlash: 'never',
  build: { format: 'file' },
});
