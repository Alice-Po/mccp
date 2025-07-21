// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'http://mccputanges.fr/',
  integrations: [svelte()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'snazzy-light',
      },
    },
  },
  vite: {
    // Autorise le viewer PDF.js hébergé sur mozilla.github.io à charger les PDF locaux
    server: {
      headers: {
        'Access-Control-Allow-Origin': 'https://mozilla.github.io',
      },
    },
  },
});
