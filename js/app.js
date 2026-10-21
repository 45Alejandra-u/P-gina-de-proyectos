/**
 * Main Application Controller for EnglishQuest 180
 */

class EnglishQuestApp {
  constructor() {
    this.currentView = 'roadmap';
    this.selectedMonth = 1;
    this.activeLesson = null;
    this.lessonStep = 0; // 0: Theory, 1: Vocab, 2: SentenceBuilder, 3: Quiz, 4: Speaking, 5: Victory
    this.builtWords = [];
    this.availableWords = [];
    this.quizSelected = null;
    this.speakingResult = null;
    this.sentenceCheckState = null;
    this.selectedArenaCategory = 'twisters';

    this.initElements();
    this.bindEvents();
    this.updateHeaderStats();
    this.renderCurrentView();
  }

  initElements() {
    this.elements = {
      userLevel: document.getElementById('user-level'),
      userRank: document.getElementById('user-rank'),
      userAvatar: document.getElementById('user-avatar'),
      userStreak: document.getElementById('user-streak'),
      userGems: document.getElementById('user-gems'),
      userXpBar: document.getElementById('user-xp-bar'),
      userXpText: document.getElementById('user-xp-text'),
      viewContainer: document.getElementById('view-container'),
      navButtons: document.querySelectorAll('.nav-btn'),
      audioToggle: document.getElementById('audio-toggle')
    };
  }

  bindEvents() {
    // Navigation
    this.elements.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Sound toggle
    if (this.elements.audioToggle) {
      this.elements.audioToggle.addEventListener('click', () => {
        window.soundFX.enabled = !window.soundFX.enabled;
        this.elements.audioToggle.innerHTML = window.soundFX.enabled ? '🔊' : '🔇';
        this.elements.audioToggle.title = window.soundFX.enabled ? 'Sonido activado' : 'Sonido silenciado';
        window.soundFX.playClick();
      });
    }
  }

  updateHeaderStats() {
    const state = window.gamification.state;
    const level = window.gamification.getLevel();
    const rank = window.gamification.getRankTitle(level);
    const xpInfo = window.gamification.getXPProgress();
    const currentAvatarObj = AVATARS.find(a => a.id === state.activeAvatar) || AVATARS[0];

    if (this.elements.userLevel) this.elements.userLevel.textContent = `Nivel ${level}`;
    if (this.elements.userRank) this.elements.userRank.textContent = rank;
    if (this.elements.userAvatar) this.elements.userAvatar.textContent = currentAvatarObj.icon;
    if (this.elements.userStreak) this.elements.userStreak.textContent = `${state.streak} ${state.streak === 1 ? 'día' : 'días'}`;
    if (this.elements.userGems) this.elements.userGems.textContent = state.gems;
    if (this.elements.userXpBar) this.elements.userXpBar.style.width = `${xpInfo.percent}%`;
    if (this.elements.userXpText) this.elements.userXpText.textContent = `${xpInfo.xpIntoLevel} / ${xpInfo.needed} XP`;
  }

  switchView(viewName) {
    window.soundFX.playClick();
    this.currentView = viewName;

    this.elements.navButtons.forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
        btn.classList.remove('text-slate-400', 'hover:bg-slate-800');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
        btn.classList.add('text-slate-400', 'hover:bg-slate-800');
      }
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    window.pronunciationEvaluator.stopListening();
    window.speechEngine.stop();

