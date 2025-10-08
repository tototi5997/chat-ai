import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import Ellipse from "@/assets/ellipse.png";
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  return (
    <Box as="header" bg="#0c0b0b" px={{ base: 4, md: 8, xl: 12 }} py="12px">
      <HStack mx="auto" w="full" justify="space-between" align="center" gap={{ base: 4, md: 8 }}>
        <HStack gap={3} align="center">
          <Box position="relative" w="32px" h="42px">
            <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
          </Box>
          <Text fontSize="24px" fontWeight="bold" fontFamily="'Rajdhani', sans-serif" color="#fdfcfb">
            Chat AI
          </Text>
        </HStack>
        <HStack gap={2} align="center">
          {/* <Button variant="surface" h="28px" w="64px">
            注册
          </Button> */}
          <Button variant="outline" h="28px" w="64px" onClick={() => navigate('/login')}>
            登录
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
