import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
import { textStyles } from "./text-styles";
import tokens from "./tokens.json";

export const config = defineConfig({
  globalCss: {
    body: {
      margin: 0,
    },
  },
  theme: {
    textStyles,
    tokens: {
      ...tokens,
    },
  },
});

export const system = createSystem(defaultConfig, config);
