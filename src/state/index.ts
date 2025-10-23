import { newChat, getChatInfo, getChatList, updateChatTitle, delChat, type ChatInterface } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

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
        title: e.title,
      }));
    },
  });
};
