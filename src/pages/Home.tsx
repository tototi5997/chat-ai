import { Box, Flex } from "@chakra-ui/react";
import { Header } from "../components/Header";
import Slider from "@/components/Slider";
import { ChatAI } from "@/components/ChatAI";

export default function Home() {
  return (
    <Box minH="100vh" bgGradient="linear(180deg, #141012 0%, #0e0b0c 38%, #3d2219 100%)" color="rgba(253, 252, 251, 0.82)">
      <Header />
      <Flex w="full" minH="calc(100vh - 72px)">
        <Slider />
        <ChatAI />
      </Flex>
    </Box>
  );
}
