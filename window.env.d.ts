declare global {
  interface Window {
    ENV: {
      STRIPE_PUBLISHABLE_KEY: string;
    };
  }
}

export {};
