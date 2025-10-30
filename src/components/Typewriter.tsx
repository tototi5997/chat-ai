import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react'

interface TypewriterProps {
  text: string;
  speed?: number;
  isHistory?: boolean
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 5,
  isHistory = false,
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0)

  function formatContent(text:string) {

    // 阶段1基础转换
    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^(\d+)\.\s(.+)/gm, '<li>$2</li>')
      .replace(/^-\s(.+)/gm, '<li>• $1</li>')
      .replace(/\\n/g, '<br>')

    // 阶段2结构优化
    formatted = formatted
      .replace(/(<li>.*?<\/li>)+/g, list => {
        const isOrdered = list.startsWith('<li>1')
        return isOrdered ? `<ol>${list}</ol>` : `<ul>${list}</ul>`
      })
    .replace(/<br><br>/g, '<p></p>')

    return formatted
  }

  // useEffect(() => {
  //   if(isHistory) {
  //     setDisplayedText(text)
  //     return
  //   }
  //   // setDisplayedText(''); // 重置文本
    
  //   let cI = 0;
  //   console.log(text, currentIndex, '???text')
  //   setCurrentIndex(currentIndex + 1)
  //   const timer = setInterval(() => {
  //     if (currentIndex < text.length) {
  //       setDisplayedText(prev => (text || '').slice(0, cI));
  //       cI++;
  //       setCurrentIndex(cI)
  //     } else {
  //       clearInterval(timer);
  //       onComplete?.();
  //     }
  //   }, speed);

  //   return () => clearInterval(timer);
  // }, [text, speed]);

  return <div dangerouslySetInnerHTML={{__html: formatContent(text)}}></div>;
};