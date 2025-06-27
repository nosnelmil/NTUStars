// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  app: {
    head: {
      title: 'NTUStars | NTU Semester Timetable Planner',
      meta: [
        { name: 'description', content: "Plan your STARS / NTU semester timetable with ease. NTU Stars is a website that provides NTU students with a user-friendly tool to create a timetable that fits their class schedule. Easily view how all indexes of one module fit in your timetable and optimize your time. Get started today!" },
      ],
    }
  },
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  runtimeConfig: {
    public: {
      getcoursecontentEndpoint: "",
      getscheduleEndpoint: "",
      getsemestersEndpoint: "",
      getsearchablecoursesEndpoint: "",
      getsupportersEndpoint: "",
    },
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
  },
  piniaPluginPersistedstate: {
    debug: true
  }
})