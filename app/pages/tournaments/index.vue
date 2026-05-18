<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { IListResult } from "~~/server/types/listResult";

//================================================================
// Composables
//================================================================

const requestFetch = useRequestFetch();

//================================================================
// Data
//================================================================

const { data: tournaments, pending } = await useAsyncData<
  IListResult<ITournamentEntity>
>(`tournaments`, () =>
  requestFetch<IListResult<ITournamentEntity>>("/api/v1/tournaments"),
);

const isLoading = ref(false);

//================================================================
// Methods
//================================================================

const handleCreateTournament = async () => {
  try {
    isLoading.value = true;
    const tournament = await $fetch<ITournamentEntity>("/api/v1/tournaments", {
      method: "POST",
      body: {
        name: "Nouveau tournoi",
      },
    });
    navigateTo(tournament.url);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création du tournoi: " + error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <div>
    <v-row v-if="pending">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" sm="6" lg="4">
        <TournamentCreateTile
          :loading="isLoading"
          @create="handleCreateTournament"
        />
      </v-col>
      <v-col
        v-for="tournament in tournaments?.results"
        :key="tournament.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <TournamentListItem :tournament="tournament" />
      </v-col>
    </v-row>
  </div>
</template>
