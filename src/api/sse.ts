/**
 * 使用 Fetch API 实现带有请求头的 SSE
 * @param {string} url - SSE 端点 URL
 * @param {Object} params - 请求参数
 * @param {Function} onMessage - 接收到消息时的回调函数
 * @param {Function} onError - 发生错误时的回调函数
 */
export function fetchWithSSE(url:string, params = {}, onMessage: (func: any) => void, onError: (func: () => void) => void, onStart: () => void, onComplete: () => void, customHeaders = {}) {
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders
    },
    body: JSON.stringify(params)
  }
  let readerCancel: () => void
  return fetch(url, init)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // 调用流开始时的回调函数
      if (onStart) {
        onStart()
      }
      // 检查是否为流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let allData:any = null

      function read() {
        reader?.read()
          .then(({ done, value }) => {
            if (done) {
              console.log('Stream complete')
              if (onComplete) {
                onComplete() // 调用流完成时的回调函数
              }
              return
            }
            const parseSSEStream = function(rawData:string) {
              const normalizedData = rawData.replace(/\r\n/g, '\n')
              const eventBlocks = normalizedData.split(/\n\n+/)

              // 2. 解析每个事件块
              return eventBlocks
                .map(block => {
                  const event = {
                    type: 'message', // 默认事件类型
                    data: '',
                    id: '',
                    retry: 0
                  }

                  // 3. 逐行解析字段
                  block.split('\n').forEach(line => {
                    line = line.trim()
                    if (!line) return // 跳过空行

                    const colonIndex = line.indexOf(':')
                    if (colonIndex < 0) return // 无效格式

                    const field = line.slice(0, colonIndex).trim()
                    let value = line.slice(colonIndex + 1).trim()

                    // 4. 处理不同字段类型
                    switch (field.toLowerCase()) {
                      case 'event':
                        event.type = value
                        break
                      case 'data':
                        // 支持多行数据
                        event.data += value + '\n'
                        break
                      case 'id':
                        event.id = value
                        break
                      case 'retry':
                        event.retry = parseInt(value, 10)
                        break
                    }
                  })

                  // 5. 清理数据结尾换行符
                  if (event.data.endsWith('\n')) {
                    event.data = event.data.slice(0, -1)
                  }

                  return event
                })
                .filter(event => event.data || event.type) // 过滤空事件
            }
            const chunk = decoder.decode(value, { stream: true })
            if (chunk.startsWith('data:')) {
              try {
                const currentData = parseSSEStream(chunk)
                if(!allData) {
                  allData = currentData
                } else {
                  allData = allData.concat(currentData)
                }
                onMessage(allData)
              } catch (error) {
                console.error('Failed to parse SSE message:', error)
              }
            }
            read() // 继续读取下一个块
          })
          .catch(error => {
            console.error('Error reading stream:', error)
            if (onError) {
              onError(error)
            }
          })
      }

      read()
      // 返回取消连接的函数
      readerCancel = () => reader?.cancel('Stream manually canceled by user.')
    })
    .catch(error => {
      console.error('Fetch error:', error)
      if (onError) {
        onError(error)
      }
    })
    .then(() => {
      // 返回取消连接的函数
      return () => {
        if (readerCancel) {
          readerCancel()
        }
      }
    })
}
