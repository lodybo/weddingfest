export const supportedLocales = [
  {
    id: 'nl',
    locale: 'Dutch',
    isDefault: true,
  },
  {
    id: 'en',
    locale: 'English',
  }
];

export const defaultLanguage = supportedLocales.find(l => l.isDefault);