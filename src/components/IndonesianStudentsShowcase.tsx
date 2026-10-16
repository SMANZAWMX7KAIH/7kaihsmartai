import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Sparkles, Award, Heart } from 'lucide-react';
import studentsImg from '../assets/images/indonesian_students_patriotism_1792160881168.jpg';

interface IndonesianStudentsShowcaseProps {
  onExploreHabits?: () => void;
}

export const IndonesianStudentsShowcase: React.FC<IndonesianStudentsShowcaseProps> = ({
  onExploreHabits,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-700 via-rose-700 to-red-800 text-white shadow-xl border border-red-500/30">
      {/* Decorative national ribbon background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8">
        {/* Left Column: Descriptive & Patriotic Motto */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 shadow-xs">
            <span className="text-sm">🇮🇩</span>
            <span>Generasi Penerus Bangsa Indonesia</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Pelajar Hebat Berkarakter Luhur Menuju Indonesia Emas 2045
          </h2>

          <p className="text-red-100 text-xs sm:text-sm leading-relaxed font-medium">
            Bersama siswa-siswi SMA seluruh nusantara, mari wujudkan 7 Kebiasaan Anak Indonesia Hebat setiap hari: bangun pagi, beribadah tekun, berolahraga, makan bergizi, gemar belajar, bermasyarakat, dan tidur cukup.
          </p>

          {/* Official Book Highlight Badge */}
          <div className="p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Panduan Resmi Karakter:</span>
            </div>
            <p className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
              <span>“7 KEBIASAAN ANAK INDONESIA HEBAT”</span>
            </p>
            <p className="text-[11px] text-red-100 font-medium">
              Pedoman kebiasaan positif holistik bagi seluruh pelajar Indonesia.
            </p>
          </div>

          {onExploreHabits && (
            <button
              onClick={onExploreHabits}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Pelajari Panduan 7 Kebiasaan</span>
            </button>
          )}
        </div>

        {/* Right Column: Visual Artwork of Indonesian Students */}
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-slate-900 group"
          >
            {/* The high-fidelity digital illustration of students */}
            <img
              src={studentsImg}
              alt="Murid-murid Indonesia memegang bendera Merah Putih dan buku 7 Kebiasaan Anak Indonesia Hebat"
              className="w-full h-auto max-h-[380px] sm:max-h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />

            {/* Micro-animated Indonesian Small Flag Ribbon */}
            <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs animate-ping" />
              <span className="text-xs font-black text-white tracking-wider flex items-center gap-1.5">
                <span>Merah Putih Berkibar</span>
                <span className="inline-block animate-bounce [animation-duration:1.5s]">🇮🇩</span>
              </span>
            </div>

            {/* Guaranteed Crystal-Clear Exact Book Title Plate */}
            {/* Memastikan tulisan persis “7 KEBIASAAN ANAK INDONESIA HEBAT” terbaca jelas 100% tanpa distorsi huruf */}
            <div className="absolute bottom-3 inset-x-3 bg-linear-to-r from-red-900/95 via-red-800/95 to-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-white/30 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white text-red-700 flex items-center justify-center font-black shadow-md shrink-0">
                  <BookOpen className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                    Buku Panduan Karakter Pelajar
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-wide leading-tight">
                    7 KEBIASAAN ANAK INDONESIA HEBAT
                  </h4>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white/90 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 shrink-0">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>Generasi Emas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
