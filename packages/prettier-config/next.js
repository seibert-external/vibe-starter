import base from "./base.js";

/**
 * @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
    ...base,
    plugins: ["prettier-plugin-tailwindcss"],
};

export default config;