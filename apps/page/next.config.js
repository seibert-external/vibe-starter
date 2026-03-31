/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marketplace-cdn.atlassian.com",
      },
      {
        protocol: "https",
        hostname: "marketplace.atlassian.com",
      },
      {
        protocol: "https",
        hostname: "*.seibert.group",
      },
    ],
  },
};

export default config;
