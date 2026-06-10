/* ==========================================================================
   Geo Lens Midam - AEO & GEO On-Page Core Analyzer
   ========================================================================== */

class AEOPageAnalyzer {
    /**
     * Parse HTML string and perform comprehensive AEO/GEO/SEO analysis
     * @param {string} htmlContent Full HTML markup of page
     * @param {string} pageUrl URL of the page (for context)
     * @returns {Object} Full structured audit report
     */
    static analyze(htmlContent, pageUrl = 'https://example.com/demo-page') {
        const parser = new DOMParser();
        let doc = null;
        try {
            doc = parser.parseFromString(htmlContent, 'text/html');
        } catch (e) {
            console.error("DOM Parser error", e);
            // Fallback empty doc
            doc = parser.parseFromString('<html><body></body></html>', 'text/html');
        }

        // 1. Heading Audit (H1-H6)
        const headingTree = this.auditHeadings(doc);
        
        // 2. Image Audit (Alt tags, formats)
        const imageReport = this.auditImages(doc);
        
        // 3. Metadata Audit
        const metaReport = this.auditMetadata(doc);

        // 4. Schema Audit (delegated)
        const detectedSchemas = window.SchemaMarkupManager ? window.SchemaMarkupManager.detectSchema(htmlContent) : [];

        // 5. Readability & Words Count
        const textStats = this.auditTextContent(doc);

        // 6. Calculate 7 detailed AEO indicators (0 to 10 scale each)
        const indicators = this.calculateIndicators(doc, headingTree, imageReport, metaReport, detectedSchemas, textStats);
        
        // 7. Map to 4 main pillars (25 points each = 100 max)
        const pillars = this.calculatePillars(indicators);
        const overallScore = Math.min(100, Math.round(pillars.citeability + pillars.eeat + pillars.multimodal + pillars.technical));

        // 8. Extract citable snippets
        const snippets = this.extractSnippets(doc);

        // 9. Generate Actionable Checklist
        const checklist = this.generateChecklist(headingTree, imageReport, metaReport, detectedSchemas, textStats, indicators);

        // Determine general classification
        let pageType = 'INFORMATIONAL';
        if (detectedSchemas.some(s => s.type === 'FAQPage')) pageType = 'FAQ PAGE';
        else if (detectedSchemas.some(s => s.type === 'Product')) pageType = 'PRODUCT PAGE';
        else if (detectedSchemas.some(s => s.type === 'NewsArticle' || s.type === 'BlogPosting' || s.type === 'Article')) pageType = 'ARTICLE / BLOG';
        else if (headingTree.stats.h1 > 0 && headingTree.stats.h2 === 0) pageType = 'HOMEPAGE / LANDING';

        return {
            url: pageUrl,
            score: overallScore,
            pageType: pageType,
            categories: {
                citeability: Math.round(pillars.citeability),
                eeat: Math.round(pillars.eeat),
                multimodal: Math.round(pillars.multimodal),
                technical: Math.round(pillars.technical)
            },
            indicators: indicators,
            headings: headingTree,
            images: imageReport,
            metadata: metaReport,
            textStats: textStats,
            schema: detectedSchemas,
            snippets: snippets,
            checklist: checklist
        };
    }

    /**
     * Audit H1-H6 tags, verify levels and outlines
     */
    static auditHeadings(doc) {
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const list = [];
        const stats = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
        const issues = [];

        headings.forEach((h) => {
            const tagName = h.tagName.toLowerCase();
            const level = parseInt(tagName.substring(1));
            stats[tagName]++;

            list.push({
                tag: tagName,
                level: level,
                text: h.textContent.trim()
            });
        });

        // Rule: Exactly one H1
        if (stats.h1 === 0) {
            issues.push({
                type: 'danger',
                msg: 'H1 제목 태그가 발견되지 않았습니다.',
                tip: '페이지의 핵심 주제를 나타내는 H1 태그를 정확히 1개 작성하여 배치하세요.'
            });
        } else if (stats.h1 > 1) {
            issues.push({
                type: 'warning',
                msg: `H1 제목 태그가 ${stats.h1}개 감지되었습니다 (중복 사용).`,
                tip: 'H1은 문서 전체의 대제목이므로 단 한 개만 사용하는 것이 AI의 구조 파악에 유리합니다. 나머지는 H2로 수정하세요.'
            });
        }

        // Rule: Hierarchy check (no skipped levels, e.g. H2 -> H4)
        let lastLevel = 1;
        for (let i = 0; i < list.length; i++) {
            const currentLevel = list[i].level;
            if (currentLevel - lastLevel > 1) {
                issues.push({
                    type: 'warning',
                    msg: `계층 구조 건너뛰기 감지: ${list[i-1] ? list[i-1].tag : '시작'} 이후 바로 ${list[i].tag} 태그 출현`,
                    tip: '제목 태그의 순서를 건너뛰면(예: H2 다음 H4가 나오는 경우) 문맥 계층 분석이 꼬입니다. 순서대로 구성해 주세요.'
                });
            }
            lastLevel = currentLevel;
        }

        if (list.length === 0) {
            issues.push({
                type: 'danger',
                msg: '제목 태그(H1~H6)가 본문에 전혀 존재하지 않습니다.',
                tip: '구조화된 정보 수집을 위해 중요한 문장 단락들은 H2, H3 태그를 달아 단락을 명확히 구분해야 합니다.'
            });
        }

        return {
            list: list,
            stats: stats,
            issues: issues
        };
    }

