import type { PrismaClient } from "@repo/database";

export function buildAuthenticationMethods({ db }: { db: PrismaClient }) {
  return {
    getPermissionByUserId: async ({ userId }: { userId: string }) => {
      return db.permission.findUnique({
        where: { userId },
      });
    },
    getPermissionByProviderAndProviderAccountId: async ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) => {
      const account = await db.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: {
            include: {
              permission: true,
            },
          },
        },
      });
      return account?.user.permission;
    },
    upsertPermission: async ({
      userId,
      email,
    }: {
      userId: string;
      email: string;
    }) => {
      return db.permission.upsert({
        where: { email },
        update: { userId },
        create: {
          email,
          userId,
          roles: ["USER"],
        },
      });
    },
  };
}
