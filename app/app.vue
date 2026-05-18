<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { isOpen, openLoginDialog, closeLoginDialog } = useLoginDialog();

watch(
  () => [route.query.login, route.query.error, route.query.from],
  ([login, error, from]) => {
    if (login === "1" || typeof error === "string") {
      const fromPath = typeof from === "string" ? from : "/";
      openLoginDialog(fromPath);
    }
  },
  { immediate: true },
);

watch(isOpen, async (open) => {
  if (open) return;
  if (
    route.query.login === "1" ||
    typeof route.query.error === "string" ||
    typeof route.query.from === "string"
  ) {
    const nextQuery = { ...route.query };
    delete nextQuery.login;
    delete nextQuery.error;
    delete nextQuery.from;
    await router.replace({ query: nextQuery });
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <DialogLogin
    v-model="isOpen"
    @update:model-value="(v) => !v && closeLoginDialog()"
  />
</template>
