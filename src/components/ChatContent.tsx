import { Box, Center, Image, Text, VStack } from "@chakra-ui/react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type contentInterface } from '@/types/customInterface'

export default function ChatContent() {
  // 获取组件中添加缓存回退
  const queryClient = useQueryClient()
  const { data: currentHistory } = useQuery({
    queryKey: ['currentHistory'],
    queryFn: () => queryClient.getQueryData(['currentHistory']) || {}
  });
  return (
    <Box width="80%" overflow="auto">
      {currentHistory?.content.map((e:contentInterface, i:number) => (
        <Box key={i} width="80%" backgroundColor={e.origin === 'user' ? '#5E565699' : ''} ml={e.origin === 'user' ? "auto" : ''} mb="20px" borderRadius="8px" p="10px" color="#FDFCFB">
          {e.msg}
        </Box>
      ))}
    </Box>
  )
}