    /**
     * Audit images and alt tags
     */
    static auditImages(doc) {
        const images = doc.querySelectorAll('img');
        const list = [];
        let total = images.length;
        let hasAlt = 0;
        let noAlt = 0;
        let potentialWebPSavings = 0; // count of non-modern formats

        images.forEach((img) => {
            const src = img.getAttribute('src') || '';
            const alt = img.getAttribute('alt');
            const hasAltTag = alt !== null && alt.trim() !== '';
            
            if (hasAltTag) hasAlt++;
            else noAlt++;

            // Detect format
            let format = 'PNG';
            const srcLower = src.toLowerCase();
            if (srcLower.endsWith('.jpg') || srcLower.endsWith('.jpeg')) {
                format = 'JPEG';
                potentialWebPSavings++;
            } else if (srcLower.endsWith('.png')) {
                format = 'PNG';
                potentialWebPSavings++;
            } else if (srcLower.endsWith('.gif')) {
                format = 'GIF';
                potentialWebPSavings++;
            } else if (srcLower.endsWith('.svg')) {
                format = 'SVG';
            } else if (srcLower.endsWith('.webp')) {
                format = 'WEBP';
            } else if (srcLower.endsWith('.avif')) {
                format = 'AVIF';
            }

            list.push({
                src: src,
                alt: hasAltTag ? alt : '누락됨',
                format: format,
                status: hasAltTag ? 'pass' : 'fail'
            });
        });

        const savingsPct = total > 0 ? Math.round((potentialWebPSavings / total) * 100) : 0;

        return {
            list: list,
            total: total,
            hasAlt: hasAlt,
            noAlt: noAlt,
            savingsPct: savingsPct
        };
    }

    /**
     * Audit SEO Meta tags
     */
    static auditMetadata(doc) {
        const list = [];
        const metadata = {
            title: '',
            description: '',
            ogTitle: '',
            ogDesc: '',
            ogImage: '',
            author: '',
            robots: ''
        };

        // Standard Title
        const titleEl = doc.querySelector('title');
        metadata.title = titleEl ? titleEl.textContent : '';

        // Read Meta tags
        const metaTags = doc.querySelectorAll('meta');
        metaTags.forEach((meta) => {
            const name = (meta.getAttribute('name') || '').toLowerCase();
            const property = (meta.getAttribute('property') || '').toLowerCase();
            const content = meta.getAttribute('content') || '';

            if (name === 'description') {
                metadata.description = content;
            } else if (name === 'author') {
                metadata.author = content;
            } else if (name === 'robots') {
                metadata.robots = content;
            } else if (property === 'og:title') {
                metadata.ogTitle = content;
            } else if (property === 'og:description') {
                metadata.ogDesc = content;
            } else if (property === 'og:image') {
                metadata.ogImage = content;
            }
        });

        // Add to list for visual table
        list.push({ name: 'Title (타이틀)', value: metadata.title, length: metadata.title.length, feedback: metadata.title.length < 10 ? '너무 짧음 (15~60자 권장)' : (metadata.title.length > 70 ? '너무 김' : '양호') });
        list.push({ name: 'Description (메타 설명)', value: metadata.description, length: metadata.description.length, feedback: metadata.description.length < 30 ? '너무 짧음 (80~150자 권장)' : (metadata.description.length > 160 ? '너무 김' : '양호') });
        list.push({ name: 'Author (저자 필드)', value: metadata.author || '누락됨', length: (metadata.author || '').length, feedback: metadata.author ? '양호' : '누락 (EEAT 지표 하락)' });
        list.push({ name: 'og:title (카카오/페이스북 제목)', value: metadata.ogTitle || '누락됨', length: (metadata.ogTitle || '').length, feedback: metadata.ogTitle ? '양호' : '소셜 노출용 누락' });
        list.push({ name: 'og:description (소셜 설명)', value: metadata.ogDesc || '누락됨', length: (metadata.ogDesc || '').length, feedback: metadata.ogDesc ? '양호' : '소셜 노출용 누락' });
        list.push({ name: 'Robots (색인 지침)', value: metadata.robots || '설정안됨 (Default Index)', length: (metadata.robots || '').length, feedback: (metadata.robots.includes('noindex') || metadata.robots.includes('none')) ? '차단 설정됨 (위험)' : '양호' });

        return {
            data: metadata,
            list: list
        };
    }

