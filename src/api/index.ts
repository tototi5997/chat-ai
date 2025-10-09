// 模拟 GET 请求，1 秒后返回空数组
export type GetDemoResponse = {
  id: number;
  title: string;
};

export type GetDemoParams = {
  query?: string;
  limit?: number;
};

export const getRequestDemoAPI = async (params: GetDemoParams): Promise<GetDemoResponse[]> => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          { id: 1, title: "智能体聊天记录" },
          { id: 2, title: "智能体聊天记录" },
        ]),
      1000
    );
  });
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
