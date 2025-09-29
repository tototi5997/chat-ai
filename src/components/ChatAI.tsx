import { Center, VStack, Text, Image, Box } from "@chakra-ui/react";
import ellipseGlow from "../assets/ellipse.svg";

export function ChatAI() {
  return (
    <Box
      position="relative"
      rounded="2xl"
      overflow="hidden"
      w="full"
      h="full"
      borderWidth="1px"
      borderColor="rgba(253, 252, 251, 0.08)"
      bgGradient="linear(180deg, rgba(37, 33, 33, 0.78) 0%, rgba(25, 20, 20, 0.9) 55%, rgba(103, 58, 35, 0.35) 100%)"
      backdropFilter="blur(18px)"
      boxShadow="0px 40px 120px rgba(0, 0, 0, 0.45)"
      _before={{
        content: '""',
        position: "absolute",
        inset: "-40%",
        bgGradient:
          "radial(at 50% 100%, rgba(201, 124, 63, 0.35), transparent 65%)",
        filter: "blur(60px)",
      }}
    >
      <Center
        position="absolute"
        inset={0}
        zIndex={1}
        p={{ base: 10, md: 16 }}
      >
        <VStack gap={4} alignItems="center" w="full" maxW="480px">
          <Box position="relative" w="60px" h="60px">
            <Image
              src={ellipseGlow}
              alt="Chat AI Logo"
              w="full"
              h="full"
              objectFit="cover"
              position="absolute"
              inset="-12.5%"
            />
          </Box>

          <VStack gap={2} alignItems="center" w="full" textAlign="center">
            <Text
              fontSize="40px"
              fontWeight="bold"
              fontFamily="Rajdhani, sans-serif"
              color="chat.text.primary"
              lineHeight="normal"
              w="full"
            >
              Chat AI
            </Text>

            <Text
              fontSize="sm"
              fontFamily="'PingFang SC', sans-serif"
              fontWeight="regular"
              color="chat.text.secondary"
              lineHeight="22px"
              w="full"
            >
              我可以帮你分析目标地址的资金情况，你可以简单描述你的追踪需求，例如目标地址、目标链、追踪Token与追踪时间范围等。
            </Text>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
