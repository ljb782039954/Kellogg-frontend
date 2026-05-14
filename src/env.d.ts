/// <reference types="astro/client" />

interface Window {
  __EXCHANGE_RATES__: Record<string, number> | undefined;
}
