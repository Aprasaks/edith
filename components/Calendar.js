'use client'

import { useState, useEffect } from 'react'

export default function Calendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [today] = useState(new Date())

  // 달력 데이터 생성
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const days = getDaysInMonth(currentDate)
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    if (!day) return
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // 시간대 문제 해결을 위해 로컬 날짜로 변환
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    onDateSelect?.(dateString)
  }
  
  const isToday = (day) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white/10 border border-white/40 rounded-2xl p-4 flex-1 text-white backdrop-blur-sm"
         style={{
           boxShadow: '0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.05)',
           textShadow: '0 0 3px rgba(255,255,255,0.3)'
         }}>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="text-white hover:text-white/80 transition-colors text-lg font-bold bg-black/30 w-8 h-8 rounded border border-white/30 hover:border-white/50"
          style={{
            boxShadow: '0 0 6px rgba(255,255,255,0.15)',
            textShadow: '0 0 4px rgba(255,255,255,0.4)'
          }}
        >
          ‹
        </button>
        <div className="text-center bg-black/30 px-3 py-1 rounded border border-white/30"
             style={{
               boxShadow: '0 0 8px rgba(255,255,255,0.1)'
             }}>
          <h3 className="text-lg font-semibold text-white"
              style={{ textShadow: '0 0 5px rgba(255,255,255,0.5)' }}>
            {currentMonth}
          </h3>
          <p className="text-sm opacity-80">{currentYear}</p>
        </div>
        <button 
          onClick={goToNextMonth}
          className="text-white hover:text-white/80 transition-colors text-lg font-bold bg-black/30 w-8 h-8 rounded border border-white/30 hover:border-white/50"
          style={{
            boxShadow: '0 0 6px rgba(255,255,255,0.15)',
            textShadow: '0 0 4px rgba(255,255,255,0.4)'
          }}
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName, index) => (
          <div 
            key={dayName} 
            className={`text-xs text-center py-1 font-semibold bg-black/20 rounded border border-white/20 ${
              index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : 'text-white'
            }`}
            style={{
              textShadow: '0 0 3px rgba(255,255,255,0.3)',
              boxShadow: '0 0 4px rgba(255,255,255,0.05)'
            }}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              text-xs text-center py-2 rounded cursor-pointer transition-all border
              ${!day ? 'invisible' : ''}
              ${isToday(day) 
                ? 'bg-white/30 text-white font-bold border-white/60' 
                : 'hover:bg-white/10 border-white/20 hover:border-white/40'
              }
              ${index % 7 === 0 && day ? 'text-red-300' : ''}
              ${index % 7 === 6 && day ? 'text-blue-300' : ''}
            `}
            style={{
              textShadow: day ? '0 0 3px rgba(255,255,255,0.3)' : '',
              boxShadow: isToday(day) 
                ? '0 0 10px rgba(255,255,255,0.2), inset 0 0 5px rgba(255,255,255,0.1)' 
                : day ? '0 0 4px rgba(255,255,255,0.05)' : ''
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 오늘 날짜 표시 */}
      <div className="mt-3 text-center bg-black/20 rounded border border-white/25 py-2"
           style={{
             boxShadow: '0 0 8px rgba(255,255,255,0.1)'
           }}>
        <p className="text-xs opacity-80 text-white"
           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
          오늘: {today.getMonth() + 1}월 {today.getDate()}일 
        </p>
      </div>
    </div>
  )
}