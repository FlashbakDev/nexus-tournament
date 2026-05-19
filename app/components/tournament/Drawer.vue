<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { TournamentDetailTab } from "~/composables/useTournamentLayout";

defineProps({
  tournamentName: {
    type: String,
    required: true,
  },
});

const activeTab = defineModel<TournamentDetailTab>({ required: true });

const tabs: {
  value: TournamentDetailTab;
  title: string;
  icon: string;
}[] = [
  {
    value: "informations",
    title: "Informations",
    icon: "mdi-information-outline",
  },
  {
    value: "participants",
    title: "Participants",
    icon: "mdi-account-group-outline",
  },
  { value: "matchs", title: "Matchs", icon: "mdi-sword-cross" },
  { value: "affichage", title: "Affichage", icon: "mdi-monitor" },
  { value: "options", title: "Options", icon: "mdi-cog-outline" },
];
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-navigation-drawer app permanent width="280">
    <div class="pa-4">
      <p class="text-caption text-medium-emphasis mb-1">Tournoi</p>
      <p class="text-subtitle-1 font-weight-medium text-truncate">
        {{ tournamentName }}
      </p>
    </div>
    <v-divider />
    <v-list nav density="comfortable" class="py-2">
      <v-list-item
        v-for="tab in tabs"
        :key="tab.value"
        :active="activeTab === tab.value"
        :prepend-icon="tab.icon"
        :title="tab.title"
        rounded="lg"
        @click="activeTab = tab.value"
      />
    </v-list>
  </v-navigation-drawer>
</template>
