// lib/github.js
// GitHub API를 통해 edith-docs 레포에서 마크다운 문서들을 가져오는 유틸리티

/**
 * GitHub API 설정
 */
const GITHUB_CONFIG = {
  owner: 'Aprasaks', // GitHub 사용자명
  repo: 'edith-docs', // 레포지토리 이름
  branch: 'main', // 브랜치 (main 또는 master)
  apiUrl: 'https://api.github.com'
};

/**
 * GitHub API 기본 함수 - 파일 또는 폴더 정보 가져오기
 * @param {string} path - 파일 또는 폴더 경로
 * @returns {Promise<any>} GitHub API 응답
 */
async function fetchFromGitHub(path = '') {
  const url = `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // GitHub Personal Access Token이 있다면 추가 (rate limit 증가)
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      // Next.js 캐싱 설정 - 1시간마다 재검증
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`GitHub API 요청 실패 (${path}):`, error);
    throw error;
  }
}

/**
 * Base64로 인코딩된 파일 내용을 디코딩
 * @param {string} content - Base64 인코딩된 내용
 * @returns {string} 디코딩된 텍스트
 */
function decodeContent(content) {
  try {
    return Buffer.from(content, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Base64 디코딩 실패:', error);
    return '';
  }
}

/**
 * frontmatter 파싱 (간단한 버전)
 * @param {string} content - 마크다운 파일 내용
 * @returns {object} { metadata, content }
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: {},
      content: content
    };
  }

  const [, frontmatterString, markdownContent] = match;
  const metadata = {};

  // YAML-like 파싱 (간단한 key: value 형태만)
  frontmatterString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // 배열 처리 (간단한 형태: ["item1", "item2"])
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          // JSON 파싱 실패시 문자열로 유지
        }
      }
      
      metadata[key] = value;
    }
  });

  return {
    metadata,
    content: markdownContent.trim()
  };
}

/**
 * 루트 폴더의 모든 카테고리 가져오기
 * @returns {Promise<Array>} 카테고리 목록
 */
export async function getCategories() {
  try {
    const docsContent = await fetchFromGitHub('');
    
    if (!Array.isArray(docsContent)) {
      console.warn('루트 폴더가 배열이 아닙니다:', docsContent);
      return [];
    }

    // 폴더만 필터링 (README.md 같은 파일 제외)
    const categories = docsContent
      .filter(item => item.type === 'dir')
      .map(folder => ({
        name: folder.name,
        path: folder.path,
        url: folder.url
      }));

    return categories;
  } catch (error) {
    console.error('카테고리 가져오기 실패:', error);
    return [];
  }
}

/**
 * 특정 카테고리의 모든 문서 목록 가져오기
 * @param {string} category - 카테고리 이름 (예: 'react', 'nextjs')
 * @returns {Promise<Array>} 문서 목록
 */
export async function getDocumentsByCategory(category) {
  try {
    const categoryContent = await fetchFromGitHub(category);
    
    if (!Array.isArray(categoryContent)) {
      console.warn(`${category} 카테고리가 배열이 아닙니다:`, categoryContent);
      return [];
    }

    // .md 파일만 필터링
    const documents = categoryContent
      .filter(item => item.type === 'file' && item.name.endsWith('.md'))
      .map(file => ({
        name: file.name,
        slug: file.name.replace('.md', ''),
        path: file.path,
        downloadUrl: file.download_url,
        size: file.size,
        sha: file.sha
      }));

    return documents;
  } catch (error) {
    console.error(`${category} 문서 목록 가져오기 실패:`, error);
    return [];
  }
}

/**
 * 모든 문서 목록 가져오기 (메타데이터 포함)
 * @returns {Promise<Array>} 모든 문서의 메타데이터
 */
export async function getAllDocuments() {
  try {
    const categories = await getCategories();
    const allDocuments = [];

    for (const category of categories) {
      const documents = await getDocumentsByCategory(category.name);
      
      // 각 문서의 메타데이터 가져오기
      for (const doc of documents) {
        try {
          const content = await getDocumentContent(category.name, doc.slug);
          allDocuments.push({
            ...doc,
            category: category.name,
            ...content.metadata,
            // 추가 정보
            fullPath: doc.path,
            lastModified: content.lastModified || new Date().toISOString()
          });
        } catch (error) {
          console.warn(`문서 메타데이터 가져오기 실패 (${doc.path}):`, error.message);
          // 메타데이터 없이도 문서 목록에 포함
          allDocuments.push({
            ...doc,
            category: category.name,
            title: doc.name.replace('.md', '').replace(/-/g, ' '),
            description: '설명이 없습니다.',
            tags: [],
            status: 'unknown'
          });
        }
      }
    }

    return allDocuments;
  } catch (error) {
    console.error('전체 문서 목록 가져오기 실패:', error);
    return [];
  }
}

/**
 * 특정 문서의 내용 가져오기
 * @param {string} category - 카테고리 이름
 * @param {string} slug - 문서 슬러그 (파일명에서 .md 제외)
 * @returns {Promise<object>} { metadata, content }
 */
export async function getDocumentContent(category, slug) {
  try {
    const filePath = `${category}/${slug}.md`;
    const fileData = await fetchFromGitHub(filePath);

    if (fileData.type !== 'file') {
      throw new Error(`${filePath}는 파일이 아닙니다.`);
    }

    // Base64 디코딩
    const decodedContent = decodeContent(fileData.content);
    
    // frontmatter 파싱
    const { metadata, content } = parseFrontmatter(decodedContent);

    return {
      metadata: {
        ...metadata,
        // 기본값 설정
        title: metadata.title || slug.replace(/-/g, ' '),
        description: metadata.description || '',
        category: metadata.category || category,
        tags: metadata.tags || [],
        status: metadata.status || 'published',
        author: metadata.author || 'Unknown',
        date: metadata.date || new Date().toISOString().split('T')[0],
        readTime: metadata.readTime || '5min',
        slug: metadata.slug || slug
      },
      content,
      rawContent: decodedContent,
      lastModified: fileData.sha, // Git SHA를 버전으로 사용
      size: fileData.size
    };
  } catch (error) {
    console.error(`문서 내용 가져오기 실패 (${category}/${slug}):`, error);
    throw error;
  }
}

/**
 * 슬러그로 문서 찾기 (모든 카테고리에서 검색)
 * 효율적인 방법: 먼저 모든 문서 목록을 가져온 후 슬러그로 매칭
 * @param {string} slug - 문서 슬러그
 * @returns {Promise<object|null>} 문서 데이터 또는 null
 */
export async function getDocumentBySlug(slug) {
  try {
    // 캐시된 문서 목록이 있다면 활용 (성능 최적화)
    const allDocs = await getAllDocuments();
    const foundDoc = allDocs.find(doc => doc.slug === slug);
    
    if (foundDoc) {
      console.log(`문서 찾음: ${foundDoc.category}/${slug}.md`);
      // 실제 문서 내용 가져오기
      const fullContent = await getDocumentContent(foundDoc.category, slug);
      return {
        ...fullContent,
        category: foundDoc.category
      };
    }
    
    console.log(`문서를 찾을 수 없습니다: ${slug}`);
    return null;
  } catch (error) {
    console.error(`슬러그로 문서 찾기 실패 (${slug}):`, error);
    return null;
  }
}

/**
 * 인기 문서 가져오기 (status가 'popular'인 문서들)
 * @param {number} limit - 가져올 문서 수
 * @returns {Promise<Array>} 인기 문서 목록
 */
export async function getPopularDocuments(limit = 5) {
  try {
    const allDocs = await getAllDocuments();
    return allDocs
      .filter(doc => doc.status === 'popular')
      .slice(0, limit);
  } catch (error) {
    console.error('인기 문서 가져오기 실패:', error);
    return [];
  }
}

/**
 * 최근 업데이트된 문서 가져오기
 * @param {number} limit - 가져올 문서 수
 * @returns {Promise<Array>} 최근 문서 목록
 */
export async function getRecentDocuments(limit = 5) {
  try {
    const allDocs = await getAllDocuments();
    return allDocs
      .filter(doc => doc.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error('최근 문서 가져오기 실패:', error);
    return [];
  }
}

/**
 * 태그로 문서 검색
 * @param {string} tag - 검색할 태그
 * @returns {Promise<Array>} 해당 태그를 가진 문서들
 */
export async function getDocumentsByTag(tag) {
  try {
    const allDocs = await getAllDocuments();
    return allDocs.filter(doc => 
      doc.tags && doc.tags.includes(tag)
    );
  } catch (error) {
    console.error(`태그 검색 실패 (${tag}):`, error);
    return [];
  }
}

/**
 * 문서 검색 (제목, 설명에서 키워드 검색)
 * @param {string} query - 검색 키워드
 * @returns {Promise<Array>} 검색 결과
 */
export async function searchDocuments(query) {
  try {
    const allDocs = await getAllDocuments();
    const lowercaseQuery = query.toLowerCase();
    
    return allDocs.filter(doc => 
      (doc.title && doc.title.toLowerCase().includes(lowercaseQuery)) ||
      (doc.description && doc.description.toLowerCase().includes(lowercaseQuery)) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  } catch (error) {
    console.error(`문서 검색 실패 (${query}):`, error);
    return [];
  }
}