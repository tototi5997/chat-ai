import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export default function DelDialog (props: {visible: boolean, setVisible:(visible:boolean) => void, onSureDel: () => void}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(props.visible)
  }, [props.visible])

  const onSureDel = () => {
    props.setVisible(false)
    props.onSureDel()
  }

  return  <Dialog.Root role="alertdialog" open={open} onOpenChange={(e) => {setOpen(e.open); props.setVisible(e.open)}}>
      {/* <Dialog.Trigger asChild>
        <Flex w="100%" alignItems="center" gap="10px" p="10px" cursor="pointer" borderRadius="8px" _hover={{backgroundColor: '#FF840029'}}>
          <Image src={IconDel} alt="" w="16px" h="px" objectFit="contain" />
          <Text fontSize="14px" fontFamily="PingFang SC" color="#FDFCFB">
            删除对话
          </Text>
        </Flex>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>永久删除聊天</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                删除后，该聊天将不可恢复。确认删除吗？
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">取消</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={onSureDel}>确认</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
}