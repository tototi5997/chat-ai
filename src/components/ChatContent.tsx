import { Box, Image, Text, Link, Collapsible, Flex } from "@chakra-ui/react";
import Ellipse from "@/assets/ellipse.png";
import { useUiStore } from "@/state/useUiStore";
import { Typewriter } from './Typewriter.tsx';
import { baseUrl } from '../../config.ts'
import { useEffect, useRef, useState } from "react";
import { type StreamMessage } from '@/api/hook'
import Arrow from "@/assets/arrow.svg";

export default function ChatContent() {
  const currentHistory = useUiStore((state) => state.currentHistory);
  const needScroll = useUiStore((state) => state.needScroll);
  const isLoading = useUiStore((state) => state.isLoading);
  const chatRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [reasoning, setReasoning] = useState<any>({})

  useEffect(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if(needScroll) {
      stickToBottom()
    }
  }, [needScroll])

  // 判断在最底部才继续黏贴在底部滚动
  const stickToBottom = () => {
    const scrollEl = chatRef.current!;
    if (!scrollEl) return;
    
    // 记录当前滚动状态
    // const currentScrollTop = scrollEl.scrollTop;
    // const currentMaxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    // // 判断是否已经到底部（允许1px误差）
    // const isAtBottom = currentScrollTop >= currentMaxScroll - 100;
  
    // if (!scrollEl) return;
    
    const newMaxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    scrollEl.scrollTo({
      top: newMaxScroll
    })
    // 只有当前在底部时才滚动
    // if (isAtBottom) {
    //   // scrollEl.scrollTop = newMaxScroll;
    // } else {
    //   // console.log('未到达底部，不滚动')
    // }
  }
  // 思考过程文字渲染结束
  const onReasoningEnd = (message:StreamMessage, index:number) => {
    setReasoning({
      [message.id || `${index}`]: true
    })
  }

  // 渲染消息内容
  const renderMessageContent = (message: StreamMessage,index:number) => {
    if (message.role === 'assistant') {
      return (
        <Box className="message assistant-message">
          {message.reasoning_content && <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Collapsible.Trigger w="100%">
              <Flex justify="space-between" w="100%">
                <Text>
                  思考过程:
                </Text>
                <Flex alignItems="center" gap="5px" cursor="pointer">
                  <Text>{!open ? '展开思考过程' : '收起思考过程'}</Text>
                  <Box transform={`rotateZ(${!open ? 0 : 180}deg)`}>
                    <Arrow width="20px" height="20px" />
                  </Box>
                </Flex>
              </Flex>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Typewriter text={message.reasoning_content} speed={20} isHistory={message.isHistory} onComplete={() => onReasoningEnd(message, index)} />
            </Collapsible.Content>
          </Collapsible.Root>}
          {((currentHistory.messages[index-1].reasoning_content ? reasoning[message.id || `${index-1}`] : true) && <Box className="content">
              <Typewriter text={message.content||''} speed={30} isHistory={message.isHistory} />
            </Box>
          )}
        </Box>
      );
    }
    if (message.role === 'tool') {
      try {
        const toolContent = JSON.parse(message.content || '{}');

        return (
          <Box className="message tool-message">
            <Box>工具调用: {toolContent.function_call}</Box> 
            {toolContent.function_result?.file_url ? (
              <Box>文件:  
                <Link href={`${baseUrl}/download/${toolContent.function_result?.file_url}`} color='#1188d6' title="点击下载"> {toolContent.function_result?.file_url}</Link>
              </Box>
            ) : <></>}
          </Box>
        );
      } catch {
        // return <div>工具调用结果解析失败</div>;
      }
    }

    return null;
  };
  return (
    <Box ref={chatRef} width="80%" overflow="auto">
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
          {e.role !== "user" && currentHistory.messages[i-1].role === 'user' ? (
            (i === (currentHistory.messages || []).length - 1 ? !isLoading : true) && <Box position="relative" w="32px" h="42px">
              <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
            </Box>
          ) : (
            <Box w="32px"></Box>
          )}
          {e.role !== "user" ? <Box w={e.role !== "user" ? "calc(100% - 42px)" : "100%"} pt={e.role !== "user" ? "8px" : ""}>
            {(i === (currentHistory.messages || []).length - 1 ? !isLoading : true) && renderMessageContent(e,i)}
          </Box> : <Text>{e.content}</Text>}
        </Box>
      ))}
    </Box>
  );
}
