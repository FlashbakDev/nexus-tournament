<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import type { IListResult } from "~~/server/types/listResult";

const route = useRoute();
const tournamentId = computed(() => route.params.id as string);

const requestFetch = useRequestFetch();

const { data: participantsData, pending, refresh } = await useAsyncData(
  () => `participants-${tournamentId.value}`,
  () =>
    requestFetch<IListResult<ITournamentParticipantEntity>>(
      `/api/v1/tournaments/${tournamentId.value}/participants`,
      { query: { limit: 100 } },
    ),
);

const participants = computed(() => participantsData.value?.results ?? []);

const isCreating = ref(false);

const handleAddParticipant = async () => {
  try {
    isCreating.value = true;
    await $fetch(
      `/api/v1/tournaments/${tournamentId.value}/participants`,
      {
        method: "POST",
        body: { name: "Nouveau participant" },
      },
    );
    await refresh();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du participant");
  } finally {
    isCreating.value = false;
  }
};
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <div class="d-flex align-center justify-space-between mb-4">
    <h1 class="text-h5 font-weight-medium">Participants</h1>
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      :loading="isCreating"
      @click="handleAddParticipant"
    >
      Ajouter
    </v-btn>
  </div>

  <v-skeleton-loader v-if="pending" type="list-item@4" />

  <template v-else>
    <v-list v-if="participants.length" lines="two" class="pa-0 bg-transparent">
      <v-list-item
        v-for="participant in participants"
        :key="participant.id"
        :title="participant.name"
        :subtitle="
          new Date(participant.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        "
        rounded="lg"
        class="mb-1"
      >
        <template #prepend>
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <p v-else class="text-body-2 text-medium-emphasis">
      Aucun participant pour le moment.
    </p>
  </template>
</template>
