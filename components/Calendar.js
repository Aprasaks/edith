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
    <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-4 flex-1 text-cyan-400 backdrop-blur-sm shadow-2xl shadow-cyan-400/20">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-bold bg-black/30 w-8 h-8 rounded border border-cyan-400/20 hover:border-cyan-400/40"
        >
          ‹
        </button>
        <div className="text-center bg-black/30 px-3 py-1 rounded border border-cyan-400/20">
          <h3 className="text-lg font-semibold text-cyan-300">{currentMonth}</h3>
          <p className="text-sm opacity-80">{currentYear}</p>
        </div>
        <button 
          onClick={goToNextMonth}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-bold bg-black/30 w-8 h-8 rounded border border-cyan-400/20 hover:border-cyan-400/40"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName, index) => (
          <div 
            key={dayName} 
            className={`text-xs text-center py-1 font-semibold bg-black/20 rounded border border-cyan-400/10 ${
              index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-cyan-400'
            }`}
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
                ? 'bg-cyan-400/30 text-cyan-200 font-bold shadow-lg border-cyan-400 shadow-cyan-400/30' 
                : 'hover:bg-cyan-400/10 border-cyan-400/20 hover:border-cyan-400/40'
              }
              ${index % 7 === 0 && day ? 'text-red-400' : ''}
              ${index % 7 === 6 && day ? 'text-blue-400' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 오늘 날짜 표시 */}
      <div className="mt-3 text-center bg-black/20 rounded border border-cyan-400/20 py-2">
        <p className="text-xs opacity-60 text-cyan-300">
          오늘: {today.getMonth() + 1}월 {today.getDate()}일 
        </p>
      </div>
    </div>
  )
}