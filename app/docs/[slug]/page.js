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

  // 로딩 및 에러 처리는 기존과 동일...
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

  // 커스텀 마크다운 컴포넌트들
  const markdownComponents = {
    // 제목들
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-white mb-6 mt-8 border-b border-white/20 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-white mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-white mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-white mb-2 mt-4">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold text-white mb-2 mt-3">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold text-white mb-2 mt-3">
        {children}
      </h6>
    ),
    
    // 텍스트
    p: ({ children }) => (
      <p className="text-white/90 text-lg leading-relaxed mb-4">
        {children}
      </p>
    ),
    
    // 링크
    a: ({ children, href }) => (
      <a 
        href={href} 
        className="text-blue-300 hover:text-blue-200 underline underline-offset-2 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    
    // 강조
    strong: ({ children }) => (
      <strong className="text-white font-semibold">
        {children}
      </strong>
    ),
    
    em: ({ children }) => (
      <em className="text-white/95 italic">
        {children}
      </em>
    ),
    
    // 코드
    code: ({ children, className }) => {
      // 인라인 코드와 코드 블록 구분
      const isCodeBlock = className && className.includes('language-')
      
      if (isCodeBlock) {
        return (
          <code className={className}>
            {children}
          </code>
        )
      }
      
      return (
        <code className="text-green-300 bg-black/60 px-2 py-1 rounded text-base font-mono">
          {children}
        </code>
      )
    },
    
    pre: ({ children }) => (
      <pre className="bg-black/80 border border-white/20 rounded-lg p-4 overflow-x-auto mb-6 text-sm">
        {children}
      </pre>
    ),
    
    // 리스트
    ul: ({ children }) => (
      <ul className="text-white/90 text-lg mb-4 space-y-2 list-disc list-inside">
        {children}
      </ul>
    ),
    
    ol: ({ children }) => (
      <ol className="text-white/90 text-lg mb-4 space-y-2 list-decimal list-inside">
        {children}
      </ol>
    ),
    
    li: ({ children }) => (
      <li className="text-white/90 mb-1 leading-relaxed">
        {children}
      </li>
    ),
    
    // 인용구
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-white/40 pl-4 text-white/80 italic mb-6 bg-white/5 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    
    // 구분선
    hr: () => (
      <hr className="border-white/20 my-8" />
    ),
    
    // 테이블
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-white/90 text-base">
          {children}
        </table>
      </div>
    ),
    
    thead: ({ children }) => (
      <thead className="border-b border-white/20">
        {children}
      </thead>
    ),
    
    tbody: ({ children }) => (
      <tbody className="divide-y divide-white/10">
        {children}
      </tbody>
    ),
    
    tr: ({ children }) => (
      <tr className="hover:bg-white/5 transition-colors">
        {children}
      </tr>
    ),
    
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold text-white">
        {children}
      </th>
    ),
    
    td: ({ children }) => (
      <td className="px-4 py-3 text-white/90">
        {children}
      </td>
    ),

    // 이미지
    img: ({ src, alt }) => (
      <image 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg border border-white/20 mb-4"
      />
    )
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
          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
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