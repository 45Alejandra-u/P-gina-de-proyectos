/**
 * Gamification & Progression Engine
 * Manages XP, Levels, Streaks, Currency (LinguaGems), Badges, Shop & LocalStorage.
 */

const STORAGE_KEY = 'english_quest_saved_state_v1';

const AVATARS = [
  { id: 'novice', name: 'Aprendiz Curioso', icon: '🌱', cost: 0, desc: 'Listo para comenzar el viaje.' },
  { id: 'fox', name: 'Zorro Astuto', icon: '🦊', cost: 60, desc: 'Aprende rápido y sin miedo.' },
  { id: 'wizard', name: 'Mago del Vocabulario', icon: '🧙‍♂️', cost: 120, desc: 'Domina los hechizos gramaticales.' },
  { id: 'cyber', name: 'Cyberpunk Speaker', icon: '⚡', cost: 180, desc: 'Fluidez a la velocidad de la luz.' },
  { id: 'dragon', name: 'Dragón Bilingüe', icon: '🐉', cost: 250, desc: 'Voz potente e imponente.' },
  { id: 'crown', name: 'Monarca de la Fluidez', icon: '👑', cost: 400, desc: 'Nivel B2/C1 conquistado.' }
];

const THEMES = [
  { id: 'default', name: 'Obsidian & Indigo', desc: 'Moderno, elegante y de alto contraste', cost: 0, bg: '#0f172a', accent: '#6366f1' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Luces de neón magenta y cian', cost: 100, bg: '#09090b', accent: '#ec4899' },
  { id: 'emerald', name: 'Emerald Valley', desc: 'Tonos bosque natural y relajante', cost: 100, bg: '#062016', accent: '#10b981' },
  { id: 'gold', name: 'Royal Sunset Gold', desc: 'Dorado imperial y violeta místico', cost: 150, bg: '#1c1326', accent: '#f59e0b' }
];

const BADGES = [
  { id: 'first_word', name: 'Primeras Palabras', icon: '🎯', desc: 'Completa tu primera lección diaria.', unlocked: false },
  { id: 'streak_3', name: 'Hábito de Hierro', icon: '🔥', desc: 'Alcanza una racha de 3 días consecutivos.', unlocked: false },
  { id: 'streak_7', name: 'Semana de Oro', icon: '⚡', desc: 'Mantén tu racha durante 7 días seguidos.', unlocked: false },
  { id: 'streak_30', name: 'Mes Conquistado', icon: '🏆', desc: 'Cumple 30 días seguidos de práctica.', unlocked: false },
  { id: 'mic_apprentice', name: 'Voz Clara', icon: '🎤', desc: 'Consigue 3 estrellas en un reto de pronunciación.', unlocked: false },
  { id: 'mic_master', name: 'Maestro del Micrófono', icon: '🎙️', desc: 'Supera 10 retos de pronunciación con más del 85%.', unlocked: false },
  { id: 'boss_month_1', name: 'Guardián del Outpost', icon: '🏰', desc: 'Supera el Boss Battle del Mes 1 (Día 30).', unlocked: false },
  { id: 'boss_month_3', name: 'Ciudadano de Metro City', icon: '🏙️', desc: 'Supera el Boss Battle del Mes 3 (Día 90).', unlocked: false },
  { id: 'gem_hoarder', name: 'Cofre del Tesoro', icon: '💎', desc: 'Acumula más de 300 LinguaGems.', unlocked: false },
  { id: 'shop_supporter', name: 'Cliente Frecuente', icon: '🛍️', desc: 'Compra tu primer artículo en la tienda.', unlocked: false },
  { id: 'streak_freeze_saver', name: 'Escudo Sagrado', icon: '❄️', desc: 'Posee un Streak Freeze en tu inventario.', unlocked: false },
  { id: 'century', name: 'Centurión Bilingüe', icon: '⭐', desc: 'Completa 100 lecciones diarias del roadmap.', unlocked: false }
];

class GamificationManager {
  constructor() {
    this.state = this.loadState();
    this.checkDailyStreak();
    this.applyTheme(this.state.activeTheme);
  }

  getDefaultState() {
    return {
      xp: 0,
      gems: 80, // Bono de bienvenida
      streak: 1,
      bestStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakFreezes: 1, // 1 escudo inicial gratis
      activeAvatar: 'novice',
      activeTheme: 'default',
      unlockedAvatars: ['novice'],
      unlockedThemes: ['default'],
      completedLessons: {}, // dayNumber: { stars: 3, score: 95, completedAt: '...' }
      unlockedBadges: [],
      pronunciationCount85: 0,
      totalPracticeMinutes: 0
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return Object.assign(this.getDefaultState(), JSON.parse(data));
      }
    } catch (e) {
      console.warn('Could not load save state', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  getLevel() {
    // XP to Level curve: Lv = floor(sqrt(XP / 50)) + 1
    return Math.floor(Math.sqrt(this.state.xp / 50)) + 1;
  }

  getXPProgress() {
    const currentLvl = this.getLevel();
    const currentLvlXP = (currentLvl - 1) * (currentLvl - 1) * 50;
    const nextLvlXP = currentLvl * currentLvl * 50;
    const xpIntoLevel = this.state.xp - currentLvlXP;
    const needed = nextLvlXP - currentLvlXP;
    const percent = Math.min(100, Math.max(0, Math.round((xpIntoLevel / needed) * 100)));
    return { currentLvl, currentLvlXP, nextLvlXP, xpIntoLevel, needed, percent };
  }

  getRankTitle(level) {
    if (level < 5) return '🌱 Aprendiz Novato (A1)';
    if (level < 10) return '🧭 Explorador del Idioma (A1-A2)';
    if (level < 15) return '⚔️ Guerrero de Vocabulario (A2-B1)';
    if (level < 20) return '🛡️ Orador Conversacional (B1-B2)';
    if (level < 25) return '👑 Caballero Fluido (B2-C1)';
    return '🌟 Maestro Legendario de la Fluidez';
  }

  checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.lastActiveDate;

    if (!last) {
      this.state.lastActiveDate = today;
      this.state.streak = 1;
      this.saveState();
      return;
    }

    if (last === today) {
      // Already recorded today
      return;
    }

    const todayDate = new Date(today);
    const lastDate = new Date(last);
    const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      this.state.streak += 1;
      if (this.state.streak > this.state.bestStreak) {
        this.state.bestStreak = this.state.streak;
      }
      this.state.lastActiveDate = today;
      this.checkBadges();
      this.saveState();
    } else if (diffDays > 1) {
      // Missed a day: check streak freeze!
      if (this.state.streakFreezes > 0) {
        this.state.streakFreezes -= 1;
        this.state.lastActiveDate = today;
        this.showToast('❄️ ¡Tu Escudo Salva-Racha te protegió! Tu racha sigue intacta.');
      } else {
        this.state.streak = 1;
        this.state.lastActiveDate = today;
        this.showToast('⚠️ No practicaste ayer. ¡Comienza una nueva racha hoy!');
      }
      this.saveState();
    }
  }

  addXP(amount, reason = '') {
    const prevLvl = this.getLevel();
    this.state.xp += amount;
    const newLvl = this.getLevel();

    if (newLvl > prevLvl) {
      window.soundFX.playVictory();
      this.triggerConfetti();
      this.showToast(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${newLvl}: ${this.getRankTitle(newLvl)}`);
    }

    this.checkBadges();
    this.saveState();
    return { added: amount, newXP: this.state.xp, leveledUp: newLvl > prevLvl };
  }

  addGems(amount) {
    this.state.gems += amount;
    window.soundFX.playCoin();
    this.checkBadges();
    this.saveState();
  }

  spendGems(amount) {
    if (this.state.gems >= amount) {
      this.state.gems -= amount;
      this.saveState();
      return true;
    }
    return false;
  }

  completeLesson(dayNumber, score, stars = 3) {
    const isNew = !this.state.completedLessons[dayNumber];
    const prevRecord = this.state.completedLessons[dayNumber] || { score: 0, stars: 0 };

    this.state.completedLessons[dayNumber] = {
      score: Math.max(score, prevRecord.score),
      stars: Math.max(stars, prevRecord.stars),
      completedAt: new Date().toISOString()
    };

    // Rewards
    let xpEarned = 50;
    let gemsEarned = 20;

    if (stars === 3) {
      xpEarned += 25;
      gemsEarned += 10;
    }

    if (isNew) {
      this.addXP(xpEarned, 'Lección completada');
      this.addGems(gemsEarned);
    } else {
      // Minor reward for review
      this.addXP(15, 'Repaso de lección');
      this.addGems(5);
    }

    this.checkBadges();
    this.saveState();

    return { xpEarned, gemsEarned, isNew };
  }

  recordPronunciationResult(score) {
    if (score >= 85) {
      this.state.pronunciationCount85 = (this.state.pronunciationCount85 || 0) + 1;
      this.checkBadges();
      this.saveState();
    }
  }

  checkBadges() {
    const newlyUnlocked = [];

    const award = (id) => {
      if (!this.state.unlockedBadges.includes(id)) {
        this.state.unlockedBadges.push(id);
        const b = BADGES.find(x => x.id === id);
        if (b) {
          newlyUnlocked.push(b);
          this.showToast(`🏆 ¡LOGRO DESBLOQUEADO!: ${b.icon} ${b.name}`);
          window.soundFX.playVictory();
        }
      }
    };

    const completedCount = Object.keys(this.state.completedLessons).length;

    if (completedCount >= 1) award('first_word');
    if (this.state.streak >= 3) award('streak_3');
    if (this.state.streak >= 7) award('streak_7');
    if (this.state.streak >= 30) award('streak_30');
    if (completedCount >= 100) award('century');
    if (this.state.completedLessons[30]) award('boss_month_1');
    if (this.state.completedLessons[90]) award('boss_month_3');
    if (this.state.gems >= 300) award('gem_hoarder');
    if (this.state.streakFreezes > 0) award('streak_freeze_saver');
    if (this.state.pronunciationCount85 >= 1) award('mic_apprentice');
    if (this.state.pronunciationCount85 >= 10) award('mic_master');

    return newlyUnlocked;
  }

  buyItem(type, id) {
    if (type === 'freeze') {
      const cost = 50;
      if (this.spendGems(cost)) {
        this.state.streakFreezes += 1;
        this.awardBadge('shop_supporter');
        this.awardBadge('streak_freeze_saver');
        this.saveState();
        return { success: true, msg: '¡Escudo Salva-Racha adquirido!' };
      }
      return { success: false, msg: 'No tienes suficientes LinguaGems 💎.' };
    }

    if (type === 'avatar') {
      const av = AVATARS.find(a => a.id === id);
      if (!av) return { success: false, msg: 'Avatar no encontrado.' };
      if (this.state.unlockedAvatars.includes(id)) {
        this.state.activeAvatar = id;
        this.saveState();
        return { success: true, msg: `Avatar ${av.icon} equipado.` };
      }
      if (this.spendGems(av.cost)) {
        this.state.unlockedAvatars.push(id);
        this.state.activeAvatar = id;
        this.awardBadge('shop_supporter');
        this.saveState();
        return { success: true, msg: `¡Desbloqueaste el avatar ${av.icon} ${av.name}!` };
      }
      return { success: false, msg: 'No tienes suficientes LinguaGems 💎.' };
    }

    if (type === 'theme') {
      const th = THEMES.find(t => t.id === id);
      if (!th) return { success: false, msg: 'Tema no encontrado.' };
      if (this.state.unlockedThemes.includes(id)) {
        this.state.activeTheme = id;
        this.applyTheme(id);
        this.saveState();
        return { success: true, msg: `Tema ${th.name} aplicado.` };
      }
      if (this.spendGems(th.cost)) {
        this.state.unlockedThemes.push(id);
        this.state.activeTheme = id;
        this.applyTheme(id);
        this.awardBadge('shop_supporter');
        this.saveState();
        return { success: true, msg: `¡Desbloqueaste el tema ${th.name}!` };
      }
      return { success: false, msg: 'No tienes suficientes LinguaGems 💎.' };
    }

    return { success: false, msg: 'Artículo desconocido.' };
  }

  awardBadge(id) {
    if (!this.state.unlockedBadges.includes(id)) {
      this.state.unlockedBadges.push(id);
      const b = BADGES.find(x => x.id === id);
      if (b) {
        this.showToast(`🏆 ¡LOGRO DESBLOQUEADO!: ${b.icon} ${b.name}`);
        window.soundFX.playVictory();
      }
      this.saveState();
    }
  }

  applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId || 'default');
  }

  triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-slate-900 border border-indigo-500/50 text-white px-5 py-3 rounded-xl shadow-2xl shadow-indigo-500/20 text-sm font-medium animate-bounce pointer-events-auto flex items-center gap-3 backdrop-blur-md';
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('animate-bounce');
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}

window.gamification = new GamificationManager();
