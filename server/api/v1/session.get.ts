export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = getHeaders(event);
  const authSession = await $fetch<{
    authenticated: boolean;
    user: Record<string, unknown> | null;
    loggedInAt: string | null;
  }>(`${runtimeConfig.public.authBaseUrl}/api/sso/session`, {
    headers: {
      cookie: headers.cookie || "",
    },
  });
  return authSession;
});
