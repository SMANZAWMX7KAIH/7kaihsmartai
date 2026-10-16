import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-slate-700 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-700 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              7K
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                7KAIH SMART AI
              </p>
              <p className="text-[11px] text-slate-700 font-medium">
                7 Kebiasaan Anak Indonesia Hebat • Menuju Generasi Emas 2045
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
            <span>Bangun Pagi</span>
            <span>•</span>
            <span>Beribadah</span>
            <span>•</span>
            <span>Berolahraga</span>
            <span>•</span>
            <span>Makan Sehat</span>
            <span>•</span>
            <span>Gemar Belajar</span>
            <span>•</span>
            <span>Bermasyarakat</span>
            <span>•</span>
            <span>Tidur Cepat</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <span>Dirancang untuk kemajuan pendidikan siswa SMA</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
