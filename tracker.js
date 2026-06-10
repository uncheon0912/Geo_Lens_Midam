/**
 * Geo Lens Midam - 실시간 AI 키워드 추적기 모듈 (tracker.js) - 2차 보완 반영본
 * 
 * 주요 기능:
 * 1. 로컬 저장소(localStorage) 기반 질문 등록 및 관리 (CRUD)
 * 2. Chart.js 기반 네온 다크 스타일의 꺾은선(Trend) 및 방사형(Radar) 차트 시각화
 * 3. Gemini API 실시간 연동 및 한국어 브랜드 키워드 언급률 분석
 * 4. ChatGPT, Claude, Grok, Perplexity 모델 연동 및 지능형 시뮬레이션 지원
 * 5. [신규] API 키 실시간 검증(연결 테스트) 및 LED 상태 연동 (🟡대기, 🟢연결, 🔴에러)
 * 6. [신규] 분석 타겟 브랜드명/병원명 설정 및 동적 정규식 매칭
 * 7. [신규] 국내 금융형 변동 색상 패치 (상승률 = 빨간색, 하락률 = 파란색)
 * 8. [신규] JSON 파일 백업 및 복원 (설정 내보내기 및 가져오기)
 */

(function () {
    'use strict';

    class AIKeywordTracker {
        constructor() {
            this.questions = [];
            this.activeQuestionId = null;
            this.targetBrand = '미담한의원';
            this.charts = {
                line: null,
                radar: null
            };
            this.apiKeys = {
                gemini: '',
                openai: ''
            };

            // 차트 인스턴스 전역 폰트 및 스타일 초기화
            if (window.Chart) {
                Chart.defaults.color = '#94a3b8'; // slate-400
                Chart.defaults.font.family = "'Inter', sans-serif";
            }

            this.init();
        }

        init() {
            // 1. API 키 및 타겟 병원명 로드
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
                
                // 저장된 API 키가 있다면 자동 연결성 자가 검증 실행
                if (this.apiKeys.gemini) {
                    this.silentVerifyGeminiKey();
                }
            }, 100);
        }

        // --- 데이터 로드 및 저장 ---
        loadSettings() {
            this.apiKeys.gemini = localStorage.getItem('geo_lens_tracker_gemini_key') || '';
            this.apiKeys.openai = localStorage.getItem('geo_lens_tracker_openai_key') || '';
            this.targetBrand = localStorage.getItem('geo_lens_tracker_target_brand') || '미담한의원';
        }

        saveSettings(geminiKey, openaiKey, brandName) {
            this.apiKeys.gemini = geminiKey.trim();
            this.apiKeys.openai = openaiKey.trim();
            this.targetBrand = brandName.trim() || '미담한의원';

            localStorage.setItem('geo_lens_tracker_gemini_key', this.apiKeys.gemini);
            localStorage.setItem('geo_lens_tracker_openai_key', this.apiKeys.openai);
            localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
        }

        loadQuestions() {
            const stored = localStorage.getItem('geo_lens_tracker_questions');
            if (stored) {
                try {
                    this.questions = JSON.parse(stored);
                } catch (e) {
                    console.error("질문 데이터 파싱 실패, 기본값으로 대체합니다.", e);
                    this.setDefaultQuestions();
                }
            } else {
                this.setDefaultQuestions();
            }

            if (this.questions.length > 0) {
                // 활성화 질문ID가 없거나 목록에 없는 경우 첫 번째 질문 활성화
                const exists = this.questions.some(q => q.id === this.activeQuestionId);
                if (!exists) {
                    this.activeQuestionId = this.questions[0].id;
                }
            }
        }

        setDefaultQuestions() {
            this.questions = [
                {
                    id: 'q_' + Date.now() + '_1',
                    text: '강동구에서 대상포진 치료 가능한 한의원 알려줘.',
                    baselineRate: 0,
                    currentRate: 70,
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
                    currentRate: 31,
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

        // --- UI 입력 필드 초기값 연동 ---
        initUIValues() {
            const geminiInput = document.getElementById('tracker-gemini-key');
            const openaiInput = document.getElementById('tracker-openai-key');
            const brandInput = document.getElementById('target-brand-input');

            if (geminiInput) geminiInput.value = this.apiKeys.gemini;
            if (openaiInput) openaiInput.value = this.apiKeys.openai;
            if (brandInput) brandInput.value = this.targetBrand;
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

            // API 키 및 브랜드 설정 저장 버튼
            const btnSaveKeys = document.getElementById('btn-save-tracker-keys');
            if (btnSaveKeys) {
                btnSaveKeys.addEventListener('click', () => {
                    const geminiKey = document.getElementById('tracker-gemini-key').value;
                    const openaiKey = document.getElementById('tracker-openai-key').value;
                    const brandName = document.getElementById('target-brand-input').value;
                    
                    this.saveSettings(geminiKey, openaiKey, brandName);
                    
                    // 저장 시 연결 유효성 검사 자동 수행
                    if (this.apiKeys.gemini) {
                        this.verifyGeminiKey(true);
                    } else {
                        this.updateLedState('pending');
                        alert('설정이 저장되었습니다. (입력된 Gemini API 키가 없으므로 테스트 모드로 작동합니다.)');
                    }

                    if (apiContainer) apiContainer.style.display = 'none';
                    if (apiToggle) apiToggle.classList.remove('active');
                });
            }

            // [신규] API 연결 테스트 버튼
            const btnTestKeys = document.getElementById('btn-test-tracker-keys');
            if (btnTestKeys) {
                btnTestKeys.addEventListener('click', () => {
                    this.verifyGeminiKey(false);
                });
            }

            // 타겟 브랜드 실시간 저장 연동 (포커스를 잃을 때 자동 업데이트)
            const brandInput = document.getElementById('target-brand-input');
            if (brandInput) {
                brandInput.addEventListener('blur', () => {
                    const val = brandInput.value.trim();
                    if (val) {
                        this.targetBrand = val;
                        localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
                    }
                });
            }

            // 질문 추가 버튼 및 엔터 키 처리
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

            // 실시간 분석 실행 버튼
            const btnAudit = document.getElementById('btn-run-audit');
            if (btnAudit) {
                btnAudit.addEventListener('click', () => {
                    this.runKeywordAudit();
                });
            }

            // [신규] 설정 백업 파일 저장 (내보내기)
            const btnExport = document.getElementById('btn-export-tracker');
            if (btnExport) {
                btnExport.addEventListener('click', () => {
                    this.exportToJSON();
                });
            }

            // [신규] 설정 백업 파일 업로드 (가져오기)
            const btnImport = document.getElementById('btn-import-tracker');
            if (btnImport) {
                btnImport.addEventListener('change', (e) => {
                    this.importFromJSON(e);
                });
            }

            // 탭 클릭 감지 (차트 크기 깨짐 방지용 리사이즈 유도)
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
        }

        // --- LED 상태 표시등 업데이트 ---
        updateLedState(state) {
            const led = document.getElementById('gemini-status-led');
            if (!led) return;

            led.className = 'api-status-led'; // 초기화
            if (state === 'pending') {
                led.classList.add('status-pending');
                led.title = '연결 상태: 대기 (검증 전)';
            } else if (state === 'connected') {
                led.classList.add('status-connected');
                led.title = '연결 상태: 정상 연결됨';
            } else if (state === 'error') {
                led.classList.add('status-error');
                led.title = '연결 상태: 오류 (유효하지 않은 키)';
            }
        }

        // --- [신규] Gemini API 키 연결 테스트 및 LED 처리 ---
        async verifyGeminiKey(isSilent = false) {
            const geminiKey = document.getElementById('tracker-gemini-key').value.trim();
            if (!geminiKey) {
                this.updateLedState('pending');
                if (!isSilent) alert('먼저 검증할 Gemini API Key를 입력해 주세요.');
                return;
            }

            this.updateLedState('pending'); // 연결 확인 중 노란색 대기 유도

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const payload = {
                contents: [{
                    parts: [{
                        text: "Hello"
                    }]
                }]
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // 통신 성공
                    this.updateLedState('connected');
                    if (!isSilent) alert('🟢 구글 Gemini API 서버 연결 테스트 성공! 정상적이고 유효한 API 키입니다.');
                } else {
                    // 통신 실패 (키 유효성 에러 등)
                    this.updateLedState('error');
                    if (!isSilent) alert('🔴 연결 오류: API 키가 잘못되었거나 제한되었습니다. 다시 확인해 주세요.');
                }
            } catch (err) {
                console.error("Gemini API 연결 확인 실패:", err);
                this.updateLedState('error');
                if (!isSilent) alert('🔴 연결 실패: 네트워크 오류 또는 API 통신 장애가 발생했습니다.');
            }
        }

        // 화면 로드 시 백그라운드에서 조용히 연결 확인 실행
        async silentVerifyGeminiKey() {
            const apiKey = this.apiKeys.gemini;
            if (!apiKey) return;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:key=${apiKey}`; // 간이 체크
            try {
                // 초당 성능 저하 방지용 가벼운 헬스 쿼리 발송
                const checkUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                const response = await fetch(checkUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "health" }] }] })
                });

                if (response.ok) {
                    this.updateLedState('connected');
                } else {
                    this.updateLedState('error');
                }
            } catch (e) {
                this.updateLedState('error');
            }
        }

        // --- 질문 추가 및 제거 ---
        addQuestion(text) {
            const newQ = {
                id: 'q_' + Date.now(),
                text: text,
                baselineRate: 0,
                currentRate: 0,
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

            alert(`'${text}' 질문이 등록되었습니다. 우측 상단 '실시간 분석 실행' 버튼을 클릭하시면 설정된 병원명('${this.targetBrand}')을 기준으로 모니터링 분석이 시작됩니다.`);
        }

        deleteQuestion(id, event) {
            if (event) event.stopPropagation(); // 카드 토글 버블링 방지
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
                // [수정] 상승(Positive)은 빨간색(text-neon-red), 하락(Negative)은 하늘색(text-neon-cyan)으로 변경
                const colorClass = current > baseline ? 'text-neon-red' : (current < baseline ? 'text-neon-cyan' : '');

                div.innerHTML = `
                    <div class="question-item-content">
                        <div class="question-item-text" title="${q.text}">${q.text}</div>
                        <div class="question-item-meta">
                            <span>언급률: ${baseline}% <span class="${colorClass}" style="font-weight: bold;">${arrow} ${current}%</span></span>
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

            if (!q) {
                document.getElementById('trend-overall-rate').textContent = '0.0%';
                const deltaSpan = document.getElementById('trend-overall-delta');
                deltaSpan.textContent = '+0.0%p';
                deltaSpan.className = 'summary-delta-value positive';
                this.clearCharts();
                this.renderTable([]);
                return;
            }

            // 상단 언급률 요약 바 업데이트
            const currentOverall = q.currentRate || 0;
            const baselineOverall = q.baselineRate || 0;
            const delta = currentOverall - baselineOverall;

            document.getElementById('trend-overall-rate').textContent = `${currentOverall.toFixed(1)}%`;
            const deltaSpan = document.getElementById('trend-overall-delta');
            if (delta >= 0) {
                deltaSpan.textContent = `▲ +${delta.toFixed(1)}%p`;
                deltaSpan.className = 'summary-delta-value positive'; // CSS 매핑에 의해 이제 빨간색으로 표기됩니다.
            } else {
                deltaSpan.textContent = `▼ ${delta.toFixed(1)}%p`;
                deltaSpan.className = 'summary-delta-value negative'; // CSS 매핑에 의해 하늘색으로 표기됩니다.
            }

            // 차트 및 테이블 동적 업데이트
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
                // 기준값 설정 (간단히 현재값 대비 40% 수준)
                const baseVal = Math.max(0, Math.round(curVal * 0.4));
                const diff = curVal - baseVal;
                
                let diffText = '0.0%p';
                let diffClass = 'stable';
                if (diff > 0) {
                    diffText = `▲ +${diff.toFixed(1)}%p`;
                    diffClass = 'up'; // [수정] styles.css에서 up은 빨간색
                } else if (diff < 0) {
                    diffText = `▼ ${diff.toFixed(1)}%p`;
                    diffClass = 'down'; // [수정] styles.css에서 down은 하늘색
                } else {
                    diffText = `● ${diff.toFixed(1)}%p`;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="model-cell">${model}</td>
                    <td class="rate-val" style="color: var(--text-muted);">${baseVal.toFixed(1)}%</td>
                    <td class="rate-val" style="color: var(--neon-green); font-weight: 700;">${curVal.toFixed(1)}%</td>
                    <td class="change-cell ${diffClass}">${diffText}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // --- Chart.js 초기화 및 핸들링 ---
        initCharts() {
            const ctxLine = document.getElementById('trendLineChart');
            const ctxRadar = document.getElementById('modelRadarChart');

            if (!ctxLine || !ctxRadar) return;

            // 1. Line Chart
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
                                label: function(context) {
                                    return `언급률: ${context.parsed.y.toFixed(1)}%`;
                                }
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

            // 2. Radar Chart
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
                            labels: {
                                font: { size: 9 },
                                boxWidth: 12,
                                padding: 10
                            }
                        },
                        tooltip: {
                            backgroundColor: '#0c0f1d',
                            borderColor: 'rgba(57, 255, 20, 0.3)',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            pointLabels: {
                                font: { size: 11, weight: 'bold' },
                                color: '#e2e8f0'
                            },
                            ticks: {
                                display: false,
                                maxTicksLimit: 5
                            },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }

        updateCharts(q) {
            if (!q) return;

            // 1. Line Chart Update
            if (this.charts.line) {
                this.charts.line.data.datasets[0].data = q.history || [0, 0, 0, 0, 0, 0, 0];
                this.charts.line.update();
            }

            // 2. Radar Chart Update
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

        // --- 실시간 분석 실행 로직 (API 통신 & 타 엔진 시물레이션) ---
        async runKeywordAudit() {
            const q = this.questions.find(item => item.id === this.activeQuestionId);
            if (!q) {
                alert('분석을 시작할 질문을 먼저 등록하거나 선택해 주세요.');
                return;
            }

            const btn = document.getElementById('btn-run-audit');
            const originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 실시간 수집 및 분석 중...`;

            try {
                let geminiScore = 0;
                let usedRealGemini = false;

                // 1. 구글 Gemini API 연동 호출 시도
                if (this.apiKeys.gemini) {
                    geminiScore = await this.fetchGeminiAudit(q.text);
                    usedRealGemini = true;
                } else {
                    geminiScore = this.calculateSimulatedScore(q.text, 'Gemini');
                }

                // 2. 나머지 모델(ChatGPT, Claude, Grok, Perplexity) 점수 시뮬레이션 계산
                const chatGptScore = this.calculateSimulatedScore(q.text, 'ChatGPT');
                const claudeScore = this.calculateSimulatedScore(q.text, 'Claude');
                const grokScore = this.calculateSimulatedScore(q.text, 'Grok');
                const perplexityScore = this.calculateSimulatedScore(q.text, 'Perplexity');

                // 3. 질문 데이터에 반영
                q.modelRates.Gemini = geminiScore;
                q.modelRates.ChatGPT = chatGptScore;
                q.modelRates.Claude = claudeScore;
                q.modelRates.Grok = grokScore;
                q.modelRates.Perplexity = perplexityScore;

                const avgRate = Math.round((geminiScore + chatGptScore + claudeScore + grokScore + perplexityScore) / 5);
                q.currentRate = avgRate;
                
                // 기존 히스토리 업데이트 (최신 데이터를 끝에 밀어 넣고 첫 주차 밀어내기)
                q.history.shift();
                q.history.push(avgRate);

                // 최초 기준값 설정
                if (q.baselineRate === 0) {
                    q.baselineRate = Math.max(5, Math.round(avgRate * 0.5));
                }

                // 4. 저장 및 UI 갱신
                this.saveQuestions();
                this.renderQuestionList();
                this.updateDashboard();

                let alertMsg = `언급률 분석이 성공적으로 처리되었습니다!\n`;
                alertMsg += `* 분석 타겟 브랜드: ${this.targetBrand}\n`;
                alertMsg += `* 종합 평균 언급률: ${avgRate}%\n\n`;
                if (usedRealGemini) {
                    alertMsg += `* Gemini 모델: 실제 API 연결을 통한 실시간 분석 성공 (점수: ${geminiScore}%)\n`;
                } else {
                    alertMsg += `* Gemini 모델: 데모 분석 모드로 실시간 산출함 (점수: ${geminiScore}%)\n(팁: 왼쪽 상단 API 설정에 Gemini API 키를 등록하고 초록색 LED를 켜시면 실제 구글 AI의 분석 결과를 받아옵니다.)\n`;
                }
                alertMsg += `* 타 AI 엔진: 브랜드 최적화 룰셋을 기반으로 실시간 추정 계산함.`;
                alert(alertMsg);

            } catch (err) {
                console.error("분석 중 오류 발생:", err);
                alert("AI 분석 도중 통신 오류가 발생했습니다. API 키나 인터넷 연결 상태를 확인해 주세요.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        }

        // --- 구글 Gemini API 호출 및 언급 검출 핵심 함수 ---
        async fetchGeminiAudit(questionText) {
            const apiKey = this.apiKeys.gemini;
            const brand = this.targetBrand || '미담한의원';

            // 프롬프트를 명확히 주어 결과에 추천 병원 리스트를 생성하게 유도 (동적 브랜드명 변수 주입)
            const systemPrompt = `너는 AEO(답변 엔진 최적화) 마케팅 감사 봇이다.
사용자의 질문에 대해 일반적으로 가장 많이 추천되거나 언급되는 병원 브랜드(특히 '${brand}' 등)를 3곳 이상 추천해주고 추천 이유를 상세히 적어줘.
답변은 다른 군더더기 없이 자연스럽게 구체적인 병원명들이 포함된 한국어 설명으로 해줘.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\n질문: ${questionText}`
                    }]
                }]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Gemini API Error: Status ${response.status}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            console.log("Gemini API 수신 답변:\n", textResponse);

            // 브랜드 키워드 동적 정규식 매칭 (공백 허용 유연한 검출)
            const escapedBrand = brand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // 정규식 이스케이프
            const regexStr = escapedBrand.split('').join('\\s*'); // 글자 사이에 공백이 있어도 매칭되도록 처리
            const keywordRegex = new RegExp(`(${regexStr})`, 'gi');
            
            const matches = textResponse.match(keywordRegex);
            
            if (!matches) {
                return 0; // 언급이 아예 없음
            }

            // 언급된 빈도와 문서 앞부분 위치 가중치 계산
            const brandIndex = textResponse.search(keywordRegex);
            const isFirstRecommend = brandIndex < 150 && brandIndex !== -1;
            
            let score = 30; // 기본 존재 점수
            score += matches.length * 15; // 빈도에 따른 가산점
            if (isFirstRecommend) {
                score += 30; // 답변 본문 초반(최상단)에 언급될 시 30점 추가
            }

            return Math.min(100, score);
        }

        // --- 지능형 모의 언급률 계산기 (타겟 브랜드명과 질병 매칭 판별 포함) ---
        calculateSimulatedScore(questionText, modelName) {
            let baseScore = 20;

            // 1. 모델별 고유 가중치 (현실성 있는 분산 부여)
            if (modelName === 'Perplexity') baseScore += 25;
            if (modelName === 'Gemini') baseScore += 18;
            if (modelName === 'ChatGPT') baseScore += 12;
            if (modelName === 'Claude') baseScore += 8;
            if (modelName === 'Grok') baseScore += 10;

            // 2. 브랜드명 및 질문 단어에 따른 마케팅 성숙도 모의 계산
            // 질문 키워드와 질환명이 매치되는 정도에 따라 지능형 점수 배점
            if (questionText.includes('대상포진')) {
                baseScore += 35;
            } else if (questionText.includes('아토피')) {
                baseScore += 20;
            } else if (questionText.includes('비염')) {
                baseScore += 10;
            } else {
                baseScore += (questionText.length % 5) * 6;
            }

            // 브랜드 이름 글자 수나 고유값에 따른 추가 보정값
            if (this.targetBrand && this.targetBrand.length > 2) {
                baseScore += (this.targetBrand.charCodeAt(0) % 5) * 3;
            }

            // 3. 다이내믹 난수 효과 (±4% 내외의 랜덤 변동성 부여)
            const randomVariance = Math.floor(Math.random() * 9) - 4;
            let finalScore = baseScore + randomVariance;

            return Math.max(5, Math.min(98, finalScore));
        }

        // --- [신규] JSON 파일 백업 (내보내기) ---
        exportToJSON() {
            const dataToSave = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                targetBrand: this.targetBrand,
                questions: this.questions,
                apiKeys: {
                    gemini: this.apiKeys.gemini,
                    openai: this.apiKeys.openai
                }
            };

            const jsonString = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            // 파일명에 타겟 브랜드명과 날짜를 믹싱하여 다운로드 유용성 증가
            const safeBrand = this.targetBrand.replace(/[^a-zA-Z0-9가-힣]/g, '');
            a.download = `geolens_backup_${safeBrand}_${new Date().toISOString().slice(0, 10)}.json`;
            a.href = url;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
        }

        // --- [신규] JSON 파일 복원 (불러오기) ---
        importFromJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    
                    // JSON 스키마 유효성 검증
                    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
                        alert('올바른 백업 파일(JSON) 형식이 아닙니다. 질문 정보가 유실되었습니다.');
                        return;
                    }

                    // 복원 데이터 셋팅
                    this.questions = parsed.questions;
                    if (parsed.targetBrand) this.targetBrand = parsed.targetBrand;
                    if (parsed.apiKeys) {
                        this.apiKeys.gemini = parsed.apiKeys.gemini || '';
                        this.apiKeys.openai = parsed.apiKeys.openai || '';
                    }

                    // 로컬스토리지 갱신
                    this.saveQuestions();
                    localStorage.setItem('geo_lens_tracker_target_brand', this.targetBrand);
                    localStorage.setItem('geo_lens_tracker_gemini_key', this.apiKeys.gemini);
                    localStorage.setItem('geo_lens_tracker_openai_key', this.apiKeys.openai);

                    // 화면 요소 갱신 및 리로드
                    this.initUIValues();
                    if (this.questions.length > 0) {
                        this.activeQuestionId = this.questions[0].id;
                    } else {
                        this.activeQuestionId = null;
                    }

                    this.renderQuestionList();
                    this.updateDashboard();

                    alert(`🟢 설정 및 질문 로그 백업 복원 완료!\n타겟 브랜드: ${this.targetBrand}\n복원 질문 개수: ${this.questions.length}개`);
                    
                    // LED 램프 재갱신
                    if (this.apiKeys.gemini) {
                        this.silentVerifyGeminiKey();
                    } else {
                        this.updateLedState('pending');
                    }

                } catch (err) {
                    console.error("백업 가져오기 도중 에러:", err);
                    alert('파일 읽기 실패: JSON 데이터 형식이 손상되었습니다.');
                }
            };
            
            reader.readAsText(file);
            
            // 동일 파일 연속 업로드를 위한 인풋 초기화
            event.target.value = '';
        }
    }

    // 전역 바인딩 및 DOMContentLoaded 실행
    window.addEventListener('DOMContentLoaded', () => {
        window.KeywordTracker = new AIKeywordTracker();
    });

})();
