import { Box, Image, Text } from "@chakra-ui/react";
import { type contentInterface } from "@/types/customInterface";
import Ellipse from "@/assets/ellipse.png";
import { useUiStore } from "@/state/useUiStore";

export default function ChatContent() {
  const currentHistory = useUiStore((state) => state.currentHistory);
  // const messages = props.messages || [];
  const handleShow = (role: string, json:string) => {
    if(!json) return json
    // if(role === 'user') {
    //   const content = JSON.parse(json)
    //   return content.content
    // }
    return json
  }
  return (
    <Box width="80%" overflow="auto">
      {(currentHistory.messages || []).map((e: any, i: number) => (
        <Box
          key={i}
          width="80%"
          display={e.role === "user" ? "" : "flex"}
          backgroundColor={e.role === "user" ? "#5E565699" : ""}
          ml={e.role === "user" ? "auto" : ""}
          mb="20px"
          borderRadius="8px"
          p="10px"
          color="#FDFCFB"
        >
          {e.role === "assistant" ? (
            <Box position="relative" w="32px" h="42px">
              <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
            </Box>
          ) : (
            <></>
          )}
          <Text w={e.role === "assistant" ? "calc(100% - 42px)" : "100%"} pt={e.role === "assistant" ? "8px" : ""}>
            {handleShow(e.role, e.content)}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
