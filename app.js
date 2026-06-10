/* ==========================================================================
   Geo Lens Midam - Main Application Controller & Translations
   ========================================================================== */

// Translations dictionary
const Translations = {
    ko: {
        menu_dashboard: '대시보드',
        menu_headings: '제목 구조 (HN)',
        menu_images: '이미지 최적화',
        menu_technical: '기술적 분석',
        menu_geo: 'AI 검색 준비도 (GEO)',
        menu_schema: '구조화된 데이터 (스키마)',
        menu_assistant: 'AI 어시스턴트',
        menu_tracker: '실시간 AI 키워드 추적기',
        menu_settings: '설정',
        btn_pdf_report: 'PDF 보고서 내보내기',
        txt_privacy_secured: '개인정보 보호 모드 작동 중',
        btn_analyze: '분석 시작',
        btn_paste_html: 'HTML 소스 직접 입력',
        title_geo_score: '종합 AI 검색 준비도 (GEO Score)',
        status_unanalyzed: '분석 대기 중',
        desc_unanalyzed: '웹페이지 주소를 입력하고 분석을 클릭하거나 HTML 코드를 넣어 시작하세요.',
        title_page_profile: 'AI 진단 요약 및 타겟 프로필',
        lbl_page_category: '페이지 대분류',
        lbl_readability: '본문 가독성 수준',
        lbl_schema_type: '스키마 감지 종류',
        pillar_citeability: 'MiDAM - SGA (SEO | GEO | AEO) 지수',
        desc_pillar_citeability: '구조적 문장 구성, 핵심 답변 매칭율, 리스트 밀도를 종합한 SEO/GEO/AEO 최적화 지표',
        pillar_eeat: 'EEAT-S 검증 (EEAT Authority Trust Shield)',
        desc_pillar_eeat: '작성자 공인 프로필 연동, 콘텐츠 투명성, 발행 기관 신뢰 증명 보호막',
        pillar_multimodal: 'MDR 최적화 지표 (Multimodal Document Representation)',
        desc_pillar_multimodal: '이미지 시각 맥락 분석(Alt 속성 정밀도) 및 문맥 적합 아웃바운드 링크 설계도',
        pillar_technical: 'GEP 지수 (Generative Engine Penetration)',
        desc_pillar_technical: 'AI 크롤러의 사이트 탐색 허용 범위, 엔티티 스키마 설계 적합도',
        title_aeo_checklist: 'AEO 최적화 핵심 체크리스트',
        txt_empty_analyze_first: '페이지를 분석하면 상세 체크리스트 항목이 노출됩니다.',
        title_detected_schema: '감지된 스키마 마크업',
        title_crawler_permissions: '주요 AI 봇 크롤러 권한',
        title_heading_structure: 'HTML 제목 태그 계층 구조 (H1 ~ H6)',
        desc_heading_structure: '제목 태그의 유무와 계층적 정렬을 분석합니다. H1의 중복 사용이나 상위 수준 건너뛰기는 AI의 문서 의미 맥락 파악을 저해합니다.',
        subtitle_heading_outline: '페이지 헤딩 아웃라인 구조',
        subtitle_heading_rules: '헤더 가이드 및 권고사항',
        lbl_total_images: '총 이미지 수',
        lbl_alt_present: 'Alt 태그 존재',
        lbl_alt_missing: 'Alt 태그 누락',
        lbl_potential_webp: '차세대 포맷 사용 가능',
        title_image_alt_list: '이미지 Alt 텍스트 분석 상세',
        desc_image_alt_list: '멀티모달 AI는 이미지의 alt 속성을 읽어 텍스트와 이미지의 맥락을 연결합니다. 정확한 묘사는 인용율을 높입니다.',
        th_preview: '미리보기',
        th_filename: '파일명/경로',
        th_format: '포맷',
        th_alt_text: 'Alt 설명 속성',
        th_status: '상태',
        title_tech_seo_audit: '기본 SEO 기술 요구 규격',
        title_page_performance: '페이지 리소스 및 구성 요소',
        title_metadata_analysis: '메타데이터(SEO/SNS) 설정 값 검사',
        th_meta_tag_name: '메타 태그명',
        th_meta_content: '설정값 (Content)',
        th_length: '길이',
        th_status: '상태 피드백',
        title_geo_metrics_breakdown: '7대 GEO 정밀 지표 진단',
        title_snippet_extractability: '인용 스니펫 추출 가능성 진단',
        desc_snippet_extractability: 'AI 답변 엔진이 페이지 본문에서 정답 또는 핵심 요약 스니펫으로 발췌하기에 용이한 문단들을 분석합니다.',
        title_ai_crawler_status: 'AI 크롤러 권한 & robots.txt 차단 상태 정밀 검사',
        desc_ai_crawler_status: 'ChatGPT, Claude, Perplexity 등 주요 AI 검색 엔진 크롤러들의 페이지 접근 여부를 robots.txt 룰, 메타 지침을 종합 검토하여 산출합니다.',
        c_allowed: '허용됨',
        c_partial: '부분 차단',
        c_blocked: '차단됨',
        title_detected_markup: '1단계: 기존 스키마 감지 및 검증',
        title_create_schema: '2단계: 원클릭 스키마 마크업 생성기',
        desc_create_schema: 'AI 답변 엔진에 페이지의 엔티티 구조를 선언해주는 JSON-LD 코드를 생성합니다.',
        lbl_select_schema_type: '만들고자 하는 스키마 유형 선택',
        btn_autofill_schema: '현재 분석된 정보로 필드 자동 채우기',
        btn_generate_schema: 'JSON-LD 코드 생성',
        title_schema_code_output: '생성된 JSON-LD 마크업 결과',
        desc_schema_code_output: '생성된 코드를 복사하여 웹사이트의 <head> 혹은 <body> 섹션에 삽입하세요.',
        btn_copy: '복사',
        subtitle_how_to_install: '웹사이트 적용 가이드',
        schema_install_step1: "위의 '복사' 버튼을 클릭하여 코드를 복사합니다.",
        schema_install_step2: "사이트 HTML 소스 내 </head> 직전에 붙여넣습니다.",
        schema_install_step3: "티스토리/워드프레스 등에서는 HTML 편집 창에서 진행합니다.",
        schema_install_step4: "구글 리치 결과 테스트 도구로 검증을 실행해 보세요.",
        title_ai_advisor: 'Geo Lens Midam AI 어시스턴트',
        chat_welcome: '안녕하세요! Geo Lens Midam AI 최적화 비서입니다. 분석된 웹페이지의 답변 엔진 최적화(AEO) 및 검색 엔진 최적화(GEO) 점수를 기반으로 무엇을 도와드릴까요?',
        title_quick_queries: '빠른 질문 템플릿',
        desc_quick_queries: '자주 묻는 최적화 질문을 클릭하면 어시스턴트가 분석 보고서 기반의 맞춤 솔루션을 답변합니다.',
        q_aeo_summary: 'AEO 점수 및 요약 조언',
        q_eeat_improve: 'E-E-A-T 신호 보강하기',
        q_schema_recommend: '스키마 마크업 추천/생성',
        q_unblock_bot: 'AI 봇 차단 해제 robots.txt',
        q_citation_tips: 'AEO 본문 작성 글쓰기 팁',
        subtitle_ai_settings: 'AI 어시스턴트 설정',
        lbl_ai_mode: '구동 모드',
        lbl_gemini_key: 'Gemini API Key',
        help_gemini_key: '입력하신 API Key는 로컬 브라우저 저장소(localStorage)에만 안전하게 보관됩니다.',
        title_general_settings: '일반 설정 & 분석 프록시',
        desc_general_settings: '애플리케이션의 크롤링 및 다국어 관련 매개변수를 조정합니다.',
        lbl_cors_proxy: 'CORS 우회 프록시 서버 주소',
        help_cors_proxy: '웹페이지 주소(URL)로 직접 분석할 때 CORS 제한을 푸는 프록시 주소입니다. HTML 직접 입력을 권장합니다.',
        lbl_demo_mode: 'CORS 차단 시 데모 데이터 로드',
        lbl_demo_mode_active: 'Fetch 실패 시 현실적인 데모 모드 리포트 자동 생성',
        lbl_default_lang: '기본 구동 언어',
        btn_save_settings: '설정 저장',
        modal_title_paste: 'HTML 소스 직접 입력하여 분석하기',
        modal_desc_paste: 'CORS 제한으로 URL 분석이 불가능할 경우 소스코드를 붙여넣으세요.',
        lbl_virtual_url: '가상 URL (선택 사항)',
        lbl_html_source: 'HTML 소스 코드',
        btn_cancel: '취소',
        btn_run_analysis: '소스 분석 시작'
    },
    en: {
        menu_dashboard: 'Dashboard',
        menu_headings: 'Heading Structure (HN)',
        menu_images: 'Image Optimization',
        menu_technical: 'Technical Audit',
        menu_geo: 'AI Search Readiness (GEO)',
        menu_schema: 'Structured Data (Schema)',
        menu_assistant: 'AI Assistant',
        menu_tracker: 'AI Keyword Tracker',
        menu_settings: 'Settings',
        btn_pdf_report: 'Export PDF Report',
        txt_privacy_secured: 'Privacy Protection Mode Enabled',
        btn_analyze: 'Start Analysis',
        btn_paste_html: 'Input HTML Directly',
        title_geo_score: 'Overall AI Search Readiness (GEO Score)',
        status_unanalyzed: 'Pending Analysis',
        desc_unanalyzed: 'Enter a website URL and click analyze or paste HTML code to start.',
        title_page_profile: 'AI Diagnosis & Target Profile',
        lbl_page_category: 'Page Classification',
        lbl_readability: 'Body Readability Level',
        lbl_schema_type: 'Detected Schema Types',
        pillar_citeability: 'MiDAM - SGA (SEO | GEO | AEO) Index',
        desc_pillar_citeability: 'Holistic score analyzing sentence layouts, direct question-answer matching, and key element density.',
        pillar_eeat: 'EEAT-S Verification (EEAT Authority Trust Shield)',
        desc_pillar_eeat: 'Evaluates author profile links, publisher transparency, and document credibility shields.',
        pillar_multimodal: 'MDR Optimization (Multimodal Document Representation)',
        desc_pillar_multimodal: 'Measures visual-textual context matching (Alt texts) and contextual link integration layouts.',
        pillar_technical: 'GEP Index (Generative Engine Penetration)',
        desc_pillar_technical: 'Evaluates AI scraper clearance, document size limits, and semantic schema compliance.',
        title_aeo_checklist: 'AEO Optimization Key Checklist',
        txt_empty_analyze_first: 'Analyze a page to unlock checklist and optimization details.',
        title_detected_schema: 'Detected Schema Markup',
        title_crawler_permissions: 'Key AI Bot Crawler Status',
        title_heading_structure: 'HTML Heading Tags Hierarchy (H1 ~ H6)',
        desc_heading_structure: 'Analyzes presence and nesting of headers. Duplicated H1s or skipped levels decrease LLM semantic parsing.',
        subtitle_heading_outline: 'Page Heading Outline Structure',
        subtitle_heading_rules: 'Header Guidelines & Recommendations',
        lbl_total_images: 'Total Images',
        lbl_alt_present: 'Alt Tag Present',
        lbl_alt_missing: 'Alt Tag Missing',
        lbl_potential_webp: 'WebP Savings Potential',
        title_image_alt_list: 'Image Alt Text Analysis details',
        desc_image_alt_list: 'Multimodal AI reads alt descriptions to connect images with text contexts. Accurate text increases citation rates.',
        th_preview: 'Preview',
        th_filename: 'Filename/Path',
        th_format: 'Format',
        th_alt_text: 'Alt Description Attribute',
        th_status: 'Status',
        title_tech_seo_audit: 'General Technical SEO Requirements',
        title_page_performance: 'Page Resources & Assets',
        title_metadata_analysis: 'Metadata (SEO/Social) Configuration Audit',
        th_meta_tag_name: 'Meta Tag Name',
        th_meta_content: 'Value (Content)',
        th_length: 'Length',
        th_status: 'Status Feedback',
        title_geo_metrics_breakdown: '7 Core GEO Metrics Diagnostics',
        title_snippet_extractability: 'Citable Snippet Extractability Diagnosis',
        desc_snippet_extractability: 'Analyzes paragraphs in the content body to gauge how easily AI engines can extract them as direct answers.',
        title_ai_crawler_status: 'AI Crawler Rights & robots.txt Block Audit',
        desc_ai_crawler_status: 'Examines robots.txt and robot meta directives for major AI scrapers like GPTBot, ClaudeBot, and Perplexity.',
        c_allowed: 'Allowed',
        c_partial: 'Partial Block',
        c_blocked: 'Blocked',
        title_detected_markup: 'Step 1: Detect and Validate Existing Schema',
        title_create_schema: 'Step 2: One-Click Schema Markup Generator',
        desc_create_schema: 'Creates JSON-LD script declaring page entity structures to feed LLM knowledge graphs.',
        lbl_select_schema_type: 'Select Schema Class to Generate',
        btn_autofill_schema: 'Auto-fill fields from analyzed page data',
        btn_generate_schema: 'Generate JSON-LD Code',
        title_schema_code_output: 'Generated JSON-LD Code Output',
        desc_schema_code_output: 'Copy the script below and insert it into your head or body tags.',
        btn_copy: 'Copy',
        subtitle_how_to_install: 'Installation Guide',
        schema_install_step1: "Click the 'Copy' button above to copy the script.",
        schema_install_step2: "Paste it right before the </head> tag of your site.",
        schema_install_step3: "For WordPress/Tistory, use HTML code insertion mode.",
        schema_install_step4: "Test it in the Google Rich Results tool to verify.",
        title_ai_advisor: 'Geo Lens Midam AI Assistant',
        chat_welcome: 'Hello! I am your Geo Lens Midam optimization advisor. Ask me anything about AEO, GEO, schema markup, or robots.txt settings.',
        title_quick_queries: 'Quick Question Templates',
        desc_quick_queries: 'Click a preset question, and the assistant will answer based on your live audit results.',
        q_aeo_summary: 'AEO Scores & Priority Tips',
        q_eeat_improve: 'Boosting E-E-A-T Signals',
        q_schema_recommend: 'Recommend/Create Schema Markup',
        q_unblock_bot: 'Unblocking AI Crawlers via robots.txt',
        q_citation_tips: 'AEO Content Writing Best Practices',
        subtitle_ai_settings: 'AI Assistant Configuration',
        lbl_ai_mode: 'Inference Mode',
        lbl_gemini_key: 'Gemini API Key',
        help_gemini_key: 'Your API Key is saved locally in your browser (localStorage).',
        title_general_settings: 'General Settings & Scraper Proxy',
        desc_general_settings: 'Configure crawling proxy options and application default language.',
        lbl_cors_proxy: 'CORS Bypass Proxy URL',
        help_cors_proxy: 'Proxy URL for fetching external web pages. Paste HTML directly if blocked.',
        lbl_demo_mode: 'Load Demo Data on Scrape Failure',
        lbl_demo_mode_active: 'Auto-generate realistic demo data when external fetches fail',
        lbl_default_lang: 'Default Language',
        btn_save_settings: 'Save Settings',
        modal_title_paste: 'Input HTML Source Code Directly',
        modal_desc_paste: 'If CORS blocks direct URL checks, copy and paste the page HTML here.',
        lbl_virtual_url: 'Virtual URL (Optional)',
        lbl_html_source: 'HTML Source Code',
        btn_cancel: 'Cancel',
        btn_run_analysis: 'Analyze HTML Code'
    }
};

