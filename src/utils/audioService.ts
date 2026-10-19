/**
 * 7KAIH SMART AI - Audio & Music Service
 * Pemutar Musik Nasionalisme Indonesia ("Bangun Pemudi Pemuda" & "Indonesia Raya")
 * Kompatibel dengan GitHub Pages (/7kaihsmartai/), dev server (/), dan peramban HP Android / desktop.
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'ended' | 'error';
export type NationalTrackId = 'bangun_pemudi_pemuda' | 'indonesia_raya';

export function getAudioPath(relPath: string): string {
  const base = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL 
    ? import.meta.env.BASE_URL 
    : '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath;
  return `${cleanBase}${cleanPath}`;
}

export interface NationalTrackInfo {
  id: NationalTrackId;
  title: string;
  composer: string;
  year: string;
  category: string;
  expectedFile: string;
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
    expectedFile: 'public/audio/bangun-pemudi-pemuda.mp3',
    srcMp3: getAudioPath('audio/bangun-pemudi-pemuda.mp3'),
    srcOgg: getAudioPath('audio/bangun-pemudi-pemuda.ogg'),
    description: 'Lagu wajib nasional ciptaan Alfred Simanjuntak (1943) yang menggelorakan tekad kepeloporan dan integritas pemuda-pemudi Indonesia (Arsip Audio Berlisensi Domain Publik).',
  },
  indonesia_raya: {
    id: 'indonesia_raya',
    title: 'Indonesia Raya',
    composer: 'Wage Rudolf Soepratman',
    year: '1928',
    category: 'Lagu Kebangsaan Republik Indonesia',
    expectedFile: 'public/audio/indonesia-raya.mp3',
    srcMp3: getAudioPath('audio/indonesia-raya.mp3'),
    srcOgg: getAudioPath('audio/indonesia-raya.ogg'),
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
  isAvailable: boolean; // File sah ditemukan di server atau dimuat pengguna
  isCheckingAvailability: boolean;
  isCustomFileLoaded: boolean;
  customFileName: string | null;
  errorMessage: string | null;
  sfxEnabled: boolean;
  sfxVolume: number;
}

const STORAGE_SETTINGS_KEY = '7kaih_audio_vol_settings';

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private customObjectUrl: string | null = null;
  private state: AudioPlayerState = {
    currentTrackId: 'bangun_pemudi_pemuda',
    playbackState: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    isMuted: false,
    isAvailable: false,
    isCheckingAvailability: false,
    isCustomFileLoaded: false,
    customFileName: null,
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
      try {
        this.initAudioElement();
        // Cek ketersediaan lagu setelah inisialisasi awal
        setTimeout(() => {
          this.checkCurrentTrackAvailability().catch(() => {});
        }, 150);
      } catch (e) {
        console.warn('AudioService constructor caught:', e);
      }
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
   * Pengecekan riil keberadaan file audio di server (termasuk fallback OGG jika ada)
   */
  public async checkTrackAvailability(trackId: NationalTrackId, forceRefresh = false): Promise<boolean> {
    const track = NATIONAL_TRACKS[trackId];
    if (!forceRefresh && this.availabilityCache.has(track.srcMp3)) {
      return Boolean(this.availabilityCache.get(track.srcMp3));
    }

    try {
      // 1. Coba periksa file MP3
      const resMp3 = await fetch(track.srcMp3, { method: 'HEAD' });
      const ctMp3 = resMp3.headers.get('content-type') || '';
      const isHtmlMp3 = ctMp3.includes('text/html'); // Menandakan 404 SPA fallback
      if (resMp3.ok && !isHtmlMp3) {
        this.availabilityCache.set(track.srcMp3, true);
        return true;
      }

      // 2. Jika MP3 belum ada, coba fallback OGG jika tersedia
      if (track.srcOgg) {
        const resOgg = await fetch(track.srcOgg, { method: 'HEAD' });
        const ctOgg = resOgg.headers.get('content-type') || '';
        const isHtmlOgg = ctOgg.includes('text/html');
        if (resOgg.ok && !isHtmlOgg) {
          this.availabilityCache.set(track.srcMp3, true);
          return true;
        }
      }

      this.availabilityCache.set(track.srcMp3, false);
      return false;
    } catch {
      this.availabilityCache.set(track.srcMp3, false);
      return false;
    }
  }

  public async checkCurrentTrackAvailability(forceRefresh = false) {
    if (this.state.isCustomFileLoaded) {
      this.state.isAvailable = true;
      this.state.errorMessage = null;
      this.notify();
      return;
    }

    this.state.isCheckingAvailability = true;
    this.notify();

    const track = NATIONAL_TRACKS[this.state.currentTrackId];
    const isAvailable = await this.checkTrackAvailability(this.state.currentTrackId, forceRefresh);
    
    this.state.isCheckingAvailability = false;
    this.state.isAvailable = isAvailable;

    if (!isAvailable) {
      this.state.playbackState = 'idle';
      this.state.errorMessage = `Berkas audio "${track.title}" belum tersedia di ${track.expectedFile}. Anda dapat menambahkan berkas audio sah ke folder tersebut, atau memilih file MP3 dari perangkat Anda.`;
    } else {
      this.state.errorMessage = null;
      if (this.audio && (!this.audio.src || !this.audio.src.includes(track.srcMp3))) {
        this.audio.src = track.srcMp3;
        this.audio.preload = 'metadata';
        this.audio.load();
      }
    }

    this.notify();
  }

  private initAudioElement() {
    if (this.audio) return;

    this.audio = new Audio();
    this.audio.preload = 'none'; // Jangan memuat media jika berkas belum dipastikan ada
    this.audio.volume = this.state.volume;
    this.audio.muted = this.state.isMuted;

    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audio?.duration || 0;
      this.state.isAvailable = true;
      this.state.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('durationchange', () => {
      if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
        this.state.duration = this.audio.duration;
        this.notify();
      }
    });

    this.audio.addEventListener('canplay', () => {
      if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
        this.state.duration = this.audio.duration;
      }
      this.state.isAvailable = true;
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
      const mediaErr = this.audio?.error;
      let msg = 'Gagal memuat berkas audio.';
      if (mediaErr) {
        // Gunakan perbandingan kode numerik standar HTML MediaError untuk keamanan peramban mobile
        switch (mediaErr.code) {
          case 1: // MEDIA_ERR_ABORTED
            msg = 'Pemutaran audio dibatalkan oleh peramban.';
            break;
          case 2: // MEDIA_ERR_NETWORK
            msg = 'Koneksi jaringan terputus saat mengunduh audio.';
            break;
          case 3: // MEDIA_ERR_DECODE
            msg = 'Format audio rusak atau tidak dapat didekode oleh peramban.';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            msg = `Berkas audio tidak ditemukan (HTTP 404). Pastikan berkas tersedia di jalur ${NATIONAL_TRACKS[this.state.currentTrackId].srcMp3}.`;
            break;
          default:
            msg = 'Kendala pemutaran audio pada peramban perangkat.';
            break;
        }
      }
      this.state.playbackState = 'error';
      this.state.isAvailable = false;
      this.state.errorMessage = msg;
      this.notify();
    });
  }

  public subscribe(fn: (state: AudioPlayerState) => void): () => void {
    this.listeners.add(fn);
    try {
      fn({ ...this.state });
    } catch (e) {
      console.warn('Initial subscriber call caught:', e);
    }
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn({ ...this.state });
      } catch (e) {
        console.warn('Audio listener notification caught:', e);
      }
    });
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

    // Lepas URL custom jika sebelumnya menggunakan file upload
    if (this.customObjectUrl) {
      URL.revokeObjectURL(this.customObjectUrl);
      this.customObjectUrl = null;
    }

    this.state.currentTrackId = trackId;
    this.state.playbackState = 'idle';
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.state.isCustomFileLoaded = false;
    this.state.customFileName = null;
    this.saveSettings();

    await this.checkCurrentTrackAvailability(true);
  }

  /**
   * Memuat file audio MP3 langsung dari perangkat pengguna (HP / Komputer)
   */
  public loadUserAudioFile(file: File): boolean {
    this.initAudioElement();
    if (!this.audio) return false;

    try {
      if (this.customObjectUrl) {
        URL.revokeObjectURL(this.customObjectUrl);
      }

      this.customObjectUrl = URL.createObjectURL(file);
      this.audio.pause();
      this.audio.src = this.customObjectUrl;
      this.audio.currentTime = 0;

      this.state.isAvailable = true;
      this.state.isCustomFileLoaded = true;
      this.state.customFileName = file.name;
      this.state.playbackState = 'idle';
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      this.state.errorMessage = `Gagal memuat berkas lokal: ${err.message}`;
      this.notify();
      return false;
    }
  }

  /**
   * Putar lagu
   * Menghubungkan langsung ke HTMLAudioElement
   */
  public async play(restartFromBeginning = false): Promise<boolean> {
    this.initAudioElement();
    if (!this.audio) return false;

    const track = NATIONAL_TRACKS[this.state.currentTrackId];

    if (!this.state.isAvailable && !this.state.isCustomFileLoaded) {
      this.state.errorMessage = `Berkas audio belum tersedia di ${track.expectedFile}. Silakan tambahkan berkas MP3 atau pilih dari perangkat.`;
      this.notify();
      return false;
    }

    try {
      const targetSrc = this.customObjectUrl || track.srcMp3;
      if (!this.audio.src || !this.audio.src.includes(targetSrc)) {
        this.audio.src = targetSrc;
      }
      if (restartFromBeginning || this.state.playbackState === 'ended' || this.state.playbackState === 'idle') {
        this.audio.currentTime = 0;
      }
      await this.audio.play();
      this.state.playbackState = 'playing';
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.state.errorMessage = 'Browser membutuhkan izin sentuh pengguna. Silakan tekan tombol Putar sekali lagi.';
      } else {
        this.state.errorMessage = `Tidak dapat memutar audio: ${err.message || 'Format tidak didukung'}.`;
      }
      this.state.playbackState = this.audio.currentTime > 0 ? 'paused' : 'idle';
      this.notify();
      return false;
    }
  }

  /**
   * Jeda lagu pada detik saat ini
   */
  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.state.playbackState = 'paused';
    this.notify();
  }

  /**
   * Lanjutkan pemutaran tanpa mereset waktu
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
   * Lompat / ubah posisi detik pemutaran (seek)
   */
  public seek(seconds: number) {
    if (!this.audio || !this.state.isAvailable) return;
    const clamped = Math.max(0, Math.min(this.state.duration || seconds, seconds));
    this.audio.currentTime = clamped;
    this.state.currentTime = clamped;
    this.notify();
  }

  /**
   * Hentikan musik dan reset ke detik 00:00
   */
  public stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state.playbackState = 'idle';
    this.state.currentTime = 0;
    this.notify();
  }

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
      try {
        this.sfxCtx = new AudioCtxClass();
      } catch {
        return null;
      }
    }
    if (this.sfxCtx && this.sfxCtx.state === 'suspended') {
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
      const notes = [523.25, 659.25, 783.99];
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
