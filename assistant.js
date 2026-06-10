/* ==========================================================================
   Geo Lens Midam - AI Assistant Module (Local Rules & Gemini API)
   ========================================================================== */

class AEOAssistantManager {
    /**
     * Generates a context-aware smart response locally based on the audit details
     */
    static getLocalResponse(query, auditData) {
        const queryLower = query.toLowerCase();
        
        // Default fallbacks if no analysis has been done yet
        if (!auditData || !auditData.url) {
            return `아직 웹페이지 분석이 수행되지 않았습니다. \n대시보드 상단에 분석할 URL을 입력하시거나 HTML 소스코드를 입력해 주시면, 해당 데이터를 기준으로 정교한 맞춤 가이드를 제공해 드릴 수 있습니다. \n\n*우선 아래의 일반적인 AEO 최적화 팁을 참고해 보세요:*\n\n1. **명확한 Q&A 구조**: 본문에 질문을 H2/H3 태그로 던지고, 바로 아랫줄에 두괄식의 1~2문장으로 직접적인 정답을 서술하세요.\n2. **저자 전문성(E-E-A-T) 표시**: 필자의 프로필 이름, 이메일, 약력 링크(Bio)를 웹페이지 하단에 포함시키세요.\n3. **스키마 마크업**: 구글과 Perplexity 등은 스키마의 구조 정보를 바탕으로 엔티티를 파악합니다. FAQ 스키마와 Article 스키마 적용은 필수입니다.`;
        }

        const url = auditData.url;
        const score = auditData.score || 0;
        const categories = auditData.categories || {};
        const crawlers = auditData.crawlers || { stats: { blocked: 0 } };
        const schema = auditData.schema || [];
        const headings = auditData.headings || { stats: { h1: 0 } };
        
        // Option 1: AEO 점수 및 요약 조언
        if (queryLower.includes('점수') || queryLower.includes('요약') || queryLower.includes('aeo 점수') || queryLower.includes('우선순위')) {
            let advice = `### 🔍 [${url}] 분석 보고서 요약 & 피드백\n\n`;
            advice += `현재 귀하의 웹페이지 **GEO/AEO 종합 점수는 ${score}점**입니다. `;
            
            if (score >= 80) {
                advice += `우수한 최적화 상태(Excellent)입니다! AI 크롤러 접근성과 시맨틱 정보가 매우 양호하게 매핑되어 있어, ChatGPT나 Gemini에 의해 출처로 인용될 확률이 큽니다.\n\n`;
            } else if (score >= 50) {
                advice += `보통 수준(Moderate)의 준비도입니다. 기본적인 콘텐츠 형태는 구성되어 있으나, 검색 엔진의 인용 확률을 비약적으로 넓히기 위한 온페이지 미세조정이 필요합니다.\n\n`;
            } else {
                advice += `개선이 시급한 미흡(Poor) 상태입니다. AI 검색 엔진 봇의 접근이 불완전하거나 구조화된 마크업, 본문 가독성에서 큰 결함이 발견되었습니다. 하단의 개선 대책을 우선 집행해 주세요.\n\n`;
            }

            advice += `#### 🛠️ 주요 교정 우선순위:\n`;
            let pNum = 1;
            
            // 1. Check crawlers blocked
            if (crawlers.stats.blocked > 0) {
                advice += `${pNum++}. **AI 크롤러 접근 차단 해제**: 현재 주요 봇 중 ${crawlers.stats.blocked}개가 차단되어 있습니다. ChatGPT 나 Perplexity가 해당 정보를 검색해 올 수 없습니다. 'AI 검색 준비도' 탭에서 차단된 봇의 robots.txt 설정을 수정하세요.\n`;
            }
            // 2. Check schema
            if (schema.length === 0) {
                advice += `${pNum++}. **구조화된 스키마 데이터 누락**: 탐지된 JSON-LD 스키마 마크업이 없습니다. 구조화된 데이터가 없을 경우, AI가 문서의 핵심 인자(Entity)를 파싱하기 어렵습니다. '구조화된 데이터' 탭에서 FAQ 나 Article 스키마를 즉시 발행하세요.\n`;
            }
            // 3. Heading level check
            if (headings.stats.h1 !== 1) {
                advice += `${pNum++}. **제목 태그 계층 불량**: H1 태그가 ${headings.stats.h1}개 감지되었습니다. (표준 규격은 페이지당 정확히 1개). AI의 핵심 주제 해석 혼란을 막기 위해 H1을 한 개로 수정하고 H2-H3 순서의 계층적 트리를 구성해 주세요.\n`;
            }
            // 4. Low indicators
            if (categories.citeability && categories.citeability < 15) {
                advice += `${pNum++}. **MiDAM - SGA 지수 보강**: 정보 밀도가 낮고 두괄식 Q&A 구성이 미흡합니다. 글을 쓸 때 핵심 정답을 명확히 요약해주는 스니펫 영역을 단락 처음에 배치하십시오.\n`;
            }
            if (categories.eeat && categories.eeat < 15) {
                advice += `${pNum++}. **EEAT-S 신뢰성 보강**: 저자 프로필, SNS 주소, 기사 수정 시점 등을 본문에 뚜렷하게 삽입하여 AI에게 '신뢰할 만한 저자가 쓴 글'임을 선언해야 합니다.\n`;
            }

            if (pNum === 1) {
                advice += `🎉 축하합니다! 모든 핵심 규격이 통과되어 있는 상태입니다. 콘텐츠의 지속적인 최신성(T-Fresh 지수)을 유지하기 위해 주기적인 날짜 갱신과 신뢰도 높은 아웃바운드 링크(OLC 신뢰성 등급)를 보완해 주시면 좋습니다.`;
            }

            return advice;
        }

        // Option 2: E-E-A-T 신호 보강하기
        if (queryLower.includes('eeat') || queryLower.includes('저자') || queryLower.includes('신뢰') || queryLower.includes('전문성')) {
            let advice = `### 🛡️ EEAT-S 신뢰도 및 창작자 검증(EEAT Authority Trust Shield) 보강 가이드\n\n`;
            advice += `AI 검색 답변 엔진은 검증되지 않은 가짜 뉴스나 출처 불분명 글 대신, 전문성과 권위를 지닌 필자의 글을 최우선 인용(Citation)합니다.\n\n`;
            
            const eeatScore = categories.eeat || 0;
            advice += `현재 페이지의 EEAT-S 검증 점수: **${eeatScore} / 25점**\n\n`;

            advice += `#### 💡 이 페이지에 즉시 적용 가능한 EEAT-S 해결 전략:\n`;
            advice += `1. **저자 바이오(Author Profile) 삽입**:\n`;
            advice += `   - 본문 하단에 \`작성자: [저자이름]\`을 텍스트로 노출하고, 짧은 경력 약력(Bio) 한 줄을 명기하세요.\n`;
            advice += `2. **소셜 링크 및 신뢰 도메인 연결**:\n`;
            advice += `   - 저자의 LinkedIn, Twitter, GitHub 또는 공식 홈페이지 링크를 \`rel="author"\` 또는 일반 아웃바운드 링크로 삽입하세요.\n`;
            advice += `3. **최종 수정 날짜 명시 (T-Fresh 지수)**:\n`;
            advice += `   - \`최종 업데이트: 2026년 06월 09일\`과 같이 날짜 정보를 표기하면 AI 봇이 T-Fresh 지수 점수를 높게 판정합니다.\n`;
            advice += `4. **학술적/신뢰 소스 인용 (OLC 신뢰성 등급)**:\n`;
            advice += `   - 글 중간에 공신력 있는 통계자료나 외부 논문, 위키피디아 등으로 아웃바운드 링크를 최소 1~2개 연동하여 내 정보의 정당성을 입증하십시오.`;

            return advice;
        }

        // Option 3: 스키마 마크업 추천/생성
        if (queryLower.includes('스키마') || queryLower.includes('구조화') || queryLower.includes('schema')) {
            let advice = `### 📊 [${url}]에 권장하는 구조화 데이터 (Schema Markup)\n\n`;
            
            if (schema.length > 0) {
                advice += `현재 페이지에서 이미 다음 스키마가 감지되었습니다: **${schema.map(s => s.type).join(', ')}**\n\n`;
            } else {
                advice += `현재 페이지에는 구조화 데이터가 전혀 설정되어 있지 않습니다. 이는 AI 봇이 페이지의 객체를 분해하여 파악하는 데 방해가 됩니다.\n\n`;
            }

            advice += `#### 🎯 추천 스키마 모델:\n`;
            advice += `1. **FAQPage 스키마 (최우선)**: \n`;
            advice += `   - AI의 Direct Answer 요약 박스에 노출되기 위한 최적의 무기입니다.\n`;
            advice += `   - 본문에 질문과 대답이 있다면 당사 대시보드의 **'구조화된 데이터 (스키마)'** 탭에서 FAQ를 골라 필드를 채우고 JSON-LD 코드를 얻어 삽입하세요.\n\n`;
            advice += `2. **NewsArticle / BlogPosting 스키마**: \n`;
            advice += `   - 포스팅의 발행인, 저자, 발행 시간, 대표 이미지를 구글봇과 GPTBot이 일목요연하게 파악할 수 있도록 도웁니다.\n`;
            advice += `   - AEO 점수 중 '저자 권위성' 지표를 단번에 패스시켜 주는 기술입니다.\n\n`;
            advice += `#### 🛠️ 구현 예시 (FAQPage JSON-LD):\n`;
            advice += `\`\`\`json\n`;
            advice += `{\n`;
            advice += `  "@context": "https://schema.org",\n`;
            advice += `  "@type": "FAQPage",\n`;
            advice += `  "mainEntity": [{\n`;
            advice += `    "@type": "Question",\n`;
            advice += `    "name": "여기에 본문의 질문을 입력하세요",\n`;
            advice += `    "acceptedAnswer": {\n`;
            advice += `      "@type": "Answer",\n`;
            advice += `      "text": "여기에 그에 대한 핵심 요약 답변을 입력하세요."\n`;
            breakLine: `    }\n`;
            advice += `  }]\n`;
            advice += `}\n`;
            advice += `\`\`\``;

            return advice;
        }

        // Option 4: AI 봇 차단 해제 robots.txt
        if (queryLower.includes('차단') || queryLower.includes('해제') || queryLower.includes('robots') || queryLower.includes('크롤러')) {
            let advice = `### 🔓 AI 봇 크롤러 접근 허용(robots.txt) 조치법\n\n`;
            advice += `웹 서버 루트 폴더에 위치한 \`robots.txt\` 파일에 AI 크롤러 차단 명령이 들어 있을 경우, 검색 AI가 문서를 수집하지 못해 검색 결과(예: ChatGPT Search) 인용에서 영구 누락됩니다.\n\n`;
            
            advice += `#### 📋 AI 검색 인용을 위한 추천 robots.txt 셋팅:\n`;
            advice += `기존의 차단 지침(\`Disallow: /\`)을 지우고, 다음과 같이 **허용(Allow) 규칙**을 선언해 주세요.\n\n`;
            advice += `\`\`\`http\n`;
            advice += `# 1. ChatGPT 검색 및 브라우징용 봇 허용\n`;
            advice += `User-agent: GPTBot\n`;
            advice += `Allow: /\n\n`;
            advice += `User-agent: ChatGPT-User\n`;
            advice += `Allow: /\n\n`;
            advice += `# 2. Claude AI 봇 허용\n`;
            advice += `User-agent: ClaudeBot\n`;
            advice += `Allow: /\n\n`;
            advice += `# 3. Perplexity AI 검색봇 허용\n`;
            advice += `User-agent: PerplexityBot\n`;
            advice += `Allow: /\n\n`;
            advice += `# 4. Google Gemini 학습용 봇 허용\n`;
            advice += `User-agent: Google-Extended\n`;
            advice += `Allow: /\n`;
            advice += `\`\`\`\n\n`;
            advice += `> [!WARNING]\n`;
            advice += `> 만약 회사 내부 기밀이나 유료 프리미엄 회원 전용 콘텐츠, 혹은 AI가 저작권을 무단 학습(Training)하기를 원치 않는 민감 페이지의 경우에는 \`Disallow: /private-folder/\` 처럼 특정 서브 디렉토리 경로만 한정하여 차단하는 전략을 취하십시오.`;

            return advice;
        }

        // Option 5: AEO 본문 작성 글쓰기 팁
        if (queryLower.includes('팁') || queryLower.includes('글쓰기') || queryLower.includes('인용') || queryLower.includes('작성')) {
            let advice = `### ✍️ AI 검색 엔진에 인용을 잘 당하는 본문 서술 기법 (AEO Writing)\n\n`;
            advice += `생성형 AI는 정보를 종합하여 짧은 '스니펫' 형태로 변환하기 때문에, **답변 밀도(Answer Density)**가 높은 텍스트를 우선 수집합니다. 다음 5가지 법칙을 준수하세요.\n\n`;
            advice += `1. **Q&A 프레이밍 (질문과 답변)**:\n`;
            advice += `   - 소제목에 사용자들이 AI에 물어볼 만한 예상 쿼리(예: "AEO 최적화 방법은 무엇인가요?")를 던지고, 바로 아래 첫 문장에 **"AEO 최적화 방법의 핵심은 구조화 데이터 적용, 명확한 두괄식 요약문 배치..."**와 같이 직접 대답을 주십시오.\n\n`;
            advice += `2. **불필요한 수식어 배제 및 정의문 선언**:\n`;
            advice += `   - \`A는 B이다\` (\`A is defined as B\`) 형태의 정언명령식 정의(Definition) 구조는 AI가 팩트 데이터베이스로 추출하기 가장 편한 기하 구조입니다.\n\n`;
            advice += `3. **불릿 포인트 및 테이블 사용**:\n`;
            advice += `   - 줄글로 길게 늘어놓는 대신, 3개 이상의 항목은 순서 있는 목록(\`ol\`), 순서 없는 목록(\`ul\`), 혹은 표(\`table\`) 구조로 요약해 주면 AI가 답변을 복사/인용하기 매우 쉬워집니다.\n\n`;
            advice += `4. **동일 의미 유의어 확장 (Query Fan-out)**:\n`;
            advice += `   - 사용자는 동일한 대답을 얻기 위해 여러 형태로 질문합니다. 글 전체에 핵심 키워드의 동의어나 연관 주제어(예: AEO 최적화, 인용 엔진 튜닝, GEO 작업)를 문맥에 맞게 골고루 포진시켜 노출 커버리지를 높이세요.\n\n`;
            advice += `5. **사실 증명 및 수치 제공**:\n`;
            advice += `   - 모호한 어조("매우 증가했습니다")보다 객관적 통계 수치("전년 대비 42.5% 상승했습니다")를 제공할 때 AI 답변 모델이 신뢰할 만한 인용 출처로 지명합니다.`;

            return advice;
        }

        // Generic text search response
        return `**질문**: "${query}"\n\n**로컬 분석 비서 답변**:\n입력해 주신 질문에 대해 현재 분석된 웹페이지 데이터([${url}])를 대조하여 검토해 보았습니다. \n이 주제와 관련하여 현재 페이지의 취약점은 **${score < 60 ? 'AEO 스키마 마크업 부재와 낮은 인용 밀도' : '일부 AI 봇의 크롤러 권한 제한'}**으로 파악됩니다.\n\n해결하기 위해 상세 조언이나 설정 수정 가이드가 추가로 필요하신 부분이 있다면 우측의 '빠른 질문 템플릿' 버튼들을 눌러 특화 솔루션을 받아 보시기 바랍니다. \n\n*더 풍성한 LLM 실시간 답변을 원하시면, 'AI 어시스턴트 설정'에서 Gemini API Key를 등록하여 고도화된 클라우드 모델을 활성화하세요.*`;
    }

