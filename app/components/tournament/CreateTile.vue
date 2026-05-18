<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  create: [];
}>();
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-card
    class="create-tile h-100"
    variant="outlined"
    :loading="loading"
    :disabled="loading"
    @click="$emit('create')"
  >
    <div
      class="d-flex flex-column align-center justify-center pa-6 text-center fill-height"
    >
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="mb-3"
      />
      <v-icon v-else size="48" color="primary" class="mb-3"> mdi-plus </v-icon>
      <span class="text-body-1 font-weight-medium">
        {{ loading ? "Création…" : "Créer un tournoi" }}
      </span>
    </div>
  </v-card>
</template>

<style scoped>
.create-tile {
  min-height: 200px;
  cursor: pointer;
  border-style: dashed !important;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.create-tile:hover:not(.v-card--disabled) {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
