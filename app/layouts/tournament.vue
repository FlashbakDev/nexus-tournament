<template>
  <v-app>
    <v-app-bar app color="primary" density="compact">
      <v-app-bar-title class="font-weight-bold">
        <v-btn class="text-none" :to="'/'" variant="text">
          <v-img src="/img/nexus.png" height="36" width="36" class="mr-2" />
          <span class="text-h6"> Nexus Tournament </span>
        </v-btn>
      </v-app-bar-title>
      <v-spacer />
      <div class="ml-8" />
      <UserMenu />
    </v-app-bar>

    <TournamentDrawer
      v-if="tournamentName"
      v-model="activeTab"
      :tournament-name="tournamentName"
    />

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { activeTab, tournamentName } = useTournamentLayout();
</script>
