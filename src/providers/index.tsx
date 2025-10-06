import React from "react";
import QueryProvider from "./QueryProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </QueryProvider>
  );
};
