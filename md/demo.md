```tsx
import { useState, useRef } from "react";
import { fetchWithSSE } from "@/api/sse";
import { useUiStore } from "@/state/useUiStore";

export function NewChat() {
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const currentHistory = useUiStore((state) => state.currentHistory);
  const setCurrentHistory = useUiStore((state) => state.setCurrentHistory);

  // 用于累积流式返回的内容
  const streamingContentRef = useRef("");

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // 1. 先添加用户消息
    const updatedHistory = {
      ...currentHistory,
      messages: [...(currentHistory.messages || []), { role: "user", content: userMessage }],
    };
    setCurrentHistory(updatedHistory);

    // 2. 清空流式内容累积器
    streamingContentRef.current = "";

    // 3. 添加一个空的 assistant 消息（用于后续更新）
    const messagesWithAssistant = [...updatedHistory.messages, { role: "assistant", content: "" }];
    setCurrentHistory({ ...updatedHistory, messages: messagesWithAssistant });

    // 4. 发起流式请求
    const cancelFn = await fetchWithSSE(
      "/api/chat/stream", // 你的流式接口地址
      {
        message: userMessage,
        chat_id: currentHistory.id || "",
        history: currentHistory.messages || [],
      },
      // onMessage: 每次收到数据块时调用
      (events) => {
        events.forEach((event) => {
          try {
            const data = JSON.parse(event.data);

            // 累积内容（关键：逐步拼接）
            if (data.content) {
              streamingContentRef.current += data.content;
            }

            // 实时更新最后一条 assistant 消息
            setCurrentHistory({
              ...updatedHistory,
              messages: [...updatedHistory.messages, { role: "assistant", content: streamingContentRef.current }],
            });
          } catch (e) {
            console.error("解析 SSE 数据失败:", e);
          }
        });
      },
      // onError: 错误处理
      (error) => {
        console.error("流式请求错误:", error);
        setIsStreaming(false);
        cancelRef.current = null;
      },
      // onStart: 流开始
      () => {
        console.log("🚀 流式数据开始返回");
        setIsStreaming(true);
      },
      // onComplete: 流结束（关键：这里确定数据返回结束）
      () => {
        console.log("✅ 流式数据返回完成");
        console.log("完整内容:", streamingContentRef.current);

        setIsStreaming(false);
        cancelRef.current = null;

        // 可选：保存完整的对话到服务器
        // saveChatHistory(currentHistory.id, streamingContentRef.current)
      },
      // 自定义请求头
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    );

    // 5. 保存取消函数（用于手动中断）
    cancelRef.current = cancelFn || null;
  };

  // 手动取消流式请求
  const handleCancel = () => {
    if (cancelRef.current) {
      cancelRef.current();
      setIsStreaming(false);
      console.log("⏹️ 流式请求已取消");
    }
  };

  return (
    <div>
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isStreaming} placeholder="输入消息..." />

      {isStreaming ? <button onClick={handleCancel}>停止生成</button> : <button onClick={handleSendMessage}>发送</button>}

      {isStreaming && <div>AI 正在思考...</div>}
    </div>
  );
}
```
