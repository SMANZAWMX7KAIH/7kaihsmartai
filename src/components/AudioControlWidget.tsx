import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  X, 
  CheckCircle2,
  AlertTriangle,
  Info,
  Flag
} from 'lucide-react';
import { audioService, AudioPlayerState } from '../utils/audioService';

function formatTime(sec: number): string {
  if (isNaN(sec) || sec <= 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const AudioControlWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioService.getState());

  useEffect(() => {
    // Berlangganan status audio yang disinkronkan langsung dari event HTMLAudioElement
    const unsubscribe = audioService.subscribe((state) => {
      setPlayerState(state);
    });

    // Upayakan autoplay saat website dibuka
    const timer = setTimeout(() => {
      audioService.attemptAutoplay();
    }, 600);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const { playbackState, currentTime, duration, volume, isMuted, isAutoplayBlocked, errorMessage, sfxEnabled, sfxVolume } = playerState;

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isIdleOrEnded = playbackState === 'idle' || playbackState === 'ended';

  // Handler tombol utama: Putar / Jeda / Lanjutkan
  const handlePrimaryButtonClick = async () => {
    if (isPlaying) {
      audioService.pause();
    } else if (isPaused) {
      await audioService.resume();
    } else {
      await audioService.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioService.setVolume(val);
  };

  const handleToggleMute = () => {
    audioService.toggleMute();
  };

  const handleToggleSfx = () => {
    audioService.toggleSfx();
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioService.setSfxVolume(val);
  };

  const handleTestSfx = () => {
    audioService.playHabitCheckSFX();
  };

  // Label tombol utama sesuai status riil
  const getButtonLabel = () => {
    if (isPlaying) return '⏸ JEDA';
    if (isPaused) return '▶ LANJUTKAN';
    return '▶ PUTAR INDONESIA RAYA';
  };

  // Teks status riil
  const getStatusText = () => {
    if (playbackState === 'playing') return 'Sedang diputar 🎵';
    if (playbackState === 'paused') return 'Dijeda ⏸️';
    if (playbackState === 'ended') return 'Selesai diputar';
    if (playbackState === 'error') return 'Gagal memuat berkas';
    return 'Siap diputar';
  };

  return (
    <>
      {/* 1. Autoplay Blocked Banner - Tampil HANYA jika browser memblokir autoplay bersuara */}
      {isAutoplayBlocked && !isPlaying && (
        <div className="fixed top-20 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md animate-in slide-in-from-top duration-300">
          <div className="bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border-2 border-white/40 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                🇮🇩
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold tracking-tight">
                  Instrumen Indonesia Raya 🇮🇩
                </p>
                <p className="text-[11px] text-red-100 font-medium">
                  Sentuh tombol untuk memulai instrumen kebangsaan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrimaryButtonClick}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-red-700" />
                <span>▶ PUTAR INDONESIA RAYA</span>
              </button>

              <button
                onClick={() => audioService.dismissAutoplayBanner()}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-xs"
                title="Tutup notifikasi"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Audio Button di Sudut Kiri Bawah */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg border transition-all duration-200 select-none ${
            isPlaying && !isMuted
              ? 'bg-linear-to-r from-red-600 to-rose-600 text-white border-white/50 shadow-red-500/30 ring-2 ring-red-400/50'
              : 'bg-white/95 text-slate-800 hover:text-red-600 border-slate-200 shadow-slate-900/10 hover:shadow-md'
          }`}
          title="Buka Pemutar Instrumen Indonesia Raya"
          aria-label="Pemutar Audio"
        >
          {isPlaying && !isMuted ? (
            <div className="flex items-end gap-0.5 h-4 w-4">
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:0ms] h-3" />
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:150ms] h-4" />
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:300ms] h-2" />
            </div>
          ) : (
            <Music className="w-4 h-4 text-red-600" />
          )}

          <span className="text-xs font-bold hidden sm:inline">
            {isPlaying && !isMuted ? 'Indonesia Raya (Memutar) 🇮🇩' : 'Indonesia Raya 🇮🇩'}
          </span>
        </button>

        {/* Quick One-Touch Button: Putar / Jeda / Lanjutkan */}
        <button
          onClick={handlePrimaryButtonClick}
          className={`px-3 py-2.5 rounded-full shadow-md border text-xs font-black transition-all flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-amber-600 text-white border-amber-500 hover:bg-amber-700'
              : 'bg-red-600 text-white border-red-500 hover:bg-red-700'
          }`}
          title={getButtonLabel()}
          aria-label={getButtonLabel()}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">JEDA</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isPaused ? 'LANJUTKAN' : 'PUTAR'}</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Panel Modal Lengkap Pemutar Audio Indonesia Raya */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Bernuansa Merah Putih */}
            <div className="px-5 py-4 bg-linear-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight leading-tight">
                    Instrumen Indonesia Raya 🇮🇩
                  </h3>
                  <p className="text-xs text-red-100 font-medium">
                    Lagu Kebangsaan Republik Indonesia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Pesan Kesalahan jika File Tidak Ditemukan */}
              {errorMessage && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Informasi Berkas Audio:</p>
                    <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Detail Sumber Rekaman Resmi */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Sumber Rekaman Asli
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">
                      United States Navy Band (Public Domain)
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Komposisi: Wage Rudolf Soepratman (1928)
                    </p>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isPlaying && !isMuted
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {getStatusText()}
                  </span>
                </div>

                {/* Indikator Waktu Berjalan & Durasi Total Rekaman */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 109)}</span>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-200"
                      style={{ 
                        width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Tombol Utama: Putar / Jeda / Lanjutkan */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handlePrimaryButtonClick}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                      isPlaying
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>⏸ JEDA</span>
                      </>
                    ) : isPaused ? (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>▶ LANJUTKAN</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>▶ PUTAR INDONESIA RAYA</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleToggleMute}
                    className={`p-3 rounded-xl border transition-colors ${
                      isMuted
                        ? 'bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isMuted ? 'Bunyikan (Unmute)' : 'Senyapkan (Mute)'}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Slider Kontrol Volume 0% - 100% */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Volume Audio Rekaman</span>
                    <span className="font-mono">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    aria-label="Slider Volume"
                  />
                  <div className="flex justify-between text-[10px] text-slate-700 font-semibold px-0.5">
                    <span>0% (Hening)</span>
                    <span>50%</span>
                    <span>100% (Normal)</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Efek Suara Interaktif Siswa (SFX) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">
                        Efek Suara Centang Kebiasaan
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Umpan balik audio saat kebiasaan dicentang
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleSfx}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      sfxEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                    aria-label="Aktifkan Efek Suara"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        sfxEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {sfxEnabled && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                      <span>Volume Efek Suara</span>
                      <span className="font-mono">{Math.round(sfxVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={sfxVolume}
                      onChange={handleSfxVolumeChange}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                  </div>
                )}

                <div className="pt-1">
                  <button
                    onClick={handleTestSfx}
                    disabled={!sfxEnabled}
                    className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Uji Coba Suara Centang</span>
                  </button>
                </div>
              </div>

              {/* Keterangan Transparansi Teknis */}
              <div className="p-3 bg-red-50/70 border border-red-200/70 rounded-xl text-[11px] text-red-900 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  Musik diputar langsung melalui <strong>HTMLAudioElement</strong> memutar berkas rekaman instrumen orkestra asli tanpa pemrosesan osilator sintetik. Berkas tersimpan di folder <code className="bg-red-100 px-1 py-0.5 rounded font-mono text-[10px]">/public/audio/indonesia-raya.mp3</code>.
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
