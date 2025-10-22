import { Box, Image, Text } from "@chakra-ui/react";
import { type contentInterface } from "@/types/customInterface";
import Ellipse from "@/assets/ellipse.png";
import { useUiStore } from "@/state/useUiStore";
import { Typewriter } from './Typewriter.tsx';

export default function ChatContent() {
  const currentHistory = useUiStore((state) => state.currentHistory);
  function formatContent(text:string) {

    // 阶段1基础转换
    let formatted = text
      // .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // .replace(/^(\d+)\.\s(.+)/gm, '<li>$2</li>')
      // .replace(/^-\s(.+)/gm, '<li>• $1</li>')
      // .replace(/\\n/g, '<br>')

    // 阶段2结构优化
    // formatted = formatted
    //   .replace(/(<li>.*?<\/li>)+/g, list => {
    //     const isOrdered = list.startsWith('<li>1')
    //     return isOrdered ? `<ol>${list}</ol>` : `<ul>${list}</ul>`
    //   })
    // .replace(/<br><br>/g, '</p><p>')

    return formatted
  }
  // 渲染消息内容
  const renderMessageContent = (message: StreamMessage) => {
    if (message.role === 'assistant') {
      return (
        <Box className="message assistant-message">
          {message.reasoning_content && (
            <Box className="reasoning">
              <Box>思考过程:</Box>
              <Typewriter text={formatContent(message.reasoning_content)} speed={20} />
            </Box>
          )}
          {message.content && (
            <Box className="content">
              <Typewriter text={formatContent(message.content)} speed={30} />
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
              <Box>文件: {toolContent.function_result?.file_url}</Box>
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
    <Box width="80%" overflow="auto">
      {(currentHistory.messages || []).filter(e => !!e.content).map((e: any, i: number) => (
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
            <Box position="relative" w="32px" h="42px">
              <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
            </Box>
          ) : (
            <Box w="32px"></Box>
          )}
          {e.role !== "user" ? <Box w={e.role !== "user" ? "calc(100% - 42px)" : "100%"} pt={e.role !== "user" ? "8px" : ""}>
            {renderMessageContent(e)}
          </Box> : <Text>{e.content}</Text>}
        </Box>
      ))}
    </Box>
  );
}
