import type { ImageMetadata } from 'astro';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob(
      '~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}'
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // continue regardless of error
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/** */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Vérifions d'abord si imagePath est null ou undefined
  if (!imagePath) {
    return null;
  }

  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Maintenant on sait que imagePath est une string non-null
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('/')
  ) {
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};
