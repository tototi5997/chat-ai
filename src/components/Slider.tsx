import { Button, VStack, HStack, Text, Box, Image, Flex, Popover, Portal, Dialog } from "@chakra-ui/react";
import IconGrid from "@/assets/icon-grid.png";
import IconSetting from "@/assets/icon-setting.png";
import IconMore from "@/assets/icon-more.png";
import IconEdit from "@/assets/icon-edit.png";
import IconDel from "@/assets/icon-del.png";
import { useEffect, useState } from "react";
import EditInput from "./EditInput";
import DelDialog from "./DelDialog";
import { type newTalkInterface, type contentInterface } from '@/types/customInterface'
import { useQueryClient } from '@tanstack/react-query';
import { useChatList, useUpdateChatTitle, useDelChat } from "@/state";

interface historyObj {
  id: string;
  label: string;
  content?: contentInterface;
  created_at?: string;
  updated_at?: string;
}
const Slider = (props: { onNewChat: () => void, newQuestion: newTalkInterface|null }) => {
  // const [history, setHistory] = useState<historyObj[]>([{id: '1', label: '智能体记录'}, {id: '2', label: '智能体记录2'}])
  const [current, setCurrent] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState<historyObj | null>()
  const [delData, setDelData] = useState<historyObj | null>()
  const [inputValue, setInputValue] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient();
  // 历史聊天记录列表
  const { data: history = [] } = useChatList();
  const updateChatTitle = useUpdateChatTitle();
  const delChat = useDelChat();

  useEffect(() => {
    if(props.newQuestion) {
      if(!current) {
        const newHistory:any = [props.newQuestion, ...history]
        // setHistory(newHistory)
        queryClient.setQueryData(['chat_list'], newHistory);
        setCurrent(props.newQuestion.id)
        queryClient.setQueryData(['currentHistory'], props.newQuestion);
        // 更新数据并触发组件重渲染
      } else {
        const newHistory:any = history.map((e:historyObj) => {
          if(e.id === props.newQuestion?.id) {
            const newItem = {
              ...e,
              content: e.content?.concat(props.newQuestion?.content)
            }
            queryClient.setQueryData(['currentHistory'], newItem);
            return newItem
          } else {
            return e
          }
        })
        // setHistory(newHistory)
        queryClient.setQueryData(['chat_list'], newHistory);
      }
    }
  }, [props.newQuestion, props.newQuestion?.content])

  // 点击侧边栏选项
  const onTabClick = (type:string) => {
    console.log(type, 'type')
  }
  // 新建对话
  const onNewChat = () => {
    props.onNewChat()
    setCurrent('')
     // 更新数据并触发组件重渲染
    queryClient.setQueryData(['currentHistory'], {});
  }
  // 点击历史聊天
  const onHistoryClick = (e:historyObj) => {
    setCurrent(e.id)
    setIsOpen(false)
    // 更新数据并触发组件重渲染
    queryClient.setQueryData(['currentHistory'], e);
  }
  // 编辑
  const onEdit = (e:historyObj) => {
    setIsOpen(false)
    setEditData(e)
    setInputValue(e.label)
  }
  // 删除
  const onDel = async (e:historyObj) => {
    setDelData(e)
    setVisible(true)
  }
  const inputChange = async (value:string, item:historyObj) => {
    await updateChatTitle.mutateAsync({
      chat_id: item.id,
      title: value
    });
    const newHistory = history.map((e:historyObj) => {
      if(item.id === e.id) {
        return {
          ...e,
          label: value
        }
      } else {
        return e
      }
    })

    queryClient.setQueryData(['chat_list'], newHistory);
    // setHistory(newHistory)
    setEditData(null)
  }

  // 确认删除
  const onSureDel = async () => {
    if(delData) {
      await delChat.mutateAsync(delData.id)
    }
    const newHistory = history.filter((e:historyObj) => e.id !== delData?.id)
    queryClient.setQueryData(['chat_list'], newHistory);
    // setHistory(newHistory)
    setCurrent('')
    queryClient.setQueryData(['currentHistory'], {});
  }

  return (
    <>
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
        <VStack w="100%" mt="30px">
          <HStack w="100%" pl="10px">
            <Text fontSize="14px" fontFamily="PingFang SC" color="#D9D1CB8A">
              最近聊天
            </Text>
          </HStack>
          {history.map((e:historyObj) => (
            <Flex key={e.id} w="100%" justify="space-between" alignItems="center" p="10px" cursor="pointer" borderRadius="8px" _hover={{backgroundColor: '#FFFFFF1A'}} backgroundColor={current === e.id ? '#FFFFFF1A' : ''} onClick={() => onHistoryClick(e)}>
              {editData?.id === e.id ? <EditInput value={inputValue} onChange={(value) => inputChange(value, e)} /> :<Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
                {e.label}
              </Text>}
              <Popover.Root open={isOpen && e.id === current} key={e.id}>
                <Popover.Trigger asChild w="16px" h="16px" borderRadius="16px" _hover={{backgroundColor: '#48414199'}}>
                  <Image src={IconMore} alt="" w="full" h="full" objectFit="contain" onClick={($event) => {$event.stopPropagation(); setCurrent(e.id); setIsOpen(!isOpen)}} />
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content w="250px" border="1px solid #5E565699" backgroundColor="#48414199">
                      {/* <Popover.Arrow /> */}
                      <Popover.Body padding="5px">
                        <Flex w="100%" alignItems="center" gap="10px" p="10px" cursor="pointer" borderRadius="8px" _hover={{backgroundColor: '#FF840029'}} onClick={() => onEdit(e)}>
                          <Image src={IconEdit} alt="" w="16px" h="px" objectFit="contain" />
                          <Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
                            编辑对话标题
                          </Text>
                        </Flex>
                        <Flex w="100%" alignItems="center" gap="10px" p="10px" cursor="pointer" borderRadius="8px" _hover={{backgroundColor: '#FF840029'}} onClick={() => onDel(e)}>
                          <Image src={IconDel} alt="" w="16px" h="px" objectFit="contain" />
                          <Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
                            删除对话
                          </Text>
                        </Flex>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            </Flex>
          ))}
        </VStack>
      </VStack>
      <DelDialog visible={visible} setVisible={(vis) => {setVisible(vis)}} onSureDel={onSureDel} />
    </>
  );
};

export default Slider;
