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

const agenda = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/data/agenda' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    place: z.string(),
    start: z.string().optional(),
    end: z.string().optional(),
    author: z.string(),
    image: z.string().optional(),
    flyers: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// Log pour vérifier la configuration
console.log('Blog collection configuration:', blog);
console.log('Agenda collection configuration:', agenda);

export const collections = { blog, agenda };

// Log pour vérifier l'export
console.log('Exported collections:', collections);
