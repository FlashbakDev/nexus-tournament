<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";

const props = defineProps({
  tournament: {
    type: Object as PropType<ITournamentEntity>,
    required: true,
  },
});

const formattedDate = computed(() =>
  new Date(props.tournament.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-card
    :to="tournament.url"
    class="tournament-card h-100 d-flex flex-column"
    hover
  >
    <v-card-title class="text-truncate">
      {{ tournament.name }}
    </v-card-title>
    <v-card-subtitle>Créé le {{ formattedDate }}</v-card-subtitle>
    <v-spacer />
    <v-card-actions>
      <v-spacer />
      <div class="d-flex align-center">
        <span> Voir </span>
        <v-icon class="ml-2">mdi-arrow-right</v-icon>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.tournament-card {
  min-height: 200px;
}
</style>
