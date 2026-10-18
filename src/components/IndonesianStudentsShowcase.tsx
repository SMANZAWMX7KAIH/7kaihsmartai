import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Sparkles, CheckCircle2, Bot, ArrowRight, Heart } from 'lucide-react';
import bgAnimeBendera from '../assets/images/bg_anime_bendera_merah_putih_1792359577913.jpg';

interface IndonesianStudentsShowcaseProps {
  onExploreHabits?: () => void;
  onNavigateToChecklist?: () => void;
  onAskAI?: () => void;
}

export const IndonesianStudentsShowcase: React.FC<IndonesianStudentsShowcaseProps> = ({
  onExploreHabits,
  onNavigateToChecklist,
  onAskAI,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-2xl border-2 border-sky-300/60 transition-all duration-300">
      {/* 
        Aset Latar Belakang Utama:
        Ilustrasi anime sekelompok remaja Indonesia mengenakan seragam putih-merah
        membentangkan bendera Merah Putih besar di halaman sekolah dengan langit cerah.
        Menggunakan background-size: cover
      */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-100 hover:scale-[1.01]"
        style={{ backgroundImage: `url(${bgAnimeBendera})` }}
      />

      {/* Lapisan transparansi & kontras (scrim) agar teks dan tombol tetap jelas dan mudah dibaca */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/92 via-slate-900/80 to-blue-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-transparent to-slate-950/45 pointer-events-none" />

      {/* Aksen pita Merah Putih di bagian paling atas */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-red-600 via-rose-500 via-white to-sky-400 z-10" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
        {/* Left Column: Descriptive & Required Copy */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slogan Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black border border-white/30 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white inline-block animate-pulse" />
              <span className="text-amber-300 tracking-wider">ANAK HEBAT, INDONESIA KUAT!</span>
              <span className="text-white/80">🇮🇩</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-sky-200 text-[11px] font-extrabold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Semangat Pelajar Indonesia</span>
            </span>
          </div>

          {/* 
            Tulisan besar pada bagian tengah/bawah bendera:
            "7 KEBIASAAN ANAK INDONESIA HEBAT"
            Tebal dengan warna merah, putih, dan biru tua agar jelas dan mudah dibaca.
          */}
          <div className="space-y-2.5">
            <div className="inline-block p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-red-500 shadow-xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase select-none">
                <span className="text-red-600 drop-shadow-xs">7 KEBIASAAN</span>{' '}
                <span className="text-slate-900 px-1 py-0.5 rounded-md bg-slate-100 border border-slate-200">ANAK INDONESIA</span>{' '}
                <span className="text-blue-900 drop-shadow-xs">HEBAT</span>
              </h1>
            </div>
            
            <p className="text-base sm:text-lg lg:text-xl font-extrabold text-amber-300 drop-shadow-md">
              Mulai dari kebiasaan kecil, untuk masa depan besar!
            </p>
          </div>

          <p className="text-sky-50 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl drop-shadow-sm bg-slate-950/45 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xs border border-white/10">
            Bangun pagi, beribadah, berolahraga, makan bergizi seimbang, gemar belajar, bermasyarakat dengan empati, dan tidur tepat waktu. Bersama ribuan pelajar SMA di seluruh nusantara, mari wujudkan generasi unggul menuju <strong>Indonesia Emas 2045</strong>.
          </p>

          {/* Action Buttons connected to original functional handlers */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            {onNavigateToChecklist && (
              <button
                onClick={onNavigateToChecklist}
                className="px-5 py-3 rounded-2xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Mulai Checklist Hari Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {onExploreHabits && (
              <button
                onClick={onExploreHabits}
                className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs sm:text-sm border border-white/40 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-200" />
                <span>Panduan 7 Kebiasaan</span>
              </button>
            )}

            {onAskAI && (
              <button
                onClick={onAskAI}
                className="px-4 py-3 rounded-2xl bg-slate-900/75 hover:bg-slate-900/90 text-sky-200 hover:text-white font-bold text-xs border border-sky-400/40 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Asisten Cerdas AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Visual Anime Artwork of Indonesian Students holding the big Merah Putih Flag */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-slate-900 group"
          >
            {/* The high-fidelity anime illustration showing students holding the flag */}
            <img
              src={bgAnimeBendera}
              alt="Ilustrasi anime sekelompok remaja Indonesia mengenakan seragam sekolah memegang dan membentangkan bendera Merah Putih yang besar"
              className="w-full h-auto max-h-[360px] sm:max-h-[400px] object-cover object-center transition-transform duration-700 group-hover:scale-103"
              referrerPolicy="no-referrer"
            />

            {/* Micro-badge: Indonesian Flag floating top left */}
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs animate-ping" />
              <span className="text-xs font-black text-white tracking-wider flex items-center gap-1.5">
                <span>Merah Putih Berkibar</span>
                <span>🇮🇩</span>
              </span>
            </div>

            {/* Bottom Caption Pill with the banner text */}
            <div className="absolute bottom-3 inset-x-3 bg-linear-to-r from-slate-950/95 via-blue-950/90 to-slate-950/95 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 block truncate">
                    7 Kebiasaan Anak Indonesia Hebat
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-wide leading-tight truncate">
                    Anak Hebat, Indonesia Kuat!
                  </h4>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white/90 bg-white/10 px-2.5 py-1 rounded-xl border border-white/20 shrink-0">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Generasi Emas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
