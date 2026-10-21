/**
 * Audio Engine: Web Audio API Synthesizer & Speech Synthesis
 * Zero external audio files required - 100% generated in real-time.
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, startTime = 0, gainValue = 0.2) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  // Click / Button tap
  playClick() {
    this.playTone(800, 'triangle', 0.04, 0, 0.15);
  }

  // Correct answer / Good match
  playSuccess() {
    this.playTone(523.25, 'triangle', 0.1, 0, 0.2);     // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08, 0.2);  // E5
    this.playTone(783.99, 'triangle', 0.1, 0.16, 0.2);  // G5
    this.playTone(1046.50, 'sine', 0.25, 0.24, 0.25);   // C6
  }

  // Incorrect answer
  playError() {
    this.playTone(300, 'sawtooth', 0.15, 0, 0.2);
    this.playTone(220, 'sawtooth', 0.25, 0.12, 0.2);
  }

  // Gem / Coin collected
  playCoin() {
    this.playTone(987.77, 'sine', 0.08, 0, 0.25);      // B5
    this.playTone(1318.51, 'sine', 0.28, 0.07, 0.25);   // E6
  }

  // Mic activate
  playMicStart() {
    this.playTone(440, 'sine', 0.08, 0, 0.2);
    this.playTone(880, 'sine', 0.12, 0.07, 0.2);
  }

  // Mic stop
  playMicStop() {
    this.playTone(880, 'sine', 0.08, 0, 0.15);
    this.playTone(440, 'sine', 0.12, 0.07, 0.15);
  }

  // Stage / Day victory fanfare
  playVictory() {
    const notes = [
      { f: 523.25, t: 0, d: 0.12 },     // C5
      { f: 659.25, t: 0.12, d: 0.12 },  // E5
      { f: 783.99, t: 0.24, d: 0.12 },  // G5
      { f: 1046.50, t: 0.36, d: 0.35 }, // C6
      { f: 880.00, t: 0.72, d: 0.15 },  // A5
      { f: 1046.50, t: 0.88, d: 0.5 },  // C6
    ];
    notes.forEach(n => this.playTone(n.f, 'triangle', n.d, n.t, 0.25));
  }
}

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.speechRate = 0.95; // Slightly clear & natural pace

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prefer English voices: Google US English, Samantha, Microsoft David/Zira, or any en-US / en-GB
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const preferred = englishVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google US English') || 
      v.name.includes('Samantha') || 
      v.name.includes('Zira') || 
      v.name.includes('David')
    );
    this.selectedVoice = preferred || englishVoices[0] || this.voices[0] || null;
  }

  speak(text, slow = false, onEnd = null) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel current speech if any
    this.synth.cancel();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = 'en-US';
    utterance.rate = slow ? 0.65 : this.speechRate;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Global audio instances
window.soundFX = new SoundEffects();
window.speechEngine = new SpeechEngine();
