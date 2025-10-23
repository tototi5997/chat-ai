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
export const newChat = (data: NewChatParams) => {
  return request({
    method: 'post',
    url: '/chat/new',
    data
  })
};
// 获取对话信息
export const getChatInfo = (chat_id: string) => {
  return request({
    method: 'post',
    url: `/chat/get/${chat_id}`,
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
