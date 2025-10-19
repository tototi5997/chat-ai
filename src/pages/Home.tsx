import { Box, Flex } from "@chakra-ui/react";
import { Header } from "../components/Header";
import Slider from "@/components/Slider";
import { ChatAI } from "@/components/ChatAI";
import { useEffect, useRef, useState } from "react";
import { type newTalkInterface } from '@/types/customInterface'
import { useQueryClient } from '@tanstack/react-query';

export default function Home() {
  const [newQuestion, setNewQuestion] = useState<newTalkInterface|null>(null)
  
  const onAsking = (talk:newTalkInterface) => {
    setNewQuestion(prev => ({ ...talk }));
  }
  return (
    <Box minH="100vh" bgGradient="linear(180deg, #141012 0%, #0e0b0c 38%, #3d2219 100%)" color="rgba(253, 252, 251, 0.82)">
      <Header />
      <Flex w="full" minH="calc(100vh - 72px)">
        <Slider newQuestion={newQuestion} />
        <ChatAI onAsking={onAsking} />
      </Flex>
    </Box>
  );
}
