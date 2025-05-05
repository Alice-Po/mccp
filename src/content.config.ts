import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Ajout de logs pour déboguer
console.log('Loading content configuration...');

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// Log pour vérifier la configuration
console.log('Blog collection configuration:', blog);

export const collections = { blog };

// Log pour vérifier l'export
console.log('Exported collections:', collections);
