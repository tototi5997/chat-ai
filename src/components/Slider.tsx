import { Button, VStack } from "@chakra-ui/react";

const Slider = () => {
  return (
    <VStack w="296px" px={{ md: 3 }} py={{ md: 5 }}>
      <Button w="full" h="36px" variant="surface">
        新建对话
      </Button>
    </VStack>
  );
};

export default Slider;
