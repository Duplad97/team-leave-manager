import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    server: {
      deps: {
        inline: [
          "@mui/material",
          "@mui/icons-material",
          "react-transition-group",
        ],
      },
    },
  },
});
