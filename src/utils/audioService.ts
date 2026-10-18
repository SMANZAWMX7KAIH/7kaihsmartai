/**
 * 7KAIH SMART AI - Audio & Music Service
 * Pemutar Musik Nasionalisme Indonesia ("Bangun Pemudi Pemuda" & "Indonesia Raya")
 * Menggunakan HTMLAudioElement murni tanpa osilator buatan atau efek DSP sintetis.
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'ended' | 'error';
export type NationalTrackId = 'bangun_pemudi_pemuda' | 'indonesia_raya';

export interface NationalTrackInfo {
  id: NationalTrackId;
  title: string;
  composer: string;
  year: string;
  category: string;
  srcMp3: string;
  srcOgg?: string;
  description: string;
}

export const NATIONAL_TRACKS: Record<NationalTrackId, NationalTrackInfo> = {
  bangun_pemudi_pemuda: {
    id: 'bangun_pemudi_pemuda',
    title: 'Bangun Pemudi Pemuda',
    composer: 'Alfred Simanjuntak',
    year: '1943',
    category: 'Lagu Nasional Republik Indonesia',
    srcMp3: '/audio/bangun-pemudi-pemuda.mp3',
    srcOgg: '/audio/bangun-pemudi-pemuda.ogg',
    description: 'Lagu wajib nasional yang menggelorakan tekad, kepeloporan, dan integritas pemuda-pemudi Indonesia.',
  },
  indonesia_raya: {
    id: 'indonesia_raya',
    title: 'Indonesia Raya',
    composer: 'Wage Rudolf Soepratman',
    year: '1928',
    category: 'Lagu Kebangsaan Republik Indonesia',
    srcMp3: '/audio/indonesia-raya.mp3',
    srcOgg: '/audio/indonesia-raya.ogg',
    description: 'Rekaman instrumen orkestra resmi United States Navy Band (Karya Bebas Hak Cipta / Public Domain).',
  },
};

export interface AudioPlayerState {
  currentTrackId: NationalTrackId;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number; // 0.0 - 1.0 (default 1.0 = 100%)
  isMuted: boolean;
  isAvailable: boolean; // Menandakan apakah file audio sah telah tersedia di server
  isCheckingAvailability: boolean;
  errorMessage: string | null;
  sfxEnabled: boolean;
  sfxVolume: number;
}

const STORAGE_SETTINGS_KEY = '7kaih_audio_vol_settings';

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState = {
    currentTrackId: 'bangun_pemudi_pemuda', // Sesuai permintaan: menggunakan lagu "Bangun Pemudi Pemuda"
    playbackState: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    isMuted: false,
    isAvailable: false,
    isCheckingAvailability: true,
    errorMessage: null,
    sfxEnabled: true,
    sfxVolume: 0.7,
  };

  private listeners: Set<(state: AudioPlayerState) => void> = new Set();
  private sfxCtx: AudioContext | null = null;
  private availabilityCache: Map<string, boolean> = new Map();

  constructor() {
    this.loadSavedSettings();
    if (typeof window !== 'undefined') {
      this.initAudioElement();
      this.checkCurrentTrackAvailability();
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
        if (parsed.currentTrackId === 'bangun_pemudi_pemuda' || parsed.currentTrackId === 'indonesia_raya') {
          this.state.currentTrackId = parsed.currentTrackId;
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
        currentTrackId: this.state.currentTrackId,
      }));
    } catch {}
  }

  /**
   * Pengecekan ketersediaan berkas audio secara riil pada server
   */
  public async checkTrackAvailability(trackId: NationalTrackId): Promise<boolean> {
    const track = NATIONAL_TRACKS[trackId];
    if (this.availabilityCache.has(track.srcMp3)) {
      return Boolean(this.availabilityCache.get(track.srcMp3));
    }

    try {
      const res = await fetch(track.srcMp3, { method: 'HEAD' });
      // File dianggap tersedia jika status 200/304 dan Content-Type audio
      const contentType = res.headers.get('content-type') || '';
      const isHtmlFallback = contentType.includes('text/html'); // Vite SPA fallback
      const exists = res.ok && !isHtmlFallback;

      this.availabilityCache.set(track.srcMp3, exists);
      return exists;
    } catch {
      this.availabilityCache.set(track.srcMp3, false);
      return false;
    }
  }

  private async checkCurrentTrackAvailability() {
    this.state.isCheckingAvailability = true;
    this.notify();

    const isAvailable = await this.checkTrackAvailability(this.state.currentTrackId);
    this.state.isCheckingAvailability = false;
    this.state.isAvailable = isAvailable;

    if (!isAvailable) {
      const track = NATIONAL_TRACKS[this.state.currentTrackId];
      this.state.playbackState = 'idle';
      this.state.errorMessage = `Berkas audio "${track.title}" belum tersedia di ${track.srcMp3}. Silakan tambahkan file audio yang sah.`;
    } else {
      this.state.errorMessage = null;
    }

    this.notify();
  }

  private initAudioElement() {
    if (this.audio) return;

    this.audio = new Audio();
    this.audio.preload = 'metadata';

    const currentTrack = NATIONAL_TRACKS[this.state.currentTrackId];
    this.audio.src = currentTrack.srcMp3;
    this.audio.volume = this.state.volume;
    this.audio.muted = this.state.isMuted;

    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audio?.duration || 0;
      this.state.isAvailable = true;
      this.state.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('playing', () => {
      this.state.playbackState = 'playing';
      this.state.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
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
      const track = NATIONAL_TRACKS[this.state.currentTrackId];
      this.state.playbackState = 'idle';
      this.state.isAvailable = false;
      this.state.errorMessage = `Berkas audio "${track.title}" belum tersedia di ${track.srcMp3}.`;
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

  public getCurrentTrack(): NationalTrackInfo {
    return NATIONAL_TRACKS[this.state.currentTrackId];
  }

  /**
   * Pindah lagu (antara "Bangun Pemudi Pemuda" dan "Indonesia Raya")
   */
  public async switchTrack(trackId: NationalTrackId) {
    if (this.state.currentTrackId === trackId) return;

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.state.currentTrackId = trackId;
    this.state.playbackState = 'idle';
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.saveSettings();

    const track = NATIONAL_TRACKS[trackId];
    if (this.audio) {
      this.audio.src = track.srcMp3;
    }

    await this.checkCurrentTrackAvailability();
  }

  /**
   * Putar lagu
   * CATATAN: Sesuai aturan sistem, audio TIDAK PERNAH diputar otomatis saat halaman dibuka.
   * Pemutaran hanya terjadi saat pengguna menekan tombol Putar.
   */
  public async play(): Promise<boolean> {
    this.initAudioElement();
    if (!this.audio) return false;

    // Jika file belum tersedia, jangan putar dan beri umpan balik jelas
    if (!this.state.isAvailable) {
      const track = NATIONAL_TRACKS[this.state.currentTrackId];
      this.state.errorMessage = `Musik belum tersedia. File ${track.srcMp3} belum ditambahkan.`;
      this.notify();
      return false;
    }

    try {
      if (this.state.playbackState === 'ended') {
        this.audio.currentTime = 0;
      }
      await this.audio.play();
      this.state.playbackState = 'playing';
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      this.state.errorMessage = 'Pemutaran diblokir oleh browser. Silakan klik tombol Putar kembali.';
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
   * Lanjutkan pemutaran dari posisi terakhir
   */
  public async resume(): Promise<boolean> {
    if (!this.audio || !this.state.isAvailable) return false;
    try {
      await this.audio.play();
      this.state.playbackState = 'playing';
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
   * Hentikan musik sepenuhnya dan kembalikan ke awal
   */
  public stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state.playbackState = 'idle';
    this.state.currentTime = 0;
    this.notify();
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
