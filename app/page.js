'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AnimatedHeader from '../components/AnimatedHeader'
import Calendar from '../components/Calendar'
import TodoList from '../components/TodoList'
import VoiceRecognition from '../components/VoiceRecognition'

import EdithChat from '../components/EdithChat'

const SplineViewer = dynamic(
  () => import("../components/SplineViewer"),
  { ssr: false }
)

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isEdithActive, setIsEdithActive] = useState(false)

  // 이디스 호출시 실행되는 함수 (한번만)
  const handleEdithDetected = () => {
    setIsEdithActive(true)
    
    // TTS로 "안녕하세요, 주인님!" 음성 출력
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('안녕하세요, 주인님!')
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8  // 조금 더 천천히
      utterance.pitch = 1.2  // 음성을 더 높게 (여성스럽게)
      utterance.volume = 0.9  // 볼륨 조정
      
      // 사용 가능한 음성 중에서 여성 음성 찾기
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('ko') && 
        (voice.name.includes('Female') || voice.name.includes('여성') || voice.name.includes('Google'))
      )
      
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
      
      speechSynthesis.speak(utterance)
    }
    
    console.log('이디스 활성화됨! 음성 인식 종료됨!')
  }

  return (
    <div className="h-screen bg-black text-cyan-400 relative overflow-hidden flex flex-col">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* 간단한 그리드 효과 */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      {/* 애니메이션 헤더 */}
      <div className="relative z-10 flex-shrink-0">
        <AnimatedHeader />
      </div>

      {/* 메인 컨테이너 */}
      <main className="relative z-10 p-6 flex-1 flex gap-6 min-h-0">
        {/* 좌측 - 시스템 상태 + 채팅창 */}
        <div className="w-1/4 flex flex-col gap-6">
          {/* 상단 - 시스템 상태 */}
          <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-sm shadow-2xl shadow-cyan-400/20 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-3 text-cyan-300">시스템 상태</h2>
            <div className="space-y-3">
              <div className="bg-black/30 p-2 rounded border border-cyan-400/20 text-center">
                <p className="text-lg font-bold text-cyan-400">12</p>
                <p className="text-xs opacity-80">활성 모듈</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-cyan-400/20 text-center">
                <p className="text-lg font-bold text-cyan-400">1.2k</p>
                <p className="text-xs opacity-80">데이터 스트림</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-cyan-400/20 text-center">
                <p className="text-lg font-bold text-cyan-400">96</p>
                <p className="text-xs opacity-80">연속 운영일</p>
              </div>
            </div>
          </div>

          {/* 하단 - 이디스 채팅창 */}
          <div className="flex-1 min-h-0">
            <EdithChat isActive={isEdithActive} />
          </div>
        </div>

        {/* 중앙 - 이디스 홀로그램 영역 */}
        <div className="flex-1">
          <div className="bg-black/40 border border-cyan-400/50 rounded-2xl h-full flex flex-col justify-center items-center relative overflow-hidden backdrop-blur-md shadow-2xl shadow-cyan-400/30">
            
            {!isEdithActive ? (
              // 이디스 비활성 상태 - 빈 화면
              <div className="text-center space-y-4">
                <p className="text-cyan-400/60 font-mono">시스템을 활성화하세요</p>
                
                {/* 이디스 호출 버튼 */}
                <button
                  onClick={handleEdithDetected}
                  className="mt-6 px-6 py-3 bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/30 transition-all transform hover:scale-105"
                >
                  🧠 E.D.I.T.H 활성화
                </button>
                
                <div className="flex justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              // 이디스 활성 상태 - 뇌 홀로그램
              <>
                {/* Spline 배경 - 전체를 덮음 + 마우스 인터랙션 가능 */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden z-5">
                  <SplineViewer url="https://prod.spline.design/s3N3zSfzU5A4pDp2/scene.splinecode"/>
                </div>
                
                {/* 홀로그램 오버레이 효과들 - 마우스 이벤트 차단하지 않음 */}
                <div className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-cyan-400/3 to-transparent pointer-events-none z-10"></div>
                
                
                {/* HUD 오버레이 */}
                <div className="absolute top-4 left-4 space-y-1 z-30 opacity-80 pointer-events-none">
                  <div className="text-xs text-cyan-400 font-mono bg-black/70 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur-sm">
                    NEURAL_SCAN: ACTIVE
                  </div>
                  <div className="text-xs text-cyan-400 font-mono bg-black/70 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur-sm">
                    STATUS: ONLINE
                  </div>
                  <div className="text-xs text-cyan-400 font-mono bg-black/70 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur-sm animate-pulse">
                    BRAIN_ACTIVITY: 87%
                  </div>
                </div>
                
                {/* 우측 상단 HUD */}
                <div className="absolute top-4 right-4 space-y-1 z-30 opacity-80 pointer-events-none">
                  <div className="text-xs text-cyan-400 font-mono bg-black/70 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur-sm">
                    RESOLUTION: 4K
                  </div>
                  <div className="text-xs text-cyan-400 font-mono bg-black/70 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur-sm">
                    FPS: 60
                  </div>
                </div>
                
                {/* 하단 상태 표시 */}
                <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
                  <div className="bg-black/70 border border-cyan-400/40 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-center text-cyan-300 font-mono">시스템 활성화 완료</p>
                    <div className="flex justify-center mt-2">
                      <button 
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors pointer-events-auto"
                        onClick={() => setIsEdithActive(false)}
                      >
                        비활성화
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 스캔라인 효과 */}
                <div className="absolute inset-0 pointer-events-none z-15">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse" 
                       style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse"
                       style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse"
                       style={{ animationDelay: '1.5s' }}></div>
                </div>
                
                {/* 코너 프레임 효과 */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-60 z-15 pointer-events-none"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400 opacity-60 z-15 pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-60 z-15 pointer-events-none"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-60 z-15 pointer-events-none"></div>
              </>
            )}
          </div>
        </div>

        {/* 우측 - 달력 & 투두리스트 */}
        <div className="w-1/4 flex flex-col gap-6">
          {/* 달력 */}
          <Calendar onDateSelect={setSelectedDate} />

          {/* 투두리스트 */}
          <TodoList selectedDate={selectedDate} />
        </div>
      </main>
      
      {/* 음성 인식 */}
      <VoiceRecognition onEdithDetected={handleEdithDetected} />
    </div>
  )
}