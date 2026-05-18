<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script setup lang="ts">
import { useDisplay } from "vuetify";

const modelValue = defineModel({ type: Boolean, required: true });
const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();
const { user } = useSsoSession();
const { returnTo } = useLoginDialog();
const config = useRuntimeConfig();

const oauthErrorMessage = computed(() => {
  const error = route.query.error;
  if (error === "google") return "La connexion avec Google a echoue.";
  if (error === "apple") return "La connexion avec Apple a echoue.";
  return null;
});

const encodeOAuthState = () => {
  const state = { returnTo: returnTo.value };
  console.log("state", state);
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
};

const authGoogleUrl = computed(
  () => `${config.public.authBaseUrl}/auth/google?state=${encodeOAuthState()}`,
);
const authAppleUrl = computed(
  () => `${config.public.authBaseUrl}/auth/apple?state=${encodeOAuthState()}`,
);

const handleLoginWithGoogle = () => {
  window.location.assign(authGoogleUrl.value);
};

const handleLoginWithApple = () => {
  window.location.assign(authAppleUrl.value);
};

watch(modelValue, (open) => {
  if (open && user.value) {
    router.replace(returnTo.value);
  }
});
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-bottom-sheet v-if="mobile" v-model="modelValue" inset>
    <v-sheet color="primary" class="rounded-t-lg p-4">
      <span class="text-white text-xl">👋 Bienvenue sur Nexus Tournament</span>

      <v-alert
        v-if="oauthErrorMessage"
        type="error"
        density="compact"
        variant="tonal"
        class="mb-4"
        closable
      >
        {{ oauthErrorMessage }}
      </v-alert>

      <div class="mt-8 flex flex-col">
        <v-btn class="grow" color="white" @click="handleLoginWithGoogle">
          <div class="flex flex-row items-center justify-center">
            <v-img src="/icons/google.png" width="24" />
            <span class="ml-2 normal-case">Se connecter avec Google</span>
          </div>
        </v-btn>
        <v-btn class="grow mt-4" color="white" @click="handleLoginWithApple">
          <div class="flex flex-row items-center justify-center">
            <v-icon>mdi-apple</v-icon>
            <span class="ml-2 normal-case">Se connecter avec Apple</span>
          </div>
        </v-btn>
        <v-btn
          class="grow mt-4 text-white"
          color="white"
          block
          variant="text"
          @click="modelValue = false"
          >Fermer</v-btn
        >
      </div>
    </v-sheet>
  </v-bottom-sheet>

  <v-dialog v-else v-model="modelValue" max-width="500">
    <v-sheet color="primary" class="rounded-lg p-4">
      <span class="text-white text-xl">👋 Bienvenue sur Nexus Tournament</span>

      <v-alert
        v-if="oauthErrorMessage"
        type="error"
        density="compact"
        variant="tonal"
        class="mb-4"
        closable
      >
        {{ oauthErrorMessage }}
      </v-alert>

      <div class="mt-8 flex flex-col">
        <v-btn class="grow" color="white" @click="handleLoginWithGoogle">
          <div class="flex flex-row items-center justify-center">
            <v-img src="/icons/google.png" width="24" />
            <span class="ml-2 normal-case">Se connecter avec Google</span>
          </div>
        </v-btn>
        <v-btn class="grow mt-4" color="white" @click="handleLoginWithApple">
          <div class="flex flex-row items-center justify-center">
            <v-icon>mdi-apple</v-icon>
            <span class="ml-2 normal-case">Se connecter avec Apple</span>
          </div>
        </v-btn>
        <v-btn
          class="grow mt-4 text-white"
          color="white"
          block
          variant="text"
          @click="modelValue = false"
          >Fermer</v-btn
        >
      </div>
    </v-sheet>
  </v-dialog>
</template>
