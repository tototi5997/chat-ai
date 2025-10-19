import request from "./request";

// 模拟 GET 请求，1 秒后返回空数组
export type ChatInterface = {
  id?: number;
  Id?: number;
  title: string;
  created_at: string;
  updated_at?: string;
};

export type NewChatParams = {
  title: string;
};

export type UpdateChatInterface = {
  chat_id: string;
  title: string;
};
// 获取历史聊天记录
export const getChatList = () => {
  return request({
    method: 'post',
    url: '/chat/list'
  })
};

// 新增对话
export const newChat = (data: NewChatParams): Promise<ChatInterface[]> => {
  return request({
    method: 'post',
    url: '/chat/new',
    data
  })
};

// 更新历史对话名称
export const updateChatTitle = (data:UpdateChatInterface) => {
  return request({
    method: 'post',
    url: `/chat/update/${data.chat_id}`,
    data: {
      title: data.title
    }
  })
};
// 删除历史对话
export const delChat = (chat_id:string) => {
  return request({
    method: 'post',
    url: `/chat/delete/${chat_id}`
  })
};

// 模拟 POST 请求，800ms 后返回回显结果
export const postRequestDemoAPI = async (message: string) => {
  const trimmed = message.trim();
  return new Promise<{ id: string; message: string; receivedAt: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        id: `mock_${Date.now()}`,
        message: trimmed || "空消息",
        receivedAt: Date.now(),
      });
    }, 800);
  });
};
