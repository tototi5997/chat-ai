import { Input, Text, Flex, Box, Center, Button } from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameValid, setUsernameValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const navigate = useNavigate()
  const onUserName = (evt:ChangeEvent<HTMLInputElement>) => {
    const value = evt.target?.value
    setUsername(value)
    if (value) {
      setUsernameValid(false)
    }
  }
  const onPassword = (evt:ChangeEvent<HTMLInputElement>) => {
    const value = evt.target?.value
    setPassword(value)
    if (value) {
      setPasswordValid(false)
    }
  }
  // 登录
  const onLogin = () => {
    if(!username) {
      setUsernameValid(true)
    }
    if(!password) {
      setPasswordValid(true)
    }
    if(!username || !password) return;
    navigate('/home')
  }
  return <Center h="100vh">
    <Flex w="300px" alignItems="center" flexDir="column" gap="20px">
      <Text color="#fff" fontSize="22px">欢迎登录</Text>
      <Box>
        <Input w="300px" h="50px" placeholder="Username" _placeholder={{color: '#7d7d7d'}} borderColor={!usernameValid ? "#7d7d7d" : "#f53f3f"} _hover={{borderColor: '#bd7c40'}} _focus={{borderColor: '#bd7c40'}} _focusVisible={{borderColor: '#bd7c40'}} outlineWidth={0} borderRadius="4px" color="#fff" onChange={onUserName} />
      </Box>
      <Box>
        <Input type="password" w="300px" h="50px" placeholder="Password" _placeholder={{color: '#7d7d7d'}} borderColor={!passwordValid ? "#7d7d7d" : "#f53f3f"} _hover={{borderColor: '#bd7c40'}} _focus={{borderColor: '#bd7c40'}} _focusVisible={{borderColor: '#bd7c40'}} outlineWidth={0} borderRadius="4px" color="#fff" onChange={onPassword} />
      </Box>
      <Button w="full" h="50px" backgroundColor="#bd7c40" onClick={onLogin}>登 录</Button>
    </Flex>
  </Center>
}