import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  Compass,
  Smile,
  Quote,
  User,
  Edit3,
  Heart,
  Volume2
} from 'lucide-react';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { 
  DailyLog, 
  HabitId, 
  StudentProfile 
} from '../types';
import { 
  HABITS_LIST, 
  DAILY_QUOTES, 
  HABIT_MOTIVATIONAL_QUOTES 
} from '../data/habitsData';
import { HabitIcon } from './HabitIcon';
import { getStudentLevel } from '../utils/storage';
import { useLiveDeviceClock } from '../utils/useLiveDeviceClock';
import { IndonesianStudentsShowcase } from './IndonesianStudentsShowcase';

interface DashboardViewProps {
  todayKey: string;
  todayLog: DailyLog;
  onToggleHabit: (habitId: HabitId, completed: boolean) => void;
  onNavigate: (tab: string) => void;
  studentProfile: StudentProfile;
  totalPoints: number;
  streak: number;
  onEditProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  todayKey,
  todayLog,
  onToggleHabit,
  onNavigate,
  studentProfile,
  totalPoints,
  streak,
  onEditProfile,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { timeString, dateString, fullGreeting, hours } = useLiveDeviceClock();

  const completedHabitsCount = HABITS_LIST.filter(
    (h) => todayLog.habits?.[h.id]?.completed
  ).length;

  const completionPercentage = Math.round((completedHabitsCount / 7) * 100);
  const studentLevel = getStudentLevel(totalPoints);

  // Quote rotation
  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentQuote = DAILY_QUOTES[quoteIndex % DAILY_QUOTES.length];

  // Kebiasaan fokus sesuai jam saat ini untuk memandu siswa SMA
  const getCurrentPeriodFocus = () => {
    if (hours >= 4 && hours < 6) return { habit: 'Bangun Pagi & Ibadah', icon: '🌅', desc: 'Awali fajar dengan syukur dan segelas air hangat' };
    if (hours >= 6 && hours < 8) return { habit: 'Berolahraga & Makan Sehat', icon: '🏃', desc: 'Peregangan badan & sarapan bergizi seimbang' };
    if (hours >= 8 && hours < 15) return { habit: 'Gemar Belajar & Bermasyarakat', icon: '📚', desc: 'Fokus menuntut ilmu dan berkolaborasi di sekolah' };
    if (hours >= 15 && hours < 18) return { habit: 'Bermasyarakat & Berolahraga', icon: '🤝', desc: 'Eksplorasi bakat, hobi sehat, dan gotong royong' };
    if (hours >= 18 && hours < 21) return { habit: 'Ibadah & Evaluasi Belajar', icon: '🤲', desc: 'Ibadah malam & penguatan materi pelajaran' };
    return { habit: 'Tidur Cepat & Istirahat Berkualitas', icon: '🌙', desc: 'Hindari layar gawai demi regenerasi otak optimal' };
  };

  const periodFocus = getCurrentPeriodFocus();

  // Animation variants respecting reduced motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Welcome Banner dengan Live Digital Clock & Salam Otomatis */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-emerald-600 text-white p-6 sm:p-8 shadow-lg shadow-blue-900/10"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            {/* Live Indonesian Date & Time Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
                <Calendar className="w-3.5 h-3.5 text-blue-200" />
                <span>{dateString}</span>
              </div>

