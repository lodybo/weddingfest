/**
 * An on the fly image resizer, taken from https://github.com/remix-run/examples/blob/main/image-resize/app/routes/assets/resize/%24.ts
 *
 * Since most of our images are served via a CDN, we don't have to save the resized images.
 * Instead we set cache headers for them and let the cdn cache them for us.
 *
 * sharp uses a highly performant native package called libvips.
 * it's written in C and is extremely fast.
 *
 * The implementation of the demo uses a stream based approach where the image is never stored in memory.
 * This means it's very good at handling images of any size, and is extremely performant.
 * Further improvements could be done by implementing ETags, but that is out of scope for this demo.
 */

import type { ReadStream } from 'fs';
import * as fs from 'fs';
import path from 'path';
import { PassThrough, finished } from 'stream';
import * as Sentry from '@sentry/remix';
import type { LoaderArgs } from '@remix-run/node';
import type { FitEnum } from 'sharp';
import sharp from 'sharp';
import { client } from '~/redis.server';

const ASSETS_ROOT = 'images';
const { createReadStream, statSync } = fs;

async function getCachedImage(key: string) {
  try {
    const data = await client.get(key);
    if (data) {
      return Buffer.from(data, 'binary');
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Redis get error:', error);
  }
  return null;
}

async function setCachedImage(key: string, buffer: string) {
  try {
    // 'EX', 3600 denotes that the key will expire in 3600 seconds (1 hour)
    // Adjust the expiration time based on your needs
    await client.set(key, buffer, { EX: 3600 });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Redis set error:', error);
  }
}

interface ResizeParams {
  src: string;
  width: number | undefined;
  height: number | undefined;
  fit: keyof FitEnum;
}

export const loader = async ({ params, request }: LoaderArgs) => {
  // extract all the parameters from the url
  const { src, width, height, fit } = extractParams(params, request);

  try {
    // read the image as a stream of bytes
    const readStream = readFileAsStream(src);
    // read the image from the file system and stream it through the sharp pipeline
    const result = await streamingResize(readStream, src, width, height, fit);
    // console.log('Returning result...', result);
    return result;
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

async function streamingResize(
  imageStream: ReadStream,
  src: string,
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum
) {
  const cacheKey = `${src}-${width}x${height ?? 'auto'}-${fit}`;
  const cachedImage = await getCachedImage(cacheKey);

  let responseData: ReadableStream | Buffer;

  console.log(' ');
  if (cachedImage) {
    console.log(`Cache hit for ${cacheKey}`);
    responseData = cachedImage;
  } else {
    console.log(`Cache miss for ${cacheKey}`);
    // create the sharp transform pipeline
    // https://sharp.pixelplumbing.com/api-resize
    // you can also add watermarks, sharpen, blur, etc.
    const sharpTransforms = sharp()
      .resize({
        width,
        height,
        fit,
        position: sharp.strategy.entropy, // will try to crop the image and keep the most interesting parts
      })
      // .jpeg({
      //   mozjpeg: true, // use mozjpeg defaults, = smaller images
      //   quality: 80,
      // });
      // sharp also has other image formats, just comment out .jpeg and make sure to change the Content-Type header below
      // .avif({
      //   quality: 80,
      // });
      // .png({
      //   quality: 80,
      // });
      .webp({
        quality: 80,
      });

    // create a pass through stream that will take the input image
    // stream it through the sharp pipeline and then output it to the response
    // without buffering the entire image in memory
    const passthroughStream = new PassThrough();

    imageStream.pipe(sharpTransforms).pipe(passthroughStream);

    const buffers: any[] = [];
    passthroughStream.on('data', (data) => buffers.push(data));

    try {
      await new Promise((resolve, reject) => {
        passthroughStream.on('error', (error) => {
          Sentry.captureException(error);
          reject(error);
        });
        passthroughStream.on('end', async () => resolve(null));
      });

      const buffer = Buffer.concat(buffers);
      await setCachedImage(cacheKey, buffer.toString('binary'));

      responseData = buffer;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error:', error);
      throw error;
    }
  }

  return new Response(responseData, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable, must-revalidate',
    },
  });
}

function readFileAsStream(src: string): ReadStream {
  // Local filesystem

  // check that file exists
  const srcPath = path.join(ASSETS_ROOT, src);
  const fileStat = statSync(srcPath);
  if (!fileStat.isFile()) {
    Sentry.captureException(new Error(`${srcPath} is not a file`));
    throw new Error(`${srcPath} is not a file`);
  }

  // create a readable stream from the image file
  return createReadStream(path.join(ASSETS_ROOT, src));

  // Other implementations that you could look into

  // Google Cloud Storage
  // we could also create a stream directly from a bucket file
  // import { Storage } from '@google-cloud/storage'
  // const storage = new Storage();
  // const bucketName = 'my-gcp-bucket'
  // const bucketPath = src // the bucket path /dogs/cute/dog-1.jpg'
  // return storage.bucket(bucketName).file(src).createReadStream()

  // AWS S3 / Digital Ocean Spaces
  // import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
  // const s3 = new S3Client({...})
  // const bucketName = 'my-s3-bucket'
  // const bucketKey = src // 'dogs/cute/dog-1.jpg'
  // const fileResult = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: bucketKey }));
  // s3 GetObjectCommand result.Body is a ReadableStream
  // return fileResult.Body
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
