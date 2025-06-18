'use client'

import { useState, useRef, useEffect } from 'react'

export default function EdithChat({ isActive }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
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

  // 메시지 전송
  const sendMessage = () => {
    if (!inputValue.trim() || !isActive) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // 이디스 응답 시뮬레이션
    setTimeout(() => {
      const edithResponse = {
        id: Date.now() + 1,
        sender: 'edith',
        text: getEdithResponse(inputValue.trim()),
        time: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, edithResponse])
    }, 1000)
  }

  // 간단한 이디스 응답 로직
  const getEdithResponse = (input) => {
    const responses = {
      '안녕': '안녕하세요! 좋은 하루입니다.',
      '시간': `현재 시간은 ${new Date().toLocaleTimeString()}입니다.`,
      '날씨': '죄송합니다. 현재 날씨 정보에 접근할 수 없습니다.',
      '도움': '투두리스트 관리, 시간 확인, 간단한 대화 등을 도와드릴 수 있습니다.',
      '고마워': '천만에요, 주인님! 언제든 말씀해주세요.',
      'default': '흥미롭네요. 더 구체적으로 말씀해주시겠어요?',
      '고재성': '오즈 조교야'
    }

    const lowerInput = input.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response
      }
    }
    return responses.default
  }

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-4 text-cyan-400 backdrop-blur-sm shadow-2xl shadow-cyan-400/20 flex flex-col h-full">
      {/* 헤더 */}
      <div className="mb-3 bg-black/20 rounded border border-cyan-400/20 p-2 flex-shrink-0">
        <h3 className="text-lg font-semibold text-cyan-300 text-center">E.D.I.T.H</h3>
        <p className="text-xs text-center opacity-60">
          {isActive ? '시스템 온라인' : '시스템 오프라인'}
        </p>
      </div>

      {/* 메시지 영역 - flex-1으로 남은 공간 모두 차지 */}
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
                    : 'bg-black/30 border border-cyan-400/30 text-cyan-400'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-60 mt-1">{message.time}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 - 하단 고정 */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isActive ? "메시지 입력..." : "이디스를 먼저 호출하세요"}
          disabled={!isActive}
          className="flex-1 px-3 py-2 text-sm bg-black/30 border border-cyan-400/30 rounded outline-none placeholder-cyan-400/60 text-cyan-300 focus:border-cyan-400/60 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isActive || !inputValue.trim()}
          className="px-3 py-2 bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 rounded text-sm font-semibold hover:bg-cyan-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤
        </button>
      </div>
    </div>
  )
}