<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import type { ParticipantFormState } from "~/components/participant/Form.vue";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";

const modelValue = defineModel<boolean>("modelValue");

const props = defineProps<{
  tournamentId: string;
  participantId: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const { updateParticipant } = useTournamentActions();

const isSaving = ref(false);
const form = ref<ParticipantFormState>({ name: "" });

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(
  null,
);

const participant = ref<ITournamentParticipantEntity>();

function onFormUpdate(value: ParticipantFormState) {
  form.value = value;
}

const reloadParticipant = async () => {
  try {
    participant.value = await $fetch<ITournamentParticipantEntity>(
      `/api/v1/tournaments/${props.tournamentId}/participants/${props.participantId}`,
    );
  } catch (error) {
    console.error(error);
    alert(
      "Erreur lors de la récupération du participant : " +
        (error as Error).message,
    );
  }
};

const syncFormFromParticipant = () => {
  if (participant.value) {
    form.value = { name: participant.value.name };
  }
};

watch(
  () => modelValue.value,
  async (open) => {
    if (open) {
      await reloadParticipant();
      syncFormFromParticipant();
    }
  },
  { immediate: true },
);

watch(
  () => [props.tournamentId, props.participantId] as const,
  async () => {
    if (modelValue.value) {
      await reloadParticipant();
      syncFormFromParticipant();
    }
  },
);

const handleClose = () => {
  modelValue.value = false;
};

const handleSave = async () => {
  if (!participant.value) return;
  const result = await (formRef.value?.validate?.() ??
    Promise.resolve({ valid: false }));
  const { valid } = result;
  if (!valid) return;
  try {
    isSaving.value = true;
    await updateParticipant({
      participant: {
        ...participant.value,
        name: form.value.name.trim(),
      },
    });
    emit("saved");
    handleClose();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la sauvegarde : " + (error as Error).message);
  } finally {
    isSaving.value = false;
  }
};
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <Drawer v-model="modelValue">
    <div v-if="participant">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h6">Modifier le participant</h2>
        <v-btn
          variant="text"
          size="small"
          :loading="isSaving"
          @click="handleSave"
        >
          <v-icon class="mr-2">mdi-content-save</v-icon>
          <span>Enregistrer</span>
        </v-btn>
      </div>
      <ParticipantForm
        ref="formRef"
        :model-value="form"
        :disabled="isSaving"
        @update:model-value="onFormUpdate"
      />
    </div>
    <div v-else class="flex justify-center items-center h-[calc(100vh-64px)]">
      <v-progress-circular indeterminate color="onPrimary" />
    </div>
  </Drawer>
</template>
