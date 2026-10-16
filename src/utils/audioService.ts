/**
 * 7KAIH SMART AI - Audio & Music Service
 * Pemutar Audio Rekaman Instrumen Resmi "Indonesia Raya"
 * Menggunakan HTMLAudioElement murni tanpa osilator buatan atau efek DSP sintetis.
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'ended' | 'error';

export interface AudioPlayerState {
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number; // 0.0 - 1.0 (default 1.0 = 100%)
  isMuted: boolean;
  isAutoplayBlocked: boolean;
  errorMessage: string | null;
  sfxEnabled: boolean;
  sfxVolume: number;
}

const STORAGE_SETTINGS_KEY = '7kaih_audio_vol_settings';

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState = {
    playbackState: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1.0, // 100% volume awal normal sesuai sumber rekaman
    isMuted: false,
    isAutoplayBlocked: false,
    errorMessage: null,
    sfxEnabled: true,
    sfxVolume: 0.7,
  };

  private listeners: Set<(state: AudioPlayerState) => void> = new Set();
  private sfxCtx: AudioContext | null = null;

  constructor() {
    this.loadSavedSettings();
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private loadSavedSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.volume === 'number') {
          this.state.volume = Math.max(0, Math.min(1, parsed.volume));
        }
        if (typeof parsed.sfxEnabled === 'boolean') {
          this.state.sfxEnabled = parsed.sfxEnabled;
        }
        if (typeof parsed.sfxVolume === 'number') {
          this.state.sfxVolume = Math.max(0, Math.min(1, parsed.sfxVolume));
        }
      }
    } catch {}
  }

  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify({
        volume: this.state.volume,
        sfxEnabled: this.state.sfxEnabled,
        sfxVolume: this.state.sfxVolume,
      }));
    } catch {}
  }

  private initAudioElement() {
    if (this.audio) return;

    // Singleton HTMLAudioElement memutar langsung rekaman instrumen Indonesia Raya
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    // Prioritaskan berkas mp3 rekaman asli di public/audio/
    this.audio.src = '/audio/indonesia-raya.mp3';

    // Volume awal 100% (1.0)
    this.audio.volume = this.state.volume;
    this.audio.muted = this.state.isMuted;

    // Sinkronisasi status antarmuka langsung melalui native HTML audio events
    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audio?.duration || 0;
      this.state.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('playing', () => {
      this.state.playbackState = 'playing';
      this.state.isAutoplayBlocked = false;
      this.state.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      // Hanya ubah ke paused jika bukan karena lagu selesai
      if (this.audio && !this.audio.ended) {
        this.state.playbackState = 'paused';
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.state.playbackState = 'ended';
      this.state.currentTime = 0;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        if (!this.state.duration && this.audio.duration) {
          this.state.duration = this.audio.duration;
        }
        this.notify();
      }
    });

    this.audio.addEventListener('volumechange', () => {
      if (this.audio) {
        this.state.volume = this.audio.volume;
        this.state.isMuted = this.audio.muted;
        this.notify();
      }
    });

    this.audio.addEventListener('error', () => {
      const mediaErr = this.audio?.error;
      let msg = 'Gagal memuat berkas audio instrumen Indonesia Raya.';
      if (mediaErr?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        // Coba alternatif ogg jika mp3 gagal
        if (this.audio && !this.audio.src.endsWith('.ogg')) {
          this.audio.src = '/audio/indonesia-raya.ogg';
          this.audio.load();
          return;
        }
        msg = 'Berkas audio rekaman instrumen Indonesia Raya belum ditemukan di /public/audio/indonesia-raya.mp3.';
      }
      this.state.playbackState = 'error';
      this.state.errorMessage = msg;
      this.notify();
    });
  }

  public subscribe(fn: (state: AudioPlayerState) => void): () => void {
    this.listeners.add(fn);
    fn({ ...this.state });
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.state }));
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  /**
   * Putar lagu dari awal (atau jika lagu selesai)
   */
  public async play(): Promise<boolean> {
    this.initAudioElement();
    if (!this.audio) return false;

    try {
      if (this.state.playbackState === 'ended') {
        this.audio.currentTime = 0;
      }
      await this.audio.play();
      this.state.playbackState = 'playing';
      this.state.isAutoplayBlocked = false;
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.state.isAutoplayBlocked = true;
      } else {
        this.state.errorMessage = 'Browser belum mengizinkan pemutaran audio otomatis. Silakan klik tombol Putar.';
      }
      this.state.playbackState = this.audio.currentTime > 0 ? 'paused' : 'idle';
      this.notify();
      return false;
    }
  }

  /**
   * Jeda lagu pada posisi terakhir (currentTime tidak direset)
   */
  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.state.playbackState = 'paused';
    this.notify();
  }

  /**
   * Lanjutkan pemutaran dari posisi terakhir (currentTime tidak berubah)
   */
  public async resume(): Promise<boolean> {
    if (!this.audio) return false;
    try {
      await this.audio.play();
      this.state.playbackState = 'playing';
      this.state.isAutoplayBlocked = false;
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      this.state.errorMessage = 'Gagal melanjutkan pemutaran audio.';
      this.notify();
      return false;
    }
  }

  /**
   * Kontrol Volume 0% - 100% (0.0 - 1.0)
   */
  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.state.volume = clamped;
    if (this.audio) {
      this.audio.volume = clamped;
      if (clamped > 0 && this.audio.muted) {
        this.audio.muted = false;
        this.state.isMuted = false;
      }
    }
    this.saveSettings();
    this.notify();
  }

  /**
   * Toggle Mute / Unmute
   */
  public toggleMute(): boolean {
    if (this.audio) {
      this.audio.muted = !this.audio.muted;
      this.state.isMuted = this.audio.muted;
      this.notify();
      return this.state.isMuted;
    }
    return false;
  }

  /**
   * Upayakan autoplay saat website dibuka
   */
  public async attemptAutoplay(): Promise<boolean> {
    this.initAudioElement();
    if (!this.audio) return false;

    try {
      await this.audio.play();
      this.state.playbackState = 'playing';
      this.state.isAutoplayBlocked = false;
      this.notify();
      return true;
    } catch (err: any) {
      // Browser memblokir autoplay bersuara (Chrome/Android)
      this.state.isAutoplayBlocked = true;
      this.state.playbackState = 'idle';
      this.notify();
      return false;
    }
  }

  public dismissAutoplayBanner() {
    this.state.isAutoplayBlocked = false;
    this.notify();
  }

  /* -------------------------------------------------------------
   * UI Sound Effects (Centang Kebiasaan & Prestasi)
   * Efek suara terpisah untuk interaksi siswa
   * ------------------------------------------------------------- */

  private initSfxContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.sfxCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;
      this.sfxCtx = new AudioCtxClass();
    }
    if (this.sfxCtx.state === 'suspended') {
      this.sfxCtx.resume().catch(() => {});
    }
    return this.sfxCtx;
  }

  public playHabitCheckSFX() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.initSfxContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      const sfxVol = this.state.sfxVolume * 0.25;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        noteGain.gain.setValueAtTime(0, now + idx * 0.08);
        noteGain.gain.linearRampToValueAtTime(sfxVol, now + idx * 0.08 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {}
  }

  public playHabitUncheckSFX() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.initSfxContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const sfxVol = this.state.sfxVolume * 0.18;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.2);

      noteGain.gain.setValueAtTime(sfxVol, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(noteGain);
      noteGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playCelebrationSFX() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.initSfxContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.5];
      const sfxVol = this.state.sfxVolume * 0.28;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        noteGain.gain.setValueAtTime(0, now + idx * 0.1);
        noteGain.gain.linearRampToValueAtTime(sfxVol, now + idx * 0.1 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.7);
      });
    } catch {}
  }

  public playBadgeUnlockedSFX() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.initSfxContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      const sfxVol = this.state.sfxVolume * 0.25;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        noteGain.gain.setValueAtTime(0, now + idx * 0.12);
        noteGain.gain.linearRampToValueAtTime(sfxVol, now + idx * 0.12 + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.9);
      });
    } catch {}
  }

  public toggleSfx(): boolean {
    this.state.sfxEnabled = !this.state.sfxEnabled;
    this.saveSettings();
    this.notify();
    return this.state.sfxEnabled;
  }

  public setSfxVolume(vol: number) {
    this.state.sfxVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    this.notify();
  }
}

export const audioService = new AudioService();
