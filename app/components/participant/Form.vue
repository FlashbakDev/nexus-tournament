<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
export interface ParticipantFormState {
  name: string;
}

const props = defineProps<{
  modelValue: ParticipantFormState;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ParticipantFormState];
}>();

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> }>();

function updateField<K extends keyof ParticipantFormState>(
  key: K,
  value: ParticipantFormState[K],
) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

async function validate() {
  const formValidation = (await formRef.value?.validate()) ?? { valid: false };
  return { valid: formValidation.valid };
}

defineExpose({ validate });
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-form ref="formRef">
    <v-text-field
      :model-value="modelValue.name"
      label="Nom"
      clearable
      autocomplete="name"
      hide-details="auto"
      :disabled="disabled"
      :rules="[(v: string) => !!v || 'Le nom est requis']"
      @update:model-value="updateField('name', $event)"
    />
  </v-form>
</template>