              {/* Digital Clock Realtime */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/40 text-emerald-300 font-mono text-xs font-bold backdrop-blur-xs border border-emerald-400/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tracking-wider">{timeString}</span>
              </div>
            </div>

            {/* Salam Otomatis Sesuai Waktu HP */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-xs">
              {fullGreeting(studentProfile.name)}
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium">
              Langkah kecil hari ini membentuk generasi hebat di masa depan. Setiap tindakan positifmu membantumu bertumbuh, berkarakter, dan berkarya.
            </p>

            {/* Current Time Period Recommendation Pill */}
            <div className="pt-1 flex items-center gap-2 text-xs bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 w-fit">
              <span className="text-base">{periodFocus.icon}</span>
              <span className="font-semibold text-blue-100">
                Fokus Waktu Ini: <strong className="text-white font-extrabold">{periodFocus.habit}</strong> — {periodFocus.desc}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/20 text-xs font-bold backdrop-blur-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Usia: {studentProfile.age > 0 ? `${studentProfile.age} Tahun` : 'Pelajar SMA'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/20 text-xs font-medium backdrop-blur-xs">
                {studentProfile.school || 'SMA Indonesia Hebat'}
              </span>
              {onEditProfile && (
                <button
                  onClick={onEditProfile}
                  className="px-2.5 py-1 rounded-md bg-white/25 hover:bg-white/35 text-xs font-bold backdrop-blur-xs flex items-center gap-1 transition-all text-white active:scale-95"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Ubah Identitas</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick CTA to AI Assistant */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/20 flex flex-col justify-between gap-3 min-w-[270px]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white text-blue-700 flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Asisten Cerdas KAIH AI
                </p>
                <p className="text-xs text-white/90 font-medium">Butuh jadwal atau tips kebiasaan?</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('assistant')}
              className="w-full py-2.5 px-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs group active:scale-98"
            >
              <span>Konsultasi dengan Gemini</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Ilustrasi Murid Indonesia, Bendera Merah Putih, dan Buku 7 KAIH */}
      <motion.div variants={itemVariants}>
        <IndonesianStudentsShowcase onExploreHabits={() => onNavigate('habits')} />
      </motion.div>

      {/* Sambutan Motivasi Personal Siswa */}
      <motion.div 
        variants={itemVariants}
        className="bg-linear-to-r from-blue-50/80 via-white to-emerald-50/80 rounded-2xl border border-blue-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {studentProfile.name || 'Sobat 7KAIH'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {studentProfile.age > 0 ? `${studentProfile.age} Tahun` : 'Pelajar SMA'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Profil Siswa Terdaftar • Data tersimpan aman di perangkat lokal Anda
              </p>
            </div>
          </div>
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Nama & Umur</span>
            </button>
          )}
        </div>

        <div className="pt-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
              Motivasi Personal Untukmu:
            </p>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              "Halo, <strong className="text-blue-700 font-extrabold">{studentProfile.name || 'Sobat Hebat'}</strong>! {studentProfile.age > 0 ? `Kamu berusia ${studentProfile.age} tahun dan` : 'Hari ini'} adalah kesempatan baru untuk menjadi lebih baik. Tidak perlu langsung sempurna. Mulailah dengan satu kebiasaan baik, lakukan dengan konsisten, dan teruslah berkembang!"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards Row */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Progress Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Capaian Hari Ini
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">
                {completedHabitsCount}
              </span>
              <span className="text-sm font-semibold text-slate-700">/ 7 Kebiasaan</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {completionPercentage}% terlaksana hari ini
            </p>
          </div>
          {/* Circular progress visual */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500 ease-out"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Konsistensi (Streak)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-amber-600">
                {streak}
              </span>
              <span className="text-sm font-semibold text-slate-700">Hari Berturut</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              Tetap semangat menjaga rutinitas!
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shadow-xs">
            <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Level Progression */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tingkat Karakter
            </p>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Level {studentLevel.level}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-800 truncate" title={studentLevel.title}>
            {studentLevel.title}
          </p>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${studentLevel.currentProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-700 mt-1 font-semibold">
            <span>{totalPoints} Poin</span>
            <span>Target: {studentLevel.nextThreshold}</span>
          </div>
        </div>

        {/* Points Today */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Poin Diraih Hari Ini
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-blue-700">
                +{todayLog.pointsEarned}
              </span>
              <span className="text-sm font-semibold text-slate-700">XP</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              {completedHabitsCount === 7 ? '🎉 Bonus 7/7 diraih!' : 'Lengkapi 7 untuk bonus!'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Motivational Quote Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/70 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-xs shrink-0 mt-0.5">
            <Quote className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-800 italic">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs font-bold text-emerald-800">
              — {currentQuote.author}
            </p>
          </div>
        </div>
        <button
          onClick={() => setQuoteIndex(prev => prev + 1)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50/50 transition-colors shrink-0 self-end sm:self-center active:scale-95"
        >
          Kutipan Lain
        </button>
      </motion.div>

      {/* Quick Checklist Section with Interactive Micro-Animations */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>Checklist Cepat Hari Ini</span>
            </h2>
            <p className="text-xs text-slate-700 font-medium">
              Ketuk untuk menandai kebiasaan yang sudah kamu laksanakan hari ini (didukung efek suara interaktif)
            </p>
          </div>
          <button
            onClick={() => onNavigate('checklist')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto active:scale-95"
          >
            <span>Buka Riwayat & Catatan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {HABITS_LIST.map((habit) => {
            const isCompleted = Boolean(todayLog.habits[habit.id]?.completed);
            const checkTime = todayLog.habits[habit.id]?.timestamp;

            return (
              <div
                key={habit.id}
                onClick={() => onToggleHabit(habit.id, !isCompleted)}
                className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white scale-105 shadow-sm'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}
                      >
                        <HabitIcon name={habit.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">
                          Kebiasaan #{habit.order}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {habit.title}
                        </h3>
                      </div>
                    </div>

                    {/* Toggle check button */}
                    <div className="pt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 transition-transform group-hover:scale-115" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 mt-2 leading-relaxed font-medium">
                    {habit.tagline}
                  </p>

                  {/* Kata-kata motivasi resmi kebiasaan */}
                  <div className="mt-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 italic font-medium leading-relaxed flex items-start gap-1.5">
                    <Quote className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                    <span>"{HABIT_MOTIVATIONAL_QUOTES[habit.id]}"</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Clock className="w-3 h-3" />
                    {checkTime ? `Pukul ${checkTime}` : habit.targetTime}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    +{habit.points} Poin
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick AI Schedule Card */}
          <div
            onClick={() => onNavigate('assistant')}
            className="p-4 rounded-xl border border-dashed border-blue-300 bg-linear-to-b from-blue-50/70 to-emerald-50/70 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-98"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Fitur Unggulan
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">
                Rancang Jadwal 7KAIH Otomatis
              </h3>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                Biarkan AI menyusun jadwal harian proporsional sesuai jam masuk dan ekstrakurikuler sekolahmu.
              </p>
            </div>
            <div className="mt-3 pt-2 text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Buka Generator AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kumpulan Kata-Kata Motivasi 7KAIH */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
              <Quote className="w-3.5 h-3.5" /> Inspirasi Karakter Juara
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Kata-Kata Motivasi 7 Kebiasaan Anak Indonesia Hebat
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Refleksi dan penyemangat harian untuk mengokohkan tekad dan budi pekerti luhur
            </p>
          </div>
          <button
            onClick={() => onNavigate('habits')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pelajari Panduan Kebiasaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HABITS_LIST.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-linear-to-tr ${h.accentColor} shadow-xs`}>
                      <HabitIcon name={h.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Kebiasaan #{h.order}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {h.title}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${h.badgeColor}`}>
                    {h.category}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
                    "{HABIT_MOTIVATIONAL_QUOTES[h.id]}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{h.targetTime}</span>
                <span className="font-bold text-blue-600">+{h.points} Poin</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 7KAIH Values Quick Guide Banner (Siswa oriented) */}
      <motion.div 
        variants={itemVariants}
        className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md"
      >
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Filosofi Karakter Bangsa
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Mengapa 7 Kebiasaan Anak Indonesia Hebat?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            7KAIH bukan sekadar daftar tugas, melainkan panduan hidup holistik bagi pelajar SMA untuk seimbang antara kecerdasan spiritual, kesehatan jasmani, ketajaman intelektual, dan kepedulian sosial menyongsong Indonesia Emas 2045.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => onNavigate('habits')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center shadow-md shadow-blue-600/30 active:scale-95"
          >
            Pelajari 7 Kebiasaan Lengkap
          </button>
          <button
            onClick={() => onNavigate('badges')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all text-center active:scale-95"
          >
            Lihat Poin & Lencana Saya
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
