'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedHeader from '../../components/AnimatedHeader'

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 예시 문서 데이터 (실제로는 GitHub API나 CMS에서 가져올 데이터)
  const docs = [
    {
      id: 1,
      slug: "react-hooks-guide",
      title: "React Hooks 완벽 가이드",
      description: "useState, useEffect부터 커스텀 훅까지 React Hooks의 모든 것",
      category: "React",
      date: "2024-12-15",
      readTime: "15min",
      tags: ["React", "Hooks", "Frontend"],
      status: "updated"
    },
    {
      id: 2,
      slug: "nextjs-app-router",
      title: "Next.js 14 App Router 마이그레이션",
      description: "Pages Router에서 App Router로 안전하게 마이그레이션하는 방법",
      category: "Next.js",
      date: "2024-12-10",
      readTime: "20min",
      tags: ["Next.js", "Migration", "App Router"],
      status: "new"
    },
    {
      id: 3,
      title: "TypeScript 고급 타입 시스템",
      description: "제네릭, 유틸리티 타입, 조건부 타입 등 고급 TypeScript 패턴",
      category: "TypeScript",
      date: "2024-12-08",
      readTime: "25min",
      tags: ["TypeScript", "Types", "Advanced"],
      status: "popular"
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox 완벽 비교",
      description: "언제 Grid를 쓰고 언제 Flexbox를 써야 하는지 실용적 가이드",
      category: "CSS",
      date: "2024-12-05",
      readTime: "12min",
      tags: ["CSS", "Layout", "Grid", "Flexbox"],
      status: "updated"
    },
    {
      id: 5,
      title: "JavaScript 비동기 처리 마스터하기",
      description: "Promise, async/await, 에러 핸들링까지 비동기의 모든 것",
      category: "JavaScript",
      date: "2024-12-01",
      readTime: "18min",
      tags: ["JavaScript", "Async", "Promise"],
      status: "popular"
    },
    {
      id: 6,
      title: "Git 워크플로우 최적화 가이드",
      description: "팀 개발을 위한 효율적인 Git 브랜치 전략과 워크플로우",
      category: "DevOps",
      date: "2024-11-28",
      readTime: "22min",
      tags: ["Git", "Workflow", "DevOps"],
      status: "new"
    },
    {
      id: 7,
      title: "Docker 컨테이너 최적화 기법",
      description: "이미지 크기 줄이기부터 멀티스테이지 빌드까지",
      category: "DevOps",
      date: "2024-11-25",
      readTime: "16min",
      tags: ["Docker", "Container", "Optimization"],
      status: "updated"
    },
    {
      id: 8,
      title: "웹 성능 최적화 체크리스트",
      description: "Core Web Vitals 개선을 위한 실전 최적화 기법들",
      category: "Performance",
      date: "2024-11-20",
      readTime: "14min",
      tags: ["Performance", "Web Vitals", "Optimization"],
      status: "popular"
    }
  ]

  const categories = ['all', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'DevOps', 'Performance']

  // 필터링된 문서들
  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <p className="text-white/80 text-lg">
              실전 개발 경험을 바탕으로 한 기술 문서들
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

          {/* 문서 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map(doc => (
              <Link href={`/docs/${doc.slug}`} key={doc.id}>
                <div className="bg-black/40 border border-white/30 rounded-xl p-6 backdrop-blur-sm hover:border-white/50 hover:bg-black/50 transition-all duration-300 cursor-pointer group"
                     style={{
                       boxShadow: '0 0 10px rgba(255,255,255,0.1)'
                     }}>
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors"
                        style={{ textShadow: '0 0 4px rgba(255,255,255,0.4)' }}>
                      {doc.title}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {doc.description}
                    </p>
                  </div>
                  <div className={`ml-3 px-2 py-1 rounded text-xs font-bold border ${getStatusColor(doc.status)}`}
                       style={{
                         boxShadow: '0 0 5px rgba(255,255,255,0.2)',
                         textShadow: '0 0 3px rgba(255,255,255,0.3)'
                       }}>
                    {getStatusText(doc.status)}
                  </div>
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <span>{doc.date}</span>
                  <span>{doc.readTime}</span>
                </div>

                {/* 태그 */}
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

                {/* 카테고리 */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">
                    📁 {doc.category}
                  </span>
                  <div className="text-white/50 group-hover:text-white transition-colors"
                       style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
                    →
                  </div>
                </div>
                              </div>
              </Link>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg mb-4"
                   style={{ textShadow: '0 0 4px rgba(255,255,255,0.3)' }}>
                검색 결과가 없습니다
              </div>
              <p className="text-white/40">
                다른 키워드나 카테고리를 선택해보세요
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
                {Math.round(docs.reduce((acc, doc) => acc + parseInt(doc.readTime), 0) / docs.length)}
              </div>
              <div className="text-white/60 text-sm">
                평균 읽기시간(분)
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}