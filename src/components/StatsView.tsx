import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Award, 
  Sparkles, 
  Printer, 
  FileText, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Check,
  X,
  Smile,
  BookOpen,
  Info
} from 'lucide-react';
import { DailyLog, HabitId, StudentProfile } from '../types';
import { HABITS_LIST } from '../data/habitsData';
import { HabitIcon } from './HabitIcon';
import { 
  getWeeklyTrendData, 
  calculateTotalPoints, 
  getStudentLevel, 
  formatIndonesianDate,
  LEVEL_RULES 
} from '../utils/storage';

interface StatsViewProps {
  allLogs: Record<string, DailyLog>;
  totalPoints: number;
  streak: number;
  studentProfile: StudentProfile;
  onNavigateToChecklist?: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  allLogs,
  totalPoints,
  streak,
  studentProfile,
  onNavigateToChecklist,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'grafik' | 'rapor'>('grafik');

  // Compute real 7-day trend
  const { days: weeklyDays, hasAnyRecordedData, totalCompletedInWeek } = getWeeklyTrendData(allLogs);

  // Real recorded date keys
  const recordedDateKeys = Object.keys(allLogs).sort().reverse();
  const totalRecordedDates = recordedDateKeys.length;

  // Real habit-by-habit frequencies
  const habitStats = HABITS_LIST.map((habit) => {
    let completedCount = 0;
    recordedDateKeys.forEach((key) => {
      if (allLogs[key]?.habits?.[habit.id]?.completed) {
        completedCount++;
      }
    });

    const frequencyRate = totalRecordedDates > 0
      ? Math.round((completedCount / totalRecordedDates) * 100)
      : 0;

    return {
      habit,
      completedCount,
      frequencyRate,
    };
  });

  // Calculate real total completions
  const totalChecks = habitStats.reduce((acc, curr) => acc + curr.completedCount, 0);
  const totalPossibleChecks = totalRecordedDates * 7;
  const overallAverageRate = totalPossibleChecks > 0
    ? Math.round((totalChecks / totalPossibleChecks) * 100)
    : 0;

