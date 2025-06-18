'use client'

import { useState, useEffect, useRef } from 'react'

export default function VoiceRecognition({ onEdithDetected }) {
  const [isListening, setIsListening] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false) // 완료 플래그
  const recognitionRef = useRef(null)

  useEffect(() => {
    // 이미 완료되었으면 아무것도 하지 않음
    if (isCompleted) {
      console.log('음성 인식 이미 완료됨')
      return
    }

    // 웹킷 음성 인식만 사용 (간단하게)
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false // 연속 듣기 OFF
      recognition.interimResults = false // 중간 결과 OFF
      recognition.lang = 'ko-KR'
      recognition.maxAlternatives = 1
      
      recognition.onstart = () => {
        setIsListening(true)
        console.log('음성 인식 시작')
      }
      
      recognition.onend = () => {
        setIsListening(false)
        console.log('음성 인식 종료')
        
        // 이디스가 아직 감지되지 않았으면 재시작
        if (!isCompleted && recognitionRef.current) {
          setTimeout(() => {
            if (!isCompleted && recognitionRef.current) {
              try {
                console.log('음성 인식 재시작 - 이디스 대기 중')
                recognitionRef.current.start()
              } catch (err) {
                console.log('재시작 실패:', err)
              }
            }
          }, 1000) // 1초 후 재시작
        } else {
          console.log('음성 인식 완전 종료됨')
        }
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        console.log('인식된 음성:', transcript)
        
        // "시스템" 또는 "이디스" 감지
        if (transcript.includes('시스템') || transcript.includes('이디스')) {
          console.log('키워드 감지! 완료:', transcript)
          setIsCompleted(true) // 완료 플래그 설정
          
          // recognition 완전히 정리
          recognition.stop()
          recognition.abort()
          recognitionRef.current = null // 참조 제거
          
          onEdithDetected() // 콜백 호출
        }
      }
      
      recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error)
        setIsListening(false)
        
        // no-speech 오류는 정상적인 상황이므로 무시
        if (event.error === 'no-speech') {
          console.log('음성 없음 - 정상적으로 재시작 예정')
          return // 아무것도 하지 않음 (onend에서 자동 재시작)
        }
        
        // 권한 관련 오류는 완전 중단
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          console.error('마이크 권한 거부됨')
          setIsCompleted(true)
          recognitionRef.current = null
          alert('마이크 권한이 필요합니다.')
          return
        }
        
        // 기타 오류도 로그만 출력하고 계속 진행
        console.log('기타 오류이지만 계속 진행:', event.error)
      }
      
      // 1초 후 시작
      setTimeout(() => {
        try {
          recognition.start()
        } catch (err) {
          console.error('시작 실패:', err)
        }
      }, 1000)
      
      // 클린업
      return () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop()
            recognitionRef.current = null
          } catch (err) {
            console.log('클린업 오류:', err)
          }
        }
      }
    }
  }, []) // 의존성 배열 비움 - 한번만 실행

  // 수동 테스트 버튼
  const testEdith = () => {
    console.log('테스트 버튼으로 이디스 활성화')
    setIsCompleted(true)
    
    // recognition 완전히 정리
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        recognitionRef.current.abort()
        recognitionRef.current = null
      } catch (err) {
        console.log('테스트 버튼 정리 오류:', err)
      }
    }
    
    onEdithDetected()
  }

  return (
    <div>
      
    </div>
  )
}