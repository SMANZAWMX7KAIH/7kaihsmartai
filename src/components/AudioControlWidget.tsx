import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square,
  Music, 
  Sparkles, 
  X, 
  CheckCircle2,
  AlertTriangle,
  Info,
  Flag,
  FileQuestion,
  Disc3
} from 'lucide-react';
import { 
  audioService, 
  AudioPlayerState, 
  NationalTrackId, 
  NATIONAL_TRACKS 
} from '../utils/audioService';

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

    // PENTING: Sesuai instruksi nomor 6, TIDAK ADA pemutaran otomatis saat halaman dibuka.
    // Pengguna harus secara sadar menekan tombol Putar.

    return () => {
      unsubscribe();
    };
  }, []);

  const { 
    currentTrackId, 
    playbackState, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    isAvailable, 
    isCheckingAvailability,
    errorMessage, 
    sfxEnabled, 
    sfxVolume 
  } = playerState;

  const currentTrack = NATIONAL_TRACKS[currentTrackId];
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';

  // Handler tombol utama: Putar / Jeda / Lanjutkan
  const handlePrimaryButtonClick = async () => {
    if (!isAvailable) return;
    if (isPlaying) {
      audioService.pause();
    } else if (isPaused) {
      await audioService.resume();
    } else {
      await audioService.play();
    }
  };

  const handleStop = () => {
    audioService.stop();
  };

  const handleSwitchTrack = (trackId: NationalTrackId) => {
    audioService.switchTrack(trackId);
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
    if (!isAvailable) return 'Musik Belum Tersedia';
    if (isPlaying) return '⏸ JEDA';
    if (isPaused) return '▶ LANJUTKAN';
    return `▶ PUTAR ${currentTrack.title.toUpperCase()}`;
  };

  // Teks status ketersediaan & pemutaran
  const getStatusText = () => {
    if (isCheckingAvailability) return 'Memeriksa berkas...';
    if (!isAvailable) return 'Musik belum tersedia';
    if (playbackState === 'playing') return 'Sedang diputar 🎵';
    if (playbackState === 'paused') return 'Dijeda ⏸️';
    if (playbackState === 'ended') return 'Selesai diputar';
    return 'Siap diputar';
  };

  return (
    <>
      {/* Floating Audio Button di Sudut Kiri Bawah (Tema Merah Putih Menarik) */}
      <aside aria-label="Widget Pemutar Musik Nasional" className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-xl border-2 transition-all duration-300 select-none cursor-pointer group active:scale-95 ${
            isPlaying && !isMuted
              ? 'bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white border-white/60 shadow-red-500/35 ring-2 ring-red-400/50'
              : 'bg-white/95 text-slate-800 hover:text-red-600 border-red-200/80 shadow-slate-900/10 hover:border-red-400'
          }`}
          title="Buka Pemutar Musik Nasionalisme"
          aria-label="Pemutar Musik Nasionalisme"
        >
          {isPlaying && !isMuted ? (
            <div className="flex items-end gap-0.5 h-4 w-4">
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:0ms] h-3" />
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:150ms] h-4" />
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:300ms] h-2" />
            </div>
          ) : (
            <Disc3 className={`w-4 h-4 ${isAvailable ? 'text-red-600 group-hover:rotate-45' : 'text-slate-400'} transition-transform duration-300`} />
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="hidden sm:inline font-extrabold">{currentTrack.title}</span>
            <span className="sm:hidden font-extrabold">Musik</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 border border-red-200">
              🇮🇩
            </span>
          </div>
        </button>

        {/* Quick Play/Pause/Lanjutkan Button */}
        <button
          onClick={handlePrimaryButtonClick}
          disabled={!isAvailable}
          className={`px-3 py-2.5 rounded-full shadow-lg border text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 ${
            !isAvailable
              ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-75'
              : isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 cursor-pointer'
              : isPaused
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 cursor-pointer shadow-emerald-500/20'
              : 'bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-red-500 cursor-pointer shadow-red-500/25'
          }`}
          title={getButtonLabel()}
          aria-label={getButtonLabel()}
        >
          {!isAvailable ? (
            <>
              <FileQuestion className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Belum Tersedia</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">JEDA</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">LANJUTKAN</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">PUTAR</span>
            </>
          )}
        </button>
      </aside>

      {/* Modal Lengkap Pemutar Musik Nasionalisme */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-red-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Bernuansa Merah Putih */}
            <div className="relative px-6 py-5 bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/40" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-md">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg tracking-tight leading-tight">
                    Musik Nasionalisme Pelajar 🇮🇩
                  </h3>
                  <p className="text-xs text-red-100 font-medium">
                    Pembangkit Semangat Karakter Pelajar Indonesia
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Tab Pemilih Lagu */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Pilih Lagu Nasional:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  <button
                    onClick={() => handleSwitchTrack('bangun_pemudi_pemuda')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      currentTrackId === 'bangun_pemudi_pemuda'
                        ? 'bg-white text-red-700 shadow-md ring-2 ring-red-400/40'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate w-full">Bangun Pemudi Pemuda</span>
                    <span className="text-[10px] font-semibold text-slate-700">Alfred Simanjuntak</span>
                  </button>

                  <button
                    onClick={() => handleSwitchTrack('indonesia_raya')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      currentTrackId === 'indonesia_raya'
                        ? 'bg-white text-red-700 shadow-md ring-2 ring-red-400/40'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate w-full">Indonesia Raya</span>
                    <span className="text-[10px] font-semibold text-slate-700">W.R. Soepratman</span>
                  </button>
                </div>
              </div>

              {/* Status Box & Track Card */}
              <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3.5 transition-all ${
                !isAvailable
                  ? 'bg-amber-50/70 border-amber-200'
                  : isPlaying
                  ? 'bg-linear-to-b from-red-50/50 to-white border-red-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100/80 px-2 py-0.5 rounded-md inline-block">
                      {currentTrack.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold">
                      Ciptaan: {currentTrack.composer} ({currentTrack.year})
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border shrink-0 ${
                    !isAvailable
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : isPlaying && !isMuted
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}>
                    {getStatusText()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {currentTrack.description}
                </p>

                {/* Notice jika file belum tersedia */}
                {!isAvailable && (
                  <div className="p-3.5 bg-amber-100/80 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-2 font-black text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Musik Belum Tersedia di Sistem</span>
                    </div>
                    <p className="font-medium text-[11px]">
                      Sesuai ketentuan integritas audio, file rekaman resmi untuk lagu <strong>"{currentTrack.title}"</strong> belum ditambahkan ke folder <code className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-amber-900 text-[10px]">{currentTrack.srcMp3}</code>.
                    </p>
                    <p className="text-[11px] text-amber-800 font-semibold">
                      Struktur pemutar telah disiapkan dan tombol putar akan aktif secara otomatis begitu berkas audio yang sah ditambahkan.
                    </p>
                  </div>
                )}

                {/* Progress bar visual jika file tersedia */}
                {isAvailable && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-linear-to-r from-red-600 to-rose-600 h-2.5 rounded-full transition-all duration-200"
                        style={{ 
                          width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Kontrol Utama: Putar, Jeda, Lanjutkan, Berhenti */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handlePrimaryButtonClick}
                    disabled={!isAvailable}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                      !isAvailable
                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                        : isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-amber-500/25'
                        : isPaused
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/30'
                        : 'bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white cursor-pointer shadow-red-600/30'
                    }`}
                  >
                    {!isAvailable ? (
                      <>
                        <FileQuestion className="w-4 h-4" />
                        <span>Musik Belum Tersedia</span>
                      </>
                    ) : isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>⏸ JEDA</span>
                      </>
                    ) : isPaused ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>▶ LANJUTKAN</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>▶ PUTAR {currentTrack.title.toUpperCase()}</span>
                      </>
                    )}
                  </button>

                  {/* Tombol Stop / Berhenti */}
                  {isAvailable && (isPlaying || isPaused) && (
                    <button
                      onClick={handleStop}
                      className="py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Hentikan Lagu"
                      aria-label="Hentikan"
                    >
                      <Square className="w-3.5 h-3.5 fill-slate-700" />
                      <span>STOP</span>
                    </button>
                  )}

                  {/* Tombol Mute / Unmute */}
                  <button
                    onClick={handleToggleMute}
                    disabled={!isAvailable}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      !isAvailable
                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                        : isMuted
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

                {/* Slider Kontrol Volume */}
                {isAvailable && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Volume Audio</span>
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
                  </div>
                )}
              </div>

              {/* Section 2: Efek Suara Interaktif Siswa (SFX) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Efek Suara Centang Kebiasaan
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Umpan balik audio saat kebiasaan 7KAIH dicatat
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleSfx}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
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
                  <div className="space-y-2 pt-1 border-t border-slate-200/60">
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
                    <button
                      onClick={handleTestSfx}
                      className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Uji Coba Suara Centang</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Catatan Legalitas & Transparansi */}
              <div className="p-3 bg-red-50/70 border border-red-200/70 rounded-xl text-[11px] text-red-950 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  Musik diputar secara sadar oleh pengguna tanpa autoplay otomatis. Bekerja mulus di peramban HP Android dan komputer tanpa mengganggu fitur lain atau aktivitas belajar.
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                7KAIH Smart AI • Musik Nasionalisme
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