  const studentLevel = getStudentLevel(totalPoints);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5" /> Laporan Perkembangan Siswa 7KAIH
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan & Statistik Pembiasaan
          </h1>
          <p className="text-sm text-slate-700 font-medium">
            Data riil tanpa manipulasi yang dihitung langsung dari checklist harian yang Anda tandai.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveReportTab('grafik')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReportTab === 'grafik'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik Mingguan</span>
          </button>
          <button
            onClick={() => setActiveReportTab('rapor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReportTab === 'rapor'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lembar Rapor Karakter</span>
          </button>
        </div>
      </div>

      {activeReportTab === 'grafik' ? (
        /* 1. GRAFIK & STATISTIK VIEW */
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Rata-rata Ketercapaian
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {overallAverageRate}%
                </p>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  {totalChecks} kebiasaan terselesaikan
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Streak Konsistensi
                </p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {streak} Hari
                </p>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  {streak > 0 ? 'Rutinitas aktif terjaga' : 'Mulai tanda hari ini'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                <Flame className="w-6 h-6 fill-amber-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Poin XP Akurat
                </p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">
                  {totalPoints} XP
                </p>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  Level {studentLevel.level}: {studentLevel.title}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Laporan Mingguan: 7-Day Chart with Empty State Notification */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Grafik Pelaksanaan 7 Hari Terakhir</span>
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  Menampilkan jumlah kebiasaan yang terlaksana (skala 0 s/d 7) pada data yang tersimpan
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                  <span>7/7 Paripurna</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                  <span>Terlaksana</span>
                </div>
              </div>
            </div>

            {/* Empty state if no habits have been checked in the past 7 days */}
            {!hasAnyRecordedData ? (
              <div className="py-12 px-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Belum Ada Catatan dalam 7 Hari Terakhir
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Grafik mingguan akan otomatis tergambar begitu Anda menandai kebiasaan yang telah dilakukan di halaman checklist.
                  </p>
                </div>
                {onNavigateToChecklist && (
                  <button
                    onClick={onNavigateToChecklist}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Buka Checklist Sekarang</span>
                  </button>
                )}
              </div>
            ) : (
              /* Real Bar Chart */
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 border-b border-slate-200 px-2 sm:px-4">
                  {weeklyDays.map((day, idx) => {
                    const heightPercent = day.completedCount > 0
                      ? Math.round((day.completedCount / 7) * 100)
                      : 4; // minimal visible baseline
                    const isPerfect = day.completedCount === 7;

                    return (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg py-1 px-2.5 pointer-events-none whitespace-nowrap z-20 shadow-md">
                          <div>{day.dateKey}</div>
                          <div>{day.completedCount} / 7 Kebiasaan ({day.percentage}%)</div>
                          <div className="text-emerald-400 font-bold">+{day.points} Poin</div>
                        </div>

                        {/* Number pill above bar */}
                        <span className="text-[11px] font-bold text-slate-700 mb-1">
                          {day.completedCount}
                        </span>

                        {/* Bar */}
                        <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all h-40">
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                              day.completedCount === 0
                                ? 'bg-slate-200'
                                : isPerfect
                                ? 'bg-linear-to-t from-emerald-600 to-teal-400'
                                : 'bg-linear-to-t from-blue-600 to-cyan-400'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>

                        {/* Day label */}
                        <span className="text-[11px] font-bold text-slate-700 mt-2">
                          {day.dayLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-700 text-center mt-3 font-medium">
                  Total kebiasaan terlaksana dalam minggu ini: <strong>{totalCompletedInWeek} kegiatan</strong>
                </p>
              </div>
            )}
          </div>

          {/* Habit-by-habit Breakdown and Level Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habit Completion Table (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Frekuensi Ketercapaian per Pilar 7KAIH
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  Dihitung berdasarkan jumlah tanda checklist yang benar-benar tercatat dalam riwayat Anda
                </p>
              </div>

              <div className="space-y-4">
                {habitStats.map((item) => (
                  <div key={item.habit.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                          <HabitIcon name={item.habit.icon} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-800">
                          {item.habit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-medium">
                          {item.completedCount} kali
                        </span>
                        <span className="font-bold text-blue-700 w-12 text-right">
                          {item.frequencyRate}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.frequencyRate >= 80
                            ? 'bg-emerald-500'
                            : item.frequencyRate >= 50
                            ? 'bg-blue-500'
                            : item.frequencyRate > 0
                            ? 'bg-amber-400'
                            : 'bg-slate-200'
                        }`}
                        style={{ width: `${item.frequencyRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progression Rules Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="font-extrabold text-sm uppercase tracking-wide">
                  Aturan Tingkat Level Karakter
                </h2>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Level dihitung secara transparan dari akumulasi poin kebiasaan tanpa pengurangan atau hukuman:
              </p>

              <div className="space-y-2">
                {LEVEL_RULES.map((rule) => {
                  const isCurrent = studentLevel.level === rule.level;
                  return (
                    <div
                      key={rule.level}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className={isCurrent ? 'text-blue-900' : 'text-slate-800'}>
                          Level {rule.level}: {rule.title}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border text-slate-700 font-mono">
                          {rule.maxXP === Infinity ? `${rule.minXP}+ XP` : `${rule.minXP} - ${rule.maxXP} XP`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-1 font-medium">
                        {rule.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. LEMBAR RAPOR KARAKTER SISWA (RESMI & BISA DICETAK) */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:p-0 print:border-none print:shadow-none">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-extrabold text-base text-slate-900">
                Format Lembar Rapor Pembiasaan Karakter Siswa (P5)
              </h2>
            </div>
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF Rapor</span>
            </button>
          </div>

          {/* Rapor Document Body */}
          <div className="space-y-6">
            {/* Header Sekolah */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
                LAPORAN PELAKSANAAN 7 KEBIASAAN ANAK INDONESIA HEBAT (7KAIH)
              </h3>
              <p className="text-xs text-slate-700 font-semibold">
                PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5) • KURIKULUM MERDEKA
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {studentProfile.school}
              </p>
            </div>

            {/* Biodata Siswa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-medium">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nama Lengkap</span>
                <span className="font-bold text-slate-900">{studentProfile.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Kelas</span>
                <span className="font-bold text-slate-900">{studentProfile.grade}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">NISN</span>
                <span className="font-mono font-bold text-slate-900">{studentProfile.nisn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Capaian Level</span>
                <span className="font-bold text-blue-700">Level {studentLevel.level} ({totalPoints} XP)</span>
              </div>
            </div>

            {/* Matrix 7 Hari Terakhir */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                I. Matriks Pelaksanaan 7 Hari Terakhir
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                      <th className="p-2 border-r border-slate-300">Pilar Kebiasaan 7KAIH</th>
                      {weeklyDays.map((d, i) => (
                        <th key={i} className="p-2 text-center border-r border-slate-300 whitespace-nowrap">
                          {d.dayLabel}<br />
                          <span className="text-[10px] font-normal text-slate-500">{d.dateKey.slice(5)}</span>
                        </th>
                      ))}
                      <th className="p-2 text-center font-bold">Frekuensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {HABITS_LIST.map((h) => {
                      let habitDoneCount = 0;
                      return (
                        <tr key={h.id} className="hover:bg-slate-50">
                          <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                            #{h.order} {h.title}
                          </td>
                          {weeklyDays.map((d, i) => {
                            const isDone = Boolean(allLogs[d.dateKey]?.habits?.[h.id]?.completed);
                            if (isDone) habitDoneCount++;
                            return (
                              <td key={i} className="p-2 text-center border-r border-slate-300">
                                {isDone ? (
                                  <span className="inline-block text-emerald-600 font-bold">✓</span>
                                ) : (
                                  <span className="inline-block text-slate-300">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-2 text-center font-bold text-blue-700">
                            {habitDoneCount} / 7
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-blue-50/70 font-extrabold border-t-2 border-slate-300">
                      <td className="p-2 border-r border-slate-300">Total Selesai Harian</td>
                      {weeklyDays.map((d, i) => (
                        <td key={i} className="p-2 text-center border-r border-slate-300 font-bold text-blue-800">
                          {d.completedCount} / 7
                        </td>
                      ))}
                      <td className="p-2 text-center font-black text-emerald-700">
                        {totalCompletedInWeek} / 49
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekapitulasi Catatan Refleksi Siswa */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                II. Catatan Refleksi & Pembiasaan Siswa
              </h4>
              <div className="space-y-2">
                {weeklyDays.filter(d => d.hasEntry).length === 0 ? (
                  <p className="text-xs text-slate-700 italic p-3 bg-slate-50 rounded-lg border">
                    Belum ada catatan refleksi yang ditulis pada minggu ini.
                  </p>
                ) : (
                  weeklyDays.filter(d => allLogs[d.dateKey]?.dailyReflection || allLogs[d.dateKey]?.dailyMood).map((d) => {
                    const log = allLogs[d.dateKey];
                    return (
                      <div key={d.dateKey} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{formatIndonesianDate(d.dateKey)}</span>
                          {log?.dailyMood && (
                            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Suasana Hati: {log.dailyMood}
                            </span>
                          )}
                        </div>
                        {log?.dailyReflection && (
                          <p className="text-slate-700 italic font-medium">
                            "{log.dailyReflection}"
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kolom Pengesahan Tanda Tangan */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-slate-800 font-medium">
              <div className="space-y-16">
                <p>Orang Tua / Wali Murid,</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[11px] text-slate-500">(Nama Terang & Tanda Tangan)</p>
              </div>
              <div className="space-y-16">
                <p>Siswa yang Bersangkutan,</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[11px] font-bold text-slate-900">{studentProfile.name}</p>
              </div>
              <div className="space-y-16">
                <p>Wali Kelas / Guru Pembina,</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[11px] text-slate-500">(NIP / NUPTK)</p>
              </div>
            </div>

            {/* Catatan Privasi & Legalitas */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-700 text-center font-medium">
              Laporan Karakter ini diverifikasi mandiri oleh siswa pada platform 7 KEBIASAAN ANAK INDONESIA HEBAT. Data tersimpan secara lokal pada peramban perangkat siswa demi menjaga privasi dan keamanan data anak.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
