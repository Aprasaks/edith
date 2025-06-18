'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AnimatedHeader from '../../../components/AnimatedHeader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm' 
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function DocDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 예시 문서 데이터 (실제로는 MDX 파일이나 CMS에서 가져올 데이터)
  const docs = {
    'react-hooks-guide': {
      id: 1,
      title: "React Hooks 완벽 가이드",
      description: "useState, useEffect부터 커스텀 훅까지 React Hooks의 모든 것",
      category: "React",
      date: "2024-12-15",
      readTime: "15min",
      tags: ["React", "Hooks", "Frontend"],
      status: "updated",
      author: "DemianDev",
      content: `
# React Hooks 완벽 가이드

React Hooks는 함수형 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있게 해주는 강력한 기능입니다.

## 목차
1. [useState 훅](#usestate-훅)
2. [useEffect 훅](#useeffect-훅)
3. [커스텀 훅 만들기](#커스텀-훅-만들기)
4. [최적화 팁](#최적화-팁)

## useState 훅

\`useState\`는 가장 기본적인 훅으로, 함수형 컴포넌트에서 상태를 관리할 수 있게 해줍니다.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
\`\`\`

### 주요 특징
- **불변성 유지**: 상태를 직접 수정하지 말고 항상 새로운 값으로 설정
- **함수형 업데이트**: 이전 상태를 기반으로 업데이트할 때는 함수를 사용

\`\`\`jsx
// 좋은 예
setCount(prevCount => prevCount + 1);

// 나쁜 예
setCount(count + 1); // 비동기 업데이트 시 문제 발생 가능
\`\`\`

## useEffect 훅

\`useEffect\`는 사이드 이펙트를 처리하는 훅입니다. 컴포넌트가 렌더링된 후에 실행됩니다.

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]); // userId가 변경될 때마다 실행

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

### 의존성 배열 이해하기
- **빈 배열 []**: 컴포넌트 마운트 시에만 실행
- **배열 없음**: 매 렌더링마다 실행
- **[value]**: value가 변경될 때마다 실행

## 커스텀 훅 만들기

반복되는 로직을 커스텀 훅으로 추출하여 재사용할 수 있습니다.

\`\`\`jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('localStorage에서 데이터를 읽는데 실패했습니다:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage에 데이터를 저장하는데 실패했습니다:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
\`\`\`

### 사용 예시

\`\`\`jsx
import useLocalStorage from './hooks/useLocalStorage';

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'ko');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">라이트</option>
        <option value="dark">다크</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
\`\`\`

## 최적화 팁

### 1. 불필요한 리렌더링 방지

\`\`\`jsx
import { memo, useCallback, useMemo } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
\`\`\`

### 2. 조건부 실행

\`\`\`jsx
useEffect(() => {
  if (!shouldFetch) return;
  
  fetchData();
}, [shouldFetch, fetchData]);
\`\`\`

### 3. 클린업 함수 활용

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('1초마다 실행');
  }, 1000);

  // 클린업 함수
  return () => {
    clearInterval(timer);
  };
}, []);
\`\`\`

## 마무리

React Hooks는 함수형 컴포넌트의 가능성을 크게 확장시켜주는 강력한 도구입니다. 
올바른 사용법을 익히고 최적화 기법을 적용하면 더욱 효율적인 React 애플리케이션을 만들 수 있습니다.

다음에는 고급 훅들인 \`useReducer\`, \`useContext\`, \`useRef\` 등에 대해서도 알아보겠습니다.
      `
    },
    'nextjs-app-router': {
      id: 2,
      title: "Next.js 14 App Router 마이그레이션",
      description: "Pages Router에서 App Router로 안전하게 마이그레이션하는 방법",
      category: "Next.js",
      date: "2024-12-10",
      readTime: "20min",
      tags: ["Next.js", "Migration", "App Router"],
      status: "new",
      author: "DemianDev",
      content: `
# Next.js 14 App Router 마이그레이션 가이드

Next.js 13에서 도입된 App Router가 이제 안정화되었습니다. Pages Router에서 App Router로 마이그레이션하는 방법을 알아봅시다.

## 주요 변화점

### 1. 폴더 구조
- \`pages/\` → \`app/\`
- 파일 기반 라우팅은 동일하지만 규칙이 변경

### 2. 레이아웃 시스템
App Router에서는 중첩된 레이아웃을 쉽게 만들 수 있습니다.

\`\`\`jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header>공통 헤더</header>
        {children}
        <footer>공통 푸터</footer>
      </body>
    </html>
  )
}
\`\`\`

이런 식으로 더 자세한 내용을 작성할 수 있습니다...
      `
    }
  }

  useEffect(() => {
    // URL의 slug 파라미터로 문서 찾기
    const slug = params.slug
    const foundDoc = docs[slug]
    
    if (foundDoc) {
      setDoc(foundDoc)
    }
    setIsLoading(false)
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center"
           style={{ textShadow: '0 0 3px rgba(255,255,255,0.3)' }}>
        <div className="text-center">
          <div className="animate-pulse text-white text-xl mb-4"
               style={{ textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
            문서를 불러오는 중...
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
                 style={{ boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.2s', boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.4s', boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}></div>
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
            <p className="text-white/80 text-lg mb-6">문서를 찾을 수 없습니다</p>
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
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white/80 hover:text-white transition-colors text-sm"
                      style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}>
                📤 공유하기
              </button>
              <button className="text-white/80 hover:text-white transition-colors text-sm"
                      style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}>
                ⭐ 즐겨찾기
              </button>
              <button className="text-white/80 hover:text-white transition-colors text-sm"
                      style={{ textShadow: '0 0 3px rgba(255,255,255,0.4)' }}>
                📝 수정 제안
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}