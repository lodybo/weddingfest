import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import * as Sentry from '@sentry/remix';
import { requireAdmin } from '~/session.server';
import { getPageBySlug, updatePage } from '~/models/pages.server';
import { validatePage } from '~/validations/content';
import { useActionData, useLoaderData } from '@remix-run/react';
import PageForm from '~/components/PageForm';
import SuccessMessage from '~/components/SuccessMessage';
import Anchor from '~/components/Anchor';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const slug = params.slug;
  invariant(slug, 'De slug is niet ingevuld');

  const page = await getPageBySlug(slug);
  invariant(page, 'De pagina bestaat niet');

  return json({ page });
}

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const content = formData.get('content');

  const hasErrors = validatePage(title, slug, content);

  if (hasErrors) {
    return json(
      {
        errors: hasErrors,
        data: {
          title: title?.toString() ?? '',
          slug: slug?.toString() ?? '',
          content: content?.toString() ?? '',
        },
        saved: false,
      },
      { status: 422 }
    );
  } else {
    invariant(title && typeof title === 'string', 'De titel is niet ingevuld');
    invariant(slug && typeof slug === 'string', 'De slug is niet ingevuld');
    invariant(
      content && typeof content === 'string',
      'De inhoud is niet ingevuld'
    );

    try {
      await updatePage({ title, slug, content });
      return json({
        errors: {},
        data: {
          title,
          slug,
          content,
        },
        saved: true,
      });
    } catch (error: unknown) {
      Sentry.captureException(error);
      return json(
        {
          errors: {
            title: '',
            slug: '',
            content: '',
            form: 'Er is iets misgegaan',
          },
          data: { title, slug, content },
          saved: false,
        },
        { status: 500 }
      );
    }
  }
}

export default function AdminContentPagesEditRoute() {
  const { page } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-6">
      <Anchor to="/admin/pages">Terug naar overzicht</Anchor>
      <h1 className="font-handwriting text-5xl">Pagina bewerken</h1>
      {actionData?.saved ? (
        <SuccessMessage message="De pagina is opgeslagen" />
      ) : null}
      <PageForm data={actionData?.data || page} errors={actionData?.errors} />
    </div>
  );
}
