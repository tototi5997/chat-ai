import { Box, Center, Image, Text, VStack, Flex } from "@chakra-ui/react";
import Ellipse from "@/assets/ellipse.png";
import { NewChat } from "./NewChat";
import { type newTalkInterface } from "@/types/customInterface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatContent from "./ChatContent";

const WelcomeBanner = () => {
  return (
    <VStack gap={4} align="center" textAlign="center">
      <Box position="relative" w="60px" h="60px">
        <Image src={Ellipse} alt="" w="full" h="full" />
      </Box>
      <VStack gap={2} align="center">
        <Text textStyle="h3">Chat AI</Text>
        <Text textStyle="h7" maxW="480px">
          我可以帮你分析目标地址的资金情况，你可以简单描述你的追踪需求，例如目标地址、目标链、追踪Token与追踪时间范围等。
        </Text>
      </VStack>
    </VStack>
  );
};

export function ChatAI(props: { onAsking?: (talk: newTalkInterface) => void }) {
  // 获取组件中添加缓存回退
  const queryClient = useQueryClient();

  const { data: isNewChat } = useQuery({
    queryKey: ["isNewChat"],
    queryFn: () => queryClient.getQueryData(["currentHistory"]) || false,
  });

  return (
    <Box h="90vh" flex={1} mx={3} my={3} border="1px solid" borderColor="#423d3d" borderRadius="8px" bg="rgba(26, 21, 22, 0.6)">
      <Flex flexDir="column" align="center" justify="center" w="full" h="full" py={16} px={8}>
        {isNewChat ? (
          <>
            <ChatContent />
            <NewChat onAsking={($event) => props.onAsking?.($event)} />
          </>
        ) : (
          <WelcomeBanner />
        )}
      </Flex>
    </Box>
  );
}
