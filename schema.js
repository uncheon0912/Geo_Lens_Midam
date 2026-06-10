/* ==========================================================================
   Geo Lens Midam - Schema Markup Validator & Generator
   ========================================================================== */

const SchemaTemplates = {
    FAQPage: {
        title: 'FAQ (자주 묻는 질문)',
        fields: [
            { id: 'faq_q1', label: '질문 1', type: 'text', placeholder: '예: Geo Lens Midam은 어떤 도구인가요?', defaultFromHTML: 'firstQuestion' },
            { id: 'faq_a1', label: '답변 1', type: 'textarea', placeholder: '예: AI 검색 엔진에 대한 웹사이트 최적화 상태를 분석해주는 진단 도구입니다.' },
            { id: 'faq_q2', label: '질문 2', type: 'text', placeholder: '예: 비용은 무료인가요?', defaultFromHTML: 'secondQuestion' },
            { id: 'faq_a2', label: '답변 2', type: 'textarea', placeholder: '예: 네, 로컬 실행 및 룰 기반 감사 기능은 100% 무료로 제한 없이 사용 가능합니다.' },
            { id: 'faq_q3', label: '질문 3', type: 'text', placeholder: '예: 지원하는 스키마 종류는 몇 개인가요?' },
            { id: 'faq_a3', label: '답변 3', type: 'textarea', placeholder: '예: FAQ, Article, Product를 포함한 15종 이상의 풍부한 스키마를 지원합니다.' }
        ],
        generator: (data) => {
            const mainEntity = [];
            if (data.faq_q1 && data.faq_a1) {
                mainEntity.push({
                    "@type": "Question",
                    "name": data.faq_q1,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": data.faq_a1
                    }
                });
            }
            if (data.faq_q2 && data.faq_a2) {
                mainEntity.push({
                    "@type": "Question",
                    "name": data.faq_q2,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": data.faq_a2
                    }
                });
            }
            if (data.faq_q3 && data.faq_a3) {
                mainEntity.push({
                    "@type": "Question",
                    "name": data.faq_q3,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": data.faq_a3
                    }
                });
            }
            return {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": mainEntity
            };
        }
    },
    Article: {
        title: 'Article (기사/블로그 포스트)',
        fields: [
            { id: 'art_headline', label: '기사 제목', type: 'text', placeholder: '예: AI 검색 엔진에 인용되는 글쓰기 비법', defaultFromHTML: 'title' },
            { id: 'art_description', label: '요약 설명', type: 'text', placeholder: '예: ChatGPT, Perplexity 등에 인용률을 높이는 최적화 작성 기술', defaultFromHTML: 'description' },
            { id: 'art_author', label: '저자 이름', type: 'text', placeholder: '예: 홍길동', defaultFromHTML: 'author' },
            { id: 'art_publisher', label: '발행 기관', type: 'text', placeholder: '예: Geo Lens Midam', defaultFromHTML: 'publisher' },
            { id: 'art_url', label: '페이지 URL', type: 'text', placeholder: '예: https://mysite.com/article1', defaultFromHTML: 'url' },
            { id: 'art_image', label: '대표 이미지 URL', type: 'text', placeholder: '예: https://mysite.com/images/cover.jpg', defaultFromHTML: 'image' },
            { id: 'art_datePublished', label: '발행일', type: 'date', defaultFromHTML: 'date' }
        ],
        generator: (data) => {
            return {
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                "headline": data.art_headline || "",
                "description": data.art_description || "",
                "image": data.art_image ? [data.art_image] : [],
                "datePublished": data.art_datePublished ? new Date(data.art_datePublished).toISOString() : new Date().toISOString(),
                "author": [{
                    "@type": "Person",
                    "name": data.art_author || "Anonymous",
                    "jobTitle": "Author"
                }],
                "publisher": {
                    "@type": "Organization",
                    "name": data.art_publisher || "Publisher",
                    "logo": {
                        "@type": "ImageObject",
                        "url": data.art_image || ""
                    }
                }
            };
        }
    },
    Product: {
        title: 'Product (상품 정보)',
        fields: [
            { id: 'prod_name', label: '상품명', type: 'text', placeholder: '예: Geo Lens Midam Enterprise', defaultFromHTML: 'title' },
            { id: 'prod_description', label: '상품 설명', type: 'text', placeholder: '예: 고성능 AEO/GEO 기업 전용 분석 툴킷', defaultFromHTML: 'description' },
            { id: 'prod_price', label: '가격 (숫자만)', type: 'text', placeholder: '예: 99000' },
            { id: 'prod_currency', label: '통화 코드', type: 'text', placeholder: 'KRW, USD 등', defaultValue: 'KRW' },
            { id: 'prod_brand', label: '브랜드', type: 'text', placeholder: '예: Midam Tech', defaultFromHTML: 'publisher' },
            { id: 'prod_image', label: '상품 이미지 URL', type: 'text', placeholder: '예: https://mysite.com/images/product.jpg', defaultFromHTML: 'image' }
        ],
        generator: (data) => {
            return {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": data.prod_name || "",
                "description": data.prod_description || "",
                "image": data.prod_image || "",
                "brand": {
                    "@type": "Brand",
                    "name": data.prod_brand || "Brand"
                },
                "offers": {
                    "@type": "Offer",
                    "price": data.prod_price || "0",
                    "priceCurrency": data.prod_currency || "KRW",
                    "availability": "https://schema.org/InStock"
                }
            };
        }
    },
    HowTo: {
        title: 'HowTo (가이드/방법)',
        fields: [
            { id: 'ht_name', label: '가이드 제목', type: 'text', placeholder: '예: 워드프레스에 스키마 마크업을 설치하는 법', defaultFromHTML: 'title' },
            { id: 'ht_description', label: '상세 설명', type: 'text', placeholder: '예: 코딩 없이 5분 안에 JSON-LD 스키마를 설정하는 단계별 가이드', defaultFromHTML: 'description' },
            { id: 'ht_step1', label: '1단계 제목', type: 'text', placeholder: '예: 코드 복사하기' },
            { id: 'ht_step1_desc', label: '1단계 상세', type: 'textarea', placeholder: '예: Geo Lens Midam에서 생성된 JSON-LD 코드를 복사합니다.' },
            { id: 'ht_step2', label: '2단계 제목', type: 'text', placeholder: '예: 테마 파일 편집기 열기' },
            { id: 'ht_step2_desc', label: '2단계 상세', type: 'textarea', placeholder: '예: 워드프레스 알림판에서 테마 파일 편집기로 이동합니다.' }
        ],
        generator: (data) => {
            const steps = [];
            if (data.ht_step1) {
                steps.push({
                    "@type": "HowToStep",
                    "name": data.ht_step1,
                    "text": data.ht_step1_desc || ""
                });
            }
            if (data.ht_step2) {
                steps.push({
                    "@type": "HowToStep",
                    "name": data.ht_step2,
                    "text": data.ht_step2_desc || ""
                });
            }
            return {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": data.ht_name || "",
                "description": data.ht_description || "",
                "step": steps
            };
        }
    },
    LocalBusiness: {
        title: 'LocalBusiness (지역 비즈니스)',
        fields: [
            { id: 'lb_name', label: '업체명', type: 'text', placeholder: '예: 미담 마케팅 연구소', defaultFromHTML: 'publisher' },
            { id: 'lb_telephone', label: '전화번호', type: 'text', placeholder: '예: 02-1234-5678' },
            { id: 'lb_address', label: '상세 주소', type: 'text', placeholder: '예: 서울시 강남구 테헤란로 123' },
            { id: 'lb_url', label: '웹사이트 URL', type: 'text', placeholder: '예: https://mysite.com', defaultFromHTML: 'url' },
            { id: 'lb_priceRange', label: '가격대', type: 'text', placeholder: '예: ₩₩', defaultValue: '₩₩' }
        ],
        generator: (data) => {
            return {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": data.lb_name || "",
                "telephone": data.lb_telephone || "",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": data.lb_address || "",
                    "addressLocality": "Seoul",
                    "addressCountry": "KR"
                },
                "url": data.lb_url || "",
                "priceRange": data.lb_priceRange || "₩₩"
            };
        }
    }
};