    switch (this.currentView) {
      case 'roadmap':
        this.renderRoadmap();
        break;
      case 'lesson':
        this.renderLesson();
        break;
      case 'arena':
        this.renderVoiceArena();
        break;
      case 'shop':
        this.renderShop();
        break;
      case 'profile':
        this.renderProfile();
        break;
      default:
        this.renderRoadmap();
    }
  }

  /* ============================================================
     1. ROADMAP VIEW (6-MONTH JOURNEY)
     ============================================================ */
  renderRoadmap() {
    const currentMonthData = window.curriculum.MONTH_THEMES.find(m => m.month === this.selectedMonth) || window.curriculum.MONTH_THEMES[0];
    const completedDays = window.gamification.state.completedLessons;
    const completedCount = Object.keys(completedDays).length;

    let html = `
      <div class="max-w-5xl mx-auto space-y-8 animate-fadeIn">
        <!-- Month Tabs -->
        <div class="flex items-center justify-between flex-wrap gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
          ${window.curriculum.MONTH_THEMES.map(m => `
            <button class="month-tab px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              m.month === this.selectedMonth 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }" data-month="${m.month}">
              <span>${m.month === 6 ? '👑' : '🏰'} Mes ${m.month}</span>
            </button>
          `).join('')}
        </div>

        <!-- Month Banner -->
        <div class="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ${currentMonthData.level}
                </span>
                <span class="text-xs text-slate-400 font-medium">Días ${currentMonthData.daysRange[0]} a ${currentMonthData.daysRange[1]}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">${currentMonthData.title}</h2>
              <p class="text-slate-300 text-sm md:text-base leading-relaxed">${currentMonthData.description}</p>
            </div>
            <div class="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm self-start md:self-auto">
              <div class="text-3xl">⚔️</div>
              <div>
                <div class="text-xs text-indigo-400 font-semibold uppercase">Boss del Mes (Día ${currentMonthData.bossDay})</div>
                <div class="text-sm font-bold text-white">${currentMonthData.bossTitle}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day Nodes Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🗺️ Misiones Diarias</span>
              <span class="text-xs font-normal text-slate-400">(${completedCount} de 180 días completados)</span>
            </h3>
            <span class="text-xs text-slate-400">Haz clic en cualquier día para comenzar</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            ${Array.from({ length: 30 }, (_, i) => {
              const dayNum = (this.selectedMonth - 1) * 30 + (i + 1);
              const isBoss = dayNum % 30 === 0;
              const isCompleted = !!completedDays[dayNum];
              const stars = isCompleted ? (completedDays[dayNum].stars || 3) : 0;
              const isToday = dayNum === (completedCount + 1);

              return `
                <button class="day-node relative group p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${
                  isCompleted 
                    ? 'bg-slate-900/90 border border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                    : isToday 
                    ? 'bg-gradient-to-b from-indigo-900/80 to-slate-900 border-2 border-indigo-400 shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/20 animate-pulse'
                    : isBoss 
                    ? 'bg-amber-950/40 border border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/50 border border-slate-800/80 hover:border-slate-700'
                }" data-day="${dayNum}">
                  ${isBoss ? `
                    <span class="absolute -top-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-md">BOSS</span>
                  ` : ''}

                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : isToday 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50' 
                      : isBoss 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-slate-800/80 text-slate-400'
                  }">
                    ${isCompleted ? '✓' : isBoss ? '👑' : dayNum}
                  </div>

                  <div class="text-center">
                    <span class="block text-xs font-bold ${isToday ? 'text-indigo-300' : 'text-slate-300'}">Día ${dayNum}</span>
                    <div class="flex items-center justify-center gap-0.5 text-xs mt-1">
                      ${isCompleted ? '⭐'.repeat(stars) : '<span class="text-[10px] text-slate-500 font-medium">Por jugar</span>'}
                    </div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.elements.viewContainer.innerHTML = html;

    // Attach Month selector clicks
    this.elements.viewContainer.querySelectorAll('.month-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        window.soundFX.playClick();
        this.selectedMonth = parseInt(tab.dataset.month, 10);
        this.renderRoadmap();
      });
    });

    // Attach Day clicks
    this.elements.viewContainer.querySelectorAll('.day-node').forEach(node => {
      node.addEventListener('click', () => {
        const day = parseInt(node.dataset.day, 10);
        this.startLesson(day);
      });
    });
  }

  /* ============================================================
     2. DAILY LESSON CONTROLLER & VIEWS
     ============================================================ */
  startLesson(dayNumber) {
    window.soundFX.playClick();
    this.activeLesson = window.curriculum.getLessonForDay(dayNumber);
    this.lessonStep = 0; // Start at theory
    this.builtWords = [];
    this.availableWords = [...this.activeLesson.sentenceBuilder.words].sort(() => Math.random() - 0.5);
    this.quizSelected = null;
    this.speakingResult = null;
    this.sentenceCheckState = null;
    this.currentView = 'lesson';
    this.renderLesson();
  }

  renderLesson() {
    if (!this.activeLesson) {
      this.switchView('roadmap');
      return;
    }

    const steps = [
      { name: "Píldora Teórica", icon: "💡" },
      { name: "Vocabulario", icon: "📚" },
      { name: "Construye Oración", icon: "🧩" },
      { name: "Quiz de Comprensión", icon: "🎯" },
      { name: "Reto de Voz 🎙️", icon: "🎤" }
    ];

    let contentHtml = '';

    switch (this.lessonStep) {
      case 0:
        contentHtml = this.renderLessonTheory();
        break;
      case 1:
        contentHtml = this.renderLessonVocab();
        break;
      case 2:
        contentHtml = this.renderLessonSentenceBuilder();
        break;
      case 3:
        contentHtml = this.renderLessonQuiz();
        break;
      case 4:
        contentHtml = this.renderLessonSpeaking();
        break;
      case 5:
        contentHtml = this.renderLessonVictory();
        break;
    }

    const html = `
      <div class="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
        <!-- Top Lesson Bar -->
        <div class="flex items-center justify-between gap-4">
          <button id="btn-exit-lesson" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all">
            <span>← Salir al Mapa</span>
          </button>
          
          <!-- Step Indicators -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            ${steps.map((st, idx) => `
              <div class="h-2 w-7 sm:w-12 rounded-full transition-all duration-300 ${
                idx === this.lessonStep 
                  ? 'bg-indigo-500 ring-2 ring-indigo-400/40 shadow-md shadow-indigo-500/50' 
                  : idx < this.lessonStep 
                  ? 'bg-emerald-500' 
                  : 'bg-slate-800'
              }"></div>
            `).join('')}
          </div>

          <div class="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Día ${this.activeLesson.day}
          </div>
        </div>

        <!-- Main Card Content -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          ${contentHtml}
        </div>
      </div>
    `;

    this.elements.viewContainer.innerHTML = html;

    // Bind common exit
    const exitBtn = document.getElementById('btn-exit-lesson');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.switchView('roadmap');
      });
    }

    // Attach step-specific listeners
    this.bindLessonStepEvents();
  }

  // Step 0: Theory & Pro Tips
  renderLessonTheory() {
    return `
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>Paso 1 de 5</span> • <span>Fundamento del Día</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${this.activeLesson.title}</h2>
        </div>

        <div class="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
          <div class="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <span>💡 Tip Fonético Pro</span>
          </div>
          <p class="text-slate-200 text-sm sm:text-base leading-relaxed">${this.activeLesson.proTip}</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div class="flex items-center gap-2 text-slate-300 font-bold text-sm">
            <span>📝 Estructura y Uso</span>
          </div>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">${this.activeLesson.grammarNote}</p>
        </div>

        <div class="pt-4 flex justify-end">
          <button id="btn-next-step" class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
            <span>Comenzar Vocabulario</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;
  }

  // Step 1: Flashcards Vocab
  renderLessonVocab() {
    return `
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>Paso 2 de 5</span> • <span>Vocabulario Clave</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Escucha y Aprende</h2>
          <p class="text-slate-400 text-sm">Haz clic en los altavoces para escuchar la pronunciación nativa y el ritmo.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${this.activeLesson.vocab.map((v, i) => `
            <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="text-lg font-bold text-white tracking-wide">${v.word}</h4>
                  <span class="text-xs text-indigo-400 font-mono">${v.ipa}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button class="btn-tts-slow p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-all" data-text="${v.word}" title="Escuchar lento (0.6x)">
                    🐢
                  </button>
                  <button class="btn-tts-fast p-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs transition-all" data-text="${v.word}" title="Escuchar velocidad normal">
                    🔊
                  </button>
                </div>
              </div>
              <div class="text-xs font-semibold text-emerald-400">${v.meaning}</div>
              <div class="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                "${v.sample}"
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-4 flex justify-between items-center">
          <button id="btn-prev-step" class="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 text-sm">
            ← Anterior
          </button>
          <button id="btn-next-step" class="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2">
            <span>Siguiente: Ordenar Frase</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;
  }

  // Step 2: Sentence Builder with Real-time Error Correction
  renderLessonSentenceBuilder() {
    const sb = this.activeLesson.sentenceBuilder;
    const target = sb.correct;
    const targetWords = target.split(/\s+/);
    const formed = this.builtWords.join(' ');
    const isChecked = this.sentenceCheckState !== null;
    const isCorrect = this.sentenceCheckState?.status === 'correct';
    const isIncorrect = this.sentenceCheckState?.status === 'incorrect';

    return `
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>Paso 3 de 5</span> • <span>Constructor de Oraciones</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Ordena la Oración</h2>
          <p class="text-slate-300 text-sm sm:text-base">${sb.prompt}</p>
        </div>

        <!-- Target Slot Area -->
        <div class="min-h-[76px] p-4 rounded-2xl bg-slate-950/80 border-2 ${
          isCorrect 
            ? 'border-emerald-500 bg-emerald-950/20' 
            : isIncorrect 
            ? 'border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-950/40' 
            : 'border-indigo-500/30'
        } flex flex-wrap items-center gap-2.5 transition-all">
          ${this.builtWords.length === 0 ? `
            <span class="text-slate-500 text-sm italic select-none">Haz clic en las palabras de abajo para formar la frase...</span>
          ` : this.builtWords.map((w, idx) => {
            let badgeClass = 'bg-indigo-600 hover:bg-indigo-500 text-white';
            let statusIcon = '✕';
            let statusClass = 'text-indigo-300';

            if (isIncorrect) {
              const matchesPos = w.toLowerCase() === (targetWords[idx] || '').toLowerCase();
              if (matchesPos) {
                badgeClass = 'bg-emerald-600/30 border-2 border-emerald-500 text-emerald-200';
                statusIcon = '✓';
                statusClass = 'text-emerald-400';
              } else {
                badgeClass = 'bg-rose-600/30 border-2 border-rose-500 text-rose-200 animate-pulse';
                statusIcon = '⚠️';
                statusClass = 'text-rose-400';
              }
            } else if (isCorrect) {
              badgeClass = 'bg-emerald-600 text-white border-2 border-emerald-400';
              statusIcon = '✓';
              statusClass = 'text-emerald-200';
            }

            return `
              <button class="btn-remove-word px-3.5 py-2 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-1.5 animate-fadeIn ${badgeClass}" data-index="${idx}" ${isCorrect ? 'disabled' : ''} title="Haz clic para quitar">
                <span>${w}</span>
                <span class="text-xs font-black ${statusClass}">${statusIcon}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Available Words Pool -->
        <div class="space-y-2">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Palabras disponibles:</span>
          <div class="flex flex-wrap gap-2.5 min-h-[44px]">
            ${this.availableWords.length === 0 ? `
              <span class="text-xs text-slate-500 italic py-2">Todas las palabras están colocadas arriba.</span>
            ` : this.availableWords.map((w, idx) => `
              <button class="btn-add-word px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700/80 hover:border-indigo-400 transition-all transform active:scale-95 shadow-sm" data-index="${idx}" data-word="${w}">
                ${w}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Error Correction or Success Box -->
        ${isIncorrect ? `
          <div class="p-5 sm:p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-500/60 shadow-xl space-y-4 animate-fadeIn">
            <div class="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div class="flex items-center gap-2 text-rose-400 font-black text-sm uppercase tracking-wider">
                  <span>❌ Orden Incorrecto</span>
                </div>
                <div class="text-xs text-slate-300 mt-1">
                  Tu intento: <span class="font-bold text-rose-300 line-through">"${formed}"</span>
                </div>
              </div>
              <button id="btn-listen-correct-sentence" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all">
                <span>🔊 Escuchar Solución</span>
              </button>
            </div>

            <!-- Solución correcta destacada -->
            <div class="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-1">
              <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">Solución Correcta:</span>
              <div class="text-base sm:text-lg font-black text-white tracking-wide">
                "${target}"
              </div>
            </div>

            <!-- Explicación pedagógica -->
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
              <div class="font-bold text-amber-300 flex items-center gap-1.5">
                <span>💡 ¿Por qué es este el orden? (Regla de corrección):</span>
              </div>
              <p class="leading-relaxed text-slate-300">
                ${sb.explanation || "En inglés, el orden de las palabras sigue estructuras fijas. Revisa la posición de los pronombres, auxiliares y verbos."}
              </p>
            </div>

            <!-- Botones interactivos de corrección -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div class="flex flex-wrap items-center gap-2">
                <button id="btn-auto-fix-sentence" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5">
                  <span>🛠️ Corregir Automáticamente</span>
                </button>
                <button id="btn-retry-sentence" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5">
                  <span>🔄 Reintentar por mi cuenta</span>
                </button>
              </div>
              <button id="btn-continue-after-error" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5">
                <span>Continuar al Quiz →</span>
              </button>
            </div>
          </div>
        ` : isCorrect ? `
          <div class="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-xl space-y-3 animate-fadeIn">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2 text-emerald-300 font-extrabold text-base">
                <span>🎉 ¡Excelente! Orden completamente correcto</span>
              </div>
              <button id="btn-listen-correct-sentence" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span>🔊 Escuchar</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-slate-300">
              ${sb.explanation || "¡Has aplicado la estructura de forma perfecta!"}
            </p>
          </div>
        ` : ''}

        <div class="pt-4 flex justify-between items-center">
          <button id="btn-prev-step" class="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 text-sm">
            ← Anterior
          </button>
          
          ${isCorrect ? `
            <button id="btn-next-step" class="px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 animate-fadeIn">
              <span>Siguiente: Quiz de Comprensión</span>
              <span>→</span>
            </button>
          ` : isIncorrect ? `
            <button id="btn-next-step" class="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2">
              <span>Siguiente: Quiz</span>
              <span>→</span>
            </button>
          ` : `
            <button id="btn-check-sentence" class="px-8 py-3.5 rounded-xl font-bold text-white ${
              this.builtWords.length > 0 ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            } transition-all flex items-center gap-2">
              <span>Comprobar</span>
              <span>✓</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  // Step 3: Quiz with Explanations and Retry
  renderLessonQuiz() {
    const q = this.activeLesson.quiz;
    const answered = this.quizSelected !== null;
    const isCorrect = this.quizSelected === q.correctIndex;

    return `
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>Paso 4 de 5</span> • <span>Quiz de Comprensión</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white">${q.question}</h2>
        </div>

        <div class="space-y-3">
          ${q.options.map((opt, idx) => {
            let btnClass = 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 text-slate-200';
            let icon = `<span class="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">${String.fromCharCode(65 + idx)}</span>`;

            if (answered) {
              if (idx === q.correctIndex) {
                btnClass = 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-200 font-bold';
                icon = `<span class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>`;
              } else if (idx === this.quizSelected) {
                btnClass = 'bg-rose-950/50 border-2 border-rose-500 text-rose-200 font-bold';
                icon = `<span class="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs">✕</span>`;
              }
            }

            return `
              <button class="quiz-option w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${btnClass}" data-index="${idx}" ${answered ? 'disabled' : ''}>
                ${icon}
                <span class="text-sm sm:text-base">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${answered ? `
          <div class="p-5 rounded-2xl ${isCorrect ? 'bg-emerald-950/40 border-2 border-emerald-500/50' : 'bg-rose-950/40 border-2 border-rose-500/50'} animate-fadeIn space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="font-extrabold text-sm sm:text-base flex items-center gap-2 ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}">
                <span>${isCorrect ? '🎉 ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}</span>
              </div>
              <button id="btn-listen-correct-quiz" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5" data-text="${q.options[q.correctIndex]}">
                <span>🔊 Escuchar Correcta</span>
              </button>
            </div>

            ${!isCorrect ? `
              <div class="text-xs text-slate-300">
                Tu elección fue: <span class="font-bold text-rose-300 line-through">"${q.options[this.quizSelected]}"</span>. La opción correcta es: <span class="font-bold text-emerald-300">"${q.options[q.correctIndex]}"</span>.
              </div>
            ` : ''}

            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
              <div class="font-bold text-amber-300">💡 Explicación pedagógica:</div>
              <p class="leading-relaxed">${q.explanation}</p>
            </div>

            ${!isCorrect ? `
              <div class="pt-1 flex items-center gap-2">
                <button id="btn-retry-quiz" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5">
                  <span>🔄 Reintentar Pregunta</span>
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="pt-4 flex justify-between items-center">
          <button id="btn-prev-step" class="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 text-sm">
            ← Anterior
          </button>
          ${answered ? `
            <button id="btn-next-step" class="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2">
              <span>Siguiente: Reto de Voz 🎙️</span>
              <span>→</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Step 4: Speaking Challenge with Word-by-Word Correction
  renderLessonSpeaking() {
    const sc = this.activeLesson.speakingChallenge;
    const isListening = window.pronunciationEvaluator.isListening;
    const res = this.speakingResult;

    return `
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span>Paso 5 de 5</span> • <span>Reto de Pronunciación en Vivo 🎙️</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Habla en Voz Alta</h2>
          <p class="text-slate-400 text-sm">Escucha la referencia y presiona el micrófono para evaluar tu pronunciación y entonación.</p>
        </div>

        <!-- Target Phrase Banner -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 space-y-3 text-center">
          <div class="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
            "${sc.target}"
          </div>
          <div class="text-xs sm:text-sm text-indigo-300 font-medium">
            ${sc.translation}
          </div>
          <div class="text-xs text-amber-300/90 font-mono">
            💡 ${sc.phoneticHint}
          </div>

          <!-- Listen Buttons -->
          <div class="flex items-center justify-center gap-3 pt-2">
            <button id="btn-listen-target-slow" class="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all">
              <span>🐢 Escuchar Lento</span>
            </button>
            <button id="btn-listen-target-fast" class="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold flex items-center gap-2 border border-indigo-500/40 transition-all">
              <span>🔊 Escuchar Nativo</span>
            </button>
          </div>
        </div>

        <!-- Mic Trigger & Audio Visualizer -->
        <div class="flex flex-col items-center justify-center py-4 space-y-4">
          <button id="btn-mic-toggle" class="relative group p-6 rounded-full transition-all duration-300 transform active:scale-95 ${
            isListening 
              ? 'bg-rose-600 text-white shadow-2xl shadow-rose-600/60 animate-pulse ring-8 ring-rose-500/30' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/40 hover:scale-105'
          }">
            <span class="text-4xl block">${isListening ? '⏹️' : '🎙️'}</span>
          </button>
          <div class="text-xs font-semibold text-slate-400">
            ${isListening ? '🔴 Escuchando... ¡Habla ahora!' : 'Toca el micrófono para comenzar a hablar'}
          </div>
        </div>

        <!-- Results Display with Detailed Correction -->
        ${res ? `
          <div class="p-6 rounded-2xl ${res.passed ? 'bg-emerald-950/40 border-2 border-emerald-500/50' : 'bg-rose-950/40 border-2 border-rose-500/50'} space-y-4 animate-fadeIn">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${res.passed ? '🎉' : '⚠️'}</span>
                <div>
                  <div class="font-extrabold text-base ${res.passed ? 'text-emerald-300' : 'text-rose-300'}">
                    Precisión: ${res.score}%
                  </div>
                  <div class="text-xs text-slate-400">${'⭐'.repeat(res.stars)}${'☆'.repeat(3 - res.stars)}</div>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${res.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}">
                ${res.passed ? '¡Aprobado!' : 'Requiere Práctica'}
              </span>
            </div>

            <!-- Word-by-word diff with individual listen buttons for errors -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Desglose fonético de palabras:</span>
                <span class="text-[11px] text-slate-500">Toca 🔊 en palabras en rojo para escuchar la pronunciación exacta</span>
              </div>
              <div class="flex flex-wrap gap-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                ${res.wordAnalysis.map(w => `
                  <div class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    w.status === 'correct' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : w.status === 'partial' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }">
                    <span>${w.word}</span>
                    ${w.status !== 'correct' ? `
                      <button class="btn-listen-word text-[11px] hover:scale-125 transition-transform" data-word="${w.word}" title="Escuchar pronunciación correcta de '${w.word}'">
                        🔊
                      </button>
                    ` : `
                      <span class="text-[10px] text-emerald-400">✓</span>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
              ${res.feedback}
            </div>

            <!-- Acciones de corrección fonética -->
            ${!res.passed ? `
              <div class="pt-1 flex flex-wrap items-center gap-2.5">
                <button id="btn-listen-target-slow-correction" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5">
                  <span>🐢 Escuchar frase completa despacio</span>
                </button>
                <button id="btn-retry-speaking" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
                  <span>🎙️ Volver a Intentar</span>
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="pt-4 flex justify-between items-center">
          <button id="btn-prev-step" class="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 text-sm">
            ← Anterior
          </button>
          ${res && res.passed ? `
            <button id="btn-complete-day" class="px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2">
              <span>Finalizar Día ${this.activeLesson.day}</span>
              <span>🏆</span>
            </button>
          ` : res && !res.passed ? `
            <button id="btn-skip-retry" class="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white bg-slate-800 text-xs">
              Continuar de todas formas →
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Step 5: Victory Screen
  renderLessonVictory() {
    return `
      <div class="text-center py-8 space-y-6 animate-fadeIn">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 animate-bounce">
          🏆
        </div>

        <div class="space-y-2">
          <h2 class="text-3xl font-black text-white">¡Día ${this.activeLesson.day} Conquistado!</h2>
          <p class="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
            ¡Excelente trabajo! Has completado la lección de hoy y tu cerebro está un paso más cerca de la fluidez bilingüe.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div class="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div class="text-2xl font-black text-indigo-400">+${this.lastRewards ? this.lastRewards.xpEarned : 50}</div>
            <div class="text-xs text-slate-400 font-bold uppercase">XP Ganado</div>
          </div>
          <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
            <div class="text-2xl font-black text-amber-400">+${this.lastRewards ? this.lastRewards.gemsEarned : 20} 💎</div>
            <div class="text-xs text-slate-400 font-bold uppercase">LinguaGems</div>
          </div>
          <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30">
            <div class="text-2xl font-black text-rose-400">${window.gamification.state.streak} 🔥</div>
            <div class="text-xs text-slate-400 font-bold uppercase">Racha de Días</div>
          </div>
        </div>

        <div class="pt-6 flex justify-center gap-4">
          <button id="btn-back-to-roadmap" class="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/40 transition-all flex items-center gap-2">
            <span>Volver al Mapa de Misiones</span>
            <span>🗺️</span>
          </button>
        </div>
      </div>
    `;
  }

  bindLessonStepEvents() {
    // Next / Prev step buttons
    const nextBtn = document.getElementById('btn-next-step');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.lessonStep++;
        this.renderLesson();
      });
    }

    const prevBtn = document.getElementById('btn-prev-step');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.lessonStep = Math.max(0, this.lessonStep - 1);
        this.renderLesson();
      });
    }

    // TTS buttons in Vocab
    document.querySelectorAll('.btn-tts-slow').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundFX.playClick();
        window.speechEngine.speak(btn.dataset.text, true);
      });
    });

    document.querySelectorAll('.btn-tts-fast').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundFX.playClick();
        window.speechEngine.speak(btn.dataset.text, false);
      });
    });

    // Sentence builder buttons
    document.querySelectorAll('.btn-add-word').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.playClick();
        const word = btn.dataset.word;
        const idx = parseInt(btn.dataset.index, 10);
        this.builtWords.push(word);
        this.availableWords.splice(idx, 1);
        this.sentenceCheckState = null; // Reset error state on edit
        this.renderLesson();
      });
    });

    document.querySelectorAll('.btn-remove-word').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.playClick();
        const idx = parseInt(btn.dataset.index, 10);
        const removed = this.builtWords.splice(idx, 1)[0];
        this.availableWords.push(removed);
        this.sentenceCheckState = null; // Reset error state on edit
        this.renderLesson();
      });
    });

    // Check sentence button
    const checkSentenceBtn = document.getElementById('btn-check-sentence');
    if (checkSentenceBtn) {
      checkSentenceBtn.addEventListener('click', () => {
        const formed = this.builtWords.join(' ').trim();
        const target = this.activeLesson.sentenceBuilder.correct.trim();
        if (formed.toLowerCase() === target.toLowerCase()) {
          window.soundFX.playSuccess();
          this.sentenceCheckState = { status: 'correct', formed, target };
          window.gamification.showToast('🎉 ¡Oración perfecta!');
          this.renderLesson();
        } else {
          window.soundFX.playError();
          this.sentenceCheckState = { status: 'incorrect', formed, target };
          window.gamification.showToast('❌ El orden no es el correcto. ¡Revisa la corrección abajo!');
          this.renderLesson();
        }
      });
    }

    // Auto-fix sentence button (Corrector automático)
    const autoFixBtn = document.getElementById('btn-auto-fix-sentence');
    if (autoFixBtn) {
      autoFixBtn.addEventListener('click', () => {
        const target = this.activeLesson.sentenceBuilder.correct.trim();
        this.builtWords = target.split(/\s+/);
        this.availableWords = [];
        this.sentenceCheckState = { status: 'correct', formed: target, target };
        window.soundFX.playSuccess();
        window.speechEngine.speak(target, false);
        window.gamification.showToast('🛠️ ¡Oración corregida automáticamente!');
        this.renderLesson();
      });
    }

    // Retry sentence manually (Reintentar por mi cuenta)
    const retrySentenceBtn = document.getElementById('btn-retry-sentence');
    if (retrySentenceBtn) {
      retrySentenceBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.availableWords = [...this.activeLesson.sentenceBuilder.words].sort(() => Math.random() - 0.5);
        this.builtWords = [];
        this.sentenceCheckState = null;
        this.renderLesson();
      });
    }

    // Continue after seeing error in sentence builder
    const continueAfterErrorBtn = document.getElementById('btn-continue-after-error');
    if (continueAfterErrorBtn) {
      continueAfterErrorBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.lessonStep++;
        this.renderLesson();
      });
    }

    // Listen to correct sentence
    const listenCorrectSentenceBtn = document.getElementById('btn-listen-correct-sentence');
    if (listenCorrectSentenceBtn) {
      listenCorrectSentenceBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(this.activeLesson.sentenceBuilder.correct, false);
      });
    }

    // Quiz options
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        this.quizSelected = idx;
        const q = this.activeLesson.quiz;
        if (idx === q.correctIndex) {
          window.soundFX.playSuccess();
        } else {
          window.soundFX.playError();
        }
        this.renderLesson();
      });
    });

    // Retry quiz button
    const retryQuizBtn = document.getElementById('btn-retry-quiz');
    if (retryQuizBtn) {
      retryQuizBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.quizSelected = null;
        this.renderLesson();
      });
    }

    // Listen to correct quiz answer
    const listenCorrectQuizBtn = document.getElementById('btn-listen-correct-quiz');
    if (listenCorrectQuizBtn) {
      listenCorrectQuizBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(listenCorrectQuizBtn.dataset.text, false);
      });
    }

    // Speaking challenge target listen
    const listenTargetSlow = document.getElementById('btn-listen-target-slow');
    if (listenTargetSlow) {
      listenTargetSlow.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(this.activeLesson.speakingChallenge.target, true);
      });
    }

    const listenTargetFast = document.getElementById('btn-listen-target-fast');
    if (listenTargetFast) {
      listenTargetFast.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(this.activeLesson.speakingChallenge.target, false);
      });
    }

    // Individual word audio listen in speaking results
    document.querySelectorAll('.btn-listen-word').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.dataset.word;
        window.soundFX.playClick();
        window.speechEngine.speak(word, false);
      });
    });

    // Slow correction listen in speaking
    const listenSlowCorr = document.getElementById('btn-listen-target-slow-correction');
    if (listenSlowCorr) {
      listenSlowCorr.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(this.activeLesson.speakingChallenge.target, true);
      });
    }

    // Retry speaking challenge
    const retrySpeakingBtn = document.getElementById('btn-retry-speaking');
    if (retrySpeakingBtn) {
      retrySpeakingBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.speakingResult = null;
        this.renderLesson();
      });
    }

    // Mic button
    const micBtn = document.getElementById('btn-mic-toggle');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (window.pronunciationEvaluator.isListening) {
          window.pronunciationEvaluator.stopListening();
          this.renderLesson();
        } else {
          window.pronunciationEvaluator.startListening({
            targetPhrase: this.activeLesson.speakingChallenge.target,
            onStart: () => {
              this.renderLesson();
            },
            onResult: (evalResult) => {
              this.speakingResult = evalResult;
              if (evalResult.passed) {
                window.soundFX.playSuccess();
                window.gamification.recordPronunciationResult(evalResult.score);
              } else {
                window.soundFX.playError();
              }
              this.renderLesson();
            },
            onError: (errMessage) => {
              window.gamification.showToast(errMessage);
              this.renderLesson();
            },
            onEnd: () => {
              this.renderLesson();
            }
          });
        }
      });
    }

    // Complete Day button
    const completeDayBtn = document.getElementById('btn-complete-day');
    if (completeDayBtn) {
      completeDayBtn.addEventListener('click', () => {
        window.soundFX.playVictory();
        window.gamification.triggerConfetti();
        const score = this.speakingResult ? this.speakingResult.score : 85;
        const stars = this.speakingResult ? this.speakingResult.stars : 3;
        this.lastRewards = window.gamification.completeLesson(this.activeLesson.day, score, stars);
        this.updateHeaderStats();
        this.lessonStep = 5; // Victory screen
        this.renderLesson();
      });
    }

    const skipRetryBtn = document.getElementById('btn-skip-retry');
    if (skipRetryBtn) {
      skipRetryBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.lastRewards = window.gamification.completeLesson(this.activeLesson.day, 60, 1);
        this.updateHeaderStats();
        this.lessonStep = 5;
        this.renderLesson();
      });
    }

    // Back to roadmap from victory
    const backRoadmapBtn = document.getElementById('btn-back-to-roadmap');
    if (backRoadmapBtn) {
      backRoadmapBtn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.switchView('roadmap');
      });
    }
  }

  /* ============================================================
     3. VOICE ARENA (DOJO DE PRONUNCIACIÓN LIBRE)
     ============================================================ */
  renderVoiceArena() {
    const ARENA_CHALLENGES = {
      twisters: [
        { text: "She sells seashells by the seashore.", hint: "Contrasta el sonido /ʃ/ (sh) con /s/ siseante." },
        { text: "Peter Piper picked a peck of pickled peppers.", hint: "Explosión limpia de la 'P' sin agregar vocales." },
        { text: "I thought a thought, but the thought I thought wasn't the thought I thought I thought.", hint: "La combinación 'TH' sorda /θ/ en acción." },
        { text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", hint: "Sonido /w/ labial y /tʃ/ (ch)." }
      ],
      sounds: [
        { text: "Think through three thousand thick thoughts.", hint: "Práctica intensiva del fonema /θ/ (lengua entre los dientes)." },
        { text: "The sheep was on the big ship in the deep sea.", hint: "Diferenciación entre /iː/ largo (sheep) y /ɪ/ corto (ship)." },
        { text: "Victor visited various vintage villages very vigorously.", hint: "Vibración de la 'V' con labio y dientes superiores." },
        { text: "Yesterday he walked, stopped, looked, and laughed.", hint: "Terminaciones de pasado en sonido /t/ seco." }
      ],
      business: [
        { text: "Let's schedule a follow-up meeting to discuss the budget.", hint: "Entonación corporativa fluida y ritmo ágil." },
        { text: "Could you please elaborate on the key deliverables?", hint: "Pregunta cortés con énfasis en 'key deliverables'." },
        { text: "We need to optimize our workflow to meet the tight deadline.", hint: "Conexión de palabras en 'to meet the tight deadline'." }
      ],
      travel: [
        { text: "Excuse me, could you point me towards the baggage claim?", hint: "Frase de aeropuerto para no perderte." },
        { text: "I would like to check in for my international flight, please.", hint: "Cortesía estándar al llegar al mostrador." },
        { text: "Is there any good vegetarian restaurant within walking distance?", hint: "Pregunta típica de viaje en hoteles o taxis." }
      ]
    };

    const currentList = ARENA_CHALLENGES[this.selectedArenaCategory] || ARENA_CHALLENGES.twisters;

    const html = `
      <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
        <!-- Banner -->
        <div class="rounded-3xl p-8 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                🎙️ Dojo de Pronunciación Libre
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white">Entrena tu Oído y Músculos Bucales</h2>
              <p class="text-slate-300 text-sm max-w-xl">
                Practica retos fonéticos específicos, gana estrellas y domina los sonidos que más cuestan a los hispanohablantes.
              </p>
            </div>
            <div class="text-5xl">🥋</div>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          ${[
            { id: 'twisters', name: 'Trabalenguas 🌪️' },
            { id: 'sounds', name: 'Sonidos Difíciles 🎯' },
            { id: 'business', name: 'Negocios & Trabajo 💼' },
            { id: 'travel', name: 'Viajes & Supervivencia ✈️' }
          ].map(c => `
            <button class="arena-cat-btn px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              this.selectedArenaCategory === c.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }" data-cat="${c.id}">
              ${c.name}
            </button>
          `).join('')}
        </div>

        <!-- Challenge Cards -->
        <div class="space-y-4">
          ${currentList.map((ch, idx) => `
            <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="space-y-1 max-w-2xl">
                  <div class="text-lg font-bold text-white tracking-wide">"${ch.text}"</div>
                  <div class="text-xs text-purple-400 font-mono">💡 ${ch.hint}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="btn-arena-listen p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all" data-text="${ch.text}" title="Escuchar audio">
                    🔊 Escuchar
                  </button>
                </div>
              </div>

              <!-- Arena Target Area -->
              <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button class="btn-arena-record w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md" data-target="${ch.text}" data-id="arena-${idx}">
                  <span>🎙️ Grabar & Evaluar</span>
                </button>
                <div id="arena-status-arena-${idx}" class="text-xs text-slate-400">
                  Listo para escuchar
                </div>
              </div>

              <div id="arena-result-arena-${idx}" class="hidden p-4 rounded-xl space-y-2 text-xs"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.elements.viewContainer.innerHTML = html;

    // Attach Category Clicks
    this.elements.viewContainer.querySelectorAll('.arena-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.playClick();
        this.selectedArenaCategory = btn.dataset.cat;
        this.renderVoiceArena();
      });
    });

    // Attach Listen
    this.elements.viewContainer.querySelectorAll('.btn-arena-listen').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.playClick();
        window.speechEngine.speak(btn.dataset.text, false);
      });
    });

    // Attach Record
    this.elements.viewContainer.querySelectorAll('.btn-arena-record').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        const id = btn.dataset.id;
        const statusEl = document.getElementById(`arena-status-${id}`);
        const resultEl = document.getElementById(`arena-result-${id}`);

        if (window.pronunciationEvaluator.isListening) {
          window.pronunciationEvaluator.stopListening();
          if (statusEl) statusEl.textContent = 'Grabación detenida.';
          return;
        }

        window.pronunciationEvaluator.startListening({
          targetPhrase: target,
          onStart: () => {
            if (statusEl) statusEl.textContent = '🔴 Escuchando... ¡Habla ahora!';
          },
          onResult: (res) => {
            if (statusEl) statusEl.textContent = `Precisión: ${res.score}% (${'⭐'.repeat(res.stars)})`;
            if (resultEl) {
              resultEl.classList.remove('hidden');
              resultEl.className = `p-4 rounded-xl space-y-2 text-xs ${res.passed ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'}`;
              resultEl.innerHTML = `
                <div class="font-bold">${res.feedback}</div>
                <div class="text-slate-400">Escuchado: "${res.userSaid || '...'}"</div>
              `;
            }

            if (res.passed) {
              window.soundFX.playSuccess();
              window.gamification.recordPronunciationResult(res.score);
              window.gamification.addXP(10, 'Práctica en Arena');
              this.updateHeaderStats();
            } else {
              window.soundFX.playError();
            }
          },
          onError: (errMsg) => {
            if (statusEl) statusEl.textContent = errMsg;
          },
          onEnd: () => {
            // idle
          }
        });
      });
    });
  }

  /* ============================================================
     4. REWARDS SHOP VIEW
     ============================================================ */
  renderShop() {
    const state = window.gamification.state;

    const html = `
      <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
        <!-- Shop Header -->
        <div class="rounded-3xl p-8 bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center md:text-left">
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🛒 Tienda de Recompensas
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">Canjea tus LinguaGems</h2>
            <p class="text-slate-300 text-sm max-w-lg">
              Protege tus rachas, desbloquea avatares legendarios y personaliza el aspecto de tu academia de inglés.
            </p>
          </div>
          <div class="bg-slate-950/80 px-6 py-4 rounded-2xl border border-amber-500/30 flex items-center gap-3">
            <span class="text-3xl">💎</span>
            <div>
              <div class="text-2xl font-black text-amber-300">${state.gems}</div>
              <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tus LinguaGems</div>
            </div>
          </div>
        </div>

        <!-- Power-ups section -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡ Potenciadores & Escudos</span>
          </h3>
          <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-3xl border border-cyan-500/30">
                ❄️
              </div>
              <div class="space-y-1">
                <h4 class="font-extrabold text-white text-base">Escudo Salva-Racha (Streak Freeze)</h4>
                <p class="text-xs text-slate-400 max-w-md">
                  Si un día no puedes practicar, el escudo se consumirá automáticamente para salvar tu racha de días intacta.
                </p>
                <div class="text-xs text-cyan-400 font-bold">Tienes: ${state.streakFreezes} en inventario</div>
              </div>
            </div>
            <button id="btn-buy-freeze" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30">
              <span>Comprar por 50 💎</span>
            </button>
          </div>
        </div>

        <!-- Avatars section -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🎭 Avatares Coleccionables</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${AVATARS.map(av => {
              const isUnlocked = state.unlockedAvatars.includes(av.id);
              const isActive = state.activeAvatar === av.id;

              return `
                <div class="p-5 rounded-2xl bg-slate-900/90 border ${isActive ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'} flex flex-col justify-between gap-4">
                  <div class="space-y-2">
                    <div class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl shadow-inner">
                      ${av.icon}
                    </div>
                    <h4 class="font-bold text-white text-base">${av.name}</h4>
                    <p class="text-xs text-slate-400">${av.desc}</p>
                  </div>
                  <button class="btn-avatar-action w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white cursor-default' 
                      : isUnlocked 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }" data-id="${av.id}">
                    ${isActive ? '✓ Equipado' : isUnlocked ? 'Equipar' : `Comprar por ${av.cost} 💎`}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Themes section -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🎨 Temas Visuales</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${THEMES.map(th => {
              const isUnlocked = state.unlockedThemes.includes(th.id);
              const isActive = state.activeTheme === th.id;

              return `
                <div class="p-5 rounded-2xl bg-slate-900/90 border ${isActive ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'} flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-xl border border-slate-700" style="background-color: ${th.bg}; border-color: ${th.accent};"></div>
                    <div>
                      <h4 class="font-bold text-white text-sm">${th.name}</h4>
                      <p class="text-xs text-slate-400">${th.desc}</p>
                    </div>
                  </div>
                  <button class="btn-theme-action px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white cursor-default' 
                      : isUnlocked 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }" data-id="${th.id}">
                    ${isActive ? '✓ Activo' : isUnlocked ? 'Activar' : `${th.cost} 💎`}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.elements.viewContainer.innerHTML = html;

    // Attach buy freeze
    const buyFreezeBtn = document.getElementById('btn-buy-freeze');
    if (buyFreezeBtn) {
      buyFreezeBtn.addEventListener('click', () => {
        const res = window.gamification.buyItem('freeze');
        if (res.success) {
          window.soundFX.playCoin();
          window.gamification.showToast(res.msg);
          this.updateHeaderStats();
          this.renderShop();
        } else {
          window.soundFX.playError();
          window.gamification.showToast(res.msg);
        }
      });
    }

    // Attach avatar buttons
    this.elements.viewContainer.querySelectorAll('.btn-avatar-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const res = window.gamification.buyItem('avatar', id);
        if (res.success) {
          window.soundFX.playCoin();
          window.gamification.showToast(res.msg);
          this.updateHeaderStats();
          this.renderShop();
        } else {
          window.soundFX.playError();
          window.gamification.showToast(res.msg);
        }
      });
    });

    // Attach theme buttons
    this.elements.viewContainer.querySelectorAll('.btn-theme-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const res = window.gamification.buyItem('theme', id);
        if (res.success) {
          window.soundFX.playCoin();
          window.gamification.showToast(res.msg);
          this.updateHeaderStats();
          this.renderShop();
        } else {
          window.soundFX.playError();
          window.gamification.showToast(res.msg);
        }
      });
    });
  }

  /* ============================================================
     5. ACHIEVEMENTS & PROFILE VIEW
     ============================================================ */
  renderProfile() {
    const state = window.gamification.state;
    const level = window.gamification.getLevel();
    const rank = window.gamification.getRankTitle(level);
    const xpInfo = window.gamification.getXPProgress();
    const completedCount = Object.keys(state.completedLessons).length;
    const percentOverall = Math.round((completedCount / 180) * 100);

    const html = `
      <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
        <!-- Profile Hero -->
        <div class="rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div class="w-24 h-24 rounded-3xl bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-5xl shadow-xl">
            ${(AVATARS.find(a => a.id === state.activeAvatar) || AVATARS[0]).icon}
          </div>
          <div class="space-y-2 text-center md:text-left flex-1">
            <div class="flex items-center justify-center md:justify-start gap-3">
              <h2 class="text-2xl font-black text-white">Nivel ${level}</h2>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ${rank}
              </span>
            </div>
            <!-- Overall 6-Month Progress -->
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-slate-400">
                <span>Progreso del viaje de 6 meses (180 Días)</span>
                <span class="font-bold text-white">${completedCount} / 180 (${percentOverall}%)</span>
              </div>
              <div class="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style="width: ${percentOverall}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <div class="text-3xl font-black text-indigo-400">${state.xp}</div>
            <div class="text-xs text-slate-400 font-bold uppercase">Total XP</div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <div class="text-3xl font-black text-amber-400">${state.gems} 💎</div>
            <div class="text-xs text-slate-400 font-bold uppercase">LinguaGems</div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <div class="text-3xl font-black text-rose-400">${state.streak} 🔥</div>
            <div class="text-xs text-slate-400 font-bold uppercase">Racha Actual</div>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <div class="text-3xl font-black text-emerald-400">${state.bestStreak} ⚡</div>
            <div class="text-xs text-slate-400 font-bold uppercase">Mejor Racha</div>
          </div>
        </div>

        <!-- Badges Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🏆 Medallas y Logros Conquistados</span>
              <span class="text-xs text-slate-400 font-normal">(${state.unlockedBadges.length} de ${BADGES.length})</span>
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            ${BADGES.map(b => {
              const unlocked = state.unlockedBadges.includes(b.id);

              return `
                <div class="p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  unlocked 
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale'
                }">
                  <div class="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    ${b.icon}
                  </div>
                  <div class="space-y-0.5">
                    <div class="text-sm font-extrabold ${unlocked ? 'text-white' : 'text-slate-500'}">${b.name}</div>
                    <div class="text-[11px] text-slate-400 leading-tight">${b.desc}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Data Management -->
        <div class="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-400 text-center sm:text-left">
            Tu progreso se guarda de forma segura y automática en tu navegador (LocalStorage).
          </div>
          <button id="btn-reset-data" class="text-xs font-bold text-rose-400 hover:text-rose-300 underline">
            Reiniciar Progreso de Aprendizaje
          </button>
        </div>
      </div>
    `;

    this.elements.viewContainer.innerHTML = html;

    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas reiniciar todo tu progreso a cero?')) {
          localStorage.removeItem(STORAGE_KEY);
          location.reload();
        }
      });
    }
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EnglishQuestApp();
});
