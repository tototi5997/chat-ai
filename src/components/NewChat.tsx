import { Textarea, Box, Text, FileUpload, Image, HStack, Flex, useFileUpload, chakra, CloseButton } from "@chakra-ui/react";
import IconPaperclip from "@/assets/icon-paperclip.png";
import IconGlobe from "@/assets/icon-globe.png";
import IconGlobeSvg from "@/assets/icon-globe.svg";
import IconArrowUp from "@/assets/icon-arrow-up.png";
import IconStop from "@/assets/icon-stop.png";
import { useState, type ChangeEvent, useCallback } from "react";
import { type newTalkInterface } from "@/types/customInterface";
import { useNewChat, usePostRequestDemo } from "@/state";
import { fetchWithSSE } from '@/api/sse'
import { useQueryClient } from '@tanstack/react-query';
import { useUiStore } from "@/state/useUiStore";

let cancelSSE
export function NewChat({ onAsking }: { onAsking: (talk: newTalkInterface) => void }) {
  const [isDeepThink, setIsDeepThink] = useState<boolean>(false); // 是否开启深度思考
  const [question, setQuestion] = useState<string>(""); // 输入框数据

  const currentHistory = useUiStore((state) => state.currentHistory);
  const isNewChat = useUiStore((state) => state.isNewChat);
  const setCurrentHistory = useUiStore((state) => state.setCurrentHistory);
  const setIsNewChat = useUiStore((state) => state.setIsNewChat);

  // get请求模拟
  const newChat = useNewChat();

  const mockPostFunc = usePostRequestDemo();

  const isAiPendding = mockPostFunc.isPending;

  const fileUpload = useFileUpload({
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const accepted = fileUpload.acceptedFiles;

  // 是否开启深度思考
  const onDeepThink = () => setIsDeepThink((prev) => !prev);

  // 输入框数据变化
  const onQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target?.value);
  };

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
    }
  };

  const onClickSendMessage = async () => {
    let chatId = ''
    if(isNewChat) {
      const newChatData = await newChat.mutateAsync({title: '智能体记录'})
      setCurrentHistory({
        ...newChatData
      })
      chatId = newChatData.data?.id
    } else {
      const newCurrentHistory = JSON.parse(JSON.stringify(currentHistory))
      newCurrentHistory.messages.push({
        role: 'user',
        content: question
      }, {
        role: 'assistant',
        content: ''
      })
      setCurrentHistory(newCurrentHistory)
      chatId = currentHistory.id
    }
    
    fetchWithSSE(`/api/chat/${chatId}/stream`, {
      messages: [{
        content: question,
        name: '',
        role: ''
      }],
      metadata: '',
      user: ''
    },
      handleSSEMessage,
      handleSSEError,
      handleStreamStart,
      handleStreamComplete
    ).then(cancelFunc => {
      cancelSSE = cancelFunc // 存储取消连接的函数
      setIsNewChat(false)
      setQuestion('')
    })
    .catch(error => {
      console.error('Failed to start SSE connection:', error)
    })
  };

  function handleSSEMessage(data) {
    if (data.length && data.length > 0) {
      console.log(currentHistory, 'currentHistory')
      let newCurrentHistory = JSON.parse(JSON.stringify(currentHistory))
      if(!newCurrentHistory?.messages || !newCurrentHistory?.messages?.length) {
        newCurrentHistory.messages = [{
          role: 'user',
          content: question
        }, {
          role: 'assistant',
          content: ''
        }]
      }
      // 更新数据并触发组件重渲染
      const botIndex = newCurrentHistory.messages.length - 1
      const botMessage = newCurrentHistory.messages[botIndex]
      botMessage.content += data.map(item => item.data ? JSON.parse(item.data).reasoning_content : '').join('')
      botMessage.displayContent = formatContent(botMessage.content)
      newCurrentHistory.messages[botIndex] = botMessage
      console.log(newCurrentHistory, 'newCurrentHistory')
      setCurrentHistory(newCurrentHistory)
    }
  }
  function handleSSEError(error) {
    // if (this.messages[this.messages.length - 1].content == '思考中...') {
    //   this.messages[this.messages.length - 1].content = '服务器异常，请稍后再试'
    // }
    console.error('SSE Error:', error)
  }
  function handleStreamStart() {
    console.log('Stream has started.')
  }
  function handleStreamComplete() {
    console.log('Stream has completed.')
    // const activeChat = this.chatHistory.find(chat => chat.id === this.activeChatId)
    // const botIndex = activeChat.messages.length - 1
    // const botMessage = activeChat.messages[botIndex]
    // setQuestion('')
    // // this.scrollToBottom()
    // botMessage.isStreaming = false
    // this.$set(activeChat.messages, botIndex, { ...botMessage })
  }
  function cancelConnection() {
    if (cancelSSE) {
      cancelSSE() // 调用取消连接的函数
    }
  }
  function formatContent(text) {
    // 阶段1基础转换
    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^(\d+)\.\s(.+)/gm, '<li>$2</li>')
      .replace(/^-\s(.+)/gm, '<li>• $1</li>')
      .replace(/\n/g, '<br>')

    // 阶段2结构优化
    formatted = formatted
      .replace(/(<li>.*?<\/li>)+/g, list => {
        const isOrdered = list.startsWith('<li>1')
        return isOrdered ? `<ol>${list}</ol>` : `<ul>${list}</ul>`
      })
      .replace(/<br><br>/g, '</p><p>')

    return formatted
  }
  
  return (
    <Box w="80%" textAlign="center">
      {currentHistory?.content ? (
        <></>
      ) : (
        <Text fontSize="48px" fontWeight="bold" fontFamily="'Rajdhani', sans-serif" color="#fdfcfb" mb="30px">
          Chat AI
        </Text>
      )}
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
              cursor={question.trim() || isAiPendding || accepted.length ? "pointer" : "not-allowed"}
              backgroundColor={question.trim() || isAiPendding || accepted.length ? "#ffdfdfff" : "#808080"}
              justifyContent="center"
              alignItems="center"
              onClick={onClickSendMessage}
              aria-label="发送消息"
              opacity={question.trim() || isAiPendding || accepted.length ? 1 : 0.6}
              transition="all 0.2s ease"
            >
              <Image src={isAiPendding ? IconStop : IconArrowUp} alt="" w="full" h="full" objectFit="contain" />
            </Flex>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
