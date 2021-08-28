import { defaultLanguage } from '../locales/locales';

export default {
  title: 'Page',
  name: 'page',
  type: 'document',
  fields: [
    {
      title: 'Page title',
      name: 'page_title',
      description: 'The title of the page',
      type: 'localisedString',
    },
    {
      title: 'Page slug',
      name: 'slug',
      description: 'The slug (identifying part of the URL) of the page',
      type: 'slug',
      options: {
        source: `page_title.${defaultLanguage.id}`,
      }
    },
    {
      title: 'Content',
      name: 'content',
      description: 'What\'s the page all about',
      type: 'array',
      of: [
        {
          type: 'localisedBlock',
        }
      ]
    }
  ],
  preview: {
    select: {
      title: `page_title.${defaultLanguage.id}`
    }
  }
}