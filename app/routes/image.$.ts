/**
 * Hybrid image serving system with three-tier optimization:
 *
 * 1. Pre-generated images (fastest): Serve pre-optimized files at standard sizes
 * 2. Disk cache (fast): Serve previously generated on-demand images from cache
 * 3. On-demand generation (slow): Generate and cache new sizes as needed
 *
 * This approach provides instant serving for common cases while maintaining
 * flexibility for custom sizes, with minimal CPU/memory usage.
 *
 * Original implementation from https://github.com/remix-run/examples/blob/main/image-resize/app/routes/assets/resize/%24.ts
 */

import * as fs from 'fs';
import path from 'path';
import * as Sentry from '@sentry/remix';
import type { LoaderArgs } from '@remix-run/node';
import type { FitEnum } from 'sharp';
import sharp from 'sharp';

const ASSETS_ROOT = 'images';
const OPTIMIZED_ROOT = 'public/optimized-images';
const CACHE_ROOT = 'public/cache-images';
const { createReadStream, statSync, existsSync } = fs;

interface ResizeParams {
  src: string;
  width: number | undefined;
  height: number | undefined;
  fit: keyof FitEnum;
}

export const loader = ({ params, request }: LoaderArgs) => {
  // extract all the parameters from the url
  const { src, width, height, fit } = extractParams(params, request);

  try {
    // TIER 1: Check for pre-generated optimized image
    const preGenerated = checkPreGeneratedImage(src, width, height, fit);
    if (preGenerated) {
      return serveStaticFile(preGenerated, 'pre-generated');
    }

    // TIER 2: Check for cached on-demand image
    const cached = checkCachedImage(src, width, height, fit);
    if (cached) {
      return serveStaticFile(cached, 'cached');
    }

    // TIER 3: Generate on-demand, cache it, and serve
    return generateAndCacheImage(src, width, height, fit);
  } catch (error: unknown) {
    // if the image is not found, or we get any other errors we return different response types
    Sentry.captureException(error);
    return handleError(error);
  }
};

function extractParams(
  params: LoaderArgs['params'],
  request: Request
): ResizeParams {
  const src = params['*'] as string;
  const searchParams = new URL(request.url).searchParams;

  const width = searchParams.has('w')
    ? Number.parseInt(searchParams.get('w') ?? '0')
    : undefined;
  const height = searchParams.has('h')
    ? Number.parseInt(searchParams.get('h') ?? '0')
    : undefined;

  const fitEnum = ['contain', 'cover', 'fill', 'inside', 'outside'];
  let fit: keyof FitEnum = sharp.fit.contain;
  if (searchParams.has('fit')) {
    const fitParam = searchParams.get('fit') ?? '';
    if (fitEnum.includes(fitParam)) {
      fit = fitParam as keyof FitEnum;
    }
  }
  return { src, width, height, fit };
}

/**
 * Check if a pre-generated optimized image exists
 * Pre-generated images are named: filename-400w.webp, filename-800w.webp, etc.
 */
function checkPreGeneratedImage(
  src: string,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
): string | null {
  // Only check for pre-generated if:
  // 1. Width is specified (we pre-generate by width)
  // 2. Height is not specified (we only pre-generate width-only resizes)
  // 3. Fit is 'cover' (the default used in pre-generation)
  if (!width || height || fit !== 'cover') {
    return null;
  }

  // Build the expected pre-generated filename
  // src: official/2023/ALL_HR_.../image.jpg
  // becomes: public/optimized-images/official/2023/ALL_HR_.../image-400w.webp
  const parsedPath = path.parse(src);
  const optimizedFilename = `${parsedPath.name}-${width}w.webp`;
  const optimizedPath = path.join(
    OPTIMIZED_ROOT,
    parsedPath.dir,
    optimizedFilename
  );

  if (existsSync(optimizedPath)) {
    return optimizedPath;
  }

  return null;
}

/**
 * Check if a cached on-demand image exists
 * Cached images include all the parameters in the filename
 */
function checkCachedImage(
  src: string,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
): string | null {
  const cacheFilename = buildCacheFilename(src, width, height, fit);
  const cachePath = path.join(CACHE_ROOT, cacheFilename);

  if (existsSync(cachePath)) {
    return cachePath;
  }

  return null;
}

/**
 * Build a unique cache filename based on all parameters
 */
function buildCacheFilename(
  src: string,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
): string {
  // Create a unique filename that includes all the resize parameters
  // src: official/2023/ALL_HR_.../image.jpg
  // becomes: official-2023-ALL_HR_...-image-w400-h0-cover.webp
  const normalized = src.replace(/\//g, '-').replace(/\\/g, '-');
  const parsedPath = path.parse(normalized);
  const w = width || 0;
  const h = height || 0;

  return `${parsedPath.name}-w${w}-h${h}-${fit}.webp`;
}

/**
 * Serve a pre-generated or cached static file
 */
function serveStaticFile(filePath: string, source: string): Response {
  const stat = statSync(filePath);

  if (!stat.isFile()) {
    throw new Error(`${filePath} is not a file`);
  }

  const stream = createReadStream(filePath);

  // Add a custom header to help with debugging/monitoring
  return new Response(stream as any, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Image-Source': source, // 'pre-generated' or 'cached'
    },
  });
}

/**
 * Generate image on-demand, cache it to disk, and serve
 */
async function generateAndCacheImage(
  src: string,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
): Promise<Response> {
  // Verify source file exists
  const srcPath = path.join(ASSETS_ROOT, src);
  const fileStat = statSync(srcPath);
  if (!fileStat.isFile()) {
    throw new Error(`${srcPath} is not a file`);
  }

  // Build cache path
  const cacheFilename = buildCacheFilename(src, width, height, fit);
  const cachePath = path.join(CACHE_ROOT, cacheFilename);

  // Ensure cache directory exists
  const cacheDir = path.dirname(cachePath);
  if (!existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Generate and save to cache
  await sharp(srcPath)
    .resize({
      width,
      height,
      fit,
      position: sharp.strategy.entropy,
    })
    .webp({
      quality: 80,
    })
    .toFile(cachePath);

  // Serve the newly cached file
  const stream = createReadStream(cachePath);

  return new Response(stream as any, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Image-Source': 'generated-and-cached',
    },
  });
}

function handleError(error: unknown) {
  // error needs to be typed
  const errorT = error as Error & { code: string };
  // if the read stream fails, it will have the error.code ENOENT
  Sentry.captureException(error);
  console.error(error);
  if (errorT.code === 'ENOENT') {
    return new Response('image not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // if there is an error processing the image, we return a 500 error
  return new Response(errorT.message, {
    status: 500,
    statusText: errorT.message,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
