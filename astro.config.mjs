// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'http://mccputanges.fr/',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'snazzy-light',
      },
    },
  },
});
