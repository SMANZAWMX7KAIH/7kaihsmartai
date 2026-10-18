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
      {/* 1. Hero Showcase Utama: Pelajar Indonesia Anime & Slogan Resmi */}
      <motion.div variants={itemVariants}>
        <IndonesianStudentsShowcase 
          onExploreHabits={() => onNavigate('habits')}
          onNavigateToChecklist={() => onNavigate('checklist')}
          onAskAI={() => onNavigate('assistant')}
        />
      </motion.div>

      {/* 2. Live Greeting & Status Bar dengan Waktu HP */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-linear-to-r from-sky-50 via-white to-blue-50/80 border border-sky-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{dateString}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 font-mono text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="tracking-wider">{timeString}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {fullGreeting(studentProfile.name)}
          </h2>

          <div className="inline-flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs font-semibold text-slate-700">
            <span className="text-base">{periodFocus.icon}</span>
            <span>
              Fokus Waktu Ini: <strong className="text-blue-700 font-black">{periodFocus.habit}</strong> — {periodFocus.desc}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => onNavigate('assistant')}
            className="px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Tanya Asisten AI Gemini</span>
          </button>
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Profil Siswa</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* 3. Panel Progres & Pencapaian Harian (Dipercantik dengan visual anime edukasi modern) */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Capaian Hari Ini (Radial Progress Ring) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Capaian Hari Ini
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {completedHabitsCount}
              </span>
              <span className="text-sm font-extrabold text-slate-500">/ 7 Kebiasaan</span>
            </div>
            <p className="text-xs text-emerald-700 font-bold">
              {completionPercentage}% Terlaksana Hari Ini
            </p>
          </div>

          {/* Circular progress visual */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-800">
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Konsistensi (Streak) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Konsistensi (Streak)
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-600">
                {streak}
              </span>
              <span className="text-sm font-extrabold text-slate-500">Hari Berturut</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              {streak > 0 ? 'Rutinitas aktif terjaga!' : 'Tandai kebiasaan pertamamu!'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-xs shrink-0">
            <Flame className="w-7 h-7 fill-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Tingkat Karakter (Level) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-sky-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Tingkat Karakter
            </p>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              Level {studentLevel.level}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-900 truncate" title={studentLevel.title}>
            {studentLevel.title}
          </p>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-linear-to-r from-sky-500 to-blue-600 h-2.5 rounded-full transition-all duration-700" 
              style={{ width: `${studentLevel.currentProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-600 font-extrabold">
            <span>{totalPoints} XP</span>
            <span>Target: {studentLevel.nextThreshold} XP</span>
          </div>
        </div>

        {/* Poin Diraih Hari Ini */}
        <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" /> Poin Hari Ini
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-700">
                +{todayLog.pointsEarned}
              </span>
              <span className="text-sm font-extrabold text-slate-500">XP</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              {completedHabitsCount === 7 ? '🌟 Bonus Paripurna 7/7 diraih!' : 'Lengkapi 7 untuk bonus +30!'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
            <Award className="w-7 h-7" />
          </div>
        </div>
      </motion.div>

      {/* 4. Tujuh Kartu Kebiasaan dengan Ilustrasi Anime Asli */}
      <motion.div variants={itemVariants} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-sky-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-black border border-sky-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Misi Harian Pelajar Indonesia
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tujuh Kartu Kebiasaan Anak Indonesia Hebat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Ketuk tombol centang untuk menandai kebiasaan yang sudah kamu lakukan, atau klik "Lihat Detail" untuk panduan lengkap.
            </p>
          </div>

          <button
            onClick={() => onNavigate('checklist')}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Buka Formulir Checklist Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {HABITS_LIST.map((habit) => {
            const isCompleted = Boolean(todayLog.habits[habit.id]?.completed);
            const checkTime = todayLog.habits[habit.id]?.timestamp;

            return (
              <div
                key={habit.id}
                className={`group relative rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white shadow-xs hover:shadow-xl ${
                  isCompleted
                    ? 'border-emerald-300 ring-2 ring-emerald-200/60 bg-linear-to-b from-emerald-50/40 to-white'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Visual Anime Artwork Header for each habit */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  {habit.image ? (
                    <img
                      src={habit.image}
                      alt={`Ilustrasi anime ${habit.title}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-tr from-sky-400 to-blue-600 text-white font-black text-lg">
                      {habit.title}
                    </div>
                  )}

                  {/* Gradient Scrim Overlay at top & bottom of image */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges: Habit Order & Category */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black border border-white/20 shadow-sm">
                      #{habit.order}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm border backdrop-blur-md ${
                      isCompleted ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/90 text-slate-800 border-white'
                    }`}>
                      {habit.category}
                    </span>
                  </div>

                  {/* Bottom Image Overlay: Title & Checkmark shortcut */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="text-white drop-shadow-md">
                      <p className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                        {habit.targetTime}
                      </p>
                      <h3 className="text-base font-black text-white leading-tight">
                        {habit.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => onToggleHabit(habit.id, !isCompleted)}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-2 ring-white scale-105'
                          : 'bg-white/90 text-slate-400 hover:text-blue-600 hover:bg-white'
                      }`}
                      title={isCompleted ? 'Batalkan tanda kebiasaan' : 'Tandai sudah selesai'}
                      aria-label={`Tandai ${habit.title}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-white text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-700 font-semibold line-clamp-2 leading-relaxed">
                      "{habit.tagline}"
                    </p>

                    {/* Official Motivational Quote */}
                    <div className="p-2.5 rounded-2xl bg-sky-50/80 border border-sky-100 text-[11px] text-sky-900 italic font-medium leading-relaxed flex items-start gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">"{HABIT_MOTIVATIONAL_QUOTES[habit.id]}"</span>
                    </div>

                    {checkTime && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Selesai pukul {checkTime} WIB</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Point */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Nilai:</span>
                      <span className={`font-black px-2 py-0.5 rounded-md ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-50 text-blue-700'
                      }`}>
                        +{habit.points} XP
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onNavigate('habits')}
                        className="w-full py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onToggleHabit(habit.id, !isCompleted)}
                        className={`w-full py-2 px-2.5 rounded-xl text-[11px] font-black transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isCompleted ? 'Selesai ✓' : 'Tandai'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 5. Motivational Quote Carousel */}
      <motion.div 
        variants={itemVariants}
        className="rounded-3xl bg-linear-to-r from-sky-50 via-teal-50 to-blue-50 border-2 border-sky-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-linear-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0 mt-0.5">
            <Quote className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-sky-800 uppercase tracking-wider">
              Kutipan Pembangun Karakter Pelajar:
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs font-black text-blue-700">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuoteIndex(prev => prev + 1)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-blue-700 font-extrabold text-xs border border-sky-200 shadow-2xs transition-all shrink-0 self-end sm:self-center active:scale-95"
        >
          Kutipan Lain ↻
        </button>
      </motion.div>

      {/* 6. Philosophy Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-blue-500/30"
      >
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Landasan Karakter Pelajar Pancasila
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Mengapa 7 Kebiasaan Anak Indonesia Hebat?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            Gerakan 7KAIH membimbing siswa SMA mengasah keseimbangan hidup: ketakwaan spiritual, kesegaran fisik, ketajaman daya nalar, dan empati sosial bergotong royong menyongsong generasi emas Indonesia.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => onNavigate('habits')}
            className="px-5 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white text-xs font-black transition-all text-center shadow-lg shadow-blue-500/25 active:scale-95"
          >
            Pelajari 7 Kebiasaan Lengkap
          </button>
          <button
            onClick={() => onNavigate('badges')}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all text-center active:scale-95"
          >
            Lihat Poin & Lencana Saya
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
