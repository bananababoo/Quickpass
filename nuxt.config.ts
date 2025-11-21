import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      websocket: true
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxt/ui', '@sidebase/nuxt-auth', '@vueuse/nuxt', '@nuxt/icon'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    }
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'NUXT_AUTH_ORIGIN',
    globalAppMiddleware: true,
    provider: { 
      type: 'authjs',
      trustHost: true,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
     },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    }
  }
})