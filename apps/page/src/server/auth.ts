import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import type { Role } from "@repo/database";
import type { DefaultSession, NextAuthOptions, Profile } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";

import { env } from "~/env";
import { db } from "~/server/db";
import { buildAuthenticationMethods } from "~/server/build-authentication-methods";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: Role[];
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

interface SeibertProfile extends Profile {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

function SeibertProvider(
  clientId: string,
  clientSecret: string,
): OAuthConfig<SeibertProfile> {
  return {
    id: "seibert",
    name: "Seibert",
    type: "oauth",
    wellKnown:
      "https://customer.seibert.group/.well-known/openid-configuration",
    clientId,
    clientSecret,
    authorization: {
      params: {
        scope: "openid profile email",
      },
    },
    checks: ["pkce", "state"],
    client: {
      token_endpoint_auth_method: "client_secret_post",
      id_token_signed_response_alg: "EdDSA",
    },
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.email,
        email: profile.email,
        image: profile.picture ?? null,
      };
    },
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    signIn: async function ({ account, profile }) {
      if (!account || !profile) {
        return false; // should not happen
      }
      if (account.provider !== "seibert") {
        return false; // we only accept seibert accounts
      }
      const seibertProfile = profile as SeibertProfile;
      if (!seibertProfile.email_verified || !seibertProfile.email) {
        return false;
      }
      const permission = await getPermissionByProviderAndProviderAccountId({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      if (permission?.email && permission.roles.length /* any role is fine */) {
        return true;
      }
      return seibertProfile.email.endsWith("@seibert.group");
    },
  },
  events: {
    signIn: async (message) => {
      if (!message.account) {
        throw new Error(
          "No account found in signIn event. Can not link permission.",
        );
      }
      if (!message.user.email) {
        throw new Error(
          "No user mail found in signIn event. Can not link permission.",
        );
      }
      await upsertPermission({
        userId: message.user.id,
        email: message.user.email,
      });
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma 7 generated client type doesn't match @auth/prisma-adapter expected type
  adapter: PrismaAdapter(db as any),
  providers: [
    SeibertProvider(env.SEIBERT_CLIENT_ID, env.SEIBERT_CLIENT_SECRET),
  ],
};

const { getPermissionByProviderAndProviderAccountId, upsertPermission } =
  buildAuthenticationMethods({ db });

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