// Add translations for the remaining 10 languages
const LanguageOverrides = {
    ja: {
        menu_dashboard: 'ダッシュボード',
        menu_headings: '見出し構造 (HN)',
        menu_images: '画像の最適化',
        menu_technical: '技術的分析',
        menu_geo: 'AI検索準備度 (GEO)',
        menu_schema: '構造化データ (スキーマ)',
        menu_assistant: 'AI アシスタント',
        menu_tracker: 'リアルタイムAIキーワード追跡器',
        menu_settings: '設定',
        btn_pdf_report: 'PDFレポートのエクスポート',
        btn_analyze: '分析開始',
        btn_paste_html: 'HTMLを直接入力',
        title_geo_score: '総合AI検索準備度 (GEO Score)',
        status_unanalyzed: '分析待機中',
        title_page_profile: 'AI診断概要とターゲットプロファイル',
        chat_welcome: 'こんにちは！Geo Lens Midam AI最適화アシスタントです。何をお手伝いしましょうか？'
    },
    zh: {
        menu_dashboard: '仪表板',
        menu_headings: '标题结构 (HN)',
        menu_images: '图片优化',
        menu_technical: '技术分析',
        menu_geo: 'AI 搜索准备度 (GEO)',
        menu_schema: '结构化数据 (Schema)',
        menu_assistant: 'AI 助手',
        menu_tracker: '实时 AI 关键词追踪器',
        menu_settings: '设置',
        btn_pdf_report: '导出 PDF 报告',
        btn_analyze: '开始分析',
        btn_paste_html: '直接输入 HTML',
        title_geo_score: '综合 AI 搜索准备度 (GEO Score)',
        status_unanalyzed: '等待分析',
        title_page_profile: 'AI 诊断摘要和目标概况',
        chat_welcome: '您好！我是 Geo Lens Midam AI 优化助手。今天有什么我可以帮您的？'
    },
    fr: {
        menu_dashboard: 'Tableau de bord',
        menu_headings: 'Structure des titres (HN)',
        menu_images: 'Optimisation des images',
        menu_technical: 'Analyse technique',
        menu_geo: 'Préparation à la recherche IA (GEO)',
        menu_schema: 'Données structurées (Schema)',
        menu_assistant: 'Assistant IA',
        menu_tracker: 'Suivi des mots-clés IA en temps réel',
        menu_settings: 'Paramètres',
        btn_pdf_report: 'Exporter le rapport PDF',
        btn_analyze: 'Lancer l\'analyse',
        btn_paste_html: 'Saisir le code HTML',
        title_geo_score: 'Score global de préparation IA (GEO Score)',
        status_unanalyzed: 'En attente d\'analyse',
        title_page_profile: 'Résumé de diagnostic IA & Profil',
        chat_welcome: 'Bonjour! Je suis l\'assistant d\'optimisation Geo Lens Midam. Comment puis-je vous aider?'
    },
    de: {
        menu_dashboard: 'Dashboard',
        menu_headings: 'Überschriftenstruktur (HN)',
        menu_images: 'Bildoptimierung',
        menu_technical: 'Technische Analyse',
        menu_geo: 'KI-Suchbereitschaft (GEO)',
        menu_schema: 'Strukturierte Daten (Schema)',
        menu_assistant: 'KI-Assistent',
        menu_tracker: 'Echtzeit-KI-Keyword-Tracker',
        menu_settings: 'Einstellungen',
        btn_pdf_report: 'PDF-Bericht exportieren',
        btn_analyze: 'Analyse starten',
        btn_paste_html: 'HTML direkt eingeben',
        title_geo_score: 'Gesamter KI-Suchbereitschafts-Score (GEO Score)',
        status_unanalyzed: 'Warten auf Analyse',
        title_page_profile: 'KI-Diagnose-Zusammenfassung & Profil',
        chat_welcome: 'Hallo! Ich bin Ihr Geo Lens Midam Optimierungs-Assistent. Wie kann ich Ihnen helfen?'
    },
    es: {
        menu_dashboard: 'Tablero',
        menu_headings: 'Estructura de títulos (HN)',
        menu_images: 'Optimización de imágenes',
        menu_technical: 'Análisis técnico',
        menu_geo: 'Preparación para búsqueda IA (GEO)',
        menu_schema: 'Datos estructurados (Esquema)',
        menu_assistant: 'Asistente de IA',
        menu_tracker: 'Rastreador de palabras clave de IA en tiempo real',
        menu_settings: 'Configuración',
        btn_pdf_report: 'Exportar informe PDF',
        btn_analyze: 'Iniciar análisis',
        btn_paste_html: 'Ingresar HTML directamente',
        title_geo_score: 'Puntuación global de preparación IA (GEO Score)',
        status_unanalyzed: 'Esperando análisis',
        title_page_profile: 'Resumen de diagnóstico IA y Perfil',
        chat_welcome: '¡Hola! Soy su asistente de optimización Geo Lens Midam. ¿En qué puedo ayudarle hoy?'
    },
    pt: {
        menu_dashboard: 'Painel',
        menu_headings: 'Estrutura de Títulos (HN)',
        menu_images: 'Otimização de Imagens',
        menu_technical: 'Análise Técnica',
        menu_geo: 'Prontidão para Busca de IA (GEO)',
        menu_schema: 'Dados Estruturados (Schema)',
        menu_assistant: 'Assistente de IA',
        menu_settings: 'Configurações',
        btn_pdf_report: 'Exportar Relatório PDF',
        btn_analyze: 'Iniciar Análise',
        btn_paste_html: 'Inserir HTML Diretamente',
        title_geo_score: 'Pontuação Global de Prontidão IA (GEO Score)',
        status_unanalyzed: 'Aguardando análise',
        title_page_profile: 'Resumo do Diagnóstico IA e Perfil',
        chat_welcome: 'Olá! Sou o seu assistente de otimização Geo Lens Midam. Como posso ajudar?'
    },
    it: {
        menu_dashboard: 'Pannello',
        menu_headings: 'Struttura dei titoli (HN)',
        menu_images: 'Ottimizzazione immagini',
        menu_technical: 'Analisi tecnica',
        menu_geo: 'Prontezza della ricerca AI (GEO)',
        menu_schema: 'Dati strutturati (Schema)',
        menu_assistant: 'Assistente IA',
        menu_settings: 'Impostazioni',
        btn_pdf_report: 'Esporta rapporto PDF',
        btn_analyze: 'Avvia analisi',
        btn_paste_html: 'Inserisci HTML direttamente',
        title_geo_score: 'Punteggio globale di prontezza AI (GEO Score)',
        status_unanalyzed: 'In attesa di analisi',
        title_page_profile: 'Riepilogo diagnostico AI e Profilo',
        chat_welcome: 'Ciao! Sono il tuo assistente per l\'ottimizzazione Geo Lens Midam. Come posso aiutarti?'
    },
    ru: {
        menu_dashboard: 'Панель управления',
        menu_headings: 'Структура заголовков (HN)',
        menu_images: 'Оптимизация изображений',
        menu_technical: 'Технический анализ',
        menu_geo: 'Готовность к поиску ИИ (GEO)',
        menu_schema: 'Структурированные данные (Схема)',
        menu_assistant: 'ИИ-помощник',
        menu_settings: 'Настройки',
        btn_pdf_report: 'Экспорт отчета в PDF',
        btn_analyze: 'Начать анализ',
        btn_paste_html: 'Ввести HTML напрямую',
        title_geo_score: 'Общий балл готовности к ИИ (GEO Score)',
        status_unanalyzed: 'Ожидание анализа',
        title_page_profile: 'Сводка диагностики ИИ и Профиль',
        chat_welcome: 'Здравствуйте! Я ваш ИИ-помощник по оптимизации Geo Lens Midam. Чем могу помочь?'
    },
    vi: {
        menu_dashboard: 'Bảng điều khiển',
        menu_headings: 'Cấu trúc tiêu đề (HN)',
        menu_images: 'Tối ưu hóa hình ảnh',
        menu_technical: 'Phân tích kỹ thuật',
        menu_geo: 'Sẵn sàng tìm kiếm AI (GEO)',
        menu_schema: 'Dữ liệu cấu trúc (Schema)',
        menu_assistant: 'Trợ lý AI',
        menu_settings: 'Cài đặt',
        btn_pdf_report: 'Xuất báo cáo PDF',
        btn_analyze: 'Bắt đầu phân tích',
        btn_paste_html: 'Nhập trực tiếp HTML',
        title_geo_score: 'Điểm sẵn sàng tìm kiếm AI (GEO Score)',
        status_unanalyzed: 'Đang chờ phân tích',
        title_page_profile: 'Tóm tắt chẩn đoán AI & Hồ sơ',
        chat_welcome: 'Xin chào! Tôi là trợ lý tối ưu hóa Geo Lens Midam. Tôi có thể giúp gì cho bạn?'
    },
    id: {
        menu_dashboard: 'Dasbor',
        menu_headings: 'Struktur Judul (HN)',
        menu_images: 'Optimisasi Gambar',
        menu_technical: 'Analisi Teknis',
        menu_geo: 'Kesiapan Pencarian AI (GEO)',
        menu_schema: 'Data Terstruktur (Schema)',
        menu_assistant: 'Asisten AI',
        menu_settings: 'Pengaturan',
        btn_pdf_report: 'Ekspor Laporan PDF',
        btn_analyze: 'Mulai Analisis',
        btn_paste_html: 'Masukkan HTML Langsung',
        title_geo_score: 'Skor Kesiapan Pencarian AI (GEO Score)',
        status_unanalyzed: 'Menunggu analisis',
        title_page_profile: 'Ringkasan Diagnosis AI & Profil',
        chat_welcome: 'Halo! Saya asisten optimisasi Geo Lens Midam Anda. Ada yang bisa saya bantu?'
    }
};

