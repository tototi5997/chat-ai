import { useState, useRef, useCallback } from 'react';
import { useUiStore } from "@/state/useUiStore";

export interface StreamMessage {
  id: string;
  role: 'assistant' | 'tool' | 'user';
  content?: string;
  reasoning_content?: string;
  tool_call_id?: string;
  isHistory?: boolean
}
export function parseString(str:string) {
  if((str.startsWith('\"') && str.endsWith('\"')) || (str.startsWith('{\"') && str.endsWith('\"}'))) {
    return JSON.parse(str)
  }
  if(str === "null") {
    return ''
  }
  return str
}

export const useStreamChat = () => {
  const currentHistory = useUiStore((state) => state.currentHistory);
  const setCurrentHistory = useUiStore((state) => state.setCurrentHistory);
  const history = useUiStore((state) => state.history);
  const setHistory = useUiStore((state) => state.setHistory);
  const setNeedScroll = useUiStore((state) => state.setNeedScroll);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const processStream = useCallback(async (url: string, options: RequestInit = {}, oldHistory: {}) => {
    setIsLoading(true);
    setError(null);
    
    // 重置消息或保留对话上下文
    setMessages([]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        setNeedScroll(true)
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              setIsLoading(false);
              setHistory({
                ...history,
                [currentHistory.id]: {
                  ...history[currentHistory.id],
                  messages: history[currentHistory.id].messages.map((x:StreamMessage) => ({
                    ...x,
                    isHistory: true
                  }))
                }
              })
              return;
            }

            try {
              const parsedData: StreamMessage = JSON.parse(data);
              
              setMessages(prev => {
                const newMessages = [...prev];
                
                if (parsedData.role === 'assistant') {
                  // 查找是否已存在同类型的消息
                  const existingIndex = newMessages.findIndex(
                    msg => msg.role === 'assistant' && 
                    (msg.reasoning_content !== undefined) === (parsedData.reasoning_content !== undefined)
                  );

                  if (existingIndex >= 0) {
                    // 更新现有消息
                    const existing = newMessages[existingIndex];
                    if (parsedData.content) {
                      newMessages[existingIndex] = {
                        ...existing,
                        content: (existing.content || '') + parseString(parsedData.content)
                      };
                    }
                    if (parsedData.reasoning_content) {
                      newMessages[existingIndex] = {
                        ...existing,
                        reasoning_content: (existing.reasoning_content || '') + parseString(parsedData.reasoning_content)
                      };
                    }
                  } else {
                    if (parsedData.content) {
                      parsedData.content = parseString(parsedData.content)
                    }
                    if (parsedData.reasoning_content) {
                      parsedData.reasoning_content = parseString(parsedData.reasoning_content)
                    }
                    // 添加新消息
                    newMessages.push(parsedData);
                  }
                } else if (parsedData.role === 'tool') {
                  // 工具调用结果
                  newMessages.push(parsedData);
                }
                if(newMessages && newMessages.length) {
                  const newCurrentHistory = JSON.parse(JSON.stringify(oldHistory))
                  newCurrentHistory.messages = [
                    ...newCurrentHistory.messages,
                    ...newMessages
                  ]
                  setCurrentHistory({...newCurrentHistory})
                  // 设置历史数据
                  let newHisMsg = history[currentHistory.id]?.messages || []
                  newHisMsg = newHisMsg.concat(newCurrentHistory.messages)
                  setHistory({
                    ...history,
                    [currentHistory.id]: {
                      ...history[currentHistory.id],
                      messages: newHisMsg
                    }
                  })
                  setNeedScroll(false)
                }
                return newMessages;
              });
            } catch (e) {
              console.error('解析 JSON 失败:', e, '原始数据:', data);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message);
        console.error('流式请求错误:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    processStream,
    stopStream,
  };
};