import { Box, Flex } from "@chakra-ui/react";
import { Header } from "../components/Header";

export default function Home() {
  return (
    <Box minH="100vh" bgGradient="linear(180deg, #141012 0%, #0e0b0c 38%, #3d2219 100%)" color="rgba(253, 252, 251, 0.82)">
      <Header />

      <Flex w="full" minH="calc(100vh - 72px)" px={{ base: 4, xl: 16 }} py={{ base: 8, md: 12 }} justify="center">
        <Flex w="full" maxW="1280px" gap={{ base: 6, lg: 10 }} align="stretch"></Flex>
      </Flex>
    </Box>
  );
}
