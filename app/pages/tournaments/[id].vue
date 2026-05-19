<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";

definePageMeta({
  layout: "tournament",
});

const route = useRoute();
const id = route.params.id;

const lastParticipantCreated = useState<ITournamentParticipantEntity | null>(
  `tournament-${id}-participant-created`,
  () => null,
);
const lastParticipantUpdated = useState<ITournamentParticipantEntity | null>(
  `tournament-${id}-participant-updated`,
  () => null,
);
const lastParticipantDeleted = useState<{
  id: string;
  tournamentId: string;
} | null>(`tournament-${id}-participant-deleted`, () => null);

const { activeTab, setTournamentContext, clearTournamentContext } =
  useTournamentLayout();

const { data: tournament, pending, refresh } = await useAsyncData(
  `tournament-${id}`,
  () => $fetch<ITournamentEntity>(`/api/v1/tournaments/${id}`),
);

useTournamentRoom(computed(() => route.params.id as string), {
  onUpdated: (payload) => {
    if (tournament.value) {
      tournament.value = payload;
    } else {
      refresh();
    }
    setTournamentContext(payload.name);
  },
  onDeleted: () => {
    navigateTo("/tournaments");
  },
  onParticipantCreated: (participant) => {
    lastParticipantCreated.value = participant;
  },
  onParticipantUpdated: (participant) => {
    lastParticipantUpdated.value = participant;
  },
  onParticipantDeleted: (payload) => {
    lastParticipantDeleted.value = payload;
  },
});

watch(
  tournament,
  (value) => {
    if (value) {
      setTournamentContext(value.name);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  clearTournamentContext();
});
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <template v-if="pending">
    <div class="pa-6">
      <v-skeleton-loader type="heading" class="mb-4" />
      <v-skeleton-loader type="paragraph" />
    </div>
  </template>
  <template v-else-if="tournament">
    <div class="pa-6">
      <TournamentInformations v-if="activeTab === 'informations'" />
      <TournamentParticipants v-else-if="activeTab === 'participants'" />
      <TournamentMatchs v-else-if="activeTab === 'matchs'" />
      <TournamentAffichage v-else-if="activeTab === 'affichage'" />
      <TournamentOptions v-else-if="activeTab === 'options'" />
    </div>
  </template>
  <NotFound v-else />
</template>
