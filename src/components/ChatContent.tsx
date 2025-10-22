import { Box, Image, Text } from "@chakra-ui/react";
import { type contentInterface } from "@/types/customInterface";
import Ellipse from "@/assets/ellipse.png";
import { useUiStore } from "@/state/useUiStore";
import { Typewriter } from './Typewriter.tsx';

export default function ChatContent() {
  const currentHistory = useUiStore((state) => state.currentHistory);
  console.log(currentHistory, 'currentHistory')
  function formatContent(text:string) {

    // 阶段1基础转换
    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^(\d+)\.\s(.+)/gm, '<li>$2</li>')
      .replace(/^-\s(.+)/gm, '<li>• $1</li>')
      .replace(/\\n/g, '<br>')

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
        <div className="message assistant-message">
          {message.reasoning_content && (
            <div className="reasoning">
              <strong>思考过程:</strong>
              <Typewriter text={formatContent(message.reasoning_content)} speed={20} />
            </div>
          )}
          {message.content && (
            <div className="content">
              <Typewriter text={formatContent(message.content)} speed={30} />
            </div>
          )}
        </div>
      );
    }

    if (message.role === 'tool') {
      try {
        const toolContent = JSON.parse(message.content || '{}');
        return (
          <div className="message tool-message">
            <strong>工具调用:</strong> {toolContent.function_call}
            {toolContent.function_result?.file_url && (
              <div>文件: {toolContent.function_result.file_url}</div>
            )}
          </div>
        );
      } catch {
        return <div>工具调用结果解析失败</div>;
      }
    }

    return null;
  };
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
          {e.role === "assistant" && currentHistory.messages[i-1].role !== 'assistant' ? (
            <Box position="relative" w="32px" h="42px">
              <Image src={Ellipse} alt="Chat AI logo" w="full" h="full" objectFit="contain" />
            </Box>
          ) : (
            <></>
          )}
          {e.role === "assistant" ? <Text w={e.role === "assistant" ? "calc(100% - 42px)" : "100%"} pt={e.role === "assistant" ? "8px" : ""}>
            {renderMessageContent(e)}
          </Text> : <Text>{e.content}</Text>}
        </Box>
      ))}
    </Box>
  );
}
