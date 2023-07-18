import { prisma } from '~/db.server';
import type { Page } from '@prisma/client';

type EditablePageProperties = Pick<Page, 'title' | 'slug' | 'content'>;

export function getAllPages() {
  return prisma.page.findMany();
}

export function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
  });
}

export function createPage(data: EditablePageProperties) {
  return prisma.page.create({
    data,
  });
}

export function updatePage({ slug, ...data }: EditablePageProperties) {
  return prisma.page.update({
    where: { slug },
    data,
  });
}

export function deletePageBySlug(slug: string) {
  return prisma.page.delete({
    where: { slug },
  });
}
