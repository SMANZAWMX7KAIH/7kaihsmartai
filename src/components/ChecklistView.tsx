import React, { useState, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  Edit3, 
  History, 
  Smile, 
  Check, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Info,
  AlertTriangle,
  X,
  Quote
} from 'lucide-react';
import { DailyLog, HabitId } from '../types';
import { HABITS_LIST, HABIT_MOTIVATIONAL_QUOTES } from '../data/habitsData';
import { HabitIcon } from './HabitIcon';
import { 
  formatDateKey, 
  formatIndonesianDate, 
  exportDataBackup, 
  importDataBackup, 
  resetAllData 
} from '../utils/storage';

interface ChecklistViewProps {
  currentDateKey: string;
  onSelectDate: (dateKey: string) => void;
  dayLog: DailyLog;
  allLogs: Record<string, DailyLog>;
  onToggleHabit: (habitId: HabitId, completed: boolean, option?: string, notes?: string) => void;
  onUpdateDailyMood: (mood: 'semangat' | 'senang' | 'fokus' | 'lelah' | 'butuh_motivasi') => void;
  onUpdateReflection: (reflection: string) => void;
  onDataResetOrImported?: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  currentDateKey,
  onSelectDate,
  dayLog,
  allLogs,
  onToggleHabit,
  onUpdateDailyMood,
  onUpdateReflection,
  onDataResetOrImported,
}) => {
  const [editingNotesHabitId, setEditingNotesHabitId] = useState<HabitId | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [viewHistoryTable, setViewHistoryTable] = useState<boolean>(false);
  const [showStorageNotice, setShowStorageNotice] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = HABITS_LIST.filter(
    (h) => dayLog.habits && dayLog.habits[h.id]?.completed
  ).length;

  const completionPercent = Math.round((completedCount / 7) * 100);

  const isToday = true;

  // Past dates list sorted descending
  const sortedDates = Object.keys(allLogs).sort().reverse();

  const handleOpenNoteModal = (habitId: HabitId) => {
    setEditingNotesHabitId(habitId);
    setTempNoteText(dayLog.habits[habitId]?.notes || '');
  };

  const handleSaveNote = () => {
    if (editingNotesHabitId) {
      const currentState = dayLog.habits[editingNotesHabitId];
      onToggleHabit(
        editingNotesHabitId, 
        currentState?.completed ?? false, 
        currentState?.selectedOption, 
        tempNoteText
      );
      setEditingNotesHabitId(null);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataBackup(content);
        if (success) {
          alert('Data berhasil dipulihkan dari cadangan JSON!');
          if (onDataResetOrImported) onDataResetOrImported();
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    if (onDataResetOrImported) onDataResetOrImported();
    alert('Data checklist berhasil diatur ulang ke kondisi awal (0%).');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Storage Architecture & Privacy Disclosure Banner */}
      {showStorageNotice && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 sm:p-5 text-xs text-blue-900 shadow-xs relative">
          <button
            onClick={() => setShowStorageNotice(false)}
            className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 p-1 rounded-md"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 pr-6">
              <h3 className="font-extrabold text-sm text-blue-950 flex items-center gap-1.5">
                <span>Penyimpanan Lokal & Perlindungan Privasi Siswa</span>
              </h3>
              <p className="text-slate-700 leading-relaxed font-medium">
                Sesuai arsitektur keamanan, seluruh data checklist dan catatan refleksi disimpan secara <strong>lokal di peramban (LocalStorage) perangkat Anda</strong>. Data tidak disimpan atau diunggah ke basis data server publik untuk melindungi kerahasiaan siswa.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={exportDataBackup}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cadangkan Data (JSON)</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pulihkan Data</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data Bersih</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Header - Terkunci Otomatis Sesuai Tanggal Hari Ini di HP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20 shrink-0">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatIndonesianDate(currentDateKey)}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[11px] border border-red-200 flex items-center gap-1">
                <span>🇮🇩</span>
                <span>Hari Ini (Waktu HP)</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Ditandai: <strong className="text-slate-900 font-black">{completedCount} dari 7 kebiasaan</strong> ({completionPercent}%) • <strong className="text-red-700 font-black">+{dayLog.pointsEarned} Poin</strong>
            </p>
          </div>
        </div>

        {/* Tombol Lihat Riwayat Catatan Masa Lalu (Read-only) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setViewHistoryTable(!viewHistoryTable)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              viewHistoryTable
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{viewHistoryTable ? 'Tutup Arsip Riwayat' : 'Lihat Arsip Riwayat'}</span>
          </button>
        </div>
      </div>

      {/* History Overview Dropdown Table */}
      {viewHistoryTable && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Riwayat Pelaksanaan Kebiasaan Nyata</span>
            </h3>
            <span className="text-xs text-slate-700 font-medium">
              Berdasarkan tanggal yang tersimpan
            </span>
          </div>

          {sortedDates.length === 0 ? (
            <p className="text-xs text-slate-700 text-center py-4 font-medium">
              Belum ada riwayat tanggal yang dicatat.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Kebiasaan Terlaksana</th>
                    <th className="py-2.5 px-3">Poin</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedDates.map((dKey) => {
                    const log = allLogs[dKey];
                    const done = HABITS_LIST.filter(h => log.habits?.[h.id]?.completed).length;
                    const isCurrent = dKey === currentDateKey;
                    return (
                      <tr 
                        key={dKey} 
                        className={`hover:bg-slate-50 transition-colors ${isCurrent ? 'bg-blue-50/50 font-semibold' : ''}`}
                      >
                        <td className="py-2.5 px-3 text-slate-900">
                          {formatIndonesianDate(dKey)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{done} / 7</span>
                            <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full transition-all" 
                                style={{ width: `${(done / 7) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-600">
                          +{log.pointsEarned || 0} XP
                        </td>
                        <td className="py-2.5 px-3">
                          {done === 7 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Lengkap 7/7 🌟
                            </span>
                          ) : done >= 4 ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                              Baik ({done}/7)
                            </span>
                          ) : done > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Proses ({done}/7)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                              Belum ditandai (0/7)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isCurrent ? (
                            <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                              Hari Ini
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-500">
                              Arsip Tersimpan
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Habits Checklist Cards */}
      <div className="space-y-3.5">
        {HABITS_LIST.map((habit) => {
          const habitState = dayLog.habits?.[habit.id] || { completed: false };
          const isDone = Boolean(habitState.completed);

          return (
            <div
              key={habit.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-200/50'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Button, icon, and details */}
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Interactive checklist button with clear toggle */}
                  <button
                    onClick={() => onToggleHabit(habit.id, !isDone)}
                    className="mt-0.5 focus:outline-hidden transition-transform active:scale-90"
                    title={isDone ? 'Batalkan tanda kebiasaan ini' : 'Tandai sudah selesai'}
                    aria-label={`Tandai ${habit.title}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-8 h-8 text-slate-300 hover:text-blue-500 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        #{habit.order}
                      </span>
                      <h2 className={`text-base font-extrabold transition-colors ${
                        isDone ? 'text-slate-900' : 'text-slate-800'
                      }`}>
                        {habit.title}
                      </h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${habit.badgeColor}`}>
                        {habit.category}
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        +{habit.points} Poin
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Selesai ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {habit.tagline}
                    </p>

                    {/* Motivasi 7KAIH */}
                    <div className="mt-1.5 p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 italic font-medium leading-relaxed flex items-start gap-1.5">
                      <Quote className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span>"{HABIT_MOTIVATIONAL_QUOTES[habit.id]}"</span>
                    </div>

                    {habitState.timestamp && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Ditandai pukul {habitState.timestamp} WIB
                      </p>
                    )}

                    {/* Note display if any */}
                    {habitState.notes && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span>Catatan: {habitState.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Sub-activity selection & actions */}
                <div className="sm:max-w-xs w-full flex flex-col gap-2 shrink-0">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Variasi Kegiatan:
                    </label>
                    <button
                      onClick={() => onToggleHabit(habit.id, !isDone)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                        isDone
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isDone ? 'Batalkan Tanda' : 'Tandai Selesai'}
                    </button>
                  </div>

                  <select
                    value={habitState.selectedOption || ''}
                    onChange={(e) => {
                      onToggleHabit(habit.id, true, e.target.value, habitState.notes);
                    }}
                    className="text-xs rounded-lg border border-slate-200 bg-white p-2 text-slate-700 font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">Pilih kegiatan yang dilakukan...</option>
                    {habit.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleOpenNoteModal(habit.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-end pt-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{habitState.notes ? 'Ubah Catatan' : '+ Tambah Catatan Refleksi'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Reflection & Mood Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Smile className="w-4 h-4 text-amber-500" />
          <span>Suasana Hati & Refleksi Harian</span>
        </h3>

        {/* Mood buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'semangat', label: '🔥 Sangat Bersemangat' },
            { id: 'senang', label: '😊 Senang & Bahagia' },
            { id: 'fokus', label: '🎯 Fokus & Produktif' },
            { id: 'lelah', label: '☕ Cukup Lelah' },
            { id: 'butuh_motivasi', label: '💪 Butuh Suntikan Semangat' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => onUpdateDailyMood(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dayLog.dailyMood === m.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Reflection textarea */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Catatan Perasaan atau Rencana Perbaikan untuk Besok:
          </label>
          <textarea
            rows={2}
            value={dayLog.dailyReflection || ''}
            onChange={(e) => onUpdateReflection(e.target.value)}
            placeholder="Tuliskan refleksi singkat: apa kebiasaan paling berkesan hari ini? Hal apa yang ingin diperbaiki besok?"
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 resize-none font-medium"
          />
        </div>
      </div>

      {/* Note Edit Modal */}
      {editingNotesHabitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-base text-slate-900">
              Catatan untuk Kebiasaan: {HABITS_LIST.find(h => h.id === editingNotesHabitId)?.title}
            </h4>
            <p className="text-xs text-slate-700 font-medium">
              Contoh: durasi olahraga, judul buku yang dibaca, atau bentuk bantuan sosial yang dilakukan.
            </p>
            <textarea
              rows={3}
              value={tempNoteText}
              onChange={(e) => setTempNoteText(e.target.value)}
              placeholder="Tulis catatanmu di sini..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500 font-medium"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNotesHabitId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-extrabold text-base text-slate-900">
                Konfirmasi Reset Data Bersih
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Apakah Anda yakin ingin menghapus seluruh catatan dan mengulang dari 0%? Tindakan ini akan mengosongkan seluruh riwayat dan lencana lokal. Anda dapat mencadangkan berkas JSON terlebih dahulu jika diperlukan.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Batalkan
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Ya, Reset ke 0%
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
