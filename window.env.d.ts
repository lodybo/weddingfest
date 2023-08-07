import type TinyMCE from 'tinymce';

declare global {
  interface Window {
    ENV: {
      ENVIRONMENT: string;
      STRIPE_PUBLISHABLE_KEY: string;
    };
    tinyMCE: TinyMCE;
  }
}
