import React from 'react';
import { 
  Award, 
  Crown, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Heart, 
  Star,
  Info
} from 'lucide-react';
import { BadgeItem, StudentProfile } from '../types';
import { getStudentLevel } from '../utils/storage';
import { HabitIcon } from './HabitIcon';

interface BadgesAndPointsViewProps {
  badges: BadgeItem[];
  totalPoints: number;
  streak: number;
  studentProfile: StudentProfile;
}

export const BadgesAndPointsView: React.FC<BadgesAndPointsViewProps> = ({
  badges,
  totalPoints,
  streak,
  studentProfile,
}) => {
  const studentLevel = getStudentLevel(totalPoints);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
          <Award className="w-3.5 h-3.5 text-amber-600" /> Gamifikasi Positif & Penghargaan
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Poin & Lencana Prestasi 7KAIH
        </h1>
        <p className="text-sm text-slate-700 max-w-2xl font-medium">
          Apresiasi atas setiap usaha dan komitmenmu membiasakan hal baik setiap hari. Tanpa hukuman, murni penguatan karakter positif.
        </p>
      </div>

      {/* Level Banner Card */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-2xl text-white p-6 sm:p-8 shadow-lg shadow-indigo-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-md border border-white/20 shrink-0">
              <Crown className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-extrabold">
                  LEVEL {studentLevel.level}
                </span>
                <span className="text-xs text-blue-200 font-medium">
                  {studentProfile.name || 'Siswa 7KAIH'} • {studentProfile.age > 0 ? `${studentProfile.age} Tahun` : studentProfile.grade}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                {studentLevel.title}
              </h2>
              <p className="text-xs text-blue-100">
                Lencana diraih: <strong>{unlockedCount} dari {badges.length}</strong> • Streak: <strong>{streak} Hari</strong>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-[240px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-blue-100">Progres Level Berikutnya</span>
              <span className="font-extrabold text-amber-300">{studentLevel.currentProgress}%</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${studentLevel.currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-blue-200 font-medium">
              <span>{totalPoints} Poin</span>
              <span>Target: {studentLevel.nextThreshold} Poin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy of Dignity Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-950">
            Prinsip Pendidikan Karakter: Tanpa Hukuman, Penuh Apresiasi
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Sistem 7KAIH SMART AI dirancang dengan prinsip psikologi perkembangan remaja: <strong>tidak ada pengurangan poin, tidak ada hukuman, dan tidak ada rasa malu</strong>. Setiap hari adalah lembaran baru untuk memulai kembali dengan gembira dan bangga atas setiap kebaikan kecil.
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Koleksi Lencana Karakter</span>
          </h2>
          <span className="text-xs font-semibold text-slate-700">
            {unlockedCount} / {badges.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;

            const rarityColors = {
              Pemula: 'bg-slate-100 text-slate-700 border-slate-200',
              Terampil: 'bg-blue-100 text-blue-800 border-blue-200',
              Teladan: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              Legenda: 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold',
            };

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:border-amber-300'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isUnlocked
                          ? 'bg-amber-50 text-amber-600 border border-amber-200 shadow-xs'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <HabitIcon name={badge.icon} className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rarityColors[badge.rarity]}`}>
                        {badge.rarity}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Terbuka
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Terkunci
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h3 className={`text-base font-bold ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 font-medium">
                    {badge.pointsRequired ? `Syarat: ${badge.pointsRequired} Poin` : badge.streakRequired ? `Syarat: Streak ${badge.streakRequired} Hari` : 'Syarat Khusus'}
                  </span>
                  {badge.unlockedAt && (
                    <span className="text-slate-700 text-[10px] font-medium">
                      Diraih: {badge.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Progression Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-base text-slate-900">
            Tabel Aturan Tingkat Level Karakter
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          Tingkat level didasarkan pada akumulasi total XP yang diraih dari checklist harian yang benar-benar ditandai:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Tingkat Level</th>
                <th className="py-2.5 px-3">Gelar Karakter</th>
                <th className="py-2.5 px-3">Rentang XP</th>
                <th className="py-2.5 px-3">Deskripsi Pencapaian</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { level: 1, title: 'Pejuang Kebiasaan Muda', range: '0 - 99 XP', desc: 'Langkah awal pembentukan 7KAIH secara mandiri' },
                { level: 2, title: 'Pelajar Tangguh Berkarakter', range: '100 - 249 XP', desc: 'Mulai konsisten menjaga rutinitas positif harian' },
                { level: 3, title: 'Teladan Hebat Nusantara', range: '250 - 449 XP', desc: 'Menjadi teladan disiplin bagi rekan sebaya di SMA' },
                { level: 4, title: 'Bintang 7KAIH Berprestasi', range: '450 - 699 XP', desc: 'Keseimbangan intelektual, spiritual, dan sosial prima' },
                { level: 5, title: 'Pionir Generasi Emas 2045', range: '700+ XP', desc: 'Karakter unggul paripurna menyongsong masa depan Indonesia' }
              ].map((lvl) => {
                const isCurrent = studentLevel.level === lvl.level;
                return (
                  <tr key={lvl.level} className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-blue-50/60 font-semibold' : ''}`}>
                    <td className="py-3 px-3 font-extrabold text-blue-700">Level {lvl.level}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{lvl.title}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{lvl.range}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{lvl.desc}</td>
                    <td className="py-3 px-3 text-right">
                      {isCurrent ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                          Level Anda
                        </span>
                      ) : studentLevel.level > lvl.level ? (
                        <span className="text-emerald-600 font-bold text-[10px]">
                          Tercapai ✓
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium text-[10px]">
                          Target Berikutnya
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points System Explanation & Deduplication Guarantee */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Cara Kerja Poin Bersih & Jaminan Bebas Duplikasi</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">Per Kebiasaan Harian</p>
            <p className="text-slate-700 font-medium leading-relaxed">
              Mendapatkan +15 hingga +20 poin untuk setiap kebiasaan yang dicentang. Poin dihitung <strong>maksimal satu kali per kebiasaan pada tanggal yang sama</strong>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-emerald-800">Bonus Paripurna 7/7</p>
            <p className="text-slate-700 font-medium leading-relaxed">
              Mendapatkan bonus ekstra +30 poin hanya jika seluruh 7 kebiasaan pada tanggal tersebut berhasil diselesaikan.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-blue-800">Pembatalan Bersih</p>
            <p className="text-slate-700 font-medium leading-relaxed">
              Jika tanda centang dibatalkan, poin kebiasaan tersebut langsung dikurangi secara otomatis dan akurat dari total XP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
