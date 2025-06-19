'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AnimatedHeader from '../../components/AnimatedHeader'
import { getAllDocuments, getCategories } from '../../lib/github'

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [docs, setDocs] = useState([])
  const [categories, setCategories] = useState(['all'])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('GitHub에서 문서 목록을 가져오는 중...')
        
        // 문서 목록과 카테고리 동시에 가져오기
        const [documentsData, categoriesData] = await Promise.all([
          getAllDocuments(),
          getCategories()
        ])
        
        console.log('가져온 문서 수:', documentsData.length)
        console.log('가져온 카테고리:', categoriesData.map(c => c.name))
        
        setDocs(documentsData)
        
        // 카테고리 목록 설정 (all + 실제 카테고리들)
        const categoryNames = ['all', ...categoriesData.map(cat => cat.name)]
        setCategories(categoryNames)
        
        console.log('문서 목록 로드 완료')
      } catch (error) {
        console.error('문서 목록 로드 실패:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 필터링된 문서들
  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = 
      (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-green-300 border-green-300/50 bg-green-300/10'
      case 'updated': return 'text-yellow-300 border-yellow-300/50 bg-yellow-300/10'
      case 'popular': return 'text-pink-300 border-pink-300/50 bg-pink-300/10'
      default: return 'text-white border-white/50 bg-white/10'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'NEW'
      case 'updated': return 'UPDATED'
      case 'popular': return 'POPULAR'
      default: return 'DOCS'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center"
           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <div className="text-white text-xl mb-4"
               style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
            GitHub에서 문서 목록을 불러오는 중...
          </div>
          <div className="text-white/60 text-sm">
            edith-docs 레포지토리를 스캔하고 있습니다
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden"
           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        <AnimatedHeader />
        
        <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-red-400 mb-4"
                style={{ textShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}>에러</h1>
            <p className="text-white/80 text-lg mb-4">문서 목록을 불러오는 중 오류가 발생했습니다</p>
            <p className="text-red-300 text-sm mb-6 bg-red-900/20 p-3 rounded border border-red-500/30">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden"
         style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* 그리드 효과 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* 헤더 */}
      <AnimatedHeader />

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 타이틀 */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>
              개발 문서 아카이브
            </h2>
            <p className="text-white/80 text-lg mb-2">
              실전 개발 경험을 바탕으로 한 기술 문서들
            </p>
            <p className="text-white/60 text-sm">
              📁 GitHub: edith-docs 레포지토리에서 실시간으로 가져옴
            </p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* 검색창 */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="문서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/50 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 8px rgba(255,255,255,0.1)',
                  textShadow: '0 0 3px rgba(255,255,255,0.3)'
                }}
              />
              <div className="absolute right-3 top-2.5 text-white/50">
                🔍
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-white/30 text-white border border-white/60'
                      : 'bg-black/30 text-white/70 border border-white/30 hover:bg-white/10'
                  }`}
                  style={{
                    boxShadow: selectedCategory === category 
                      ? '0 0 8px rgba(255,255,255,0.2)' 
                      : '0 0 4px rgba(255,255,255,0.1)',
                    textShadow: '0 0 3px rgba(255,255,255,0.3)'
                  }}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 결과 표시 */}
          {searchTerm && (
            <div className="mb-4 text-white/60 text-sm">
              {searchTerm} 검색 결과: {filteredDocs.length}개 문서
            </div>
          )}

          {/* 문서 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map(doc => (
              <Link href={`/docs/${doc.slug}`} key={doc.id || doc.slug}>
                <div className="bg-black/40 border border-white/30 rounded-xl p-6 backdrop-blur-sm hover:border-white/50 hover:bg-black/50 transition-all duration-300 cursor-pointer group"
                     style={{
                       boxShadow: '0 0 10px rgba(255,255,255,0.1)'
                     }}>
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors"
                          style={{ textShadow: '0 0 4px rgba(255,255,255,0.4)' }}>
                        {doc.title || 'Untitled'}
                      </h3>
                      <p className="text-white/70 text-sm mt-1">
                        {doc.description || 'No description'}
                      </p>
                    </div>
                    {doc.status && (
                      <div className={`ml-3 px-2 py-1 rounded text-xs font-bold border ${getStatusColor(doc.status)}`}
                           style={{
                             boxShadow: '0 0 5px rgba(255,255,255,0.2)',
                             textShadow: '0 0 3px rgba(255,255,255,0.3)'
                           }}>
                        {getStatusText(doc.status)}
                      </div>
                    )}
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <span>{doc.date || 'No date'}</span>
                    <span>{doc.readTime || 'Unknown'}</span>
                  </div>

                  {/* 태그 */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded border border-white/20"
                          style={{
                            boxShadow: '0 0 4px rgba(255,255,255,0.1)',
                            textShadow: '0 0 2px rgba(255,255,255,0.3)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 카테고리와 GitHub 정보 */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">
                      📁 {doc.category || 'Uncategorized'}
                    </span>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <span>GitHub</span>
                      <div className="text-white/50 group-hover:text-white transition-colors"
                           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredDocs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg mb-4"
                   style={{ textShadow: '0 0 4px rgba(255,255,255,0.3)' }}>
                {searchTerm ? '검색 결과가 없습니다' : '문서가 없습니다'}
              </div>
              <p className="text-white/40">
                {searchTerm 
                  ? '다른 키워드나 카테고리를 선택해보세요' 
                  : 'GitHub edith-docs 레포지토리에 문서를 추가해보세요'
                }
              </p>
            </div>
          )}

          {/* 통계 */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 border border-white/25 rounded-lg p-4 text-center"
                 style={{ boxShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-bold text-white mb-1"
                   style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
                {docs.length}
              </div>
              <div className="text-white/60 text-sm">
                전체 문서
              </div>
            </div>
            <div className="bg-black/30 border border-white/25 rounded-lg p-4 text-center"
                 style={{ boxShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-bold text-white mb-1"
                   style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
                {categories.length - 1}
              </div>
              <div className="text-white/60 text-sm">
                카테고리
              </div>
            </div>
            <div className="bg-black/30 border border-white/25 rounded-lg p-4 text-center"
                 style={{ boxShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-bold text-white mb-1"
                   style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
                {docs.filter(doc => doc.status === 'new').length}
              </div>
              <div className="text-white/60 text-sm">
                새 문서
              </div>
            </div>
            <div className="bg-black/30 border border-white/25 rounded-lg p-4 text-center"
                 style={{ boxShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-bold text-white mb-1"
                   style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
                {docs.length > 0 
                  ? Math.round(
                      docs
                        .filter(doc => doc.readTime)
                        .reduce((acc, doc) => {
                          const minutes = parseInt(doc.readTime.replace(/\D/g, '')) || 0
                          return acc + minutes
                        }, 0) / docs.filter(doc => doc.readTime).length || 0
                    )
                  : 0
                }
              </div>
              <div className="text-white/60 text-sm">
                평균 읽기시간(분)
              </div>
            </div>
          </div>

          {/* GitHub 연동 정보 */}
          <div className="mt-8 text-center text-white/40 text-sm">
            <p>
              📡 실시간으로 
              <a 
                href="https://github.com/Aprasaks/edith-docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 mx-1"
              >
                GitHub edith-docs
              </a> 
              레포지토리에서 가져옴
            </p>
            <p className="mt-1 text-xs">
              캐시: 1시간 | 마지막 업데이트: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}