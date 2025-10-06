import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Input } from "@chakra-ui/react";

export default function EditInput(props: {value: string, onChange: (value:string) => void}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
    setInputValue(props.value)
  }, [])
  const onInput = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target?.value)
  }
  return <Input ref={inputRef} value={inputValue} onChange={onInput} onBlur={() => props.onChange(inputValue)}></Input>
}