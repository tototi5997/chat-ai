import { Box, Image, Text } from "@chakra-ui/react";
import { type contentInterface } from "@/types/customInterface";
import Ellipse from "@/assets/ellipse.png";

export default function ChatContent(props: { messages?: contentInterface[] }) {
  const messages = props.messages || [];

  return (
    <Box width="80%" overflow="auto">
      {messages.map((e: contentInterface, i: number) => (
        <Box
          key={i}
          width="80%"
          display={e.origin === "user" ? "" : "flex"}
          backgroundColor={e.origin === "user" ? "#5E565699" : ""}
          ml={e.origin === "user" ? "auto" : ""}
          mb="20px"
          borderRadius="8px"
          p="10px"
          color="#FDFCFB"
        >
          {e.origin === "ai" ? (
            <Box position="relative" w="32px" h="42px">
              <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
            </Box>
          ) : (
            <></>
          )}
          <Text w={e.origin === "ai" ? "calc(100% - 42px)" : "100%"} pt={e.origin === "ai" ? "8px" : ""}>
            {e.msg}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
