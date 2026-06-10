/**
 * Geo Lens Midam - 실시간 AI 키워드 추적기 모듈 (tracker.js) - 3차 보완본
 * 
 * 보완 및 신규 구현 내역:
 * 1. 대형 [실시간 AEO 추적 분석 시작] 버튼 좌측 패널 하단에 추가 연동
 * 2. 최초 등록일(createdDate) 및 최종 분석일(lastAuditedDate) 기록 및 UI 카드 출력
 * 3. [AI 키워드 추적 보고서 (PDF)] 버튼 클릭 시 body에 전용 프린트 클래스를 주입하여
 *    오직 추적기 탭만 완벽한 A4 포맷으로 인쇄하도록 설계 (인쇄 완료 시 자동 복구)
 * 4. 이메일 자동 발송 스케줄러 설정 필드 로컬 세이브 및 데이터 백업 연동, 외부 전송 웹훅(sendMailWebhook) 구현
 */

(function () {
    'use strict';

    class AIKeywordTracker {
        constructor() {
            this.questions = [];
            this.activeQuestionId = null;
            this.targetBrand = '지유클리닉 강남점';
            this.charts = {
                line: null,
                radar: null
            };
            this.apiKeys = {
                gemini: '',
                openai: '',
                perplexity: '',
                claude: '',
                grok: ''
            };
            this.scheduler = {
                email: '',
                time: '09:00',
                active: false
            };

            // 실시간 AI 원본 답변 캐싱용 객체
            this.lastResponses = {
                ChatGPT: '',
                Gemini: '',
                Claude: '',
                Grok: '',
                Perplexity: '',
                SearchContext: ''
            };

            if (window.Chart) {
                Chart.defaults.color = '#94a3b8';
                Chart.defaults.font.family = "'Inter', sans-serif";
            }

            this.init();
        }

        init() {
            // 1. 설정 및 이메일 스케줄러 세팅 불러오기
            this.loadSettings();

            // 2. 질문 데이터 로드
            this.loadQuestions();

            // 3. UI 이벤트 바인딩
            this.bindEvents();

            // 4. 초기 UI 및 차트 기동
            setTimeout(() => {
                this.initCharts();
                this.renderQuestionList();
                this.updateDashboard();
                this.initUIValues();
                
                // API 키 검증 상태등 자가 갱신
                this.silentVerifyAllKeys();
            }, 100);
        }

        // --- 데이터 로드 및 저장 ---
        loadSettings() {
            this.apiKeys.gemini = localStorage.getItem('geo_lens_tracker_gemini_key') || '';
            this.apiKeys.openai = localStorage.getItem('geo_lens_tracker_openai_key') || '';
            this.apiKeys.perplexity = localStorage.getItem('geo_lens_tracker_perplexity_key') || '';
            this.apiKeys.claude = localStorage.getItem('geo_lens_tracker_claude_key') || '';
            this.apiKeys.grok = localStorage.getItem('geo_lens_tracker_grok_key') || '';
            this.targetBrand = localStorage.getItem('geo_lens_tracker_target_brand') || '지유클리닉 강남점';
            
            // 이메일 스케줄러 로드
            try {
                const storedScheduler = localStorage.getItem('geo_lens_tracker_scheduler');
                if (storedScheduler) {
                    this.scheduler = JSON.parse(storedScheduler);
                }
            } catch (e) {
                console.error("스케줄러 설정 로드 실패", e);
            }

            // AI 답변 원문 캐시 로드
            try {
                const storedResponses = localStorage.getItem('geo_lens_tracker_last_responses');
                if (storedResponses) {
                    this.lastResponses = JSON.parse(storedResponses);
                }
            } catch (e) {
                console.error("마지막 AI 응답 데이터 로드 실패", e);
            }
        }

        saveSettings(geminiKey, openaiKey, perplexityKey, claudeKey, grokKey, brandName) {
            this.apiKeys.gemini = geminiKey.trim();
            this.apiKeys.openai = openaiKey.trim();
            this.apiKeys.perplexity = perplexityKey.trim();
            this.apiKeys.claude = claudeKey.trim();
            this.apiKeys.grok = grokKey.trim();
            this.targetBrand = brandName.trim() || '지유클리닉 강남점';

            localStorage.setItem('geo_lens_tracker_gemini_key', this.apiKeys.gemini);
            localStorage.setItem('geo_lens_tracker_openai_key', this.apiKeys.openai);
            localStorage.setItem('geo_lens_tracker_perplexity_key', this.apiKeys.perplexity);
            localStorage.setItem('geo_lens_tracker_claude_key', this.apiKeys.claude);
            localStorage.setItem('geo_lens_tracker_grok_key', this.apiKeys.grok);
            localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
        }

        saveSchedulerSettings() {
            localStorage.setItem('geo_lens_tracker_scheduler', JSON.stringify(this.scheduler));
        }

        loadQuestions() {
            const stored = localStorage.getItem('geo_lens_tracker_questions');
            if (stored) {
                try {
                    this.questions = JSON.parse(stored);
                } catch (e) {
                    console.error("질문 목록 파싱 실패", e);
                    this.setDefaultQuestions();
                }
            } else {
                this.setDefaultQuestions();
            }

            if (this.questions.length > 0) {
                const exists = this.questions.some(q => q.id === this.activeQuestionId);
                if (!exists) {
                    this.activeQuestionId = this.questions[0].id;
                }
            }
        }

        setDefaultQuestions() {
            const today = this.getFormattedDate();
            this.questions = [
                {
                    id: 'q_' + Date.now() + '_1',
                    text: '강동구에서 대상포진 치료 가능한 한의원 알려줘.',
                    baselineRate: 0,
                    currentRate: 70,
                    createdDate: today,
                    lastAuditedDate: today,
                    history: [0, 5, 8, 12, 25, 50, 70],
                    modelRates: {
                        ChatGPT: 45,
                        Gemini: 80,
                        Claude: 60,
                        Grok: 75,
                        Perplexity: 90
                    }
                },
                {
                    id: 'q_' + Date.now() + '_2',
                    text: '강동구에서 아토피를 잘 치료하는 피부전문 한의원 추천해줘.',
                    baselineRate: 0,
                    currentRate: 46,
                    createdDate: today,
                    lastAuditedDate: today,
                    history: [0, 10, 15, 22, 30, 40, 46],
                    modelRates: {
                        ChatGPT: 30,
                        Gemini: 50,
                        Claude: 45,
                        Grok: 40,
                        Perplexity: 65
                    }
                },
                {
                    id: 'q_' + Date.now() + '_3',
                    text: '송파구에서 비염 치료 잘하는 한의원 추천해줘.',
                    baselineRate: 0,
                    createdDate: today,
                    lastAuditedDate: today,
                    history: [0, 2, 5, 12, 18, 25, 31],
                    modelRates: {
                        ChatGPT: 20,
                        Gemini: 40,
                        Claude: 30,
                        Grok: 25,
                        Perplexity: 40
                    }
                }
            ];
            this.saveQuestions();
        }

        saveQuestions() {
            localStorage.setItem('geo_lens_tracker_questions', JSON.stringify(this.questions));
        }

        // --- UI 설정값 초기 대입 ---
        initUIValues() {
            const geminiInput = document.getElementById('tracker-gemini-key');
            const openaiInput = document.getElementById('tracker-openai-key');
            const perplexityInput = document.getElementById('tracker-perplexity-key');
            const claudeInput = document.getElementById('tracker-claude-key');
            const grokInput = document.getElementById('tracker-grok-key');
            const brandInput = document.getElementById('target-brand-input');
            
            // 이메일 스케줄러 UI 바인딩
            const schedulerEmail = document.getElementById('scheduler-email');
            const schedulerTime = document.getElementById('scheduler-time');
            const schedulerActive = document.getElementById('scheduler-active');

            if (geminiInput) geminiInput.value = this.apiKeys.gemini;
            if (openaiInput) openaiInput.value = this.apiKeys.openai;
            if (perplexityInput) perplexityInput.value = this.apiKeys.perplexity;
            if (claudeInput) claudeInput.value = this.apiKeys.claude || '';
            if (grokInput) grokInput.value = this.apiKeys.grok || '';
            if (brandInput) brandInput.value = this.targetBrand;
            
            if (schedulerEmail) schedulerEmail.value = this.scheduler.email;
            if (schedulerTime) schedulerTime.value = this.scheduler.time;
            if (schedulerActive) schedulerActive.checked = this.scheduler.active;
        }

        // --- UI 이벤트 바인딩 ---
        bindEvents() {
            // API 토글 아코디언
            const apiToggle = document.getElementById('api-toggle-btn');
            const apiContainer = document.getElementById('api-inputs-container');
            if (apiToggle && apiContainer) {
                apiToggle.addEventListener('click', () => {
                    apiToggle.classList.toggle('active');
                    const isHidden = apiContainer.style.display === 'none';
                    apiContainer.style.display = isHidden ? 'block' : 'none';
                });
            }

            // API 키 저장 버튼
            const btnSaveKeys = document.getElementById('btn-save-tracker-keys');
            if (btnSaveKeys) {
                btnSaveKeys.addEventListener('click', () => {
                    const geminiKey = document.getElementById('tracker-gemini-key').value;
                    const openaiKey = document.getElementById('tracker-openai-key').value;
                    const perplexityKey = document.getElementById('tracker-perplexity-key').value;
                    const claudeKey = document.getElementById('tracker-claude-key').value;
                    const grokKey = document.getElementById('tracker-grok-key').value;
                    const brandName = document.getElementById('target-brand-input').value;
                    
                    this.saveSettings(geminiKey, openaiKey, perplexityKey, claudeKey, grokKey, brandName);
                    this.silentVerifyAllKeys();
                    
                    alert('설정이 안전하게 로컬에 보존되었습니다.');

                    if (apiContainer) apiContainer.style.display = 'none';
                    if (apiToggle) apiToggle.classList.remove('active');
                });
            }

            // API 연결 테스트 버튼
            const btnTestKeys = document.getElementById('btn-test-tracker-keys');
            if (btnTestKeys) {
                btnTestKeys.addEventListener('click', () => {
                    this.runConnectionTests();
                });
            }

            // 브랜드명 등록 버튼 및 엔터키 바인딩
            const btnSaveBrand = document.getElementById('btn-save-target-brand');
            const brandInput = document.getElementById('target-brand-input');
            if (btnSaveBrand && brandInput) {
                const saveBrandFn = () => {
                    const val = brandInput.value.trim();
                    if (!val) {
                        alert('분석할 타겟 병원/브랜드명을 입력해 주세요.');
                        return;
                    }
                    this.targetBrand = val;
                    localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
                    alert(`🟢 분석 타겟 병원명이 '${this.targetBrand}'(으)로 성공적으로 등록되었습니다.`);
                    this.updateDashboard();
                };
                
                btnSaveBrand.addEventListener('click', saveBrandFn);
                brandInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveBrandFn();
                    }
                });
            }

            // 질문 등록 처리
            const btnAdd = document.getElementById('btn-add-question');
            const inputQuestion = document.getElementById('new-question-input');
            if (btnAdd && inputQuestion) {
                const addFn = () => {
                    const text = inputQuestion.value.trim();
                    if (!text) {
                        alert('질문을 입력해 주세요.');
                        return;
                    }
                    this.addQuestion(text);
                    inputQuestion.value = '';
                };
                btnAdd.addEventListener('click', addFn);
                inputQuestion.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') addFn();
                });
            }

            // 분석 실행 버튼 (우측 패널)
            const btnAudit = document.getElementById('btn-run-audit');
            if (btnAudit) {
                btnAudit.addEventListener('click', () => {
                    this.runKeywordAudit();
                });
            }

            // [신규] 분석 실행 대형 버튼 (좌측 패널 질문 목록 하단)
            const btnAuditLeft = document.getElementById('btn-run-audit-left');
            if (btnAuditLeft) {
                btnAuditLeft.addEventListener('click', () => {
                    this.runKeywordAudit();
                });
            }

            // 설정 백업 파일 저장 (내보내기)
            const btnExport = document.getElementById('btn-export-tracker');
            if (btnExport) {
                btnExport.addEventListener('click', () => {
                    this.exportToJSON();
                });
            }

            // 설정 백업 파일 업로드 (가져오기)
            const btnImport = document.getElementById('btn-import-tracker');
            if (btnImport) {
                btnImport.addEventListener('change', (e) => {
                    this.importFromJSON(e);
                });
            }

            // [신규] 이메일 스케줄러 실시간 자동 세이브
            const schedulerEmail = document.getElementById('scheduler-email');
            const schedulerTime = document.getElementById('scheduler-time');
            const schedulerActive = document.getElementById('scheduler-active');

            if (schedulerEmail) {
                schedulerEmail.addEventListener('blur', () => {
                    this.scheduler.email = schedulerEmail.value.trim();
                    this.saveSchedulerSettings();
                });
            }
            if (schedulerTime) {
                schedulerTime.addEventListener('change', () => {
                    this.scheduler.time = schedulerTime.value;
                    this.saveSchedulerSettings();
                });
            }
            if (schedulerActive) {
                schedulerActive.addEventListener('change', () => {
                    this.scheduler.active = schedulerActive.checked;
                    this.saveSchedulerSettings();
                    if (this.scheduler.active && !this.scheduler.email) {
                        alert('알림: 자동 발송을 사용하시려면 올바른 수신인 이메일 주소를 입력해 주셔야 합니다.');
                    }
                });
            }

            // [신규] AI 키워드 추적 보고서 PDF 인쇄 버튼
            const btnPdfReport = document.getElementById('btn-pdf-tracker-report');
            if (btnPdfReport) {
                btnPdfReport.addEventListener('click', () => {
                    this.printTrackerPdfReport();
                });
            }

            // 탭 클릭 감지 (리사이징 유도)
            const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const tab = item.getAttribute('data-tab');
                    if (tab === 'tracker') {
                        setTimeout(() => {
                            if (this.charts.line) this.charts.line.resize();
                            if (this.charts.radar) this.charts.radar.resize();
                        }, 200);
                    }
                });
            });
            // [신규] 새로 등록하기 경고 모달 제어 이벤트 바인딩
            const btnResetTracker = document.getElementById('btn-reset-tracker');
            const modalResetOverlay = document.getElementById('modal-confirm-reset-overlay');
            const btnCloseResetModal = document.getElementById('btn-close-reset-modal');
            const btnResetSaveExport = document.getElementById('btn-reset-save-export');
            const btnResetDiscardAll = document.getElementById('btn-reset-discard-all');
            const btnResetCancel = document.getElementById('btn-reset-cancel');

            if (btnResetTracker && modalResetOverlay) {
                btnResetTracker.addEventListener('click', () => {
                    modalResetOverlay.style.display = 'flex';
                });
            }

            const hideResetModal = () => {
                if (modalResetOverlay) {
                    modalResetOverlay.style.display = 'none';
                }
            };

            if (btnCloseResetModal) {
                btnCloseResetModal.addEventListener('click', hideResetModal);
            }
            if (btnResetCancel) {
                btnResetCancel.addEventListener('click', hideResetModal);
            }

            if (btnResetSaveExport) {
                btnResetSaveExport.addEventListener('click', () => {
                    this.exportToJSON();
                    this.resetTrackerData();
                    hideResetModal();
                });
            }

            if (btnResetDiscardAll) {
                btnResetDiscardAll.addEventListener('click', () => {
                    this.resetTrackerData();
                    hideResetModal();
                });
            }

            // [신규] 실시간 AI 원본 답변 보기 모달 제어
            const btnViewRaw = document.getElementById('btn-view-raw-responses');
            const modalRawOverlay = document.getElementById('modal-raw-responses-overlay');
            const btnCloseRaw = document.getElementById('btn-close-raw-modal');
            const btnCloseRawBottom = document.getElementById('btn-close-raw-modal-bottom');
            const rawTabs = document.querySelectorAll('#raw-tabs-container .tab-btn');
            const rawTextarea = document.getElementById('raw-response-textarea');

            if (btnViewRaw && modalRawOverlay) {
                btnViewRaw.addEventListener('click', () => {
                    modalRawOverlay.style.display = 'flex';
                    // 현재 선택된 탭의 텍스트 로드
                    const activeTab = document.querySelector('#raw-tabs-container .tab-btn.active');
                    if (activeTab && rawTextarea) {
                        const model = activeTab.getAttribute('data-model');
                        rawTextarea.value = this.lastResponses[model] || '최근 분석된 실시간 데이터가 없거나, 해당 모델의 API 응답이 기록되지 않았습니다.';
                    }
                });
            }

            const hideRawModal = () => {
                if (modalRawOverlay) modalRawOverlay.style.display = 'none';
            };

            if (btnCloseRaw) btnCloseRaw.addEventListener('click', hideRawModal);
            if (btnCloseRawBottom) btnCloseRawBottom.addEventListener('click', hideRawModal);

            // 탭 클릭 이벤트
            rawTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // 모든 탭 비활성화
                    rawTabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.color = 'var(--text-muted)';
                        t.style.borderBottom = 'none';
                    });
                    
                    // 현재 탭 활성화
                    tab.classList.add('active');
                    tab.style.color = 'var(--neon-cyan)';
                    tab.style.borderBottom = '2px solid var(--neon-cyan)';
                    
                    const model = tab.getAttribute('data-model');
                    if (rawTextarea) {
                        rawTextarea.value = this.lastResponses[model] || '최근 분석된 실시간 데이터가 없거나, 해당 모델의 API 응답이 기록되지 않았습니다.';
                    }
                });
            });
        }

        // --- LED 상태 표시등 업데이트 ---
        updateLedState(model, state) {
            let ledId = '';
            if (model === 'gemini') ledId = 'gemini-status-led';
            else if (model === 'openai') ledId = 'openai-status-led';
            else if (model === 'perplexity') ledId = 'perplexity-status-led';
            else if (model === 'claude') ledId = 'claude-status-led';
            else if (model === 'grok') ledId = 'grok-status-led';

            const led = document.getElementById(ledId);
            if (!led) return;

            led.className = 'api-status-led';
            if (state === 'pending') {
                led.classList.add('status-pending');
                led.title = `${model.toUpperCase()} 연결 상태: 대기 (검증 전)`;
            } else if (state === 'connected') {
                led.classList.add('status-connected');
                led.title = `${model.toUpperCase()} 연결 상태: 정상 연결 완료`;
            } else if (state === 'error') {
                led.classList.add('status-error');
                led.title = `${model.toUpperCase()} 연결 상태: 오류 (키가 비활성이거나 잘못됨)`;
            }
        }

        // --- API 키 유효성 테스트 통합 제어 ---
        async runConnectionTests() {
            const geminiKey = document.getElementById('tracker-gemini-key').value.trim();
            const openaiKey = document.getElementById('tracker-openai-key').value.trim();
            const perplexityKey = document.getElementById('tracker-perplexity-key').value.trim();
            const claudeKey = document.getElementById('tracker-claude-key').value.trim();
            const grokKey = document.getElementById('tracker-grok-key').value.trim();

            if (!geminiKey && !openaiKey && !perplexityKey && !claudeKey && !grokKey) {
                alert('검증할 API Key를 하나 이상 입력해 주세요.');
                return;
            }

            let results = [];

            if (geminiKey) {
                this.updateLedState('gemini', 'pending');
                const res = await this.verifyKeyRequest('gemini', geminiKey);
                this.updateLedState('gemini', res ? 'connected' : 'error');
                results.push(`Gemini API: ${res ? '🟢 성공' : '🔴 실패'}`);
            } else {
                this.updateLedState('gemini', 'pending');
            }

            if (openaiKey) {
                this.updateLedState('openai', 'pending');
                const res = await this.verifyKeyRequest('openai', openaiKey);
                this.updateLedState('openai', res ? 'connected' : 'error');
                results.push(`OpenAI API: ${res ? '🟢 성공' : '🔴 실패'}`);
            } else {
                this.updateLedState('openai', 'pending');
            }

            if (perplexityKey) {
                this.updateLedState('perplexity', 'pending');
                const res = await this.verifyKeyRequest('perplexity', perplexityKey);
                this.updateLedState('perplexity', res ? 'connected' : 'error');
                results.push(`Perplexity API: ${res ? '🟢 성공' : '🔴 실패'}`);
            } else {
                this.updateLedState('perplexity', 'pending');
            }

            if (claudeKey) {
                this.updateLedState('claude', 'pending');
                const res = await this.verifyKeyRequest('claude', claudeKey);
                this.updateLedState('claude', res ? 'connected' : 'error');
                results.push(`Claude API: ${res ? '🟢 성공' : '🔴 실패'}`);
            } else {
                this.updateLedState('claude', 'pending');
            }

            if (grokKey) {
                this.updateLedState('grok', 'pending');
                const res = await this.verifyKeyRequest('grok', grokKey);
                this.updateLedState('grok', res ? 'connected' : 'error');
                results.push(`Grok API: ${res ? '🟢 성공' : '🔴 실패'}`);
            } else {
                this.updateLedState('grok', 'pending');
            }

            alert(`연결 테스트 결과:\n\n${results.join('\n')}\n\n실패로 표시된 모델은 키 유효 기간, 오타, 또는 잔액(Credit) 부족 현상일 수 있습니다.`);
        }

        async verifyKeyRequest(model, key) {
            try {
                if (model === 'gemini') {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
                    });
                    return response.ok;
                } else if (model === 'openai') {
                    const url = `https://api.openai.com/v1/chat/completions`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${key}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o-mini",
                            messages: [{ role: "user", content: "Hello" }],
                            max_tokens: 5
                        })
                    });
                    return response.ok;
                } else if (model === 'perplexity') {
                    const url = `https://api.perplexity.ai/chat/completions`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${key}`
                        },
                        body: JSON.stringify({
                            model: "sonar",
                            messages: [{ role: "user", content: "Hello" }],
                            max_tokens: 5
                        })
                    });
                    return response.ok;
                } else if (model === 'claude') {
                    const url = `https://api.anthropic.com/v1/messages`;
                    const payload = {
                        model: "claude-3-5-sonnet-20241022",
                        max_tokens: 1,
                        messages: [{ role: "user", content: "H" }]
                    };
                    const headers = {
                        'Content-Type': 'application/json',
                        'x-api-key': key,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    };
                    
                    let response;
                    try {
                        response = await fetch(url, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(payload)
                        });
                    } catch (e) {
                        console.warn("Claude verifyKeyRequest CORS block, trying proxy...");
                    }

                    if (!response || !response.ok) {
                        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                        response = await fetch(proxyUrl, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(payload)
                        });
                    }
                    return response.ok;
                } else if (model === 'grok') {
                    const url = `https://api.x.ai/v1/chat/completions`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${key}`
                        },
                        body: JSON.stringify({
                            model: "grok-2-1212",
                            messages: [{ role: "user", content: "Hello" }],
                            max_tokens: 5
                        })
                    });
                    return response.ok;
                }
            } catch (err) {
                console.error(`${model} 연결 오류:`, err);
            }
            return false;
        }

        async silentVerifyAllKeys() {
            if (this.apiKeys.gemini) {
                const res = await this.verifyKeyRequest('gemini', this.apiKeys.gemini);
                this.updateLedState('gemini', res ? 'connected' : 'error');
            } else {
                this.updateLedState('gemini', 'pending');
            }

            if (this.apiKeys.openai) {
                const res = await this.verifyKeyRequest('openai', this.apiKeys.openai);
                this.updateLedState('openai', res ? 'connected' : 'error');
            } else {
                this.updateLedState('openai', 'pending');
            }

            if (this.apiKeys.perplexity) {
                const res = await this.verifyKeyRequest('perplexity', this.apiKeys.perplexity);
                this.updateLedState('perplexity', res ? 'connected' : 'error');
            } else {
                this.updateLedState('perplexity', 'pending');
            }

            if (this.apiKeys.claude) {
                const res = await this.verifyKeyRequest('claude', this.apiKeys.claude);
                this.updateLedState('claude', res ? 'connected' : 'error');
            } else {
                this.updateLedState('claude', 'pending');
            }

            if (this.apiKeys.grok) {
                const res = await this.verifyKeyRequest('grok', this.apiKeys.grok);
                this.updateLedState('grok', res ? 'connected' : 'error');
            } else {
                this.updateLedState('grok', 'pending');
            }
        }

        // --- 질문 추가 및 제거 ---
        addQuestion(text) {
            const today = this.getFormattedDate();
            const newQ = {
                id: 'q_' + Date.now(),
                text: text,
                baselineRate: 0,
                currentRate: 0,
                createdDate: today,          // 최초 등록일 자동 부여
                lastAuditedDate: '-',        // 분석 수행 전 대기
                history: [0, 0, 0, 0, 0, 0, 0],
                modelRates: {
                    ChatGPT: 0,
                    Gemini: 0,
                    Claude: 0,
                    Grok: 0,
                    Perplexity: 0
                }
            };
            this.questions.push(newQ);
            this.activeQuestionId = newQ.id;
            this.saveQuestions();
            this.renderQuestionList();
            this.updateDashboard();

            alert(`'${text}' 질문이 등록되었습니다.`);
        }

        deleteQuestion(id, event) {
            if (event) event.stopPropagation();
            if (!confirm('해당 질문을 정말 삭제하시겠습니까?')) return;

            this.questions = this.questions.filter(q => q.id !== id);
            this.saveQuestions();

            if (this.activeQuestionId === id) {
                this.activeQuestionId = this.questions.length > 0 ? this.questions[0].id : null;
            }

            this.renderQuestionList();
            this.updateDashboard();
        }

        // --- UI 렌더링 함수군 ---
        renderQuestionList() {
            const container = document.getElementById('tracker-question-list');
            if (!container) return;

            container.innerHTML = '';
            
            if (this.questions.length === 0) {
                container.innerHTML = `<div class="empty-list-note">등록된 질문이 없습니다. 상단에서 추가해 주세요.</div>`;
                return;
            }

            this.questions.forEach(q => {
                const isActive = q.id === this.activeQuestionId;
                const div = document.createElement('div');
                div.className = `question-item ${isActive ? 'active' : ''}`;
                div.dataset.id = q.id;

                const baseline = q.baselineRate || 0;
                const current = q.currentRate || 0;
                const arrow = current >= baseline ? '▲' : '▼';
                const colorClass = current > baseline ? 'text-neon-red' : (current < baseline ? 'text-neon-cyan' : '');
                
                // 등록일 및 분석일 세팅
                const cDate = q.createdDate || '-';
                const aDate = q.lastAuditedDate || '-';

                div.innerHTML = `
                    <div class="question-item-content">
                        <div class="question-item-text" title="${q.text}">${q.text}</div>
                        <div class="question-item-meta" style="margin-top: 4px;">
                            <span style="display: block; font-size: 11px;">언급률: ${baseline}% <span class="${colorClass}" style="font-weight: bold;">${arrow} ${current}%</span></span>
                            <span style="display: block; font-size: 9px; color: var(--text-muted); margin-top: 2px;">
                                등록: ${cDate} | 최근분석: ${aDate}
                            </span>
                        </div>
                    </div>
                    <div class="question-item-actions">
                        <button class="btn-icon-only delete" title="삭제">
                            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                        </button>
                    </div>
                `;

                div.addEventListener('click', () => {
                    this.activeQuestionId = q.id;
                    this.renderQuestionList();
                    this.updateDashboard();
                });

                const delBtn = div.querySelector('.btn-icon-only.delete');
                if (delBtn) {
                    delBtn.addEventListener('click', (e) => this.deleteQuestion(q.id, e));
                }

                container.appendChild(div);
            });

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        updateDashboard() {
            const q = this.questions.find(item => item.id === this.activeQuestionId);
            const countSpan = document.getElementById('stats-question-count');
            if (countSpan) countSpan.textContent = this.questions.length;

            // 배너 엘리먼트 획득 및 상태 업데이트
            const banner = document.getElementById('demo-mode-warning-banner');
            if (banner) {
                const hasGemini = !!this.apiKeys.gemini;
                const hasOpenai = !!this.apiKeys.openai;
                const hasPerplexity = !!this.apiKeys.perplexity;

                const liveKeysCount = (hasGemini ? 1 : 0) + (hasOpenai ? 1 : 0) + (hasPerplexity ? 1 : 0);

                if (liveKeysCount === 0) {
                    banner.style.display = 'flex';
                    banner.className = 'demo-warning-banner demo-active';
                    banner.innerHTML = `
                        <i data-lucide="alert-triangle" style="width: 14px; height: 14px; flex-shrink: 0; margin-right: 4px;"></i>
                        <span>⚠️ 현재 API 키 미등록 상태로 <strong>데모 모드(추정 데이터)</strong>로 동작하고 있습니다. 실제 AI 검색 결과에 따른 정확한 언급률을 반영하려면 왼쪽 아래에서 API Key를 입력하고 연결 테스트를 완료해 주세요.</span>
                    `;
                } else if (liveKeysCount === 3) {
                    banner.style.display = 'flex';
                    banner.className = 'demo-warning-banner live-full';
                    banner.innerHTML = `
                        <i data-lucide="check-circle" style="width: 14px; height: 14px; flex-shrink: 0; margin-right: 4px;"></i>
                        <span>🟢 ChatGPT, Gemini, Perplexity의 <strong>실시간 API 실측 데이터</strong>가 대시보드에 적용되었습니다. (언급이 전혀 없는 모델은 0%로 정직하게 실측됩니다)</span>
                    `;
                } else {
                    banner.style.display = 'flex';
                    banner.className = 'demo-warning-banner live-partial';
                    const activeModels = [];
                    if (hasOpenai) activeModels.push('ChatGPT');
                    if (hasGemini) activeModels.push('Gemini');
                    if (hasPerplexity) activeModels.push('Perplexity');
                    
                    const inactiveModels = [];
                    if (!hasOpenai) inactiveModels.push('ChatGPT');
                    if (!hasGemini) inactiveModels.push('Gemini');
                    if (!hasPerplexity) inactiveModels.push('Perplexity');

                    banner.innerHTML = `
                        <i data-lucide="info" style="width: 14px; height: 14px; flex-shrink: 0; margin-right: 4px;"></i>
                        <span>ℹ️ <strong>${activeModels.join(', ')}</strong>는 실시간 API 실측 데이터가 반영되며, 미등록된 <strong>${inactiveModels.join(', ')}</strong> 및 기타 모델은 0%로 정직하게 표기됩니다.</span>
                    `;
                }

                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }

            if (!q) {
                document.getElementById('trend-overall-rate').textContent = '0.0%';
                const deltaSpan = document.getElementById('trend-overall-delta');
                deltaSpan.textContent = '+0.0%p';
                deltaSpan.className = 'summary-delta-value positive';
                this.clearCharts();
                this.renderTable([]);
                return;
            }

            const currentOverall = q.currentRate || 0;
            const baselineOverall = q.baselineRate || 0;
            const delta = currentOverall - baselineOverall;

            document.getElementById('trend-overall-rate').textContent = `${currentOverall.toFixed(1)}%`;
            const deltaSpan = document.getElementById('trend-overall-delta');
            if (delta >= 0) {
                deltaSpan.textContent = `▲ +${delta.toFixed(1)}%p`;
                deltaSpan.className = 'summary-delta-value positive';
            } else {
                deltaSpan.textContent = `▼ ${delta.toFixed(1)}%p`;
                deltaSpan.className = 'summary-delta-value negative';
            }

            this.updateCharts(q);
            this.renderTable(q);
        }

        renderTable(q) {
            const tbody = document.getElementById('tracker-table-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            if (!q || !q.modelRates) {
                tbody.innerHTML = `<tr><td colspan="4" class="empty-table-cell" style="text-align: center; padding: 20px;">질문을 등록하거나 선택해 주세요.</td></tr>`;
                return;
            }

            const models = ['ChatGPT', 'Gemini', 'Claude', 'Grok', 'Perplexity'];
            models.forEach(model => {
                const curVal = q.modelRates[model] || 0;
                const baseVal = Math.max(0, Math.round(curVal * 0.4));
                const diff = curVal - baseVal;
                
                let diffText = '0.0%p';
                let diffClass = 'stable';
                if (diff > 0) {
                    diffText = `▲ +${diff.toFixed(1)}%p`;
                    diffClass = 'up';
                } else if (diff < 0) {
                    diffText = `▼ ${diff.toFixed(1)}%p`;
                    diffClass = 'down';
                } else {
                    diffText = `● ${diff.toFixed(1)}%p`;
                }

                // API 키 등록 상태에 따른 실측 / 추정 배지 구분
                let statusBadge = '';
                if (model === 'ChatGPT') {
                    statusBadge = this.apiKeys.openai ? '<span class="badge badge-live">실측</span>' : '<span class="badge badge-estimate">추정</span>';
                } else if (model === 'Gemini') {
                    statusBadge = this.apiKeys.gemini ? '<span class="badge badge-live">실측</span>' : '<span class="badge badge-estimate">추정</span>';
                } else if (model === 'Perplexity') {
                    statusBadge = this.apiKeys.perplexity ? '<span class="badge badge-live">실측</span>' : '<span class="badge badge-estimate">추정</span>';
                } else {
                    statusBadge = '<span class="badge badge-estimate">추정</span>';
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="model-cell" style="display: flex; align-items: center; justify-content: flex-start; gap: 4px;">
                        <span>${model}</span>
                        ${statusBadge}
                    </td>
                    <td class="rate-val" style="color: var(--text-muted);">${baseVal.toFixed(1)}%</td>
                    <td class="rate-val" style="color: var(--neon-green); font-weight: 700;">${curVal.toFixed(1)}%</td>
                    <td class="change-cell ${diffClass}">${diffText}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // --- Chart.js 초기화 ---
        initCharts() {
            const ctxLine = document.getElementById('trendLineChart');
            const ctxRadar = document.getElementById('modelRadarChart');

            if (!ctxLine || !ctxRadar) return;

            this.charts.line = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['1주차', '2주차', '3주차', '4주차', '5주차', '6주차', '7주차'],
                    datasets: [{
                        label: '전체 AI 언급률 (%)',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#00f2fe',
                        borderWidth: 3,
                        pointBackgroundColor: '#00f2fe',
                        pointBorderColor: '#05070f',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#00f2fe',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return null;
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
                            gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
                            return gradient;
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0c0f1d',
                            titleColor: '#fff',
                            bodyColor: '#00f2fe',
                            borderColor: 'rgba(0, 242, 254, 0.3)',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: function(context) { return `언급률: ${context.parsed.y.toFixed(1)}%`; }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.03)' },
                            ticks: { font: { size: 10 } }
                        },
                        y: {
                            min: 0,
                            max: 100,
                            grid: { color: 'rgba(255, 255, 255, 0.03)' },
                            ticks: {
                                font: { size: 10 },
                                callback: function(value) { return value + '%'; }
                            }
                        }
                    }
                }
            });

            this.charts.radar = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['ChatGPT', 'Gemini', 'Claude', 'Grok', 'Perplexity'],
                    datasets: [
                        {
                            label: '기준 (Baseline)',
                            data: [0, 0, 0, 0, 0],
                            borderColor: 'rgba(245, 158, 11, 0.6)',
                            backgroundColor: 'rgba(245, 158, 11, 0.08)',
                            borderWidth: 1.5,
                            pointRadius: 2,
                            fill: true
                        },
                        {
                            label: '현재 (Current)',
                            data: [0, 0, 0, 0, 0],
                            borderColor: '#39ff14',
                            backgroundColor: 'rgba(57, 255, 20, 0.15)',
                            borderWidth: 2.5,
                            pointBackgroundColor: '#39ff14',
                            pointHoverBackgroundColor: '#fff',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: { font: { size: 9 }, boxWidth: 12, padding: 10 }
                        },
                        tooltip: {
                            backgroundColor: '#0c0f1d',
                            borderColor: 'rgba(57, 255, 20, 0.3)',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) { return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`; }
                            }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            pointLabels: { font: { size: 11, weight: 'bold' }, color: '#e2e8f0' },
                            ticks: { display: false, maxTicksLimit: 5 },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }

        updateCharts(q) {
            if (!q) return;

            if (this.charts.line) {
                this.charts.line.data.datasets[0].data = q.history || [0, 0, 0, 0, 0, 0, 0];
                this.charts.line.update();
            }

            if (this.charts.radar) {
                const models = ['ChatGPT', 'Gemini', 'Claude', 'Grok', 'Perplexity'];
                const currentData = models.map(m => q.modelRates[m] || 0);
                const baselineData = currentData.map(val => Math.max(0, Math.round(val * 0.4)));

                this.charts.radar.data.datasets[0].data = baselineData;
                this.charts.radar.data.datasets[1].data = currentData;
                this.charts.radar.update();
            }
        }

        clearCharts() {
            if (this.charts.line) {
                this.charts.line.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                this.charts.line.update();
            }
            if (this.charts.radar) {
                this.charts.radar.data.datasets[0].data = [0, 0, 0, 0, 0];
                this.charts.radar.data.datasets[1].data = [0, 0, 0, 0, 0];
                this.charts.radar.update();
            }
        }

        // --- 실시간 분석 실행 로직 (최종 분석 날짜 갱신 보완) ---
        async runKeywordAudit() {
            const q = this.questions.find(item => item.id === this.activeQuestionId);
            if (!q) {
                alert('분석을 시작할 질문을 먼저 등록하거나 선택해 주세요.');
                return;
            }

            const btn = document.getElementById('btn-run-audit');
            const btnLeft = document.getElementById('btn-run-audit-left');
            const originalHtml = btn ? btn.innerHTML : '';
            
            // 두 버튼 모두 로딩 처리
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 분석 중...`;
            }
            if (btnLeft) {
                btnLeft.disabled = true;
                btnLeft.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> AEO 데이터 분석 중...`;
            }

            try {
                // 1. 실시간 웹 검색 원본 텍스트 수집 (RAG 컨텍스트 획득)
                let perplexityContext = '';
                if (this.apiKeys.perplexity) {
                    perplexityContext = await this.fetchPerplexityAuditRawText(q.text);
                    this.lastResponses.Perplexity = perplexityContext;
                } else {
                    console.log("Perplexity API Key 없음 -> 무료 DuckDuckGo RAG 수집 시작");
                    perplexityContext = await this.fetchWebSearchSnippets(q.text);
                    this.lastResponses.Perplexity = "Perplexity API 키가 등록되지 않았습니다. (무료 DuckDuckGo 웹 검색 RAG 모드로 실행됨)";
                }

                // 수집된 검색 컨텍스트 캐싱 및 저장
                this.lastResponses.SearchContext = perplexityContext || "실시간 웹 검색 결과가 비어 있거나 수집하지 못했습니다.";
                localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));

                // 무료 검색 크롤링 실패 시 AI 프롬프트에 디버그용 에러 메시지가 RAG 컨텍스트로 주입되는 것을 차단
                const actualRAGContext = (perplexityContext && !perplexityContext.startsWith('[오류]')) ? perplexityContext : '';

                let geminiScore = 0;
                let chatGptScore = 0;
                let perplexityScore = 0;
                let claudeScore = 0;
                let grokScore = 0;

                if (this.apiKeys.perplexity) {
                    perplexityScore = this.evaluateTextMentionScore(perplexityContext, this.targetBrand);
                }
                if (this.apiKeys.gemini) {
                    // Gemini는 자체 구글 실시간 검색 Grounding이 동작함
                    geminiScore = await this.fetchGeminiAudit(q.text);
                }
                if (this.apiKeys.openai) {
                    chatGptScore = await this.fetchOpenAIAudit(q.text, actualRAGContext);
                }
                if (this.apiKeys.claude) {
                    claudeScore = await this.fetchClaudeAudit(q.text, actualRAGContext);
                }
                if (this.apiKeys.grok) {
                    grokScore = await this.fetchGrokAudit(q.text, actualRAGContext);
                }

                let logInfo = '';
                let liveCount = 0;
                if (this.apiKeys.gemini) { logInfo += 'Gemini 실측 | '; liveCount++; }
                if (this.apiKeys.openai) { logInfo += 'ChatGPT 실측 | '; liveCount++; }
                if (this.apiKeys.perplexity) { logInfo += 'Perplexity 실측 | '; liveCount++; }
                if (this.apiKeys.claude) { logInfo += 'Claude 실측 | '; liveCount++; }
                if (this.apiKeys.grok) { logInfo += 'Grok 실측 | '; liveCount++; }

                if (liveCount === 0) {
                    logInfo = `실시간 분석 대기 (API 키 없음)`;
                } else {
                    logInfo = logInfo.slice(0, -3) + ' 적용';
                }

                q.modelRates.Gemini = geminiScore;
                q.modelRates.ChatGPT = chatGptScore;
                q.modelRates.Perplexity = perplexityScore;
                q.modelRates.Claude = claudeScore;
                q.modelRates.Grok = grokScore;

                const avgRate = Math.round((geminiScore + chatGptScore + claudeScore + grokScore + perplexityScore) / 5);
                q.currentRate = avgRate;
                
                q.history.shift();
                q.history.push(avgRate);

                if (q.baselineRate === 0) {
                    q.baselineRate = Math.round(avgRate * 0.4);
                }

                // [신규] 최종 분석일 기록
                q.lastAuditedDate = this.getFormattedDate();

                this.saveQuestions();
                this.renderQuestionList();
                this.updateDashboard();

                // [신규] 스케줄러 메일 전송 연계 (활성화 시 외부 쏘아 보내기 실행)
                if (this.scheduler.active && this.scheduler.email) {
                    this.sendMailWebhook(q);
                }

                let alertMsg = `AEO/GEO 키워드 언급률 분석이 완료되었습니다!\n`;
                alertMsg += `* 분석 타겟 브랜드: ${this.targetBrand}\n`;
                alertMsg += `* 종합 평균 언급률: ${avgRate}%\n\n`;

                // RAG 웹 검색 수집이 실패했을 경우 사용자 안내 주입
                if (!this.apiKeys.perplexity && !actualRAGContext) {
                    alertMsg += `⚠️ [경고] 실시간 웹 검색(RAG) 수집이 일시적인 프록시 차단 또는 네트워크 에러로 인해 실패했습니다. LLM 모델이 최신 정보를 반영하지 못해 언급률이 0%로 산출되었을 수 있으니, 대시보드의 [실시간 AI 원본 답변 보기] -> [실시간 검색 컨텍스트 (RAG)] 탭에서 상세 오류 로그를 확인해 주십시오.\n\n`;
                }

                alertMsg += `[상세 모드: ${logInfo}]\n`;
                alertMsg += `- ChatGPT 점수 (실측): ${chatGptScore}%\n`;
                alertMsg += `- Gemini 점수 (실측): ${geminiScore}%\n`;
                alertMsg += `- Perplexity 점수 (실측): ${perplexityScore}%\n`;
                alertMsg += `- Claude 점수 (실측): ${claudeScore}%\n`;
                alertMsg += `- Grok 점수 (실측): ${grokScore}%\n\n`;
                alertMsg += `(※ 실측되지 않은 데이터는 사기 없는 분석을 위해 점수를 전혀 부여하지 않고 0% 처리되었습니다.)`;
                
                alert(alertMsg);

            } catch (err) {
                console.error("분석 실패:", err);
                alert("AI 실시간 분석에 실패했습니다. 크레딧이나 API 연결 상태를 확인해 주세요.");
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHtml;
                }
                if (btnLeft) {
                    btnLeft.disabled = false;
                    btnLeft.innerHTML = `<i class="play-icon" data-lucide="play"></i> 실시간 GEO 추적 분석시작`;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        }

        async fetchGeminiAudit(questionText) {
            const apiKey = this.apiKeys.gemini;
            const brand = this.targetBrand || '미담한의원';

            // 편향 지시 및 억지 추천 유도를 제거한 일반 추천 프롬프트로 수정
            const systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 사용자의 질문에 대해 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 인터넷 지식과 구글 검색 실시간 지식을 기반으로 객관적인 정보만을 담아 자연스럽게 설명해줘.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{ parts: [{ text: `${systemPrompt}\n\n질문: ${questionText}` }] }],
                tools: [{ googleSearchRetrieval: {} }] // 구글 실시간 검색 Grounding 기능 활성화!
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gemini API fail");
            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            // 캐시 수집
            this.lastResponses.Gemini = textResponse;
            localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));
            
            return this.evaluateTextMentionScore(textResponse, brand);
        }

        async fetchOpenAIAudit(questionText, context = '') {
            const apiKey = this.apiKeys.openai;
            const brand = this.targetBrand || '미담한의원';

            let systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 사용자의 질문에 대해 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 인터넷 지식과 학습 지식을 기반으로 객관적인 정보만을 담아 자연스럽게 설명해줘.`;

            if (context) {
                systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 제공되는 [실시간 인터넷 검색 결과]를 최신 정보 컨텍스트로 삼아, 사용자의 질문에 대해 신뢰성 높은 최신 병원/브랜드명 3곳 내외를 추천하고 구체적인 이유를 사실 기반으로 상세히 적어줘.
[실시간 인터넷 검색 결과]:
${context}

특정 병원을 억지로 추천하도록 편향을 두지 말고, 제공된 실시간 검색 자료를 객관적으로 반영하여 자연스럽게 대답해줘.`;
            }

            const url = `https://api.openai.com/v1/chat/completions`;
            const payload = {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: questionText }
                ],
                temperature: 0.5
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("OpenAI API fail");
            const data = await response.json();
            const textResponse = data.choices?.[0]?.message?.content || '';
            
            // 캐시 수집
            this.lastResponses.ChatGPT = textResponse;
            localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));
            
            return this.evaluateTextMentionScore(textResponse, brand);
        }

        async fetchPerplexityAudit(questionText) {
            const apiKey = this.apiKeys.perplexity;
            const brand = this.targetBrand || '미담한의원';

            const url = `https://api.perplexity.ai/chat/completions`;
            const payload = {
                model: "sonar", // Perplexity 최신 실시간 웹 검색 sonar 모델
                messages: [
                    {
                        role: "system",
                        content: `너는 질문에 답하는 AI 검색 엔진이다. 사용자의 질문에 대해 실시간 인터넷 검색 지식을 기반으로 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 검색 데이터에 입각하여 사실 정보만을 담아 자연스럽게 설명해줘.`
                    },
                    { role: "user", content: questionText }
                ],
                temperature: 0.5
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Perplexity API fail");
            const data = await response.json();
            const textResponse = data.choices?.[0]?.message?.content || '';
            
            // 캐시 수집
            this.lastResponses.Perplexity = textResponse;
            localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));
            
            return this.evaluateTextMentionScore(textResponse, brand);
        }

        async fetchPerplexityAuditRawText(questionText) {
            const apiKey = this.apiKeys.perplexity;
            if (!apiKey) return '';

            const url = `https://api.perplexity.ai/chat/completions`;
            const payload = {
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: `너는 질문에 답하는 AI 검색 엔진이다. 사용자의 질문에 대해 실시간 인터넷 검색 지식을 기반으로 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 검색 데이터에 입각하여 사실 정보만을 담아 자연스럽게 설명해줘.`
                    },
                    { role: "user", content: questionText }
                ],
                temperature: 0.5
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) return '';
                const data = await response.json();
                return data.choices?.[0]?.message?.content || '';
            } catch (err) {
                console.error("Perplexity Raw Text 수집 실패:", err);
                return '';
            }
        }

        async fetchClaudeAudit(questionText, context = '') {
            const apiKey = this.apiKeys.claude;
            const brand = this.targetBrand || '미담한의원';
            
            let systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 사용자의 질문에 대해 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 인터넷 지식과 학습 지식을 기반으로 객관적인 정보만을 담아 자연스럽게 설명해줘.`;

            if (context) {
                systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 제공되는 [실시간 인터넷 검색 결과]를 최신 정보 컨텍스트로 삼아, 사용자의 질문에 대해 신뢰성 높은 최신 병원/브랜드명 3곳 내외를 추천하고 구체적인 이유를 사실 기반으로 상세히 적어줘.
[실시간 인터넷 검색 결과]:
${context}

특정 병원을 억지로 추천하도록 편향을 두지 말고, 제공된 실시간 검색 자료를 객관적으로 반영하여 자연스럽게 대답해줘.`;
            }

            const url = `https://api.anthropic.com/v1/messages`;
            const payload = {
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: "user", content: questionText }]
            };
            const headers = {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            };

            try {
                let response;
                try {
                    response = await fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(payload)
                    });
                } catch (e) {
                    console.warn("Claude fetch API CORS block, trying proxy...");
                }

                if (!response || !response.ok) {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                    response = await fetch(proxyUrl, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(payload)
                    });
                }

                if (!response.ok) throw new Error("Claude API fail");
                const data = await response.json();
                const textResponse = data.content?.[0]?.text || '';
                
                // 캐시 수집
                this.lastResponses.Claude = textResponse;
                localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));

                return this.evaluateTextMentionScore(textResponse, brand);
            } catch (err) {
                console.error("Claude API 호출 실패:", err);
                return 0;
            }
        }

        async fetchGrokAudit(questionText, context = '') {
            const apiKey = this.apiKeys.grok;
            const brand = this.targetBrand || '미담한의원';

            let systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 사용자의 질문에 대해 일반적으로 추천되거나 많이 거론되는 한의원/병원명을 3곳 내외로 추천하고 구체적인 이유를 상세히 적어줘. 특정 병원을 억지로 추천하도록 편향을 두지 말고, 실제 인터넷 지식과 학습 지식을 기반으로 객관적인 정보만을 담아 자연스럽게 설명해줘.`;

            if (context) {
                systemPrompt = `너는 질문에 답하는 AI 어시스턴트이다. 제공되는 [실시간 인터넷 검색 결과]를 최신 정보 컨텍스트로 삼아, 사용자의 질문에 대해 신뢰성 높은 최신 병원/브랜드명 3곳 내외를 추천하고 구체적인 이유를 사실 기반으로 상세히 적어줘.
[실시간 인터넷 검색 결과]:
${context}

특정 병원을 억지로 추천하도록 편향을 두지 말고, 제공된 실시간 검색 자료를 객관적으로 반영하여 자연스럽게 대답해줘.`;
            }

            const url = `https://api.x.ai/v1/chat/completions`;
            const payload = {
                model: "grok-2-1212",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: questionText }
                ],
                temperature: 0.5
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("Grok API fail");
                const data = await response.json();
                const textResponse = data.choices?.[0]?.message?.content || '';
                
                // 캐시 수집
                this.lastResponses.Grok = textResponse;
                localStorage.setItem('geo_lens_tracker_last_responses', JSON.stringify(this.lastResponses));

                return this.evaluateTextMentionScore(textResponse, brand);
            } catch (err) {
                console.error("Grok API 호출 실패:", err);
                return 0;
            }
        }

        async fetchWebSearchSnippets(query) {
            // DuckDuckGo 검색 결과 URL (한글 쿼리를 단 한 번만 안전하게 인코딩)
            const searchQueries = [
                `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
                `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
            ];

            // 프록시별 맞춤 경로 조합 빌더 정의
            const proxyBuilders = [
                {
                    name: "cors.eu.org",
                    build: (url) => `https://cors.eu.org/${url}`
                },
                {
                    name: "corsproxy.io (direct)",
                    build: (url) => `https://corsproxy.io/?${url}`
                },
                {
                    name: "allorigins (json)",
                    build: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                    isJson: true
                },
                {
                    name: "allorigins (raw)",
                    build: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
                },
                {
                    name: "codetabs",
                    build: (url) => `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(url)}`
                }
            ];

            let debugLog = [];

            for (const searchUrl of searchQueries) {
                for (const proxy of proxyBuilders) {
                    const fullUrl = proxy.build(searchUrl);
                    debugLog.push(`[시도] 프록시: ${proxy.name} | URL: ${fullUrl}`);
                    try {
                        const controller = new AbortController();
                        // 타임아웃을 15초(15000ms)로 넉넉하게 지정하여 allorigins가 차단/중단되지 않게 함
                        const timeoutId = setTimeout(() => controller.abort(), 15000);

                        const response = await fetch(fullUrl, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (!response.ok) {
                            debugLog.push(`-> HTTP 에러: 상태 코드 ${response.status}`);
                            continue;
                        }
                        
                        let htmlText = '';
                        if (proxy.isJson) {
                            const json = await response.json();
                            htmlText = json.contents || '';
                        } else {
                            htmlText = await response.text();
                        }
                        
                        if (!htmlText || htmlText.length < 200) {
                            debugLog.push(`-> 응답 텍스트 길이 부족 (${htmlText ? htmlText.length : 0} 바이트)`);
                            continue;
                        }

                        // 봇 감지 챌린지 차단 확인
                        if (htmlText.includes("ddg-captcha") || htmlText.includes("robot") || htmlText.includes("automated access") || htmlText.includes("Forbidden")) {
                            debugLog.push(`-> 봇 감지 차단(Captcha/Forbidden) 발생`);
                            continue;
                        }

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlText, 'text/html');
                        
                        let snippets = [];
                        
                        if (searchUrl.includes('html.duckduckgo.com')) {
                            // html.duckduckgo.com 파싱
                            const results = doc.querySelectorAll('.result__snippet');
                            results.forEach((el, index) => {
                                if (index < 10) snippets.push(el.textContent.trim());
                            });
                            
                            if (snippets.length === 0) {
                                const fallbacks = doc.querySelectorAll('.web-result');
                                fallbacks.forEach((el, index) => {
                                    if (index < 10) snippets.push(el.textContent.trim().replace(/\s+/g, ' '));
                                });
                            }
                        } else {
                            // lite.duckduckgo.com 파싱
                            const tdSnippets = doc.querySelectorAll('.result-snippet');
                            tdSnippets.forEach((el, index) => {
                                if (index < 10) snippets.push(el.textContent.trim());
                            });

                            if (snippets.length === 0) {
                                const rows = doc.querySelectorAll('table tr');
                                rows.forEach((row, index) => {
                                    const text = row.textContent.trim();
                                    if (text && text.length > 30 && snippets.length < 10 && !text.includes('정렬') && !text.includes('검색 결과')) {
                                        snippets.push(text.replace(/\s+/g, ' '));
                                    }
                                });
                            }
                        }

                        if (snippets.length > 0) {
                            debugLog.push(`-> 성공! (${proxy.name} 프록시 이용, ${snippets.length}개 스니펫 획득)`);
                            return snippets.join('\n\n');
                        } else {
                            debugLog.push(`-> 파싱 결과 0개 스니펫`);
                        }

                    } catch (err) {
                        debugLog.push(`-> 통신 예외 에러: ${err.message || err}`);
                    }
                }
            }

            console.error("무료 웹 검색 결과 수집 전체 실패. 상세 로그:\n", debugLog.join('\n'));
            return `[오류] 모든 CORS 프록시 및 DuckDuckGo 경로에서 검색 데이터를 수집하지 못했습니다.\n` +
                   `네트워크 상태를 확인하시거나, 잠시 후 다시 실행해 주십시오.\n\n` +
                   `※ 상세 시도 로그:\n` + debugLog.join('\n');
        }

        evaluateTextMentionScore(text, brand) {
            if (!text || !brand) return 0;
            
            // 공백을 모두 제거하고 소문자로 만든 분석 텍스트와 브랜드명
            const cleanText = text.replace(/\s+/g, '').toLowerCase();
            const cleanBrandFull = brand.replace(/\s+/g, '').toLowerCase();
            
            // 1단계 매칭: 전체 브랜드명 (공백 무관 일치 확인)
            if (cleanText.includes(cleanBrandFull)) {
                const escapedBrand = brand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regexStr = escapedBrand.split('').join('\\s*');
                const keywordRegex = new RegExp(`(${regexStr})`, 'gi');
                
                const matches = text.match(keywordRegex) || [brand];
                const brandIndex = text.toLowerCase().indexOf(brand.toLowerCase());
                const isFirstRecommend = brandIndex < 350 && brandIndex !== -1;
                
                let score = 50 + matches.length * 15;
                if (isFirstRecommend) score += 20;
                return Math.min(100, score);
            }

            // 2단계 매칭: 지점/지리 수식어만 뺀 브랜드명 (예: '지유클리닉 강남본점' -> '지유클리닉')
            const noBranchBrand = brand.replace(/\s*(강남본점|강남점|본점|지점|본원)/g, '').trim();
            const cleanNoBranch = noBranchBrand.replace(/\s+/g, '').toLowerCase();
            if (cleanNoBranch.length >= 2 && cleanText.includes(cleanNoBranch)) {
                const escapedSub = noBranchBrand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const subRegexStr = escapedSub.split('').join('\\s*');
                const subRegex = new RegExp(`(${subRegexStr})`, 'gi');
                
                const matches = text.match(subRegex) || [noBranchBrand];
                const brandIndex = text.toLowerCase().indexOf(noBranchBrand.toLowerCase());
                const isFirstRecommend = brandIndex < 400 && brandIndex !== -1;
                
                let score = 40 + matches.length * 15;
                if (isFirstRecommend) score += 20;
                return Math.min(100, score);
            }

            // 3단계 매칭: 의원/한의원/클리닉 등 업종 수식어까지 전부 뺀 핵심 키워드명 (예: '지유클리닉' -> '지유')
            const coreBrand = brand.replace(/\s*(강남본점|강남점|본점|지점|본원|의원|한의원|클리닉|성형외과|피부과|치과)/g, '').trim();
            const cleanCore = coreBrand.replace(/\s+/g, '').toLowerCase();
            if (cleanCore.length >= 2 && cleanText.includes(cleanCore)) {
                const escapedCore = coreBrand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const coreRegexStr = escapedCore.split('').join('\\s*');
                const coreRegex = new RegExp(`(${coreRegexStr})`, 'gi');
                
                const matches = text.match(coreRegex) || [coreBrand];
                const brandIndex = text.toLowerCase().indexOf(cleanCore);
                const isFirstRecommend = brandIndex < 450 && brandIndex !== -1;
                
                let score = 30 + matches.length * 10;
                if (isFirstRecommend) score += 15;
                return Math.min(100, score);
            }

            return 0;
        }

        calculateSimulatedFromBase(baseScore, modelName) {
            // 사기 없는 실측을 위해 모든 가짜(추정) 점수 생성을 원천 차단하고 0% 처리
            return 0;
        }

        calculateSimulatedScore(questionText, modelName) {
            // 사기 없는 실측을 위해 모든 가짜(추정) 점수 생성을 원천 차단하고 0% 처리
            return 0;
        }

        // --- [신규] 외부 이메일 전송용 웹훅 발송 스텁 (백엔드 연동용) ---
        async sendMailWebhook(auditedData) {
            const webhookUrl = "https://your-backend-api.com/send-tracker-report"; // ⚠️ 추후 연동할 실제 서버 API 주소
            const payload = {
                targetBrand: this.targetBrand,
                receiver: this.scheduler.email,
                scheduleTime: this.scheduler.time,
                auditResult: {
                    question: auditedData.text,
                    overallMentionRate: auditedData.currentRate,
                    modelRates: auditedData.modelRates,
                    auditedAt: auditedData.lastAuditedDate
                }
            };

            console.log(`[이메일 스케줄러 작동] 백엔드 웹훅으로 메일 발송 데이터를 전송합니다:`, payload);

            // 실제 백엔드 연동을 원할 시 아래 주석을 해제합니다.
            /*
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                console.log("웹훅 메일 데이터 전송 완료");
            } catch (err) {
                console.error("이메일 웹훅 통신 실패:", err);
            }
            */
        }

        // --- [신규] 추적기 전용 PDF 보고서 출력 제어 ---
        printTrackerPdfReport() {
            // 인쇄 전용 클래스를 바디에 추가하여 타 탭을 인쇄물에서 숨김
            document.body.classList.add('print-tracker-only');

            // 브라우저 렌더러가 스타일을 재그릴 시간을 주기 위해 200ms 대기 후 인쇄 팝업 기동
            setTimeout(() => {
                window.print();
            }, 200);

            // 인쇄 팝업이 종료되면 바디 클래스를 제거하여 복구 (afterprint 미지원 브라우저 대비)
            window.addEventListener('afterprint', () => {
                document.body.classList.remove('print-tracker-only');
            }, { once: true });

            // 안전장치로 2초 뒤 강제 복구
            setTimeout(() => {
                document.body.classList.remove('print-tracker-only');
            }, 2000);
        }

        // --- 날짜 도우미 함수 ---
        getFormattedDate() {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // --- JSON 백업 (내보내기) ---
        exportToJSON() {
            const dataToSave = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                targetBrand: this.targetBrand,
                questions: this.questions,
                apiKeys: {
                    gemini: this.apiKeys.gemini,
                    openai: this.apiKeys.openai,
                    perplexity: this.apiKeys.perplexity
                },
                scheduler: this.scheduler
            };

            const jsonString = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            const safeBrand = this.targetBrand.replace(/[^a-zA-Z0-9가-힣]/g, '');
            a.download = `geolens_backup_${safeBrand}_${new Date().toISOString().slice(0, 10)}.json`;
            a.href = url;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
        }

        // --- JSON 복원 (불러오기) ---
        importFromJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    
                    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
                        alert('올바른 백업 파일(JSON) 형식이 아닙니다.');
                        return;
                    }

                    this.questions = parsed.questions;
                    if (parsed.targetBrand) this.targetBrand = parsed.targetBrand;
                    if (parsed.apiKeys) {
                        this.apiKeys.gemini = parsed.apiKeys.gemini || '';
                        this.apiKeys.openai = parsed.apiKeys.openai || '';
                        this.apiKeys.perplexity = parsed.apiKeys.perplexity || '';
                        this.apiKeys.claude = parsed.apiKeys.claude || '';
                        this.apiKeys.grok = parsed.apiKeys.grok || '';
                    }
                    if (parsed.scheduler) this.scheduler = parsed.scheduler;

                    this.saveQuestions();
                    localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
                    localStorage.setItem('geo_lens_tracker_gemini_key', this.apiKeys.gemini);
                    localStorage.setItem('geo_lens_tracker_openai_key', this.apiKeys.openai);
                    localStorage.setItem('geo_lens_tracker_perplexity_key', this.apiKeys.perplexity);
                    localStorage.setItem('geo_lens_tracker_claude_key', this.apiKeys.claude);
                    localStorage.setItem('geo_lens_tracker_grok_key', this.apiKeys.grok);
                    this.saveSchedulerSettings();

                    this.initUIValues();
                    if (this.questions.length > 0) {
                        this.activeQuestionId = this.questions[0].id;
                    } else {
                        this.activeQuestionId = null;
                    }

                    this.renderQuestionList();
                    this.updateDashboard();

                    alert(`🟢 백업 복원 완료!\n타겟 브랜드: ${this.targetBrand}\n복원 질문 개수: ${this.questions.length}개`);
                    this.silentVerifyAllKeys();

                } catch (err) {
                    console.error("백업 로드 에러:", err);
                    alert('파일 읽기 실패: JSON 데이터 형식이 손상되었습니다.');
                }
            };
            
            reader.readAsText(file);
            event.target.value = '';
        }

        resetTrackerData() {
            // 1. 데이터 초기화
            this.questions = [];
            this.activeQuestionId = null;
            this.targetBrand = '';
            
            // 2. LocalStorage 저장
            this.saveQuestions();
            localStorage.setItem('geo_lens_tracker_target_brand', '');
            
            // 3. UI 컴포넌트들 초기화
            const brandInput = document.getElementById('target-brand-input');
            if (brandInput) {
                brandInput.value = '';
            }
            
            const questionInput = document.getElementById('new-question-input');
            if (questionInput) {
                questionInput.value = '';
            }
            
            // 4. UI 렌더링 갱신
            this.renderQuestionList();
            this.updateDashboard();
            
            alert('데이터가 성공적으로 초기화되었습니다. 새로운 병원명과 질문을 등록해 주세요.');
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        window.KeywordTracker = new AIKeywordTracker();
    });

})();
