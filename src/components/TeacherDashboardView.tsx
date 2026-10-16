import React, { useState } from 'react';
import { 
  School, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Download, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  Award,
  Filter,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_CLASS_STUDENTS } from '../data/habitsData';
import { ClassStudentData } from '../types';

export const TeacherDashboardView: React.FC = () => {
  const [students, setStudents] = useState<ClassStudentData[]>(INITIAL_CLASS_STUDENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<ClassStudentData | null>(null);
  const [teacherNoteInput, setTeacherNoteInput] = useState<string>('');

  // AI Teacher Pedagogical Insights
  const [isGeneratingAiInsights, setIsGeneratingAiInsights] = useState<boolean>(false);
  const [aiInsights, setAiInsights] = useState<{
    summary: string;
    recommendations: string[];
    actionPlan: string;
  } | null>({
    summary: 'Kelas XI MIPA 1 menunjukkan keterlibatan luar biasa pada kebiasaan Beribadah (96%) dan Gemar Belajar (92%). Siswa aktif berkolaborasi dalam tugas kelompok.',
    recommendations: [
      'Galakkan kampanye "Matikan Gawai Pukul 21.30" melalui grup wali murid untuk membantu siswa mengatasi tantangan tidur larut malam.',
      'Sediakan sesi "Peregangan Aktif 5 Menit" di kelas sebelum mata pelajaran jam ke-4 dimulai.',
      'Apresiasi siswa berprestasi karakter dengan piagam digital mingguan "Bintang 7KAIH".'
    ],
    actionPlan: 'Fokus pembinaan minggu depan adalah menjaga stamina fisik dan ritme tidur sehat tanpa membebani siswa.'
  });

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNoteModal = (student: ClassStudentData) => {
    setSelectedStudentForNote(student);
    setTeacherNoteInput(student.teacherNote || '');
  };

  const handleSaveTeacherNote = () => {
    if (selectedStudentForNote) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudentForNote.id ? { ...s, teacherNote: teacherNoteInput } : s
        )
      );
      setSelectedStudentForNote(null);
    }
  };

  const handleFetchAiInsights = async () => {
    setIsGeneratingAiInsights(true);
    try {
      const res = await fetch('/api/gemini/teacher-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: 'Kelas XI MIPA 1',
          totalStudents: 36,
          habitCompletionStats: {
            'Beribadah': 96,
            'Gemar Belajar': 92,
            'Bermasyarakat': 88,
            'Makan Sehat': 85,
            'Bangun Pagi': 82,
            'Berolahraga': 72,
            'Tidur Cepat': 65
          },
          topStrengths: ['Beribadah', 'Gemar Belajar'],
          lowHabits: ['Tidur Cepat', 'Berolahraga']
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (e) {
      console.error('Error fetching teacher insights:', e);
    } finally {
      setIsGeneratingAiInsights(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Nama Siswa', 'NISN', 'Kelas', 'Partisipasi Mingguan (%)', 'Total Poin', 'Streak', 'Kebiasaan Terkuat', 'Catatan Guru'];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${s.nisn}"`,
      `"${s.grade}"`,
      s.weeklyAttendanceRate,
      s.totalPoints,
      s.streak,
      `"${s.strongestHabit}"`,
      `"${s.teacherNote || '-'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Laporan_7KAIH_Kelas_XI_MIPA_1.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <School className="w-3.5 h-3.5" /> Portal Evaluasi Guru & Wali Kelas
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Pelaksanaan 7KAIH Siswa
          </h1>
          <p className="text-sm text-slate-700 font-medium">
            Rancangan instrumen pemantauan karakter untuk Rapor P5 (Projek Penguatan Profil Pelajar Pancasila).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Kelas Binaan
          </p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            Kelas XI MIPA 1
          </p>
          <p className="text-xs text-slate-700 mt-1 font-medium">
            Wali Kelas: Dra. Endang Sri Wahyuni, M.Pd
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Partisipasi Aktif
          </p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            92.4%
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-semibold">
            34 dari 36 siswa aktif mencatat
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Pilar Paling Konsisten
          </p>
          <p className="text-base font-extrabold text-blue-700 mt-1 truncate">
            Beribadah (96%)
          </p>
          <p className="text-xs text-slate-700 mt-1 font-medium">
            Disusul Gemar Belajar (92%)
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Fokus Pembinaan Bersama
          </p>
          <p className="text-base font-extrabold text-amber-700 mt-1 truncate">
            Tidur Cepat (65%)
          </p>
          <p className="text-xs text-slate-700 mt-1 font-medium">
            Perlu edukasi gawai malam
          </p>
        </div>
      </div>

      {/* AI Pedagogical Character Insights for Teachers */}
      <div className="bg-linear-to-r from-blue-50 via-teal-50 to-emerald-50 rounded-2xl border border-blue-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-blue-900">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                Rekomendasi Pembinaan Karakter AI (Gemini Flash)
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Analisis otomatis berbasis pola data kelas untuk memandu langkah wali kelas & guru BK
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchAiInsights}
            disabled={isGeneratingAiInsights}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAiInsights ? 'animate-spin' : ''}`} />
            <span>Perbarui Analisis</span>
          </button>
        </div>

        {aiInsights && (
          <div className="space-y-3 pt-2">
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-white/70 p-3.5 rounded-xl border border-blue-100">
              {aiInsights.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiInsights.recommendations.map((rec, i) => (
                <div key={i} className="bg-white/90 p-3 rounded-xl border border-blue-200/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    Saran #{i + 1}
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-100/70 border border-emerald-300/80 rounded-xl text-xs text-emerald-950 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Rencana Tindak Lanjut:</strong> {aiInsights.actionPlan}</span>
            </div>
          </div>
        )}
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              Daftar Siswa & Catatan Perkembangan 7KAIH
            </h3>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3">NISN</th>
                <th className="py-3 px-3">Partisipasi</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Poin XP</th>
                <th className="py-3 px-3">Pilar Terkuat</th>
                <th className="py-3 px-3">Catatan Pembinaan Guru</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-mono">
                    {student.nisn}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-600">
                      {student.weeklyAttendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-amber-600">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {student.streak} Hari
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-700">
                    {student.totalPoints} Poin
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {student.strongestHabit}
                  </td>
                  <td className="py-3 px-3 text-slate-700 italic max-w-xs truncate font-medium">
                    {student.teacherNote || '-'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenNoteModal(student)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 justify-end ml-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Beri Catatan</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Note Modal */}
      {selectedStudentForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Catatan Apresiasi & Motivasi Guru
            </h3>
            <p className="text-xs text-slate-700 font-medium">
              Siswa: <strong>{selectedStudentForNote.name}</strong> ({selectedStudentForNote.grade})
            </p>
            <textarea
              rows={4}
              value={teacherNoteInput}
              onChange={(e) => setTeacherNoteInput(e.target.value)}
              placeholder="Tuliskan apresiasi karakter atau saran membangun bagi siswa ini..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudentForNote(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTeacherNote}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Simpan Apresiasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
