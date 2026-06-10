/* ==========================================================================
   Geo Lens Midam - AI Crawler Database & robots.txt Rules Simulator
   ========================================================================== */

const AICrawlersList = [
    { id: 'gptbot', name: 'GPTBot', company: 'OpenAI (ChatGPT)', ua: 'GPTBot', category: 'AI Crawler', icon: 'bot' },
    { id: 'chatgpt-user', name: 'ChatGPT-User', company: 'OpenAI (Web Browsing)', ua: 'ChatGPT-User', category: 'AI Agent', icon: 'navigation' },
    { id: 'google-extended', name: 'Google-Extended', company: 'Google (Gemini)', ua: 'Google-Extended', category: 'AI Training', icon: 'cpu' },
    { id: 'googlebot', name: 'Googlebot', company: 'Google (Search & AI)', ua: 'Googlebot', category: 'Search Engine', icon: 'search' },
    { id: 'claudebot', name: 'ClaudeBot', company: 'Anthropic (Claude)', ua: 'ClaudeBot', category: 'AI Crawler', icon: 'bot' },
    { id: 'claude-web', name: 'Claude-Web', company: 'Anthropic (Claude Agent)', ua: 'Claude-Web', category: 'AI Agent', icon: 'navigation' },
    { id: 'perplexitybot', name: 'PerplexityBot', company: 'Perplexity AI', ua: 'PerplexityBot', category: 'AI Search', icon: 'search-code' },
    { id: 'perplexity-user', name: 'Perplexity-User', company: 'Perplexity (Real-time)', ua: 'Perplexity-User', category: 'AI Agent', icon: 'navigation' },
    { id: 'applebot-extended', name: 'Applebot-Extended', company: 'Apple (Apple Intelligence)', ua: 'Applebot-Extended', category: 'AI Training', icon: 'cpu' },
    { id: 'applebot', name: 'Applebot', company: 'Apple (Search & AI)', ua: 'Applebot', category: 'Search Engine', icon: 'apple' },
    { id: 'bingbot', name: 'Bingbot', company: 'Microsoft (Copilot)', ua: 'bingbot', category: 'Search Engine', icon: 'search' },
    { id: 'cohere-ai', name: 'Cohere-AI', company: 'Cohere (LLM Training)', ua: 'cohere-ai', category: 'AI Training', icon: 'cpu' },
    { id: 'meta-externalagent', name: 'Meta-ExternalAgent', company: 'Meta (Llama)', ua: 'Meta-ExternalAgent', category: 'AI Crawler', icon: 'bot' },
    { id: 'bytespider', name: 'Bytespider', company: 'ByteDance (TikTok)', ua: 'Bytespider', category: 'AI Crawler', icon: 'bot' },
    { id: 'ccbot', name: 'CCBot', company: 'Common Crawl (Datasets)', ua: 'CCBot', category: 'AI Training', icon: 'database' },
    { id: 'diffbot', name: 'Diffbot', company: 'Diffbot (AI Knowledge)', ua: 'Diffbot', category: 'AI Crawler', icon: 'network' },
    { id: 'youbot', name: 'YouBot', company: 'You.com (AI Search)', ua: 'YouBot', category: 'AI Search', icon: 'search-code' },
    { id: 'omgilibot', name: 'Omgilibot', company: 'Omgili (AI Datasets)', ua: 'Omgilibot', category: 'AI Training', icon: 'database' },
    { id: 'ia_archiver', name: 'ia_archiver', company: 'Internet Archive', ua: 'ia_archiver', category: 'Archiver', icon: 'archive' },
    { id: 'anthropic-ai', name: 'Anthropic-AI', company: 'Anthropic (Datasets)', ua: 'Anthropic-AI', category: 'AI Training', icon: 'cpu' },
    { id: 'baiduspider', name: 'Baiduspider', company: 'Baidu (Ernie Bot)', ua: 'Baiduspider', category: 'Search Engine', icon: 'search' },
    { id: 'yandexbot', name: 'YandexBot', company: 'Yandex (YandexGPT)', ua: 'YandexBot', category: 'Search Engine', icon: 'search' }
];

class AICrawlerChecker {
    /**
     * Parse robots.txt to test access rules for different bots
     * @param {string} robotsText robots.txt contents
     * @param {string} pagePath path of current page (e.g., "/blog/my-post")
     * @returns {Object} map of agent -> allow/disallow/unspecified
     */
    static parseRobotsTxt(robotsText, pagePath = '/') {
        const rules = {};
        if (!robotsText) return rules;

        // Clean lines
        const lines = robotsText.split(/\r?\n/);
        let currentAgents = [];

        for (let line of lines) {
            // Remove comments and whitespace
            line = line.split('#')[0].trim();
            if (!line) continue;

            const parts = line.split(':');
            if (parts.length < 2) continue;

            const directive = parts[0].trim().toLowerCase();
            const value = parts.slice(1).join(':').trim();

            if (directive === 'user-agent') {
                // If previous group of user agents was declared, but we are moving to next block,
                // we can start fresh.
                if (line.toLowerCase().startsWith('user-agent:')) {
                    // Start of UA block
                    const agent = value.toLowerCase();
                    currentAgents.push(agent);
                }
            } else if (directive === 'allow' || directive === 'disallow') {
                const isAllow = directive === 'allow';
                // Pattern match logic
                const pathPattern = value || '/';
                const regexPattern = this.pathToRegex(pathPattern);

                for (let agent of currentAgents) {
                    if (!rules[agent]) rules[agent] = [];
                    rules[agent].push({
                        allow: isAllow,
                        pattern: regexPattern,
                        path: pathPattern,
                        length: pathPattern.length // Longer matches have priority in robots.txt standard
                    });
                }
            } else {
                // Sitemaps or other tags, reset UA block
                currentAgents = [];
            }
        }
        return rules;
    }

