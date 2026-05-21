<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
const modelValue = defineModel<boolean>("modelValue");

defineProps({
  width: {
    type: Number,
    default: 40,
  },
});
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-overlay v-model="modelValue" scrim class="align-start justify-end">
    <div class="edit-drawer-overlay-content">
      <Transition name="drawer-panel">
        <v-sheet
          v-if="modelValue"
          class="edit-drawer-panel"
          color="surface"
          elevation="4"
          :style="{ width: `${width}vw` }"
          @click.stop
        >
          <div class="d-flex flex-column pa-4 h-full">
            <slot />
          </div>
        </v-sheet>
      </Transition>
    </div>
  </v-overlay>
</template>

<style scoped>
.edit-drawer-overlay-content {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.edit-drawer-overlay-content :deep(.edit-drawer-panel) {
  pointer-events: auto;
}

.edit-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: auto;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition: transform 0.5s linear;
}

.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(100%);
}

.drawer-panel-enter-to,
.drawer-panel-leave-from {
  transform: translateX(0);
}
</style>
