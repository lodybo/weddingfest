import { useState } from 'react';
import { Form } from '@remix-run/react';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import ErrorMessage from '~/components/ErrorMessage';
import Editor from '~/components/Editor';
import Button from '~/components/Button';
import { slugify } from '~/utils/utils';
import type { ContentPageErrors } from '~/validations/content';

type Props = {
  errors?: ContentPageErrors & { form?: string };
  data?: {
    title: string;
    slug: string;
    content: string;
  };
};

export default function PageForm({ errors, data }: Props) {
  const [slug, setSlug] = useState(data?.slug ?? '');
  const handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (slug === '') {
      setSlug(slugify(evt.target.value));
    }
  };

  const handleSlugChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(evt.target.value);
  };

  return (
    <Form className="space-y-6" method="post">
      <Label label="Titel van de pagina">
        <TextInput
          name="title"
          defaultValue={data?.title ?? ''}
          onBlur={handleTitleChange}
        />
        {errors?.title ? <ErrorMessage message={errors.title} /> : null}
      </Label>

      <div className="w-1/3">
        <Label label="Slug">
          <TextInput
            name="slug"
            defaultValue={slug}
            onChange={handleSlugChange}
          />
          {errors?.slug ? <ErrorMessage message={errors.slug} /> : null}
        </Label>
      </div>

      <div className="w-full">
        <Editor name="content" initialValue={data?.content ?? ''} />
        {errors?.content ? <ErrorMessage message={errors.content} /> : null}
      </div>

      <Button variant="primary" type="submit">
        Opslaan
      </Button>
    </Form>
  );
}
