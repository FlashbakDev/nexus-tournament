// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("listen", (server, { port }) => {
        console.log(`Server is listening on port ${port}`);

        // Emit ready event for PM2
        if (process.send) process.send("ready");
        else console.log("process.send n'est pas disponible.");

        process.on("SIGTERM", () => {
          console.log("SIGTERM received");

          server.close(() => {
            console.log("Server closed");
          }); // Arrêtez le serveur Nuxt
        });

        process.on("SIGINT", () => {
          console.log("SIGINT received");

          server.close(() => {
            console.log("Server closed");
          }); // Arrêtez le serveur Nuxt
        });
      });
    },
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "vuetify-nuxt-module",
    "nuxt-mongoose",
  ],
  runtimeConfig: {
    public: {
      authBaseUrl: process.env.NUXT_PUBLIC_AUTH_BASE_URL,
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