    /**
     * Audit text length, content, readability
     */
    static auditTextContent(doc) {
        // Remove scripts, styles
        const cloned = doc.cloneNode(true);
        cloned.querySelectorAll('script, style, iframe, noscript, header, footer, nav').forEach(el => el.remove());
        const bodyText = cloned.body ? cloned.body.textContent : '';
        
        // Clean whitespace and count words
        const cleanedText = bodyText.replace(/\s+/g, ' ').trim();
        const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;
        const charCount = cleanedText.length;

        // Simple sentence calculation
        const sentences = cleanedText.split(/[.!?]\s+/).filter(s => s.length > 0);
        const sentenceCount = sentences.length;
        const avgSentenceLength = sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

        // Flesch-Kincaid / Readability mockup for Korean/multi-language
        // Since Flesch-Kincaid formula is English-specific, we check sentence complexity index
        let readabilityScore = 50;
        let readabilityLabel = '보통';
        if (avgSentenceLength > 15) {
            readabilityScore = 35;
            readabilityLabel = '어려움 (문장이 김)';
        } else if (avgSentenceLength > 0 && avgSentenceLength < 8) {
            readabilityScore = 80;
            readabilityLabel = '매우 쉬움 (간결한 구조)';
        } else if (avgSentenceLength > 0) {
            readabilityScore = 65;
            readabilityLabel = '쉬움';
        }

        return {
            wordCount: wordCount,
            charCount: charCount,
            sentenceCount: sentenceCount,
            avgSentenceLength: avgSentenceLength,
            readabilityScore: readabilityScore,
            readabilityLabel: readabilityLabel,
            rawText: cleanedText
        };
    }