// Populate default generic templates for other types
const otherTypes = ['Organization', 'Person', 'Event', 'Recipe', 'VideoObject', 'BreadcrumbList', 'Course', 'JobPosting', 'Review', 'WebPage'];
for (let type of otherTypes) {
    if (!SchemaTemplates[type]) {
        SchemaTemplates[type] = {
            title: `${type} (기본형)`,
            fields: [
                { id: `gen_name`, label: '명칭 / 이름', type: 'text', placeholder: '예: 명칭을 입력하세요', defaultFromHTML: 'title' },
                { id: `gen_desc`, label: '설명', type: 'text', placeholder: '예: 관련 세부 설명을 적으세요', defaultFromHTML: 'description' },
                { id: `gen_url`, label: '참조 URL', type: 'text', placeholder: '예: https://example.com', defaultFromHTML: 'url' }
            ],
            generator: (data) => {
                return {
                    "@context": "https://schema.org",
                    "@type": type,
                    "name": data.gen_name || "",
                    "description": data.gen_desc || "",
                    "url": data.gen_url || ""
                };
            }
        };
    }
}

class SchemaMarkupManager {
    /**
     * Parse HTML and detect existing Schema structures (JSON-LD and microdata)
     */
    static detectSchema(htmlContent) {
        const detected = [];
        let doc = null;
        try {
            const parser = new DOMParser();
            doc = parser.parseFromString(htmlContent, 'text/html');
        } catch (e) {
            console.error("DOM Parsing failed in schema detection", e);
            return detected;
        }

        // 1. JSON-LD scripts
        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        scripts.forEach((script) => {
            try {
                const json = JSON.parse(script.textContent);
                // Handle arrays or graphs
                const extractTypes = (obj) => {
                    if (!obj) return;
                    if (Array.isArray(obj)) {
                        obj.forEach(extractTypes);
                    } else if (typeof obj === 'object') {
                        if (obj['@type']) {
                            detected.push({
                                type: obj['@type'],
                                format: 'JSON-LD',
                                code: JSON.stringify(obj, null, 2)
                            });
                        }
                        if (obj['@graph']) {
                            extractTypes(obj['@graph']);
                        }
                    }
                };
                extractTypes(json);
            } catch (e) {
                // Invalid JSON-LD block
                detected.push({
                    type: '검증 실패 (유효하지 않은 JSON-LD)',
                    format: 'JSON-LD',
                    code: script.textContent.substring(0, 300) + '...'
                });
            }
        });

        // 2. Microdata detection (itemtype)
        const microdataNodes = doc.querySelectorAll('[itemtype]');
        microdataNodes.forEach((node) => {
            const typeUrl = node.getAttribute('itemtype');
            const type = typeUrl.split('/').pop();
            // Basic extraction (limit duplicating parent-child nodes)
            if (!detected.some(d => d.type === type && d.format === 'Microdata')) {
                detected.push({
                    type: type,
                    format: 'Microdata',
                    code: node.outerHTML.substring(0, 250) + '...'
                });
            }
        });

        return detected;
    }

