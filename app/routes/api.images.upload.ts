import type { ActionArgs, NodeOnDiskFile } from '@remix-run/node';
import { json, unstable_parseMultipartFormData } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { getErrorMessage } from '~/utils/utils';
import {
  replicateImageAcrossApps,
  uploadHandler,
} from '~/models/images.server';
import type { APIResponse, ImageUploadResponse } from '~/types/Responses';
import { serverError } from 'remix-utils';

const ALLOWED_ORIGINS = [
  'https://weddingfest.nl',
  'https://www.weddingfest.nl',
  'https://staging.weddingfest.nl',
  'http://localhost:3000',
];

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);

  const origin = request.headers.get('origin');

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return json<APIResponse>({
      ok: false,
      message: 'Deze actie is niet toegestaan',
    });
  }

  let image: NodeOnDiskFile | null = null;
  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    image = formData.get('file') as NodeOnDiskFile | null;
  } catch (e) {
    const message = getErrorMessage(e);
    return json<APIResponse>({ ok: false, message });
  }

  if (!image) {
    return json<APIResponse>({
      ok: false,
      message: 'Er is geen afbeelding geüpload',
    });
  }

  if (process.env.NODE_ENV === 'production') {
    await replicateImageAcrossApps(image.name).catch((e) => {
      return serverError(e);
    });
  }

  // Construct the base url
  return json<ImageUploadResponse>({
    location: `${origin}/image/${image.name}`,
  });
}
