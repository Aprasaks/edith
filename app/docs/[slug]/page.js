'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AnimatedHeader from '../../../components/AnimatedHeader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm' 
import rehypeHighlight from 'rehype-highlight'
import { getDocumentBySlug } from '../../../lib/github'
import 'highlight.js/styles/github-dark.css'

export default function DocDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDocument() {
      try {
        setIsLoading(true)
        setError(null)
        
        const slug = params.slug
        console.log('문서 슬러그:', slug)
        
        const documentData = await getDocumentBySlug(slug)
        
        if (documentData) {
          // GitHub API에서 가져온 데이터를 기존 형태로 변환
          const formattedDoc = {
            id: documentData.metadata.slug || slug,
            title: documentData.metadata.title,
            description: documentData.metadata.description,
            category: documentData.metadata.category,
            date: documentData.metadata.date,
            readTime: documentData.metadata.readTime,
            tags: documentData.metadata.tags || [],
            status: documentData.metadata.status,
            author: documentData.metadata.author,
            content: documentData.content,
            // 추가 정보
            lastModified: documentData.lastModified,
            size: documentData.size
          }
          
          setDoc(formattedDoc)
          console.log('문서 로드 성공:', formattedDoc.title)
        } else {
          console.log('문서를 찾을 수 없습니다:', slug)
          setDoc(null)
        }
      } catch (error) {
        console.error('문서 로드 실패:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchDocument()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center"
           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
        <div className="text-center">
          <div className="animate-pulse text-white text-xl mb-4"
               style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
            GitHub에서 문서를 불러오는 중...
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
                 style={{ boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.2s', boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.4s', boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
          </div>
          <p className="text-white/60 text-sm mt-4">
            edith-docs 레포지토리에서 가져오는 중...
          </p>
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
            <p className="text-white/80 text-lg mb-4">문서를 불러오는 중 오류가 발생했습니다</p>
            <p className="text-red-300 text-sm mb-6 bg-red-900/20 p-3 rounded border border-red-500/30">
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                다시 시도
              </button>
              <button 
                onClick={() => router.push('/docs')}
                className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                ← 문서 목록으로
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!doc) {
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
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>404</h1>
            <p className="text-white/80 text-lg mb-2">문서를 찾을 수 없습니다</p>
            <p className="text-white/60 text-sm mb-6">
              요청한 문서가 edith-docs 레포지토리에 존재하지 않습니다.
            </p>
            <button 
              onClick={() => router.push('/docs')}
              className="bg-white/20 border border-white/40 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors font-semibold"
              style={{
                boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                textShadow: '0 0 4px rgba(255,255,255,0.6)'
              }}
            >
              ← 문서 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

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

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 max-w-4xl mx-auto p-6">
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={() => router.push('/docs')}
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          문서 목록으로 돌아가기
        </button>

        {/* GitHub 소스 표시 */}
        <div className="mb-4 text-xs text-white/40 flex items-center gap-2">
          <span>📁 GitHub:</span>
          <span>edith-docs/{doc.category?.toLowerCase()}/{params.slug}.md</span>
          {doc.lastModified && (
            <span className="ml-auto">SHA: {doc.lastModified.slice(0, 7)}</span>
          )}
        </div>

        {/* 문서 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>
              {doc.title}
            </h1>
            <div className={`px-3 py-1 rounded text-sm font-bold border ${getStatusColor(doc.status)}`}
                 style={{
                   boxShadow: '0 0 6px rgba(255,255,255,0.2)',
                   textShadow: '0 0 3px rgba(255,255,255,0.4)'
                 }}>
              {getStatusText(doc.status)}
            </div>
          </div>
          
          <p className="text-white/80 text-lg mb-6">
            {doc.description}
          </p>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-6">
            <span>📅 {doc.date}</span>
            <span>⏱️ {doc.readTime}</span>
            <span>✍️ {doc.author}</span>
            <span>📁 {doc.category}</span>
            {doc.size && <span>📄 {(doc.size / 1024).toFixed(1)}KB</span>}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2">
            {doc.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-white/25"
                style={{
                  boxShadow: '0 0 4px rgba(255,255,255,0.2)',
                  textShadow: '0 0 2px rgba(255,255,255,0.4)'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 문서 내용 */}
        <article className="bg-black/30 border border-white/25 rounded-xl p-8 backdrop-blur-sm"
                 style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
          <div 
            className="prose prose-lg prose-invert max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
              prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
              prose-p:text-white/90 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-4
              prose-code:text-green-300 prose-code:bg-black/60 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base
              prose-pre:bg-black/80 prose-pre:border prose-pre:border-white/20 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:mb-6
              prose-blockquote:border-l-white/40 prose-blockquote:text-white/80 prose-blockquote:pl-4 prose-blockquote:mb-6
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-blue-300 prose-a:no-underline hover:prose-a:text-blue-200
              prose-ul:text-white/90 prose-ul:text-lg prose-ul:mb-4 prose-ul:space-y-2
              prose-ol:text-white/90 prose-ol:text-lg prose-ol:mb-4 prose-ol:space-y-2
              prose-li:text-white/90 prose-li:mb-1
              prose-table:text-white/90 prose-table:text-lg
              prose-thead:border-white/20
              prose-tbody:border-white/20
            "
            style={{ 
              textShadow: '0 0 2px rgba(255,255,255,0.3)',
              lineHeight: '1.8'
            }}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({children}) => <h1 style={{fontSize: '2.25rem', marginBottom: '1.5rem', color: 'white', fontWeight: '600'}}>{children}</h1>,
                h2: ({children}) => <h2 style={{fontSize: '1.875rem', marginBottom: '1rem', marginTop: '2rem', color: 'white', fontWeight: '600'}}>{children}</h2>,
                h3: ({children}) => <h3 style={{fontSize: '1.5rem', marginBottom: '0.75rem', marginTop: '1.5rem', color: 'white', fontWeight: '600'}}>{children}</h3>,
                p: ({children}) => <p style={{fontSize: '1.125rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.75'}}>{children}</p>,
                ul: ({children}) => <ul style={{fontSize: '1.125rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)'}}>{children}</ul>,
                ol: ({children}) => <ol style={{fontSize: '1.125rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)'}}>{children}</ol>,
                li: ({children}) => <li style={{marginBottom: '0.25rem', color: 'rgba(255,255,255,0.9)'}}>{children}</li>,
                strong: ({children}) => <strong style={{color: 'white', fontWeight: '600'}}>{children}</strong>,
                a: ({children, href}) => <a href={href} style={{color: 'rgb(147, 197, 253)', textDecoration: 'none'}}>{children}</a>
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* 문서 하단 네비게이션 */}
        <footer className="mt-12 pt-8 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              마지막 업데이트: {doc.date}
              {doc.lastModified && (
                <span className="ml-4 text-white/40">
                  Git SHA: {doc.lastModified.slice(0, 7)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const githubUrl = `https://github.com/Aprasaks/edith-docs/blob/main/${doc.category?.toLowerCase()}/${params.slug}.md`
                  window.open(githubUrl, '_blank')
                }}
                className="text-white/80 hover:text-white transition-colors text-sm"
                style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}
              >
                📤 GitHub에서 보기
              </button>
              <button 
                onClick={() => {
                  const githubEditUrl = `https://github.com/Aprasaks/edith-docs/edit/main/${doc.category?.toLowerCase()}/${params.slug}.md`
                  window.open(githubEditUrl, '_blank')
                }}
                className="text-white/80 hover:text-white transition-colors text-sm"
                style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}
              >
                📝 GitHub에서 수정
              </button>
              <button className="text-white/80 hover:text-white transition-colors text-sm"
                      style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}>
                ⭐ 즐겨찾기
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}