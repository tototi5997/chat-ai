import { newChat, getChatInfo, postRequestDemoAPI, getChatList, updateChatTitle, delChat, type NewChatParams, type ChatInterface } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// get请求式例
// 1. 在api文件中创建getRequestDemoAPI函数
// 2. 在state文件中创建useGetRequesetDemo函数，这里可以对入参或者接口返回的数据进行二次处理
// 3. 在组件中使用useGetRequesetDemo函数
// 新对话
export const useNewChat = () => {
  return useMutation({
    mutationFn: newChat,
  });
};
// 获取对话信息
export const useGetChatInfo = () => {
  return useMutation({
    mutationFn: getChatInfo,
  });
};


// post请求示例
// 1. 在api文件中创建postRequestDemoAPI函数
// 2. 在state文件中创建usePostRequestDemo函数
// 3. 在组件中使用usePostRequestDemo函数
export const usePostRequestDemo = () => {
  return useMutation({
    mutationFn: postRequestDemoAPI,
  });
};
// 修改名称
export const useUpdateChatTitle = () => {
  return useMutation({
    mutationFn: updateChatTitle,
  });
};
// 删除
export const useDelChat = () => {
  return useMutation({
    mutationFn: delChat,
  });
};
// 历史聊天记录列表
export const useChatList = () => {
  return useQuery({
    queryKey: ["chat_list"],
    queryFn: async () => {
      const res = await getChatList()
      return (res.data || []).map((e:ChatInterface) => ({
        id: e.id || e.Id,
        created_at: e.created_at,
        updated_at: e.updated_at,
        label: e.title,
      }));
    },
  });
};
