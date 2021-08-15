import { supportedLocales } from './locales';

export default {
  name: 'localisedString',
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
    type: 'string',
    fieldset: locale.isDefault ? null : 'translations',
  })),
}