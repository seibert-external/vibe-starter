// Re-export from generated client
export { PrismaClient } from "./generated/client";

// Re-export enums
export { Role } from "./generated/enums";

// Re-export model types
export type {
  Account,
  Session,
  User,
  VerificationToken,
  Permission,
} from "./generated/client";

// Re-export the singleton db instance
export { db } from "./client";
