import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { useActionData } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { requireAdmin } from '~/session.server';
import { validatePage } from '~/validations/content';
import { createPage } from '~/models/pages.server';
import PageForm from '~/components/PageForm';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  return null;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const content = formData.get('content');
  const mode = formData.get('mode');

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
    invariant(mode && typeof mode === 'string', 'De modus is niet ingevuld');
    invariant(mode === 'published' || mode === 'draft', 'De modus is ongeldig');

    try {
      await createPage({ title, slug, content, mode });
      return redirect('/admin/pages');
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
        },
        { status: 500 }
      );
    }
  }
}

export default function AdminNewPagesRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-5xl">Nieuwe pagina</h1>

      <PageForm errors={actionData?.errors} data={actionData?.data} />
    </div>
  );
}
