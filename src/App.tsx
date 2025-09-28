import { Button, Heading, Stack, Container, Text, Box } from "@chakra-ui/react";

function App() {
  return (
    <Container maxW="4xl" py={10}>
      <Stack gap={6}>
        <Heading as="h1" size="2xl" color="blue.600">
          Chakra UI + React
        </Heading>
        <Text fontSize="lg" color="gray.600">
          欢迎使用 Chakra UI 组件库
        </Text>
        <Stack gap={4}>
          <Box>
            <Text mb={2}>按钮示例：</Text>
            <Button colorScheme="blue" me={2}>
              主要按钮
            </Button>
            <Button colorScheme="green" me={2}>
              成功按钮
            </Button>
            <Button colorScheme="red" variant="outline">
              危险按钮
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
