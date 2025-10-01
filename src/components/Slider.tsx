import { Button, VStack, HStack, Text, Box, Image } from "@chakra-ui/react";
import IconGrid from "@/assets/icon-grid.png";
import IconSetting from "@/assets/icon-setting.png";

const Slider = (props: { onNewChat: () => void; }) => {
  // 点击侧边栏选项
  const onTabClick = (type:string) => {
    console.log(type, 'type')
  }
  // 新建对话
  const onNewChat = () => {
    props.onNewChat()
  }
  return (
    <VStack w="296px" px={{ md: 3 }} py={{ md: 5 }}>
      <Button w="full" h="36px" variant="surface" onClick={onNewChat}>
        新建对话
      </Button>
      
      <VStack w="100%" mt="20px" pl="10px">
        <HStack w="100%" mb="10px" cursor="pointer" onClick={() => onTabClick('search')}>
          <Box position="relative" w="16px" h="16px">
            <Image src={IconGrid} alt="" w="full" h="full" objectFit="contain" />
          </Box>
          <Text fontSize="16px" fontFamily="PingFang SC" color="#FDFCFB">
            搜索
          </Text>
        </HStack>
        <HStack w="100%" mb="10px" cursor="pointer" onClick={() => onTabClick('project')}>
          <Box position="relative" w="16px" h="16px">
            <Image src={IconGrid} alt="" w="full" h="full" objectFit="contain" />
          </Box>
          <Text fontSize="16px" fontFamily="PingFang SC" color="#FDFCFB">
            项目
          </Text>
        </HStack>
        <HStack w="100%" mb="10px" cursor="pointer" onClick={() => onTabClick('community')}>
          <Box position="relative" w="16px" h="16px">
            <Image src={IconGrid} alt="" w="full" h="full" objectFit="contain" />
          </Box>
          <Text fontSize="16px" fontFamily="PingFang SC" color="#FDFCFB">
            社区
          </Text>
        </HStack>
        <HStack w="100%" mb="10px" cursor="pointer" onClick={() => onTabClick('setting')}>
          <Box position="relative" w="16px" h="16px">
            <Image src={IconSetting} alt="" w="full" h="full" objectFit="contain" />
          </Box>
          <Text fontSize="16px" fontFamily="PingFang SC" color="#FDFCFB">
            设置
          </Text>
        </HStack>
      </VStack>
      <VStack w="100%" mt="30px" pl="10px">
        <HStack w="100%">
          <Text fontSize="14px" fontFamily="PingFang SC" color="#D9D1CB8A">
            最近聊天
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Slider;
