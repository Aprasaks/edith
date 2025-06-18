'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnimatedHeader() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <header className="flex justify-between items-center p-6 bg-black/80 border-b border-white/40 backdrop-blur-md"
            style={{ 
              borderBottomColor: 'rgba(255,255,255,0.4)',
              boxShadow: '0 2px 10px rgba(255,255,255,0.05)' 
            }}>
      {/* 좌측 - 커피 버튼 */}
      <a 
        href="https://www.buymeacoffee.com/demiandev" 
        target="_blank"
        className="inline-flex items-center px-4 py-2 bg-white/20 border border-white/40 text-white rounded-lg hover:bg-white/30 hover:text-white transition-all duration-200 backdrop-blur-sm font-medium"
        style={{
          boxShadow: '0 0 8px rgba(255,255,255,0.15)',
          textShadow: '0 0 4px rgba(255,255,255,0.4)'
        }}
      >
        ☕ Buy me a coffee
      </a>

      {/* 중앙 - 제목/네비게이션 영역 */}
      <div 
        className="relative h-8 flex items-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* E.D.I.T.H 제목 */}
        <h1 
          className={`text-2xl font-bold text-white transition-opacity duration-300  ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            textShadow: '0 0 6px rgba(255,255,255,0.5)'
          }}
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
          <Link 
            href="/docs" 
            className="text-white font-semibold hover:text-white/80 transition-colors"
            style={{
              textShadow: '0 0 4px rgba(255,255,255,0.4)'
            }}
          >
            DOCS
          </Link>
          <a 
            href="#" 
            className="text-white font-semibold hover:text-white/80 transition-colors"
            style={{
              textShadow: '0 0 4px rgba(255,255,255,0.4)'
            }}
          >
            LEARN
          </a>
          <a 
            href="#" 
            className="text-white font-semibold hover:text-white/80 transition-colors"
            style={{
              textShadow: '0 0 4px rgba(255,255,255,0.4)'
            }}
          >
            PROJECT
          </a>
          <a 
            href="#" 
            className="text-white font-semibold hover:text-white/80 transition-colors"
            style={{
              textShadow: '0 0 4px rgba(255,255,255,0.4)'
            }}
          >
            ABOUT
          </a>
        </nav>
      </div>

      {/* 우측 - 로그인 버튼 */}
      <button className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors font-semibold backdrop-blur-sm"
              style={{
                boxShadow: '0 0 8px rgba(255,255,255,0.15)',
                textShadow: '0 0 4px rgba(255,255,255,0.4)'
              }}>
        ACCESS
      </button>
    </header>
  )
}