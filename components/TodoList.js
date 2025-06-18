'use client'

import { useState, useEffect } from 'react'

export default function TodoList({ selectedDate = null }) {
  const [todos, setTodos] = useState({})
  const [newTask, setNewTask] = useState('')
  const [currentDate, setCurrentDate] = useState(() => {
    // 현재 로컬 날짜를 정확히 가져오기
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  // 선택된 날짜가 변경되면 currentDate 업데이트
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate)
    }
  }, [selectedDate])

  // 현재 날짜의 투두 가져오기
  const getCurrentTodos = () => {
    return todos[currentDate] || []
  }

  // 새 할 일 추가
  const addTodo = () => {
    if (!newTask.trim()) return

    const newTodo = {
      id: Date.now(), // 임시 ID
      task: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => ({
      ...prev,
      [currentDate]: [...(prev[currentDate] || []), newTodo]
    }))

    setNewTask('')
  }

  // 할 일 완료 상태 토글
  const toggleTodo = (id) => {
    setTodos(prev => ({
      ...prev,
      [currentDate]: prev[currentDate]?.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ) || []
    }))
  }

  // 할 일 삭제
  const deleteTodo = (id) => {
    setTodos(prev => ({
      ...prev,
      [currentDate]: prev[currentDate]?.filter(todo => todo.id !== id) || []
    }))
  }

  // Enter 키로 추가
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    // 시간대 문제 해결을 위해 직접 파싱
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const monthNum = date.getMonth() + 1
    const dayNum = date.getDate()
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const weekday = weekdays[date.getDay()]
    
    return `${monthNum}월 ${dayNum}일 (${weekday})`
  }

  const currentTodos = getCurrentTodos()
  const completedCount = currentTodos.filter(todo => todo.completed).length

  return (
    <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-4 flex-1 text-cyan-400 backdrop-blur-sm shadow-2xl shadow-cyan-400/20">
      {/* 헤더 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-cyan-300">투두리스트</h3>
        <p className="text-sm opacity-80">{formatDate(currentDate)}</p>
        {currentTodos.length > 0 && (
          <div className="flex justify-between items-center mt-2 bg-black/20 rounded px-2 py-1 border border-cyan-400/20">
            <p className="text-xs opacity-60">진행률</p>
            <p className="text-xs text-cyan-300">{completedCount}/{currentTodos.length} 완료</p>
          </div>
        )}
      </div>

      {/* 새 할 일 추가 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="새 할 일 입력..."
            className="flex-1 px-3 py-2 text-sm bg-black/30 border border-cyan-400/30 rounded outline-none placeholder-cyan-400/60 text-cyan-300 focus:border-cyan-400/60"
          />
          <button
            onClick={addTodo}
            className="px-3 py-2 bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 rounded text-sm font-semibold hover:bg-cyan-400/30 transition-colors"
          >
            ➕
          </button>
        </div>
      </div>

      {/* 투두 리스트 */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {currentTodos.length === 0 ? (
          <div className="text-center py-8 opacity-60 bg-black/20 rounded border border-cyan-400/10">
            <p className="text-sm text-cyan-300">아직 할 일이 없어요</p>
            <p className="text-xs mt-1 opacity-80">위에서 새로 추가해보세요!</p>
          </div>
        ) : (
          currentTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 p-2 rounded transition-all border ${
                todo.completed 
                  ? 'bg-black/20 opacity-70 border-cyan-400/20' 
                  : 'bg-cyan-400/10 hover:bg-cyan-400/20 border-cyan-400/30 hover:border-cyan-400/50'
              }`}
            >
              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
              
              {/* 할 일 텍스트 */}
              <span
                className={`flex-1 text-sm cursor-pointer ${
                  todo.completed 
                    ? 'line-through opacity-60 text-cyan-400/60' 
                    : 'text-cyan-300'
                }`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.task}
              </span>
              
              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300 transition-colors text-sm px-1 opacity-70 hover:opacity-100"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* 통계 */}
      {currentTodos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-cyan-400/30">
          <div className="w-full bg-black/30 rounded-full h-2 border border-cyan-400/20">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-cyan-300 h-2 rounded-full transition-all duration-300 shadow-sm shadow-cyan-400/50"
              style={{ width: `${(completedCount / currentTodos.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs text-cyan-300 bg-black/20 px-2 py-1 rounded border border-cyan-400/20">
              {Math.round((completedCount / currentTodos.length) * 100)}% 완료
            </span>
          </div>
        </div>
      )}
    </div>
  )
}