import { mkizka } from "@mkizka/eslint-config";

export default [
  {
    ignores: ["vite.config.ts"],
  },
  ...mkizka(),
];
