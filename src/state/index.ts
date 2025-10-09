import { getRequestDemoAPI, postRequestDemoAPI, type GetDemoParams } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// get请求式例
// 1. 在api文件中创建getRequestDemoAPI函数
// 2. 在state文件中创建useGetRequesetDemo函数，这里可以对入参或者接口返回的数据进行二次处理
// 3. 在组件中使用useGetRequesetDemo函数
export const useGetRequesetDemo = (params: GetDemoParams) => {
  return useQuery({
    queryKey: ["get_requert_demo"],
    queryFn: () => getRequestDemoAPI(params),
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
