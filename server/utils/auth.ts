import type { H3Event } from "h3";
import type { IUserEntity } from "../features/user/business/entities/user.entity";
import { UserRole } from "../features/user/business/types/userRole";

export type SsoSession = {
  user: IUserEntity | null;
  loggedInAt?: string | null;
};

async function getSsoSession(event: H3Event): Promise<SsoSession> {
  const runtimeConfig = useRuntimeConfig();
  const cookie = getHeaders(event).cookie || "";
  const session = await $fetch<SsoSession>(
    `${runtimeConfig.public.authBaseUrl}/api/sso/session`,
    {
      headers: { cookie },
    },
  );
  return session;
}

export async function getAuthUser(
  event: H3Event,
): Promise<IUserEntity | undefined> {
  const session = await getSsoSession(event);
  if (!session) {
    return undefined;
  }
  return session.user as IUserEntity;
}

export async function requireAuth(event: H3Event): Promise<IUserEntity> {
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  return user;
}

export async function requireAdmin(event: H3Event): Promise<IUserEntity> {
  const user = await requireAuth(event);
  if (user?.role !== UserRole.ADMIN) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }
  return user;
}
