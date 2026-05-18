<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";

definePageMeta({
  layout: "tournament",
});

const route = useRoute();
const id = route.params.id;

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
      <TournamentOptions v-else />
    </div>
  </template>
  <NotFound v-else />
</template>