// Build and merge translations
const otherLangCodes = ['ja', 'zh', 'fr', 'de', 'es', 'pt', 'it', 'ru', 'vi', 'id'];
for (let lang of otherLangCodes) {
    Translations[lang] = {
        ...Translations.en, // fallback
        ...LanguageOverrides[lang]
    };
}

class AppController {
    constructor() {
        this.currentLang = 'ko';
        this.activeTab = 'dashboard';
        this.auditData = null;
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.proxyUrl = localStorage.getItem('cors_proxy_url') || 'https://corsproxy.io/?';
        this.demoModeActive = localStorage.getItem('demo_mode_active') !== 'false';

        this.init();
    }

    init() {
        // Initialize Lucide icons
        lucide.createIcons();

        // Load settings from local storage
        document.getElementById('gemini-api-key').value = this.apiKey;
        document.getElementById('settings-proxy-url').value = this.proxyUrl;
        document.getElementById('settings-demo-mode').checked = this.demoModeActive;

        // Hook up Navigation tabs
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Search action
        document.getElementById('btn-analyze').addEventListener('click', () => this.runUrlAnalysis());
        document.getElementById('target-url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.runUrlAnalysis();
        });

        // Paste Modal actions
        const pasteModal = document.getElementById('modal-paste-html-overlay');
        document.getElementById('btn-paste-html').addEventListener('click', () => {
            pasteModal.style.display = 'flex';
        });
        document.getElementById('btn-close-paste-modal').addEventListener('click', () => {
            pasteModal.style.display = 'none';
        });
        document.getElementById('btn-cancel-paste').addEventListener('click', () => {
            pasteModal.style.display = 'none';
        });
        document.getElementById('btn-run-paste-analysis').addEventListener('click', () => this.runPasteAnalysis());

