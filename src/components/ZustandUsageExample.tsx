import { Button, Text, VStack } from "@chakra-ui/react";
import { useUiStore } from "@/state/useUiStore";

// 示例组件：演示如何在组件中使用 Zustand store
// 将该组件放入任意页面即可看到按钮切换效果
export function ZustandUsageExample() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <VStack align="flex-start" px={3} p={4} border="1px dashed" borderColor="#5E565699" borderRadius="8px">
      <Text>当前侧边栏状态：{sidebarOpen ? "打开" : "关闭"}</Text>
      <Button onClick={toggleSidebar} variant="surface">
        切换侧边栏
      </Button>
      <Button onClick={() => setSidebarOpen(false)} variant="outline">
        重置为关闭
      </Button>
    </VStack>
  );
}

export default ZustandUsageExample;
