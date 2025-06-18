'use client'

import { useState, useRef, useEffect } from 'react'

export default function EdithChat({ isActive }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 이디스 활성화시 환영 메시지
  useEffect(() => {
    if (isActive && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'edith',
          text: '안녕하세요, 주인님! 무엇을 도와드릴까요?',
          time: new Date().toLocaleTimeString()
        }
      ])
    }
  }, [isActive, messages.length])

  // AI API 호출 함수
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('/api/edith', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      return data.response || '죄송합니다, 주인님. 응답을 생성할 수 없습니다.'
    } catch (error) {
      console.error('AI API 호출 실패:', error)
      return '시스템에 문제가 발생했습니다, 주인님. 잠시 후 다시 시도해주세요.'
    }
  }

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim() || !isActive || isLoading) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // 로딩 메시지 추가
    const loadingMessage = {
      id: Date.now() + 1,
      sender: 'edith',
      text: '생각 중입니다...',
      time: new Date().toLocaleTimeString(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // AI 응답 받기
      const aiResponse = await getAIResponse(currentInput)
      
      // 로딩 메시지 제거하고 실제 응답 추가
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            sender: 'edith',
            text: aiResponse,
            time: new Date().toLocaleTimeString()
          }
        ]
      })
    } catch (error) {
      // 에러 시 로딩 메시지 제거하고 에러 메시지 추가
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            sender: 'edith',
            text: '죄송합니다, 주인님. 시스템 오류가 발생했습니다.',
            time: new Date().toLocaleTimeString()
          }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage()
    }
  }

  return (
    <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-4 text-cyan-400 backdrop-blur-sm shadow-2xl shadow-cyan-400/20 flex flex-col h-full">
      {/* 헤더 */}
      <div className="mb-3 bg-black/20 rounded border border-cyan-400/20 p-2 flex-shrink-0">
        <h3 className="text-lg font-semibold text-cyan-300 text-center">E.D.I.T.H</h3>
        <p className="text-xs text-center opacity-60">
          {isActive ? (isLoading ? '처리 중...' : '시스템 온라인') : '시스템 오프라인'}
        </p>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-0">
        {!isActive ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm">이디스를 먼저 호출해주세요</p>
            <p className="text-xs mt-1">이디스! 라고 말해보세요</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 opacity-60">
            <p className="text-sm">대화를 시작해보세요</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-2 rounded text-sm ${
                  message.sender === 'user'
                    ? 'bg-cyan-400/20 border border-cyan-400/40 text-cyan-300'
                    : message.isLoading
                    ? 'bg-black/30 border border-cyan-400/30 text-cyan-400 animate-pulse'
                    : 'bg-black/30 border border-cyan-400/30 text-cyan-400'
                }`}
              >
                <p className={message.isLoading ? 'flex items-center gap-1' : ''}>
                  {message.isLoading && <span className="animate-spin">🤔</span>}
                  {message.text}
                </p>
                <p className="text-xs opacity-60 mt-1">{message.time}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isActive ? (isLoading ? "처리 중..." : "메시지 입력...") : "이디스를 먼저 호출하세요"}
          disabled={!isActive || isLoading}
          className="flex-1 px-3 py-2 text-sm bg-black/30 border border-cyan-400/30 rounded outline-none placeholder-cyan-400/60 text-cyan-300 focus:border-cyan-400/60 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isActive || !inputValue.trim() || isLoading}
          className="px-3 py-2 bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 rounded text-sm font-semibold hover:bg-cyan-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  )
}