    /**
     * Ask Gemini API for advanced suggestions
     */
    static async askGemini(apiKey, query, auditData) {
        if (!apiKey) {
            throw new Error("API Key is missing");
        }

        const modelName = 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        // Build context
        const contextPrompt = `
You are "Geo Lens Midam AI 어시스턴트" - a professional on-page AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization) SEO audit consultant.
Your role is to help digital marketers, content creators, and developers optimize their website to get cited by AI engines like ChatGPT, Perplexity, Gemini, Claude, and Copilot.

Provide all answers in Korean (한글로 친절하고 전문적으로 가독성 높게 마크다운 포맷을 살려서 답변해주세요).
Be highly specific and refer to the website's audit data below when answering the user's questions.

[Audit Context for Current Webpage]
- Page URL: ${auditData.url}
- GEO Score: ${auditData.score} / 100
- 4 Pillar Scores:
  * MiDAM - SGA Score: ${auditData.categories.citeability} / 25
  * EEAT-S Score: ${auditData.categories.eeat} / 25
  * MDR Info: ${auditData.categories.multimodal} / 25
  * GEP Index: ${auditData.categories.technical} / 25
- Detected Schema Markups: ${JSON.stringify(auditData.schema.map(s => s.type))}
- Crawler Blocking Counts: Blocked: ${auditData.crawlers.stats.blocked}, Partial: ${auditData.crawlers.stats.partial}, Allowed: ${auditData.crawlers.stats.allowed}
- Heading Outline Tree Counts: H1: ${auditData.headings.stats.h1}, H2: ${auditData.headings.stats.h2}, H3: ${auditData.headings.stats.h3}

[User Query]
${query}

[AEO/GEO Best Practices to keep in mind]
1. Clear Direct Answers (Q&A format): direct short summary answers right below H2/H3 headers increase citation rate.
2. Structure (bullet lists, tables): Structured details are easily digestible for LLM bots.
3. EEAT: Clear author bio, links to socials, publication date.
4. Schema: structured data (JSON-LD) is key to feeding LLM entity knowledge bases.
5. Crawler accessibility: robots.txt must allow GPTBot, ClaudeBot, Google-Extended, PerplexityBot.

Please answer the user's request precisely and suggest actionable solutions they can copy and paste directly.
`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: contextPrompt }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1500
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
        }

        const resData = await response.json();
        if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts[0]) {
            return resData.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response format received from Gemini API");
        }
    }
}

window.AEOAssistantManager = AEOAssistantManager;