    /**
     * Convert robots.txt path wildcard into Regex
     */
    static pathToRegex(path) {
        let esc = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        esc = esc.replaceAll('\\*', '.*');
        if (!esc.endsWith('$')) {
            esc = esc + '.*';
        }
        return new RegExp('^' + esc);
    }

    /**
     * Evaluate if a specific user agent is allowed to access pagePath based on parsed rules
     */
    static isBotAllowed(parsedRules, botUa, pagePath = '/') {
        const matchingAgents = ['*', botUa.toLowerCase()];
        let activeRules = [];

        // Collect all rules for matching agents
        for (let agent of matchingAgents) {
            if (parsedRules[agent]) {
                activeRules = activeRules.concat(parsedRules[agent]);
            }
        }

        if (activeRules.length === 0) {
            return 'allowed'; // Allowed by default if no rules match
        }

        // Sort rules by specificity (longest path match wins)
        activeRules.sort((a, b) => b.length - a.length);

        // Find first rule that matches the pagePath
        for (let rule of activeRules) {
            if (rule.pattern.test(pagePath)) {
                return rule.allow ? 'allowed' : 'blocked';
            }
        }

        return 'allowed';
    }

    /**
     * Check Meta Robots rules in HTML
     * @param {Document} doc Parsed DOM Document
     * @param {string} botUa Bot user agent or id
     */
    static checkMetaRobots(doc, botUa) {
        if (!doc) return 'allowed';

        const metaElements = doc.querySelectorAll('meta[name]');
        const targetNames = ['robots', botUa.toLowerCase(), 'google-extended']; // google-extended applies generally to AI training

        for (let meta of metaElements) {
            const name = meta.getAttribute('name').toLowerCase();
            if (targetNames.includes(name)) {
                const content = (meta.getAttribute('content') || '').toLowerCase();
                if (content.includes('noindex') || content.includes('none') || content.includes('disallow')) {
                    return 'blocked';
                }
            }
        }
        return 'allowed';
    }

    /**
     * Audit all crawlers from HTML content and simulated robots.txt
     */
    static auditCrawlers(htmlContent, robotsTxtContent = '', pagePath = '/') {
        let doc = null;
        try {
            const parser = new DOMParser();
            doc = parser.parseFromString(htmlContent, 'text/html');
        } catch (e) {
            console.error("DOM Parsing failed in crawler check", e);
        }

        const parsedRobotsRules = this.parseRobotsTxt(robotsTxtContent, pagePath);
        const results = [];

        let allowedCount = 0;
        let partialCount = 0;
        let blockedCount = 0;

        for (let bot of AICrawlersList) {
            // 1. Robots.txt check
            const robotsTxtStatus = this.isBotAllowed(parsedRobotsRules, bot.ua, pagePath);
            
            // 2. Meta Tag Check
            const metaStatus = this.checkMetaRobots(doc, bot.ua);

            // Combine status
            let finalStatus = 'allowed';
            let reason = 'Robots.txt & Meta Tags: ALLOW';
            let recommendation = '현재 상태가 양호합니다. AI 검색 엔진이 이 페이지의 내용을 자유롭게 인용할 수 있습니다.';

            if (robotsTxtStatus === 'blocked' && metaStatus === 'blocked') {
                finalStatus = 'blocked';
                reason = 'robots.txt 차단 + Meta Robots 차단';
                recommendation = `robots.txt에서 'Disallow'를 제거하고, HTML head에서 <meta name="${bot.ua}" content="noindex"> 태그를 삭제하세요.`;
            } else if (robotsTxtStatus === 'blocked') {
                finalStatus = 'blocked';
                reason = 'robots.txt 규칙에 의해 차단됨';
                recommendation = `robots.txt 파일에서 다음과 같은 행을 찾아서 삭제하거나 수정하세요: \n"User-agent: ${bot.ua}\nDisallow: ${pagePath}"`;
            } else if (metaStatus === 'blocked') {
                finalStatus = 'blocked';
                reason = 'robots 메타 태그에 의해 차단됨';
                recommendation = `HTML 소스의 <head> 내에서 <meta name="${bot.ua}" content="noindex"> 또는 <meta name="robots" content="noindex"> 지침을 지우거나 "index, follow"로 수정하세요.`;
            }

            // Detect partial situations (e.g. general crawler Googlebot allowed, but Google-Extended for Gemini training is blocked)
            if (bot.id === 'google-extended' && finalStatus === 'blocked') {
                const googlebotStatus = results.find(r => r.id === 'googlebot')?.status || 'allowed';
                if (googlebotStatus === 'allowed') {
                    // Google Search index is ok, but Gemini AI training is blocked
                    partialCount++;
                    results.push({
                        ...bot,
                        status: 'partial',
                        reason: '구글 검색 노출은 허용되나, Gemini AI 답변 학습용 크롤러(Google-Extended)는 차단됨',
                        recommendation: '구글 AI 답변에 인용되기 원한다면 Google-Extended 차단을 해제하고, AI 학습에만 차단하고 싶다면 현재 상태를 유지하십시오.'
                    });
                    continue;
                }
            }

            if (finalStatus === 'allowed') allowedCount++;
            else if (finalStatus === 'blocked') blockedCount++;

            results.push({
                ...bot,
                status: finalStatus,
                reason: reason,
                recommendation: recommendation
            });
        }

        return {
            crawlers: results,
            stats: {
                allowed: allowedCount,
                partial: partialCount,
                blocked: blockedCount
            }
        };
    }
}

// Global reference
window.AICrawlerChecker = AICrawlerChecker;
