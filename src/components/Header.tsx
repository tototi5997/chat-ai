import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import ellipseIcon from "../assets/ellipse.png";

export function Header() {
  return (
    <Box
      w="full"
      bg="rgba(18, 15, 15, 0.96)"
      borderTop="1px solid rgba(63, 103, 136, 0.45)"
      borderBottom="1px solid rgba(253, 252, 251, 0.06)"
    >
      <HStack mx="auto" h="72px" px={{ base: 4, xl: 16 }} justify="space-between" align="center" gap={6}>
        <HStack gap={3} align="center">
          <Box w="32px" h="32px" rounded="full" overflow="hidden">
            <Image src={ellipseIcon} alt="Chat AI" w="full" h="full" objectFit="cover" />
          </Box>

          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" fontFamily="Rajdhani, sans-serif" color="#fdfcfb">
            Chat AI
          </Text>
        </HStack>

        <HStack gap={3} align="center">
          <Button
            minW="64px"
            h="32px"
            px={4}
            bg="rgba(42, 37, 37, 0.78)"
            border="1px solid rgba(253, 252, 251, 0.18)"
            color="rgba(253, 252, 251, 0.82)"
            fontSize="12px"
            fontWeight="medium"
            fontFamily="Inter, 'PingFang SC', sans-serif"
            borderRadius="md"
            _hover={{ bg: "rgba(253, 252, 251, 0.12)" }}
            _active={{ bg: "rgba(253, 252, 251, 0.16)" }}
          >
            注册
          </Button>

          <Button
            minW="64px"
            h="32px"
            px={4}
            bg="#fdfcfb"
            color="#1b1818"
            fontSize="12px"
            fontWeight="medium"
            fontFamily="Inter, 'PingFang SC', sans-serif"
            borderRadius="md"
            _hover={{ bg: "rgba(253, 252, 251, 0.92)" }}
            _active={{ bg: "rgba(253, 252, 251, 0.88)" }}
          >
            登录
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
