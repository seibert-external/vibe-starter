import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   */
  server: {
    POSTGRES_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.string().url(),
    SEIBERT_CLIENT_ID: z.string(),
    SEIBERT_CLIENT_SECRET: z.string(),
    SSR_ENCRYPTION_KEY: z.string(),
  },

  /**
   * Client-side environment variables schema.
   */
  client: {},

  /**
   * Runtime environment variables.
   */
  runtimeEnv: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SEIBERT_CLIENT_ID: process.env.SEIBERT_CLIENT_ID,
    SEIBERT_CLIENT_SECRET: process.env.SEIBERT_CLIENT_SECRET,
    SSR_ENCRYPTION_KEY: process.env.SSR_ENCRYPTION_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
