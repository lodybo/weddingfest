export type ContentPageErrors = {
  title?: string;
  slug?: string;
  content?: string;
};

export function validatePage(
  title: FormDataEntryValue | null,
  slug: FormDataEntryValue | null,
  content: FormDataEntryValue | null
): ContentPageErrors | undefined {
  let errors: ContentPageErrors = {};

  if (typeof title !== 'string' || title === '') {
    errors.title = 'De titel mag niet leeg zijn.';
  }

  if (typeof slug !== 'string' || slug === '') {
    errors.slug = 'De slug mag niet leeg zijn.';
  }

  if (typeof content !== 'string' || content === '') {
    errors.content = 'De inhoud mag niet leeg zijn.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}
