import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    minW: "64px",
    h: "32px",
    px: "8px",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "6px",
    transitionProperty: "background, color, border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
  },
  variants: {
    variant: {
      surface: {
        color: "#252222",
        bg: "#fdfcfb",
        // _hover: { bg: "#ebe6e1" },
        // _active: { bg: "#e3dcd6" },
      },
      outline: {
        color: "#fdfcfb",
        bg: "#252222",
        fontFamily: "'PingFang SC', sans-serif",
        _hover: { bg: "#302c2c" },
        _active: { bg: "#3b3636" },
      },
    },
  },
});