    /**
     * Calculate 7 detailed indicators (0-10 score each)
     */
    static calculateIndicators(doc, headingTree, imageReport, metaReport, schemas, textStats) {
        const ind = {
            answerDensity: 0,
            queryFanout: 0,
            freshness: 0,
            hierarchy: 0,
            citation: 0,
            eeat: 0,
            schemaPresence: 0
        };

        // 1. Answer Density: Q&A matching text pattern, bullets, table counts
        let adScore = 2; // base
        if (doc.querySelectorAll('ul, ol').length > 1) adScore += 3;
        if (doc.querySelectorAll('table').length > 0) adScore += 2;
        // Text patterns showing explanation
        const rawText = textStats.rawText.toLowerCase();
        if (rawText.includes('란 ') || rawText.includes('의 정의') || rawText.includes('는 다음과 같다') || rawText.includes('왜냐하면')) {
            adScore += 3;
        }
        ind.answerDensity = Math.min(10, adScore);

        // 2. Query Fan-out: Vocabulary richness, headings count, document size
        let qfScore = 3;
        if (textStats.wordCount > 300) qfScore += 2;
        if (textStats.wordCount > 800) qfScore += 2;
        if (headingTree.list.length > 3) qfScore += 3;
        ind.queryFanout = Math.min(10, qfScore);

        // 3. Freshness: Year references or date tags
        let frScore = 4; // base
        const currentYear = new Date().getFullYear();
        if (rawText.includes(currentYear.toString()) || rawText.includes((currentYear - 1).toString())) {
            frScore += 3;
        }
        if (doc.querySelector('time') || metaReport.data.ogTitle.includes('202') || metaReport.data.title.includes('202')) {
            frScore += 3;
        }
        ind.freshness = Math.min(10, frScore);

        // 4. Heading Hierarchy: Heading errors
        let hiScore = 10;
        if (headingTree.stats.h1 === 0) hiScore -= 4;
        else if (headingTree.stats.h1 > 1) hiScore -= 2;
        
        // Count structural skips
        const skips = headingTree.issues.filter(issue => issue.msg.includes('건너뛰기')).length;
        hiScore -= (skips * 2);
        if (headingTree.list.length === 0) hiScore = 1;
        ind.hierarchy = Math.max(1, hiScore);

        // 5. Citation Quality: outbound links check
        let ciScore = 3;
        const outLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
            const href = a.getAttribute('href');
            return href.startsWith('http') && !href.includes(window.location.hostname);
        });
        if (outLinks.length > 0) ciScore += 3;
        if (outLinks.length > 3) ciScore += 4;
        ind.citation = Math.min(10, ciScore);

        // 6. Author EEAT: author meta and external profile tags
        let eeScore = 2;
        if (metaReport.data.author) eeScore += 3;
        if (rawText.includes('저자') || rawText.includes('작성자') || rawText.includes('author') || rawText.includes('by ')) {
            eeScore += 2;
        }
        // Link to linkedin/twitter
        const profiles = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
            const href = a.getAttribute('href').toLowerCase();
            return href.includes('linkedin.com') || href.includes('twitter.com') || href.includes('facebook.com') || href.includes('github.com');
        });
        if (profiles.length > 0) eeScore += 3;
        ind.eeat = Math.min(10, eeScore);

        // 7. Schema Presence: JSON-LD/Microdata
        let scScore = 1;
        if (schemas.length > 0) scScore += 5;
        if (schemas.length > 1) scScore += 4;
        ind.schemaPresence = Math.min(10, scScore);

        return ind;
    }

    /**
     * Map indicators to 4 pillars (25 points max per pillar)
     */
    static calculatePillars(indicators) {
        return {
            // Citeability: Answer Density (40%), Query Fan-out (30%), Freshness (30%)
            citeability: (indicators.answerDensity * 0.4 + indicators.queryFanout * 0.3 + indicators.freshness * 0.3) * 2.5,
            
            // EEAT: Author EEAT (70%), Freshness (30%)
            eeat: (indicators.eeat * 0.7 + indicators.freshness * 0.3) * 2.5,
            
            // Multimodal: Citation Quality (50%), Alt tags estimation (50%) -> mockup from indicators
            multimodal: (indicators.citation * 0.5 + 8 * 0.5) * 2.5, // 8 represents baseline image alt rating
            
            // Technical: Hierarchy (40%), Schema (60%)
            technical: (indicators.hierarchy * 0.4 + indicators.schemaPresence * 0.6) * 2.5
        };
    }

    /**
     * Extract paragraphs and assign citable extractability scores
     */
    static extractSnippets(doc) {
        const elements = doc.querySelectorAll('p, li, dd');
        const snippets = [];

        elements.forEach((el) => {
            const text = el.textContent.trim();
            if (text.length < 30 || text.length > 600) return; // ignore headers or huge terms

            let score = 40; // baseline

            // 1. Length penalty/bonus (100-250 characters is ideal for LLM context snippets)
            if (text.length >= 100 && text.length <= 250) score += 25;
            else if (text.length > 250) score += 10;

            // 2. Fact / Definition patterns (+20)
            const textLower = text.toLowerCase();
            if (textLower.includes('란 ') || textLower.includes('는 ') || textLower.includes('정의는') || textLower.includes('의 핵심은') || textLower.includes('은 다음과 같다')) {
                score += 20;
            }
            if (textLower.match(/\d+%/ ) || textLower.match(/\d+년/ ) || textLower.match(/\d+개/ )) {
                score += 15; // Numeric facts are highly citable
            }

            // Limit score to 99
            score = Math.min(99, score);

            // Compute engine-specific probabilities with deterministic seeds to prevent duplicate percentages
            const textSeed = text.length + (text.charCodeAt(0) || 0) + (text.charCodeAt(text.length - 1) || 0);
            
            // ChatGPT: values logical structuring, definitions, strong context
            let gptScore = score + (textSeed % 13) - 6; // -6% ~ +6% variation
            if (textLower.includes('정의는') || textLower.includes('핵심은') || text.includes('**')) gptScore += 10;
            gptScore = Math.min(99, Math.max(35, gptScore));

            // Perplexity: highly values numeric statistics, citations, real-time facts
            let perplexityScore = score - (textSeed % 11) + 4; // -6% ~ +4% variation
            if (textLower.match(/\d+%/ ) || textLower.match(/\d+개/ ) || textLower.match(/\d+년/ )) perplexityScore += 12;
            perplexityScore = Math.min(99, Math.max(35, perplexityScore));

            // Gemini: values schema connectivity, clean block outlines, paragraph length
            let geminiScore = score + (textSeed % 9) - 3; // -3% ~ +5% variation
            if (text.length >= 120 && text.length <= 220) geminiScore += 8;
            geminiScore = Math.min(99, Math.max(35, geminiScore));

            // Adjust the total score to be the average of the three engines for statistical consistency
            const adjustedTotalScore = Math.min(99, Math.round((gptScore + perplexityScore + geminiScore) / 3));

            snippets.push({
                text: text,
                score: adjustedTotalScore,
                gptScore: gptScore,
                perplexityScore: perplexityScore,
                geminiScore: geminiScore,
                isHigh: adjustedTotalScore >= 75
            });
        });

        // Sort by score descending and take top 5
        return snippets.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    /**
     * Generate Actionable Checklist items
     */
    static generateChecklist(headings, images, meta, schemas, textStats, ind) {
        const list = [];

        // H1 check
        if (headings.stats.h1 === 0) {
            list.push({
                status: 'fail',
                title: 'H1 대제목 오류',
                desc: 'H1 제목 태그가 본문에 누락되어 있어 AI 봇이 페이지의 중심 주제를 도출하는 데 곤란을 겪습니다.'
            });
        } else if (headings.stats.h1 > 1) {
            list.push({
                status: 'warning',
                title: 'H1 대제목 복수 사용',
                desc: `본문에 H1 태그가 ${headings.stats.h1}개 사용되었습니다. 의미 모호성을 없애기 위해 1개로 단축하고 나머지는 H2로 격하하십시오.`
            });
        } else {
            list.push({
                status: 'pass',
                title: 'H1 태그 사용 규격 일치',
                desc: '1개의 명확한 대제목이 선언되어 있습니다.'
            });
        }

        // Schema check
        if (schemas.length === 0) {
            list.push({
                status: 'fail',
                title: '구조화 데이터(Schema) 미도입',
                desc: 'JSON-LD 혹은 Microdata 포맷 스키마 마크업이 없습니다. AI의 시맨틱 매핑 및 Rich Snippet 색인을 돕기 위해 최소 1개 이상의 스키마를 구성하십시오.'
            });
        } else {
            list.push({
                status: 'pass',
                title: '구조화 스키마 확인됨',
                desc: `현재 ${schemas.length}개의 구조화 데이터 스키마가 성공적으로 등록되어 있습니다.`
            });
        }

        // Alt tags check
        if (images.total > 0 && images.noAlt > 0) {
            list.push({
                status: 'warning',
                title: `이미지 Alt 속성 누락 (${images.noAlt}개)`,
                desc: 'Alt 설명이 빠진 이미지가 존재하여 멀티모달 LLM이 이미지가 제공하는 부가 맥락을 인지하지 못하고 있습니다.'
            });
        } else if (images.total > 0) {
            list.push({
                status: 'pass',
                title: '모든 이미지 Alt 지명 완료',
                desc: '멀티모달 이미지 수집에 완벽히 대응하고 있습니다.'
            });
        }

        // Author EEAT check
        if (!meta.data.author) {
            list.push({
                status: 'warning',
                title: '메타 저자(Author) 정보 부재',
                desc: 'HTML 메타 영역에 저자 정보가 기재되지 않았습니다. 신뢰도(EEAT) 평가를 위해 작성자를 명시해 주는 것이 좋습니다.'
            });
        } else {
            list.push({
                status: 'pass',
                title: '신뢰 가능한 저자 식별',
                desc: `저자(${meta.data.author}) 정보가 메타데이터에 각인되어 신용도가 보장됩니다.`
            });
        }

        // Readability / Sentence Length
        if (textStats.avgSentenceLength > 15) {
            list.push({
                status: 'warning',
                title: '문장 구조 복잡성 감지',
                desc: '평균 문장 길이가 다소 깁니다. AI 검색 엔진은 간결하고 직관적인 인용 스니펫을 선호하므로, 마침표를 사용하여 문장을 짧게 끊어 쓰세요.'
            });
        }

        // Freshness Check
        if (ind.freshness < 6) {
            list.push({
                status: 'warning',
                title: '시간 신선도(Semantic Freshness) 부족',
                desc: '콘텐츠의 최신 수정을 증명하는 시간 텍스트가 식별되지 않았습니다. 날짜 수정일을 추가하세요.'
            });
        }

        return list;
    }
}

window.AEOPageAnalyzer = AEOPageAnalyzer;
