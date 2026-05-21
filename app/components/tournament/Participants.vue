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

const { data: participantsData, pending } = await useAsyncData(
  () => `participants-${tournamentId.value}`,
  () =>
    requestFetch<IListResult<ITournamentParticipantEntity>>(
      `/api/v1/tournaments/${tournamentId.value}/participants`,
      { query: { limit: 100 } },
    ),
);

const participants = computed(() => participantsData.value?.results ?? []);

const {
  addParticipant,
  updateParticipant,
  deleteParticipant,
  setParticipantIsReady,
} = useTournamentActions();

const isCreating = ref(false);
const updatingId = ref<string | null>(null);
const deletingId = ref<string | null>(null);
const readyUpdatingId = ref<string | null>(null);

const lastParticipantCreated = useState<ITournamentParticipantEntity | null>(
  `tournament-${tournamentId.value}-participant-created`,
  () => null,
);
const lastParticipantUpdated = useState<ITournamentParticipantEntity | null>(
  `tournament-${tournamentId.value}-participant-updated`,
  () => null,
);
const lastParticipantDeleted = useState<{
  id: string;
  tournamentId: string;
} | null>(`tournament-${tournamentId.value}-participant-deleted`, () => null);

watch(lastParticipantCreated, (participant) => {
  if (!participant) {
    return;
  }
  const current = participantsData.value?.results ?? [];
  if (current.some((p) => p.id === participant.id)) {
    lastParticipantCreated.value = null;
    return;
  }
  if (participantsData.value) {
    participantsData.value = {
      ...participantsData.value,
      results: [...current, participant],
      total_results: participantsData.value.total_results + 1,
    };
  }
  lastParticipantCreated.value = null;
});

watch(lastParticipantUpdated, (participant) => {
  if (!participant || !participantsData.value) {
    return;
  }
  participantsData.value = {
    ...participantsData.value,
    results: participantsData.value.results.map((p) =>
      p.id === participant.id ? participant : p,
    ),
  };
  lastParticipantUpdated.value = null;
});

watch(lastParticipantDeleted, (payload) => {
  if (!payload || !participantsData.value) {
    return;
  }
  participantsData.value = {
    ...participantsData.value,
    results: participantsData.value.results.filter((p) => p.id !== payload.id),
    total_results: Math.max(0, participantsData.value.total_results - 1),
  };
  lastParticipantDeleted.value = null;
});

const handleAddParticipant = async () => {
  try {
    isCreating.value = true;
    await addParticipant({
      tournamentId: tournamentId.value,
      name: "Nouveau participant",
    });
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'ajout du participant");
  } finally {
    isCreating.value = false;
  }
};

const handleUpdateParticipant = async (
  participant: ITournamentParticipantEntity,
) => {
    updatingId.value = participant.id;
};

const handleSetParticipantIsReady = async (
  participant: ITournamentParticipantEntity,
  isReady: boolean,
) => {
  if (participant.isReady === isReady) {
    return;
  }

  try {
    readyUpdatingId.value = participant.id;
    await setParticipantIsReady({
      participant: {
        id: participant.id,
        tournamentId: participant.tournamentId,
      },
      isReady,
    });
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la mise à jour du statut");
  } finally {
    readyUpdatingId.value = null;
  }
};

const handleDeleteParticipant = async (
  participant: ITournamentParticipantEntity,
) => {
  if (!window.confirm(`Supprimer le participant « ${participant.name} » ?`)) {
    return;
  }

  try {
    deletingId.value = participant.id;
    await deleteParticipant({ participant });
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression du participant");
  } finally {
    deletingId.value = null;
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

    <ParticipantFormDrawer
    v-if="
      updatingId !== null
    "
    :model-value="updatingId !== null"
    :tournament-id="tournamentId"
    :participant-id="updatingId"
    @saved="updatingId = null"
  />

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
          <v-checkbox
            :model-value="participant.isReady ?? false"
            hide-details
            density="default"
            :disabled="readyUpdatingId === participant.id"
            @update:model-value="
              handleSetParticipantIsReady(participant, $event === true)
            "
          />
        </template>
        <template #append>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            :loading="updatingId === participant.id"
            @click="handleUpdateParticipant(participant)"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            :loading="deletingId === participant.id"
            @click="handleDeleteParticipant(participant)"
          />
        </template>
      </v-list-item>
    </v-list>

    <p v-else class="text-body-2 text-medium-emphasis">
      Aucun participant pour le moment.
    </p>
  </template>
</template>
