import { supportedLocales } from './locales';

export default {
  name: 'localisedBlock',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: {
        collapsible: true,
      }
    }
  ],
  fields: supportedLocales.map(locale => ({
    title: locale.locale,
    name: locale.id,
    type: 'array',
    of: [
      {
        type: 'block',
      }
    ],
    fieldset: locale.isDefault ? null : 'translations',
  })),
}