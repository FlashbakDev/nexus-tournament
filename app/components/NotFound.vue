<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
const router = useRouter();

defineProps({
  title: {
    type: String,
    default: "404 - Page introuvable",
  },
  message: {
    type: String,
    default: "La page recherchee n'est pas disponible ou n'est pas accessible.",
  },
});

const goBack = () => {
  router.back();
};
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div
      class="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-lg backdrop-blur-sm"
    >
      <div
        class="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-white/10"
      >
        <v-icon size="30">mdi-file-search-outline</v-icon>
      </div>
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
      <p class="mt-4 text-sm opacity-80">{{ message }}</p>
      <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <v-btn variant="outlined" color="white" @click="goBack">
          <v-icon start>mdi-arrow-left</v-icon>
          Retour
        </v-btn>
        <v-btn color="primary" to="/">
          <v-icon start>mdi-home</v-icon>
          Accueil
        </v-btn>
      </div>
    </div>
  </div>
</template>
