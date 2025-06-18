'use client'

import { useState } from 'react'

export default function AnimatedHeader() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <header className="flex justify-between items-center p-6 bg-black/80 border-b border-cyan-400/30 backdrop-blur-md">
      {/* 좌측 빈 공간 (균형 맞추기 위해) */}
      <div className="w-20"></div>

      {/* 중앙 - 제목/네비게이션 영역 */}
      <div 
        className="relative h-8 flex items-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* E.D.I.T.H 제목 */}
        <h1 
          className={`text-2xl font-bold text-cyan-400 transition-opacity duration-300  ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        >
          E.D.I.T.H.
        </h1>
        
        {/* 네비게이션 메뉴 */}
        <nav 
          className={`flex space-x-6 transition-opacity duration-300 absolute justify-center items-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <a 
            href="#" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            DOCS
          </a>
          <a 
            href="#" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            LEARN
          </a>
          <a 
            href="#" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            PROJECT
          </a>
          <a 
            href="#" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            ABOUT
          </a>
        </nav>
      </div>

      {/* 우측 - 로그인 버튼 */}
      <button className="bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded hover:bg-cyan-400/30 transition-colors font-semibold backdrop-blur-sm">
        ACCESS
      </button>
    </header>
  )
}