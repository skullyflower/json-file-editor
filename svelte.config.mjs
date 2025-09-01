import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  compilerOptions: {
    experimental: {
      async: true
    }
  },

  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess()
}
