import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import vercelAnalytics from "@vercel/analytics/astro";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    vercelAnalytics()
    tailwind({
      applyBaseStyles: true,
    }),
  ],
});
