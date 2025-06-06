// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  runtimeConfig: {
    public: {
      getcoursecontentEndpoint: "",
      getscheduleEndpoint: "",
      getsemestersEndpoint: ""
    }
  },
  css: [
    '@/assets/css/app.css',
    '@/assets/css/vars.css',
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-quasar-ui',
  ],
  quasar: {
    plugins: ['Notify', 'Dialog'],
    config: {
      dark: true
    }
  }
})