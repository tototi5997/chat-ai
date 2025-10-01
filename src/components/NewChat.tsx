import { Textarea, Box, Text, FileUpload, Image, HStack, Flex, useFileUpload } from "@chakra-ui/react";
import IconPaperclip from "@/assets/icon-paperclip.png";
import IconGlobe from "@/assets/icon-globe.png";
import IconArrowUp from "@/assets/icon-arrow-up.png";
import { useState } from "react";

export function NewChat() {
  const [isDeepThink, setIsDeepThink] = useState<Boolean>(false)
  // 是否开启深度搜索
  const onDeepThink = () => {
    setIsDeepThink(!isDeepThink)
  }

  const fileUpload = useFileUpload({
    maxFiles: 99,
    // maxFileSize: 3000,
  })

  const accepted = fileUpload.acceptedFiles // 附件列表
  console.log(accepted, 'accepted')

  // 点击发送
  const onSend = () => {

  }
  return (
    <Box w="80%" textAlign="center">
      <Text fontSize="48px" fontWeight="bold" fontFamily="'Rajdhani', sans-serif" color="#fdfcfb" mb="30px">
        Chat AI
      </Text>
      <Box position="relative">
        <Textarea minH="120px" p="20px" pb="60px" fontSize="16px" borderRadius="8px" resize="none" placeholder="开始对话..." color="#86807B" bgColor="#363131" borderColor="#5E565699" />
        <Box w="calc(100% - 35px)" h="60px" borderRadius="8px" position="absolute" bottom="7px" left="15px" zIndex="2" bgColor="#363131">
          <HStack pos="absolute" bottom="15px" left="5px">
            <FileUpload.RootProvider value={fileUpload}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <HStack cursor="pointer">
                  <Box position="relative" w="16px" h="16px">
                    <Image src={IconPaperclip} alt="" w="full" h="full" objectFit="contain" />
                  </Box>
                  <Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
                    附件
                  </Text>
                </HStack>
              </FileUpload.Trigger>
              {/* <FileUpload.List showSize clearable /> */}
            </FileUpload.RootProvider>
            <Flex minW="88px" h="28px" ml="20px" cursor="pointer" alignItems="center" backgroundColor="#4a4545" borderRadius="28px" align="center" justifyContent="center" gap="5px" onClick={onDeepThink}>
              <Box position="relative" w="16px" h="16px">
                <Image src={IconGlobe} alt="" w="full" h="full" objectFit="contain" />
              </Box>
              <Text fontSize="14px" fontFamily="PingFang SC" color={isDeepThink ? "#0660fc" : "#FDFCFB"}>
                深度思考
              </Text>
            </Flex>
          </HStack>
          <HStack pos="absolute" bottom="15px" right="5px">
            <Flex w="28px" h="28px" borderRadius="28px" cursor="pointer" backgroundColor="#999696" justifyContent="center" alignItems="center" onClick={onSend}>
              <Image src={IconArrowUp} alt="" w="full" h="full" objectFit="contain" />
            </Flex>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