    /**
     * Extract page metadata values to autofill generator fields
     */
    static getAutofillSource(htmlContent, currentUrl = '') {
        const source = {
            title: '',
            description: '',
            author: 'Anonymous',
            publisher: 'My Web Publication',
            url: currentUrl || 'https://mysite.com/post',
            image: '',
            date: new Date().toISOString().substring(0, 10),
            firstQuestion: '',
            secondQuestion: ''
        };

        let doc = null;
        try {
            const parser = new DOMParser();
            doc = parser.parseFromString(htmlContent, 'text/html');
        } catch (e) {
            return source;
        }

        // Extract Title
        const titleEl = doc.querySelector('title');
        const h1El = doc.querySelector('h1');
        const metaTitleEl = doc.querySelector('meta[property="og:title"]');
        source.title = (titleEl ? titleEl.textContent : (h1El ? h1El.textContent : '')).trim();
        if (metaTitleEl && metaTitleEl.getAttribute('content')) {
            source.title = metaTitleEl.getAttribute('content').trim();
        }

        // Extract Description
        const descMeta = doc.querySelector('meta[name="description"]');
        const ogDescMeta = doc.querySelector('meta[property="og:description"]');
        if (descMeta && descMeta.getAttribute('content')) {
            source.description = descMeta.getAttribute('content').trim();
        } else if (ogDescMeta && ogDescMeta.getAttribute('content')) {
            source.description = ogDescMeta.getAttribute('content').trim();
        }

        // Extract Author
        const authorMeta = doc.querySelector('meta[name="author"]');
        const ogSiteName = doc.querySelector('meta[property="og:site_name"]');
        if (authorMeta && authorMeta.getAttribute('content')) {
            source.author = authorMeta.getAttribute('content').trim();
        }
        if (ogSiteName && ogSiteName.getAttribute('content')) {
            source.publisher = ogSiteName.getAttribute('content').trim();
        }

        // Extract Image
        const ogImgMeta = doc.querySelector('meta[property="og:image"]');
        if (ogImgMeta && ogImgMeta.getAttribute('content')) {
            source.image = ogImgMeta.getAttribute('content').trim();
        }

        // Try to guess questions from H2/H3 for FAQ page
        const headings = Array.from(doc.querySelectorAll('h2, h3'));
        const questionHeadings = headings.filter(h => h.textContent.includes('?') || h.textContent.includes('어떻게') || h.textContent.includes('무엇'));
        if (questionHeadings.length > 0) source.firstQuestion = questionHeadings[0].textContent.trim();
        if (questionHeadings.length > 1) source.secondQuestion = questionHeadings[1].textContent.trim();

        // Extract dates
        const dateMeta = doc.querySelector('meta[property="article:published_time"]');
        if (dateMeta && dateMeta.getAttribute('content')) {
            source.date = dateMeta.getAttribute('content').substring(0, 10);
        }

        return source;
    }
}

window.SchemaTemplates = SchemaTemplates;
window.SchemaMarkupManager = SchemaMarkupManager;
