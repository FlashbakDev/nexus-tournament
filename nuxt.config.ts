// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "vuetify-nuxt-module",
    "nuxt-mongoose",
  ],
  runtimeConfig: {
    public: {
      authBaseUrl: process.env.NUXT_NEXUS_AUTH_BASE_URL,
      socketPath: "/socket.io/",
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#1e1e1e",
            },
          },
        },
      },
    },
  },
});
