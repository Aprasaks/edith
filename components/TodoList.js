'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TodoList({ selectedDate = null }) {
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => {
    // 현재 로컬 날짜를 정확히 가져오기
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  const supabase = createClientComponentClient()

  // 선택된 날짜가 변경되면 currentDate 업데이트
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate)
    }
  }, [selectedDate])

  // 날짜가 변경될 때마다 해당 날짜의 투두 불러오기
  useEffect(() => {
    fetchTodos()
  }, [currentDate])

  // 해당 날짜의 투두 불러오기
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('date', currentDate)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('투두 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 새 할 일 추가
  const addTodo = async () => {
    if (!newTask.trim()) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            task: newTask.trim(),
            date: currentDate,
            completed: false,
            user_id: null // 현재는 사용자 인증 없이 null로 설정
          }
        ])
        .select()

      if (error) throw error
      
      setTodos(prev => [data[0], ...prev])
      setNewTask('')
    } catch (error) {
      console.error('투두 추가 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 할 일 완료 상태 토글
  const toggleTodo = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error

      setTodos(prev => 
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      )
    } catch (error) {
      console.error('투두 업데이트 실패:', error)
    }
  }

  // 할 일 삭제
  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('투두 삭제 실패:', error)
    }
  }

  // Enter 키로 추가
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
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

  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="bg-white/10 border border-white/40 rounded-2xl p-4 flex-1 text-white backdrop-blur-sm"
         style={{
           boxShadow: '0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.05)',
           textShadow: '0 0 3px rgba(255,255,255,0.3)'
         }}>
      {/* 헤더 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white"
            style={{ textShadow: '0 0 5px rgba(255,255,255,0.5)' }}>
          투두리스트
        </h3>
        <p className="text-sm opacity-80">{formatDate(currentDate)}</p>
        {todos.length > 0 && (
          <div className="flex justify-between items-center mt-2 bg-black/20 rounded px-2 py-1 border border-white/25"
               style={{ boxShadow: '0 0 6px rgba(255,255,255,0.1)' }}>
            <p className="text-xs opacity-60">진행률</p>
            <p className="text-xs text-white"
               style={{ textShadow: '0 0 4px rgba(255,255,255,0.4)' }}>
              {completedCount}/{todos.length} 완료
            </p>
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
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm bg-black/30 border border-white/30 rounded outline-none placeholder-white/60 text-white focus:border-white/50 disabled:opacity-50"
            style={{
              boxShadow: '0 0 6px rgba(255,255,255,0.1)',
              textShadow: '0 0 3px rgba(255,255,255,0.3)'
            }}
          />
          <button
            onClick={addTodo}
            disabled={loading || !newTask.trim()}
            className="px-3 py-2 bg-white/20 border border-white/40 text-white rounded text-sm font-semibold hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '0 0 8px rgba(255,255,255,0.15)',
              textShadow: '0 0 4px rgba(255,255,255,0.4)'
            }}
          >
            {loading ? '⏳' : '➕'}
          </button>
        </div>
      </div>

      {/* 투두 리스트 */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {loading && todos.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm text-white"
               style={{ textShadow: '0 0 4px rgba(255,255,255,0.3)' }}>
              로딩 중...
            </p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 opacity-60 bg-black/20 rounded border border-white/15"
               style={{ boxShadow: '0 0 6px rgba(255,255,255,0.05)' }}>
            <p className="text-sm text-white"
               style={{ textShadow: '0 0 4px rgba(255,255,255,0.3)' }}>
              아직 할 일이 없어요
            </p>
            <p className="text-xs mt-1 opacity-80">위에서 새로 추가해보세요!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 p-2 rounded transition-all border ${
                todo.completed 
                  ? 'bg-black/20 opacity-70 border-white/20' 
                  : 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50'
              }`}
              style={{
                boxShadow: todo.completed 
                  ? '0 0 4px rgba(255,255,255,0.05)' 
                  : '0 0 8px rgba(255,255,255,0.1)'
              }}
            >
              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="w-4 h-4 accent-white cursor-pointer"
                disabled={loading}
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))'
                }}
              />
              
              {/* 할 일 텍스트 */}
              <span
                className={`flex-1 text-sm cursor-pointer ${
                  todo.completed 
                    ? 'line-through opacity-60 text-white/60' 
                    : 'text-white'
                }`}
                onClick={() => !loading && toggleTodo(todo.id, todo.completed)}
                style={{
                  textShadow: todo.completed 
                    ? '0 0 2px rgba(255,255,255,0.2)' 
                    : '0 0 3px rgba(255,255,255,0.3)'
                }}
              >
                {todo.task}
              </span>
              
              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteTodo(todo.id)}
                disabled={loading}
                className="text-red-300 hover:text-red-200 transition-colors text-sm px-1 opacity-70 hover:opacity-100 disabled:opacity-50"
                style={{
                  textShadow: '0 0 3px rgba(255,100,100,0.3)',
                  filter: 'drop-shadow(0 0 2px rgba(255,100,100,0.2))'
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* 통계 */}
      {todos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/30">
          <div className="w-full bg-black/30 rounded-full h-2 border border-white/25"
               style={{ boxShadow: '0 0 6px rgba(255,255,255,0.1)' }}>
            <div 
              className="bg-gradient-to-r from-white to-white/80 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(completedCount / todos.length) * 100}%`,
                boxShadow: '0 0 8px rgba(255,255,255,0.3)'
              }}
            />
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs text-white bg-black/20 px-2 py-1 rounded border border-white/25"
                  style={{
                    boxShadow: '0 0 6px rgba(255,255,255,0.1)',
                    textShadow: '0 0 4px rgba(255,255,255,0.4)'
                  }}>
              {Math.round((completedCount / todos.length) * 100)}% 완료
            </span>
          </div>
        </div>
      )}
    </div>
  )
}