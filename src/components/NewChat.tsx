import { Textarea, Box, Text, FileUpload, Image, HStack, Flex, useFileUpload, chakra, CloseButton } from "@chakra-ui/react";
import IconPaperclip from "@/assets/icon-paperclip.png";
import IconGlobe from "@/assets/icon-globe.png";
import IconGlobeSvg from "@/assets/icon-globe.svg";
import IconArrowUp from "@/assets/icon-arrow-up.png";
import IconStop from "@/assets/icon-stop.png";
import { useState, type ChangeEvent, useCallback } from "react";
import { type newTalkInterface } from "@/types/customInterface";
import { useQuery, useQueryClient } from '@tanstack/react-query';

let timer:number|undefined
export function NewChat({ onAsking }: { onAsking: (talk: newTalkInterface) => void }) {
  const [isDeepThink, setIsDeepThink] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const queryClient  = useQueryClient()

  const { data: currentHistory } = useQuery({
    queryKey: ['currentHistory'],
    queryFn: () => queryClient.getQueryData(['currentHistory']) || {}
  });

  // 是否开启深度思考
  const onDeepThink = () => {
    setIsDeepThink((prev) => !prev);
  };

  const fileUpload = useFileUpload({
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const accepted = fileUpload.acceptedFiles;
  // 输入框数据变化
  const onQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newQues = e.target?.value;
    setQuestion(newQues);
  };
  const getAskingData = () => {
    if(isSending) {
      clearTimeout(timer)
      setIsSending(false)
      return
    }
    if (!question.trim() && !accepted.length) return {};
    const time = Date.now()
    const msg = accepted.length ? `${accepted.map(e => e.name).join(',')}\n${question.trim()}` : question.trim()
    const newData = {
      id: currentHistory?.id || `new_talk_${Date.now()}`,
      label: "新对话",
      content: [{
        msg,
        id: `msg_${time}`,
        time: time,
        origin: 'user'
      }],
    };
    onAsking(newData);
    setQuestion("");
    setIsSending(true)
    queryClient.setQueryData(['isNewChat'], false);
    // queryClient.setQueryData(['askingData'], newData);
    // todo：调用接口
    timer = setTimeout(() => {
      const answerTime = Date.now()
      const answerData = {
        id: newData.id,
        label: "AI回答",
        content: [{
          msg: 'AI回答',
          id: `msg_${answerTime}`,
          time: answerTime,
          origin: 'ai'
        }],
      };
      // queryClient.setQueryData(['askingData'], answerData);
      fileUpload.clearFiles()
      onAsking(answerData);
      setIsSending(false)
      clearTimeout(timer)
    }, 5000)
  }
  // 发送问题
  const onSend = useCallback(() => {
    getAskingData()
  }, [question, accepted, onAsking]);
  // 移除附件
  const onCloseFile = useCallback(
    (file: File) => {
      fileUpload.deleteFile(file);
    },
    [fileUpload]
  );
  // 处理附件尺寸展示
  const handleSize = useCallback((size: number) => {
    if (size < 1024 * 1024) {
      const kb = Number((size / 1024).toFixed(2));
      return `${kb}KB`;
    } else {
      const mb = Number((size / 1024 / 1024).toFixed(2));
      return `${mb}MB`;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <Box w="80%" textAlign="center">
      {currentHistory?.content ? <></> : <Text fontSize="48px" fontWeight="bold" fontFamily="'Rajdhani', sans-serif" color="#fdfcfb" mb="30px">
        Chat AI
      </Text>}
      {accepted.length > 0 && (
        <Flex w="100%" gap="10px" mb="20px" flexWrap="wrap" role="list" aria-label="已上传的文件">
          {accepted.map((file, index) => (
            <Flex
              key={`${file.name}-${index}`}
              w="280px"
              justify="space-between"
              alignItems="center"
              border="1px solid #86807B"
              p="10px"
              borderRadius="8px"
              textAlign="left"
              role="listitem"
              aria-label={`文件: ${file.name}, 大小: ${handleSize(file.size)}`}
            >
              <Box flex={1} minW={0}>
                <Text truncate title={file.name} fontWeight="medium">
                  {file.name}
                </Text>
                <Text fontSize="sm" color="#86807B">
                  {handleSize(file.size)}
                </Text>
              </Box>
              <CloseButton
                color="#fff"
                _hover={{ backgroundColor: "transparent" }}
                onClick={() => onCloseFile(file)}
                aria-label={`移除文件: ${file.name}`}
              />
            </Flex>
          ))}
        </Flex>
      )}
      <Box position="relative">
        <Textarea
          minH="120px"
          p="20px"
          pb="60px"
          fontSize="16px"
          borderRadius="8px"
          resize="none"
          placeholder="开始对话..."
          _placeholder={{ color: "#86807B" }}
          color="#fdfcfb"
          bgColor="#363131"
          borderColor="#5E565699"
          onChange={onQuestion}
          value={question}
          onKeyDown={handleKeyDown}
        />
        <Box w="calc(100% - 35px)" h="60px" borderRadius="8px" position="absolute" bottom="7px" left="15px" zIndex="2" bgColor="#363131">
          <HStack pos="absolute" bottom="15px" left="5px">
            <FileUpload.RootProvider value={fileUpload}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <HStack
                  cursor="pointer"
                  p="5px"
                  borderRadius="4px"
                  _hover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  transition="background-color 0.2s"
                  aria-label="上传附件"
                >
                  <Box position="relative" w="16px" h="16px">
                    <Image src={IconPaperclip} alt="附件图标" w="full" h="full" objectFit="contain" />
                  </Box>
                  <Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
                    附件
                  </Text>
                </HStack>
              </FileUpload.Trigger>
            </FileUpload.RootProvider>
            <Flex
              minW="88px"
              h="28px"
              ml="20px"
              cursor="pointer"
              alignItems="center"
              backgroundColor={isDeepThink ? "#0660fc20" : "#4a4545"}
              borderRadius="28px"
              align="center"
              justifyContent="center"
              gap="5px"
              onClick={onDeepThink}
              transition="all 0.2s"
              aria-label={isDeepThink ? "关闭深度思考" : "开启深度思考"}
              aria-pressed={isDeepThink}
            >
              <Box position="relative" w="16px" h="16px">
                {isDeepThink ? (
                  <chakra.svg>
                    <IconGlobeSvg />
                  </chakra.svg>
                ) : (
                  <Image src={IconGlobe} alt="深度思考图标" w="full" h="full" objectFit="contain" />
                )}
              </Box>
              <Text fontSize="14px" whiteSpace={"nowrap"} fontFamily="PingFang SC" color={isDeepThink ? "#0660fc" : "#FDFCFB"}>
                深度思考
              </Text>
            </Flex>
          </HStack>
          <HStack pos="absolute" bottom="15px" right="5px">
            <Flex
              w="28px"
              h="28px"
              borderRadius="28px"
              cursor={question.trim() || isSending || accepted.length ? "pointer" : "not-allowed"}
              backgroundColor={question.trim() || isSending || accepted.length ? "#ffdfdfff" : "#808080"}
              justifyContent="center"
              alignItems="center"
              onClick={onSend}
              aria-label="发送消息"
              opacity={question.trim() || isSending || accepted.length ? 1 : 0.6}
              transition="all 0.2s ease"
            >
              <Image src={isSending ? IconStop : IconArrowUp} alt="" w="full" h="full" objectFit="contain" />
            </Flex>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
