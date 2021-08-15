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