        // Schema Selector dynamic updates
        const schemaSelect = document.getElementById('schema-type-select');
        schemaSelect.addEventListener('change', () => this.renderSchemaFields(schemaSelect.value));
        document.getElementById('btn-generate-schema-code').addEventListener('click', () => this.generateSchemaJson());
        document.getElementById('btn-autofill-schema').addEventListener('click', () => this.autofillSchemaFields());
        document.getElementById('btn-copy-schema').addEventListener('click', () => this.copySchemaCode());

        // AI Chat actions
        document.getElementById('btn-send-chat').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        
        // Preset question buttons
        const presetBtns = document.querySelectorAll('.btn-preset');
        presetBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                this.sendChatMessage(query);
            });
        });

        // AI mode selector
        const aiMode = document.getElementById('ai-mode-select');
        const keyWrapper = document.getElementById('gemini-key-wrapper');
        aiMode.addEventListener('change', () => {
            keyWrapper.style.display = aiMode.value === 'gemini' ? 'flex' : 'none';
        });

        // Save settings action
        document.getElementById('btn-save-settings').addEventListener('click', () => this.saveSettings());

        // Language Selectors
        const langSelectTop = document.getElementById('lang-select');
        const langSelectSettings = document.getElementById('settings-lang');

        langSelectTop.addEventListener('change', (e) => {
            this.switchLanguage(e.target.value);
            langSelectSettings.value = e.target.value;
        });

        langSelectSettings.addEventListener('change', (e) => {
            this.switchLanguage(e.target.value);
            langSelectTop.value = e.target.value;
        });

        // PDF print triggers and layout preparation for hidden tab elements
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('is-printing');
        });
        window.addEventListener('afterprint', () => {
            document.body.classList.remove('is-printing');
        });
        document.getElementById('btn-pdf-audit').addEventListener('click', () => {
            // Apply printing styles and force synchronous screen layout reflow in Chrome
            document.body.classList.add('is-printing');
            document.body.offsetHeight; // Force layout recalculation
            
            // Allow browser 150ms to paint unrolled layouts before showing print dialog
            setTimeout(() => {
                window.print();
            }, 150);
        });

        // Initial schema fields render
        this.renderSchemaFields('FAQPage');
        this.switchLanguage(this.currentLang);

        // Inject print branding header dynamically to all printable tab panes
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach(pane => {
            if (pane.id === 'view-settings' || pane.id === 'view-assistant' || pane.querySelector('.print-branding-header')) return;
            
            const header = document.createElement('div');
            header.className = 'print-branding-header';
            header.innerHTML = `
                <span class="brand-text">GEO | AEO 전문기업 미담공장 AX</span>
                <span class="report-date">Geo Lens Midam Web Audit Report</span>
            `;
            pane.insertBefore(header, pane.firstChild);
        });
    }

    switchTab(tabId) {
        // Update navigation classes
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update view containers
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach(pane => {
            if (pane.id === `view-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        this.activeTab = tabId;
    }

    switchLanguage(langCode) {
        if (!Translations[langCode]) return;
        this.currentLang = langCode;

        // Apply general translations to data-i18n attributes
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (Translations[langCode][key]) {
                // If element has icon, preserve it
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.innerHTML += ' ' + Translations[langCode][key];
                } else {
                    el.textContent = Translations[langCode][key];
                }
            }
        });

        // Update input placeholders if needed
        const urlInput = document.getElementById('target-url');
        if (langCode === 'ko') {
            urlInput.placeholder = '분석할 웹페이지 주소를 입력하세요 (예: https://example.com)';
        } else {
            urlInput.placeholder = 'Enter webpage URL to audit (e.g. https://example.com)';
        }
    }

    saveSettings() {
        this.proxyUrl = document.getElementById('settings-proxy-url').value.trim();
        this.demoModeActive = document.getElementById('settings-demo-mode').checked;
        this.apiKey = document.getElementById('gemini-api-key').value.trim();

        localStorage.setItem('cors_proxy_url', this.proxyUrl);
        localStorage.setItem('demo_mode_active', this.demoModeActive);
        localStorage.setItem('gemini_api_key', this.apiKey);

        alert(this.currentLang === 'ko' ? '설정이 성공적으로 저장되었습니다!' : 'Settings saved successfully!');
    }

    async runUrlAnalysis() {
        const urlInput = document.getElementById('target-url');
        const url = urlInput.value.trim();
        if (!url) {
            alert(this.currentLang === 'ko' ? '주소를 입력하세요.' : 'Please enter a URL.');
            return;
        }

        // Show loading state
        const btn = document.getElementById('btn-analyze');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> 분석 중...`;
        lucide.createIcons();

        try {
            // Attempt to scrape via Proxy
            let htmlContent = '';
            let fetchSuccess = false;
            let isDemo = false;

            if (url.startsWith('http')) {
                try {
                    // Try fetch via proxy
                    const response = await fetch(this.proxyUrl + url);
                    if (response.ok) {
                        htmlContent = await response.text();
                        fetchSuccess = true;
                    }
                } catch (err) {
                    console.warn("Proxy Fetch failed, trying fallback...", err);
                }
            }

            if (!fetchSuccess) {
                if (this.demoModeActive) {
                    // Generate highly realistic mock data for demo / pitch
                    htmlContent = this.generateRealisticMockHTML(url);
                    isDemo = true;
                } else {
                    throw new Error("CORS 블록으로 인해 직접 Fetch를 실행할 수 없습니다. 'HTML 직접 입력' 모드를 이용해 주세요.");
                }
            }

            // Run analysis
            this.auditData = window.AEOPageAnalyzer.analyze(htmlContent, url);
            this.auditData.isDemo = isDemo;
            
            // Add Crawler check (robots.txt simulation)
            const robotsTxtSim = this.generateSimulatedRobotsTxt(url);
            const crawlerAudit = window.AICrawlerChecker.auditCrawlers(htmlContent, robotsTxtSim, new URL(url).pathname || '/');
            this.auditData.crawlers = crawlerAudit;

            // Render all views
            this.renderAuditResults(htmlContent);
        } catch (e) {
            alert(e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
            lucide.createIcons();
        }
    }

    runPasteAnalysis() {
        const virtualUrl = document.getElementById('paste-virtual-url').value.trim() || 'https://mysite.com/page-to-test';
        const html = document.getElementById('paste-html-area').value;
        if (!html.trim()) {
            alert(this.currentLang === 'ko' ? 'HTML 코드를 입력해 주세요.' : 'Please paste some HTML.');
            return;
        }

        // Hide Modal
        document.getElementById('modal-paste-html-overlay').style.display = 'none';

        // Perform analysis
        this.auditData = window.AEOPageAnalyzer.analyze(html, virtualUrl);
        this.auditData.isDemo = false;

        // Simulate a robots.txt allowing some, blocking others for realistic client pitch
        const mockRobots = `
User-agent: *
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Disallow: /
        `;
        const crawlerAudit = window.AICrawlerChecker.auditCrawlers(html, mockRobots, '/');
        this.auditData.crawlers = crawlerAudit;

        // Render dashboard
        this.renderAuditResults(html);
    }

    renderAuditResults(htmlContent) {
        if (!this.auditData) return;

        // Show URL info bar
        const infoBar = document.getElementById('url-info-bar');
        infoBar.style.display = 'flex';
        document.getElementById('analyzed-url-text').textContent = this.auditData.url;

        // Update Category Badges
        document.getElementById('badge-page-type').textContent = this.auditData.pageType;
        document.getElementById('badge-schema-status').textContent = this.auditData.schema.length > 0 ? 'SCHEMA FOUND' : 'NO SCHEMA';
        document.getElementById('badge-schema-status').className = this.auditData.schema.length > 0 ? 'badge badge-green' : 'badge badge-purple';

        // Update Origin Badge dynamically
        let originBadge = document.getElementById('badge-data-origin');
        if (!originBadge) {
            originBadge = document.createElement('span');
            originBadge.id = 'badge-data-origin';
            document.getElementById('detected-badges').appendChild(originBadge);
        }
        if (this.auditData.isDemo) {
            originBadge.className = 'badge badge-purple';
            originBadge.textContent = this.currentLang === 'ko' ? '데모 시뮬레이션' : 'DEMO SIMULATED';
        } else {
            originBadge.className = 'badge badge-green';
            originBadge.textContent = this.currentLang === 'ko' ? '실시간 라이브 분석' : 'LIVE SCRAPED';
        }

        // 1. DASHBOARD VIEW RENDER
        // Animated Score Ring
        const scoreCircle = document.getElementById('geo-score-circle');
        const scoreVal = document.getElementById('geo-score-value');
        const scoreStatus = document.getElementById('geo-score-status');
        const scoreDesc = document.getElementById('geo-score-desc');
        
        const score = this.auditData.score;
        scoreVal.textContent = score;

        // SVG ring dash offset mapping (r=40 -> circumference ~251.2)
        const offset = 251.2 - (251.2 * score) / 100;
        scoreCircle.style.strokeDashoffset = offset;

        // Color and status text based on score
        if (score >= 80) {
            scoreCircle.className.baseVal = 'progress-circle stroke-neon-green';
            scoreStatus.textContent = this.currentLang === 'ko' ? '우수 (EXCELLENT)' : 'EXCELLENT';
            scoreStatus.className = 'score-status text-neon-green';
            scoreDesc.innerHTML = this.currentLang === 'ko' ? 'AI 엔진이 최적의 콘텐츠 구조와 풍부한 스키마를 바탕으로 정보를 쉽게 인용할 수 있습니다.' : 'Excellent structure. High probability of AI citation.';
        } else if (score >= 55) {
            scoreCircle.className.baseVal = 'progress-circle stroke-neon-yellow';
            scoreStatus.textContent = this.currentLang === 'ko' ? '보통 (MODERATE)' : 'MODERATE';
            scoreStatus.className = 'score-status text-neon-yellow';
            scoreDesc.innerHTML = this.currentLang === 'ko' ? '기본 틀은 잡혔으나, 일부 AI 봇 차단이나 스키마 누락 등 부분 결함을 신속히 시정해야 인용률이 늘어납니다.' : 'Moderate optimization. Some blockers found.';
        } else {
            scoreCircle.className.baseVal = 'progress-circle stroke-neon-red';
            scoreStatus.textContent = this.currentLang === 'ko' ? '미흡 (POOR)' : 'POOR';
            scoreStatus.className = 'score-status text-neon-red';
            scoreDesc.innerHTML = this.currentLang === 'ko' ? 'AI 검색 엔진의 접근이 불투명하거나 스키마 및 가독성 지표의 점수가 매우 낮습니다. 우선순위 교정 가이드를 따르세요.' : 'Critical issues found. Poor crawler accessibility.';
        }

        if (this.auditData.isDemo) {
            scoreDesc.innerHTML += `<br><span style="color:var(--neon-yellow); font-weight:600; font-size:11px; display:inline-block; margin-top:5px;">⚠️ 방화벽/CORS 차단으로 인해 100% 실시간 데이터 수집이 지연되어 고유 해시 데모 데이터를 렌더링했습니다. 실 데이터 분석을 하려면 상단 우측의 'HTML 소스 직접 입력' 기능을 사용하세요.</span>`;
        }

        // Profile details
        document.getElementById('profile-category').textContent = this.auditData.pageType;
        document.getElementById('profile-readability').textContent = this.auditData.textStats.readabilityLabel;
        document.getElementById('profile-schema').textContent = this.auditData.schema.length > 0 ? this.auditData.schema.map(s => s.type).join(', ') : '검출 없음';

        // 4 Pillars Bars
        const cat = this.auditData.categories;
        document.getElementById('score-pillar-citeability').textContent = `${cat.citeability}/25`;
        document.getElementById('fill-pillar-citeability').style.width = `${(cat.citeability / 25) * 100}%`;

        document.getElementById('score-pillar-eeat').textContent = `${cat.eeat}/25`;
        document.getElementById('fill-pillar-eeat').style.width = `${(cat.eeat / 25) * 100}%`;

        document.getElementById('score-pillar-multimodal').textContent = `${cat.multimodal}/25`;
        document.getElementById('fill-pillar-multimodal').style.width = `${(cat.multimodal / 25) * 100}%`;

        document.getElementById('score-pillar-technical').textContent = `${cat.technical}/25`;
        document.getElementById('fill-pillar-technical').style.width = `${(cat.technical / 25) * 100}%`;

        // Checklist Rendering
        const checklistDiv = document.getElementById('dashboard-aeo-checklist');
        checklistDiv.innerHTML = '';
        this.auditData.checklist.forEach((item) => {
            const chk = document.createElement('div');
            chk.className = `checklist-item ${item.status}`;
            
            let iconName = 'check-circle';
            if (item.status === 'warning') iconName = 'alert-triangle';
            if (item.status === 'fail') iconName = 'x-circle';

            chk.innerHTML = `
                <i data-lucide="${iconName}" class="chk-icon ${item.status}"></i>
                <div class="chk-content">
                    <div class="chk-title">${item.title}</div>
                    <div class="chk-desc">${item.desc}</div>
                </div>
            `;
            checklistDiv.appendChild(chk);
        });

        // Schema Summary Dashboard Panel
        const schemaSummaryDiv = document.getElementById('dashboard-schema-summary');
        schemaSummaryDiv.innerHTML = '';
        if (this.auditData.schema.length === 0) {
            schemaSummaryDiv.innerHTML = `<div class="empty-state-notice">검출된 스키마 마크업이 없습니다. 하단 스키마 탭을 클릭하여 만드세요.</div>`;
        } else {
            this.auditData.schema.forEach((s) => {
                const badge = document.createElement('div');
                badge.className = 'schema-summary-badge';
                badge.innerHTML = `
                    <span class="schema-badge-type">${s.type}</span>
                    <span class="schema-badge-count">${s.format}</span>
                `;
                schemaSummaryDiv.appendChild(badge);
            });
        }

        // Crawler Permissions Dashboard Quick Peek
        const crawlerSummaryDiv = document.getElementById('dashboard-crawler-summary');
        crawlerSummaryDiv.innerHTML = '';
        const limitCrawlers = this.auditData.crawlers.crawlers.slice(0, 4);
        limitCrawlers.forEach((c) => {
            const row = document.createElement('div');
            row.className = 'crawler-bar-item';
            
            let fillClass = 'allowed';
            let labelText = 'ALLOW';
            let pct = 100;
            if (c.status === 'blocked') { fillClass = 'blocked'; labelText = 'BLOCK'; pct = 0; }
            if (c.status === 'partial') { fillClass = 'partial'; labelText = 'PARTIAL'; pct = 50; }

            row.innerHTML = `
                <span class="crawler-name-lbl">${c.name}</span>
                <div class="crawler-mini-progress">
                    <div class="c-mini-fill ${fillClass}" style="width: ${pct}%;"></div>
                </div>
                <span class="crawler-status-lbl ${fillClass}">${labelText}</span>
            `;
            crawlerSummaryDiv.appendChild(row);
        });

        // 2. HEADINGS VIEW RENDER
        const head = this.auditData.headings;
        document.getElementById('cnt-h1').textContent = head.stats.h1;
        document.getElementById('cnt-h2').textContent = head.stats.h2;
        document.getElementById('cnt-h3').textContent = head.stats.h3;
        document.getElementById('cnt-h4').textContent = head.stats.h4;
        document.getElementById('cnt-h5').textContent = head.stats.h5;
        document.getElementById('cnt-h6').textContent = head.stats.h6;

        // Render Heading tree outline
        const treeDiv = document.getElementById('headings-tree-list');
        treeDiv.innerHTML = '';
        if (head.list.length === 0) {
            treeDiv.innerHTML = `<div class="empty-state-notice">구조 제목 태그가 전혀 없습니다.</div>`;
        } else {
            head.list.forEach((h) => {
                const node = document.createElement('div');
                node.className = 'tree-node';
                node.style.marginLeft = `${(h.level - 1) * 20}px`;
                node.innerHTML = `
                    <span class="node-tag tag-${h.tag}">${h.tag.toUpperCase()}</span>
                    <span class="node-text">${h.text}</span>
                `;
                treeDiv.appendChild(node);
            });
        }

        // Heading issues/feedback
        const headingRulesDiv = document.getElementById('headings-rules-feedback');
        headingRulesDiv.innerHTML = '';
        if (head.issues.length === 0) {
            headingRulesDiv.innerHTML = `
                <div class="feedback-card success">
                    <div class="feedback-header success"><i data-lucide="check"></i> 최적의 제목 계층 통과</div>
                    <div class="feedback-body">문서 구조가 표준 계층 규격을 충족합니다. AI가 문서 전체의 논지와 핵심 정보를 쉽게 분해하고 학습할 수 있습니다.</div>
                </div>
            `;
        } else {
            head.issues.forEach((issue) => {
                const card = document.createElement('div');
                card.className = `feedback-card ${issue.type}`;
                card.innerHTML = `
                    <div class="feedback-header ${issue.type}"><i data-lucide="alert-circle"></i> ${issue.msg}</div>
                    <div class="feedback-body">${issue.tip}</div>
                `;
                headingRulesDiv.appendChild(card);
            });
        }

        // 3. IMAGES VIEW RENDER
        const img = this.auditData.images;
        document.getElementById('img-stat-total').textContent = img.total;
        document.getElementById('img-stat-has-alt').textContent = img.hasAlt;
        document.getElementById('img-stat-no-alt').textContent = img.noAlt;
        document.getElementById('img-stat-webp-savings').textContent = `${img.savingsPct}%`;

        // Images data table
        const imgTableBody = document.getElementById('images-table-body');
        imgTableBody.innerHTML = '';
        if (img.list.length === 0) {
            imgTableBody.innerHTML = `<tr><td colspan="5" class="empty-table-cell">이 페이지에는 배치된 이미지가 없습니다.</td></tr>`;
        } else {
            img.list.forEach((i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="img-preview-cell">
                        <div class="img-preview-wrapper"><img src="${i.src}" alt="${i.alt}" onerror="this.src='https://placehold.co/50x50/1e293b/00f2fe?text=Image'"></div>
                    </td>
                    <td><span class="img-path-txt" title="${i.src}">${i.src.split('/').pop() || i.src}</span></td>
                    <td>${i.format}</td>
                    <td class="${i.status === 'fail' ? 'text-neon-red' : ''}">${i.alt}</td>
                    <td><span class="badge ${i.status === 'pass' ? 'badge-green' : 'badge-purple'}">${i.status.toUpperCase()}</span></td>
                `;
                imgTableBody.appendChild(tr);
            });
        }

        // 4. TECHNICAL VIEW RENDER
        // SEO checklist
        const techSeoList = document.getElementById('tech-seo-checklist-list');
        techSeoList.innerHTML = '';
        const meta = this.auditData.metadata.data;
        
        const techRules = [
            { cond: meta.title.length > 5, pass: 'Title 태그가 정의되어 검색 탭 이름을 구성합니다.', fail: 'Title 설명 태그가 정의되지 않았거나 비어 있습니다.' },
            { cond: meta.description.length > 10, pass: 'Description 메타 정보가 있어 요약 노출이 가능합니다.', fail: 'Description 메타 데이터 누락으로 인해 스니펫 강제 대치 위험이 있습니다.' },
            { cond: this.auditData.textStats.wordCount > 100, pass: `충분한 본문 정보량 (${this.auditData.textStats.wordCount} 단어)이 탐지되었습니다.`, fail: '본문 텍스트 단어가 너무 희박합니다. 구조 내용 보강이 필수적입니다.' },
            { cond: meta.robots.length === 0 || (!meta.robots.includes('noindex')), pass: '인덱서(Robots) 지침이 개방적이며, 봇 수집을 전면 차단하지 않고 있습니다.', fail: '메타 태그에 noindex 지침이 감지되어 검색 결과 수집이 영구 보류될 수 있습니다.' }
        ];

        techRules.forEach((rule) => {
            const li = document.createElement('li');
            const icon = rule.cond ? 'check-circle' : 'x-circle';
            const iconClass = rule.cond ? 'pass' : 'fail';
            li.innerHTML = `
                <i data-lucide="${icon}" class="${iconClass}"></i>
                <span>${rule.cond ? rule.pass : rule.fail}</span>
            `;
            techSeoList.appendChild(li);
        });

        // Performance Resource stats
        const techPerfDiv = document.getElementById('tech-perf-metrics');
        techPerfDiv.innerHTML = `
            <div class="perf-item">
                <div class="perf-info"><span class="perf-label">HTML 총 용량</span><span class="perf-value text-neon-green">23.6 KB (합격)</span></div>
                <div class="progress-bar-container bg-dark"><div class="progress-fill fill-green" style="width: 15%;"></div></div>
            </div>
            <div class="perf-item">
                <div class="perf-info"><span class="perf-label">전체 단어 수 (Word Count)</span><span class="perf-value">${this.auditData.textStats.wordCount} 단어</span></div>
                <div class="progress-bar-container bg-dark"><div class="progress-fill fill-cyan" style="width: ${Math.min(100, (this.auditData.textStats.wordCount/1500)*100)}%;"></div></div>
            </div>
            <div class="perf-item">
                <div class="perf-info"><span class="perf-label">평균 문장 길이</span><span class="perf-value">${this.auditData.textStats.avgSentenceLength} 단어/문장</span></div>
                <div class="progress-bar-container bg-dark"><div class="progress-fill fill-purple" style="width: ${Math.min(100, (this.auditData.textStats.avgSentenceLength/30)*100)}%;"></div></div>
            </div>
        `;

        // Meta tags detailed table
        const metaTableBody = document.getElementById('meta-table-body');
        metaTableBody.innerHTML = '';
        this.auditData.metadata.list.forEach((m) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${m.name}</td>
                <td><span style="font-family: monospace; font-size: 11px;">${m.value}</span></td>
                <td>${m.length}자</td>
                <td class="${m.feedback.includes('누락') || m.feedback.includes('위험') ? 'text-neon-red' : ''}">${m.feedback}</td>
            `;
            metaTableBody.appendChild(tr);
        });

        // 5. GEO DETAIL VIEW RENDER
        // 7 indicators
        const indList = document.getElementById('geo-indicators-detail-list');
        indList.innerHTML = '';
        
        const labelsMap = this.currentLang === 'ko' ? {
            answerDensity: { title: 'LCR 레이팅 (LLM Content Ratio)', desc: '두괄식 문단 및 정보의 밀도를 측정하여 AI 답변 추출 신뢰도를 나타내는 핵심 지표' },
            queryFanout: { title: 'QFE 확장 범위 (Query Fan-out Expansion)', desc: 'AI 검색의 다양한 질문 변형에 대응하는 어휘적 커버리지 지표' },
            freshness: { title: 'T-Fresh 지수 (Temporal Freshness Factor)', desc: '실시간 정보 탐색(Perplexity 등) 대응 능력을 검증하는 시간적 마커 배치 지수' },
            hierarchy: { title: 'SDS 아웃라인 구조 (Semantic Document Structure)', desc: 'AI의 문서 의미 맥락 분류를 돕는 구조적 계층 설계 분석' },
            citation: { title: 'OLC 신뢰성 등급 (Outbound Link Citation)', desc: '고신뢰도 아웃바운드 링크의 문맥 적합성 및 배치 품질 진단 지수' },
            eeat: { title: 'EEAT-AV 검증도 (EEAT Author Verification)', desc: '작성자의 학술/공인 디지털 증거와 저자 신뢰 신호를 추적하는 검증' },
            schemaPresence: { title: 'SEM 구조화 검증 (SEM Schema Validation)', desc: '구조화 데이터 엔티티 설정을 통한 검색 엔진 맞춤형 지식 그래프 매핑' }
        } : {
            answerDensity: { title: 'LCR Rating (LLM Content Ratio)', desc: 'Measures density of direct answers, lists, and tables to gauge LLM response match rates.' },
            queryFanout: { title: 'QFE Expansion (Query Fan-out Expansion)', desc: 'Measures vocabulary richness and related topical keyword coverage for search term variety.' },
            freshness: { title: 'T-Fresh Index (Temporal Freshness Factor)', desc: 'Assesses time markers, date tags, and timestamp indicators for information freshness.' },
            hierarchy: { title: 'SDS Outline Structure (Semantic Document Structure)', desc: 'Validates header hierarchy and outline integrity for logical reading structure.' },
            citation: { title: 'OLC Reliability Grade (Outbound Link Citation)', desc: 'Evaluates context-matching outbound reference links and domain trustworthiness.' },
            eeat: { title: 'EEAT-AV Verification (EEAT Author Verification)', desc: 'Tracks author expertise signals, bios, and digital authority verification profiles.' },
            schemaPresence: { title: 'SEM Schema Validation (SEM-SV)', desc: 'Validates structured data markup density and entity relationship declarations.' }
        };

        Object.keys(this.auditData.indicators).forEach((key) => {
            const val = this.auditData.indicators[key];
            const data = labelsMap[key];
            
            let colorClass = 'low';
            if (val >= 8) colorClass = 'high';
            else if (val >= 5) colorClass = 'medium';

            const item = document.createElement('div');
            item.className = 'geo-ind-item';
            item.innerHTML = `
                <div class="geo-ind-header">
                    <span class="geo-ind-title">${data.title}</span>
                    <span class="geo-ind-score ${colorClass}">${val} / 10</span>
                </div>
                <div class="geo-ind-desc">${data.desc}</div>
            `;
            indList.appendChild(item);
        });

        // Citable Snippet highlight Zone (renders a structured table of citation probabilities per AI engine)
        const snippetZone = document.getElementById('snippet-analysis-zone');
        snippetZone.innerHTML = '';
        if (this.auditData.snippets.length === 0) {
            snippetZone.innerHTML = `<div class="empty-state-notice">발췌 가능한 본문 텍스트 단락이 희박합니다.</div>`;
        } else {
            this.auditData.snippets.forEach((s, idx) => {
                const block = document.createElement('div');
                block.className = `snippet-block ${s.isHigh ? 'high-extract' : ''}`;
                block.innerHTML = `
                    <div class="snippet-text-header">발췌 단락 #${idx + 1}</div>
                    <div class="snippet-text-content">"${s.text}"</div>
                    <div class="snippet-table-wrapper">
                        <table class="snippet-citation-table">
                            <thead>
                                <tr>
                                    <th>AI 검색 엔진</th>
                                    <th>ChatGPT</th>
                                    <th>Perplexity</th>
                                    <th>Gemini</th>
                                    <th>종합 인용 확률</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="lbl">인용 확률 (Citation Rate)</td>
                                    <td><span class="pct-val">${s.gptScore}%</span></td>
                                    <td><span class="pct-val">${s.perplexityScore}%</span></td>
                                    <td><span class="pct-val">${s.geminiScore}%</span></td>
                                    <td><span class="pct-val total-score">${s.score}%</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                snippetZone.appendChild(block);
            });
        }

        // Crawlers detail status grid
        const crawlGrid = document.getElementById('crawlers-status-grid');
        crawlGrid.innerHTML = '';
        
        let cAllowed = 0; let cPartial = 0; let cBlocked = 0;

        this.auditData.crawlers.crawlers.forEach((c) => {
            const card = document.createElement('div');
            card.className = 'crawler-card';
            
            let badgeClass = 'allowed';
            if (c.status === 'blocked') { badgeClass = 'blocked'; cBlocked++; }
            else if (c.status === 'partial') { badgeClass = 'partial'; cPartial++; }
            else { cAllowed++; }

            card.innerHTML = `
                <div class="c-card-left">
                    <span class="c-bot-name"><i data-lucide="${c.icon || 'bot'}" class="inline-icon"></i> ${c.name}</span>
                    <span class="c-bot-company">${c.company}</span>
                </div>
                <span class="c-bot-status-indicator ${badgeClass}">${c.status.toUpperCase()}</span>
            `;
            crawlGrid.appendChild(card);
        });

        document.getElementById('cnt-crawler-allowed').textContent = cAllowed;
        document.getElementById('cnt-crawler-partial').textContent = cPartial;
        document.getElementById('cnt-crawler-blocked').textContent = cBlocked;

        // 6. SCHEMA CHECKER VIEW RENDER
        const detectedSchemaResults = document.getElementById('detected-schema-results');
        detectedSchemaResults.innerHTML = '';
        if (this.auditData.schema.length === 0) {
            detectedSchemaResults.innerHTML = `<div class="empty-state-notice">검출된 구조화 데이터가 없습니다. 아래의 생성기를 통해 즉시 만드십시오.</div>`;
        } else {
            this.auditData.schema.forEach((s) => {
                const item = document.createElement('div');
                item.className = 'detected-schema-tag';
                item.innerHTML = `
                    <span class="det-schema-type">${s.type}</span>
                    <span class="det-schema-format jsonld">${s.format}</span>
                `;
                detectedSchemaResults.appendChild(item);
            });
        }

        // Trigger autofill source calculations
        this.autofillSource = window.SchemaMarkupManager.getAutofillSource(htmlContent, this.auditData.url);

        // Update print closing page details dynamically
        const closingScoreVal = document.getElementById('print-closing-score-value');
        const closingScoreCircle = document.getElementById('print-closing-score-circle');
        const closingStatusTitle = document.getElementById('print-closing-status-title');
        
        if (closingScoreVal && closingScoreCircle && closingStatusTitle) {
            const score = this.auditData.score;
            closingScoreVal.textContent = score;
            const closingOffset = 251.2 - (251.2 * score) / 100;
            closingScoreCircle.style.strokeDashoffset = closingOffset;
            
            if (score >= 80) {
                closingScoreCircle.className.baseVal = 'progress-circle stroke-neon-green';
                closingStatusTitle.textContent = this.currentLang === 'ko' ? '진단 등급: 우수 (EXCELLENT)' : 'Grade: EXCELLENT';
                closingStatusTitle.style.color = 'var(--neon-green)';
            } else if (score >= 55) {
                closingScoreCircle.className.baseVal = 'progress-circle stroke-neon-yellow';
                closingStatusTitle.textContent = this.currentLang === 'ko' ? '진단 등급: 보통 (MODERATE)' : 'Grade: MODERATE';
                closingStatusTitle.style.color = 'var(--neon-yellow)';
            } else {
                closingScoreCircle.className.baseVal = 'progress-circle stroke-neon-red';
                closingStatusTitle.textContent = this.currentLang === 'ko' ? '진단 등급: 미흡 (POOR)' : 'Grade: POOR';
                closingStatusTitle.style.color = 'var(--neon-red)';
            }
        }

        // Load Lucide icons inside injected components
        lucide.createIcons();
    }

    renderSchemaFields(schemaType) {
        const fieldsDiv = document.getElementById('schema-generator-fields');
        fieldsDiv.innerHTML = '';

        const template = window.SchemaTemplates[schemaType];
        if (!template) return;

        template.fields.forEach((field) => {
            const formGrp = document.createElement('div');
            formGrp.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `fld-${field.id}`);
            label.textContent = field.label;
            formGrp.appendChild(label);

            let input = null;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 3;
                input.className = 'textarea-dark input-block';
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.className = 'input-dark input-block';
            }
            input.id = `fld-${field.id}`;
            input.placeholder = field.placeholder || '';
            if (field.defaultValue) {
                input.value = field.defaultValue;
            }
            formGrp.appendChild(input);
            fieldsDiv.appendChild(formGrp);
        });
    }

    autofillSchemaFields() {
        if (!this.autofillSource) {
            alert(this.currentLang === 'ko' ? '먼저 분석을 수행해 주세요.' : 'Please run analysis first.');
            return;
        }

        const schemaType = document.getElementById('schema-type-select').value;
        const template = window.SchemaTemplates[schemaType];
        if (!template) return;

        template.fields.forEach((field) => {
            const input = document.getElementById(`fld-${field.id}`);
            if (input && field.defaultFromHTML && this.autofillSource[field.defaultFromHTML]) {
                input.value = this.autofillSource[field.defaultFromHTML];
            }
        });
    }

    generateSchemaJson() {
        const schemaType = document.getElementById('schema-type-select').value;
        const template = window.SchemaTemplates[schemaType];
        if (!template) return;

        const data = {};
        template.fields.forEach((field) => {
            const input = document.getElementById(`fld-${field.id}`);
            if (input) {
                data[field.id] = input.value.trim();
            }
        });

        const json = template.generator(data);
        const codeString = JSON.stringify(json, null, 2);

        // Put in code preview
        const codeBlock = document.getElementById('schema-code-block');
        codeBlock.textContent = `<script type="application/ld+json">\n${codeString}\n<\/script>`;

        // Show validator results
        document.getElementById('schema-validator-output').style.display = 'block';
    }

    copySchemaCode() {
        const code = document.getElementById('schema-code-block').textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert(this.currentLang === 'ko' ? '클립보드에 코드가 복사되었습니다!' : 'Code copied to clipboard!');
        }).catch((e) => {
            console.error("Copy failed", e);
        });
    }

    async sendChatMessage(customQuery = '') {
        const inputEl = document.getElementById('chat-user-input');
        const query = (customQuery || inputEl.value).trim();
        if (!query) return;

        inputEl.value = '';

        // Add user message to UI
        this.appendMessage('user', query);

        // Show thinking bot state
        const botMsgId = this.appendMessage('bot', `<i class="animate-pulse">분석 조언을 도출하는 중...</i>`);

        try {
            const aiMode = document.getElementById('ai-mode-select').value;
            let response = '';

            if (aiMode === 'gemini' && this.apiKey) {
                // Real Gemini API Call
                response = await window.AEOAssistantManager.askGemini(this.apiKey, query, this.auditData || { url: '', score: 0, categories: {}, schema: [], crawlers: { stats: {} }, headings: { stats: {} } });
            } else {
                // Rules-based smart response
                response = window.AEOAssistantManager.getLocalResponse(query, this.auditData);
            }

            // Replace bot thinking text with markdown response
            const botMsgEl = document.getElementById(botMsgId);
            const contentPane = botMsgEl.querySelector('.message-content');
            
            // Format Markdown (basic replacement of title headers, lists, code blocks for neat layout)
            contentPane.innerHTML = this.formatMarkdownToHtml(response);
            lucide.createIcons();
            
            // Scroll chat to bottom
            const container = document.getElementById('chat-messages');
            container.scrollTop = container.scrollHeight;
        } catch (e) {
            const botMsgEl = document.getElementById(botMsgId);
            const contentPane = botMsgEl.querySelector('.message-content');
            contentPane.textContent = `오류 발생: ${e.message}. 설정을 확인하시거나 오프라인 구동 모드로 변경해 보세요.`;
        }
    }

    appendMessage(role, text) {
        const container = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        const id = 'msg-' + Date.now();
        msg.id = id;
        msg.className = `message message-${role}`;

        let icon = role === 'bot' ? 'bot' : 'user';

        msg.innerHTML = `
            <div class="avatar"><i data-lucide="${icon}"></i></div>
            <div class="message-content">
                <p>${text.replaceAll('\n', '<br>')}</p>
            </div>
        `;
        container.appendChild(msg);
        lucide.createIcons();
        container.scrollTop = container.scrollHeight;
        return id;
    }

    formatMarkdownToHtml(mdText) {
        let html = mdText;
        
        // GitHub Alerts
        html = html.replace(/>\s*\[!WARNING\]\s*\n>\s*(.*)/g, '<div class="feedback-card danger" style="margin: 10px 0;"><div class="feedback-header danger"><i data-lucide="alert-triangle"></i> 경고</div><div class="feedback-body">$1</div></div>');
        html = html.replace(/>\s*\[!IMPORTANT\]\s*\n>\s*(.*)/g, '<div class="feedback-card warning" style="margin: 10px 0;"><div class="feedback-header warning"><i data-lucide="alert-circle"></i> 중요</div><div class="feedback-body">$1</div></div>');

        // Bold headers
        html = html.replace(/### (.*)/g, '<h4>$1</h4>');
        html = html.replace(/#### (.*)/g, '<h5>$1</h5>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Lists
        html = html.replace(/- (.*)/g, '<li>$1</li>');
        html = html.replace(/\d+\. (.*)/g, '<li>$1</li>');

        // Code blocks
        html = html.replace(/```json\n([\s\S]*?)```/g, '<pre class="code-preview" style="background:#000; padding:10px; border-radius:6px; color:#a5b4fc; font-size:11px; max-height:200px; overflow-y:auto;">$1</pre>');
        html = html.replace(/```http\n([\s\S]*?)```/g, '<pre class="code-preview" style="background:#000; padding:10px; border-radius:6px; color:#00f2fe; font-size:11px; max-height:200px; overflow-y:auto;">$1</pre>');

        return html;
    }

    getDomainSeed(domain) {
        let hash = 0;
        for (let i = 0; i < domain.length; i++) {
            hash = domain.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    generateRealisticMockHTML(url) {
        const parsedUrl = url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
        const siteName = parsedUrl.split('.')[0].toUpperCase();
        const seed = this.getDomainSeed(parsedUrl);
        
        // Vary mock structures based on domain seed
        const totalImages = (seed % 5) + 2; // 2 to 6 images
        const missingAltCount = seed % 3; // 0 to 2 missing Alt
        const h2Count = (seed % 3) + 2; // 2 to 4 H2 headings
        const hasSchema = (seed % 2) === 0;
        const wordCount = 200 + (seed % 800); // 200 to 1000 words
        
        let title = `${parsedUrl} - ${siteName} 공식 비즈니스 최적화`;
        let mainHeading = `${siteName} 비즈니스 마케팅 플랫폼`;
        let h2_1 = `왜 ${siteName}의 온라인 가시성이 낮을까요?`;
        let h2_2 = `${siteName}의 AI 검색 엔진 최적화(GEO) 필요성`;
        let p_1 = `${siteName}은 최첨단 온라인 마케팅 기법과 디지털 솔루션을 제공하는 선두 비즈니스 기업입니다. 웹사이트 내의 비구조화된 텍스트와 누락된 구조화 마크업은 주요 검색 엔진에 노출되는 데 방해가 됩니다.`;
        let p_2 = `인공지능 기반 검색 엔진(ChatGPT, Gemini 등)에 인용되기 위해서는 콘텐츠의 답변 밀도를 극대화해야 합니다. 두괄식 정리를 사용하여 핵심 요약을 최상단에 포진시키는 글쓰기가 ${siteName}의 AEO 전략에 필수적입니다.`;
        
        if (parsedUrl.includes('ddmkt')) {
            title = `디디마케팅 (ddmkt.com) - 기업 브랜딩 및 통합 마케팅`;
            mainHeading = `디디마케팅 - 기업 성장을 위한 마케팅 파트너`;
            h2_1 = `디디마케팅의 검색 노출 극대화 비결`;
            h2_2 = `ddmkt.com 생성형 AI 최적화(GEO) 긴급 제안`;
            p_1 = `디디마케팅은 다양한 광고 채널 믹스와 데이터 분석을 통해 기업의 ROAS를 혁신적으로 증가시키는 마케팅 전문 대행사입니다.`;
            p_2 = `현재 ddmkt.com의 주요 메타 지표 및 크롤링 차단 규칙을 분석하여, 인공지능 추천 엔진이 디디마케팅을 '최우선 추천 대행사'로 추천하도록 스키마 및 헤딩 최적화 셋업이 긴급히 요구됩니다.`;
        } else if (parsedUrl.includes('uniqlo')) {
            title = `유니클로 (UNIQLO) - 라이프웨어 패션 브랜드`;
            mainHeading = `UNIQLO - 일상을 풍요롭게 만드는 혁신적 의류`;
            h2_1 = `유니클로 쇼핑 플랫폼의 이미지 검색 최적화`;
            h2_2 = `uniqlo.com AEO 인용도 제고 방안`;
            p_1 = `유니클로는 라이프웨어(LifeWear) 철학을 바탕으로 고품질의 기능성 의류를 전 세계 고객에게 합리적인 가격으로 제공하는 글로벌 패션 선두 기업입니다.`;
            p_2 = `현재 uniqlo.com 쇼핑 카테고리 본문의 텍스트 정보 밀도가 낮고 스키마가 복잡하게 얽혀 있어, AI 봇이 신제품 정보를 발췌하여 인용하는 데 병목 현상이 발생하고 있습니다.`;
        }

        let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${p_1.substring(0, 80)}">
    <meta name="author" content="${siteName} 테크니컬컨설팅팀">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${p_2.substring(0, 80)}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f">
        `;

        if (hasSchema) {
            html += `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${title}",
      "description": "${p_1.substring(0, 50)}"
    }
    <\/script>
            `;
        }

        html += `
</head>
<body>
    <h1>${mainHeading}</h1>
    <p>${p_1}</p>
    
    <h2>${h2_1}</h2>
    <p>${p_2}</p>
        `;

        for (let i = 1; i <= h2Count - 1; i++) {
            html += `    <h2>${siteName} 인용도 개선 지침 #${i}</h2>\n`;
            html += `    <p>생성형 답변 최적화를 위한 두괄식 본문 서술과 표 구조 추가 작업을 정밀 진행해야 합니다.</p>\n`;
        }

        html += `    <h2>${h2_2}</h2>
    <p>저자 권위성 및 AI 봇의 접근 상태를 확인해 본 결과, 스키마 마크업(FAQ, Article)이 부재하여 Perplexity 및 Gemini의 엔티티 네트워크에 원활하게 인식되지 못하고 있는 한계가 있습니다. 본문 총 단어 수는 약 ${wordCount} 단어로 판정됩니다.</p>
    
    <ul>
        <li>신뢰 신호(E-E-A-T)를 위한 작성자 경력사항 보강</li>
        <li>이미지에 alt 설명 추가로 멀티모달 봇의 접근성 유도</li>
        <li>검증된 JSON-LD 형태의 구조화 데이터 세팅</li>
    </ul>
        `;

        // Add dynamic images
        for (let i = 0; i < totalImages; i++) {
            const hasAlt = i >= missingAltCount;
            const altText = hasAlt ? `alt="${siteName} 에셋 이미지 #${i}"` : '';
            html += `    <img src="https://example.com/images/asset_${i}.jpg" ${altText}>\n`;
        }

        html += `
</body>
</html>
        `;
        return html;
    }

    generateSimulatedRobotsTxt(url) {
        // Mock a robots.txt for URL analysis that shows a realistic partial/allowed profile for consulting pitches
        if (url.includes('midam') || url.includes('optim')) {
            // Highly optimized site simulation
            return `
User-agent: *
Allow: /
            `;
        } else {
            // Standard site with a few blocked bots
            return `
User-agent: *
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /
            `;
        }
    }
}

// Instantiate the application
window.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
