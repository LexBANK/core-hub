export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [],
  app: {
    head: {
      title: 'CoreHub',
      meta: [
        { name: 'description', content: 'CoreHub docs-first developer portal' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
})
