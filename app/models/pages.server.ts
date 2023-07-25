import { prisma } from '~/db.server';
import type { Page } from '@prisma/client';

type EditablePageProperties = Pick<Page, 'title' | 'slug' | 'content'> & {
  mode: 'publish' | 'draft';
};

export function getAllPages() {
  return prisma.page.findMany();
}

export function getPublishedPages() {
  return prisma.page.findMany({
    where: { published: true },
  });
}

export function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
  });
}

export function createPage({
  title,
  slug,
  content,
  mode,
}: EditablePageProperties) {
  return prisma.page.create({
    data: {
      title,
      slug,
      content,
      published: mode === 'publish',
    },
  });
}

export function updatePage({
  title,
  slug,
  content,
  mode,
}: EditablePageProperties) {
  return prisma.page.update({
    where: { slug },
    data: {
      title,
      content,
      published: mode === 'publish',
    },
  });
}

export function deletePageBySlug(slug: string) {
  return prisma.page.delete({
    where: { slug },
  });
}
