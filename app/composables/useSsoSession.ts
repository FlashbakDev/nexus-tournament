export function useSsoSession() {
  const { data, pending, refresh, error } = useFetch("/api/v1/session", {
    key: "sso-session",
  });
  const authenticated = computed(() => Boolean(data.value?.user));
  const user = computed(() => data.value?.user ?? null);
  const runtimeConfig = useRuntimeConfig();
  const logout = async () => {
    await navigateTo(
      `${runtimeConfig.public.authBaseUrl}/auth/logout?returnTo=${window.location.toString()}`,
      {
        external: true,
      },
    );
    refresh();
  };
  return {
    data,
    authenticated,
    user,
    pending,
    error,
    refresh,
    logout,
  };
}
