import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  Heart, 
  Bot, 
  Search,
  Check,
  Quote
} from 'lucide-react';
import { HABITS_LIST, HABIT_MOTIVATIONAL_QUOTES } from '../data/habitsData';
import { HabitItem, HabitId } from '../types';
import { HabitIcon } from './HabitIcon';

interface HabitsGuideViewProps {
  onAskAIWithTopic: (topic: string) => void;
  onCheckHabit: (habitId: HabitId) => void;
  todayCompletedHabits: Record<string, boolean>;
}

export const HabitsGuideView: React.FC<HabitsGuideViewProps> = ({
  onAskAIWithTopic,
  onCheckHabit,
  todayCompletedHabits,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHabitModal, setActiveHabitModal] = useState<HabitItem | null>(null);

  const categories = ['Semua', 'Kedisiplinan', 'Spiritual', 'Kesehatan', 'Intelektual', 'Sosial'];

  const filteredHabits = HABITS_LIST.filter((h) => {
    const matchesCategory = selectedCategory === 'Semua' || h.category === selectedCategory;
    const matchesSearch = 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <BookOpen className="w-3.5 h-3.5" /> Panduan Lengkap 7KAIH
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tujuh Kebiasaan Anak Indonesia Hebat
          </h1>
          <p className="text-sm text-slate-700 max-w-2xl font-medium">
            Pilar pembiasaan karakter positif bagi siswa SMA untuk membentuk pribadi yang religius, bugar, cerdas, berintegritas, dan berjiwa sosial.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kebiasaan atau manfaat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => {
          const isDoneToday = Boolean(todayCompletedHabits[habit.id]);

          return (
            <div
              key={habit.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-linear-to-tr ${habit.accentColor} shadow-md`}>
                    <HabitIcon name={habit.icon} className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${habit.badgeColor}`}>
                      {habit.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      +{habit.points} Poin
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Kebiasaan #{habit.order}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {habit.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    "{habit.tagline}"
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {habit.description}
                </p>

                {/* Kata-Kata Motivasi 7KAIH */}
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 leading-relaxed italic flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase not-italic block mb-0.5 tracking-wider">
                      Motivasi {habit.title}:
                    </span>
                    <span>"{HABIT_MOTIVATIONAL_QUOTES[habit.id]}"</span>
                  </div>
                </div>

                {/* Target Time */}
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Waktu Ideal: {habit.targetTime}</span>
                </div>

                {/* Practical Options Preview */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Contoh Penerapan:
                  </p>
                  <ul className="space-y-1">
                    {habit.options.slice(0, 2).map((opt, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveHabitModal(habit)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Detail & Tips</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onAskAIWithTopic(`Bagaimana tips praktis bagi siswa SMA agar konsisten menerapkan kebiasaan ${habit.title}? Berikan saran psikologis dan jadwal realistis.`)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                    title={`Konsultasi AI tentang ${habit.title}`}
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Check Today Button */}
                <button
                  onClick={() => onCheckHabit(habit.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isDoneToday
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDoneToday ? 'Sudah Dilakukan Hari Ini ✓' : 'Tandai Sudah Selesai'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Deep Habit Insight */}
      {activeHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-linear-to-tr ${activeHabitModal.accentColor}`}>
                  <HabitIcon name={activeHabitModal.icon} className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase">
                    Kebiasaan #{activeHabitModal.order}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {activeHabitModal.title}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700">
                    {activeHabitModal.tagline}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveHabitModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {activeHabitModal.description}
            </p>

            {/* Kata-Kata Motivasi Resmi */}
            <div className="bg-linear-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Quote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider mb-1">
                  Kata-Kata Motivasi 7KAIH:
                </p>
                <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed font-medium">
                  "{HABIT_MOTIVATIONAL_QUOTES[activeHabitModal.id]}"
                </p>
              </div>
            </div>

            {/* Manfaat */}
            <div className="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-blue-600" /> Manfaat Utama Bagi Siswa SMA
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {activeHabitModal.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Praktis */}
            <div className="space-y-2 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-600" /> Tips Praktis Sukses Membiasakan
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {activeHabitModal.tips.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions inside modal */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const topic = `Saya siswa SMA ingin tips mendalam untuk membiasakan ${activeHabitModal.title}. Bagaimana mengatasi rasa malas dan jadwal padat?`;
                  setActiveHabitModal(null);
                  onAskAIWithTopic(topic);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>Tanya Asisten AI Gemini</span>
              </button>
              <button
                onClick={() => setActiveHabitModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
