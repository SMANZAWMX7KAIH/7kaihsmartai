import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  BookOpen, 
  RefreshCw, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Smile,
  ShieldCheck,
  Flame,
  Award,
  ListFilter,
  Lightbulb,
  Heart
} from 'lucide-react';
import { ChatMessage, StudentProfile, DailyLog, HabitId } from '../types';
import { HABITS_LIST } from '../data/habitsData';

interface GeminiAssistantViewProps {
  studentProfile: StudentProfile;
  todayLog: DailyLog;
  streak: number;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onToggleHabit?: (habitId: HabitId, completed: boolean) => void;
}

export const GeminiAssistantView: React.FC<GeminiAssistantViewProps> = ({
  studentProfile,
  todayLog,
  streak,
  initialPrompt,
  onClearInitialPrompt,
  onToggleHabit,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recommendation' | 'chat' | 'schedule'>('recommendation');

  // Compute real completed and pending habits strictly from todayLog
  const completedHabits = HABITS_LIST.filter(
    (h) => todayLog.habits && todayLog.habits[h.id]?.completed
  ).map((h) => ({
    id: h.id,
    title: h.title,
    category: h.category,
    time: todayLog.habits[h.id]?.timestamp,
    option: todayLog.habits[h.id]?.selectedOption,
    notes: todayLog.habits[h.id]?.notes,
  }));

  const pendingHabits = HABITS_LIST.filter(
    (h) => !todayLog.habits || !todayLog.habits[h.id]?.completed
  ).map((h) => ({
    id: h.id,
    title: h.title,
    category: h.category,
    tagline: h.tagline,
  }));

  const completedTodayCount = completedHabits.length;

  // AI Habit Recommendation State
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    apresiasi: string;
    rekomendasiPrioritas: { habitTitle: string; langkahPraktis: string }[];
    tipsKonsistensi: string;
    kutipanPenyemangat: string;
  } | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo ${studentProfile.name ? studentProfile.name.split(' ')[0] : 'Siswa'}! 🇮🇩 Saya **KAIH AI**, asisten cerdas pribadimu.\n\nBerdasarkan data checklistmu hari ini (${todayLog.date}), kamu telah menyelesaikan **${completedTodayCount} dari 7 kebiasaan**.\n\nSilakan pilih menu **"Rekomendasi Nyata"** untuk mendapatkan saran langkah kecil berdasarkan kebiasaan yang belum diselesaikan, atau gunakan kolom obrolan di bawah ini!`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Schedule Generator State
  const [schoolStart, setSchoolStart] = useState<string>('06:45');
  const [schoolEnd, setSchoolEnd] = useState<string>('15:30');
  const [sleepTarget, setSleepTarget] = useState<string>('21:45');
  const [extracurricular, setExtracurricular] = useState<string>('OSIS & Olahraga');
  const [studyGoal, setStudyGoal] = useState<string>('Persiapan Belajar Ulangan & UTBK');
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState<boolean>(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<any[] | null>(null);
  const [scheduleTips, setScheduleTips] = useState<string>('');

  useEffect(() => {
    if (initialPrompt) {
      setActiveSubTab('chat');
      sendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (activeSubTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoadingChat, activeSubTab]);

  // Fetch grounded recommendations based on actual user checklist
  const fetchHabitRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const res = await fetch('/api/gemini/habit-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentProfile.name,
          currentDate: todayLog.date,
          completedHabits,
          pendingHabits,
          streak,
        }),
      });

      const data = await res.json();
      setAiRecommendation(data);
    } catch (e) {
      console.error('Error fetching habit recommendations:', e);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const quickPrompts = [
    '💡 Beri saran kebiasaan yang belum saya selesaikan hari ini',
    '📅 Buatkan jadwal harian seimbang siswa SMA',
    '🌅 Tips bangun pagi tanpa ngantuk dan malas',
    '📚 Metode belajar Pomodoro & konsentrasi tinggi',
    '🥗 Ide menu sarapan sehat bergizi untuk pelajar',
    '🌙 Tips tidur cepat tanpa scrolling HP larut malam'
  ];

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          studentProfile,
          currentStats: {
            completedCount: completedTodayCount,
            completionRate: Math.round((completedTodayCount / 7) * 100),
            completedHabitsTitles: completedHabits.map(h => h.title),
            pendingHabitsTitles: pendingHabits.map(h => h.title),
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || data.error || 'Terjadi kendala saat memproses jawaban. Silakan coba kembali.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Sambungan terganggu. Tetap semangat melanjutkan kebiasaan baik hari ini!',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true);
    try {
      const res = await fetch('/api/gemini/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolStart,
          schoolEnd,
          sleepTarget,
          extracurricular,
          studyGoal,
        }),
      });
      const data = await res.json();
      setGeneratedSchedule(data.schedule || []);
      setScheduleTips(data.tips || '');
    } catch (e) {
      console.error('Schedule gen error:', e);
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Asisten AI Gemini 7KAIH
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Grounded on Real Records
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Memberikan saran berdasarkan kebiasaan nyata yang kamu tandai tanpa mengarang riwayat.
            </p>
          </div>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('recommendation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'recommendation'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Rekomendasi Nyata</span>
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'chat'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Obrolan Chatbot
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'schedule'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Generator Jadwal</span>
          </button>
        </div>
      </div>

      {/* 1. Grounded Habit Recommendations Tab */}
      {activeSubTab === 'recommendation' && (
        <div className="space-y-6">
          {/* Real Input State Summary Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-blue-600" />
                  <span>Kondisi Riil Checklist Hari Ini ({todayLog.date})</span>
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  AI Gemini akan membaca daftar ini secara jujur untuk menghasilkan saran langkah kecil.
                </p>
              </div>

              <button
                onClick={fetchHabitRecommendations}
                disabled={isLoadingRecommendations}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isLoadingRecommendations ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Catatan Nyata...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Dapatkan Saran Gemini Berdasarkan Catatan Ini</span>
                  </>
                )}
              </button>
            </div>

            {/* Checklist Real Status Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Completed */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sudah Dilakukan ({completedHabits.length})</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    +{todayLog.pointsEarned} XP
                  </span>
                </div>
                {completedHabits.length === 0 ? (
                  <p className="text-xs text-slate-700 italic font-medium">
                    Belum ada kebiasaan yang dicentang hari ini.
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {completedHabits.map((h) => (
                      <li key={h.id} className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-950">• {h.title}</span>
                        <span className="text-[10px] text-slate-700 font-medium">
                          {h.time ? `${h.time} WIB` : 'selesai'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pending */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    <Circle className="w-4 h-4 text-blue-600" />
                    <span>Belum Dilakukan ({pendingHabits.length})</span>
                  </span>
                  <span className="text-[11px] font-bold text-blue-700">
                    Target Hari Ini
                  </span>
                </div>
                {pendingHabits.length === 0 ? (
                  <p className="text-xs text-emerald-700 font-bold">
                    🎉 Luar biasa! Seluruh 7 kebiasaan telah tuntas diselesaikan!
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {pendingHabits.map((h) => (
                      <li key={h.id} className="flex items-center justify-between">
                        <span className="font-semibold text-blue-950">• {h.title}</span>
                        <span className="text-[10px] text-slate-700 font-medium">{h.category}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendation Cards */}
          {aiRecommendation && (
            <div className="space-y-4 animate-in fade-in">
              {/* Apresiasi Nyata */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm">
                    Apresiasi Kemajuan Nyata Hari Ini
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {aiRecommendation.apresiasi}
                </p>
              </div>

              {/* Rekomendasi Prioritas Langkah Kecil */}
              {aiRecommendation.rekomendasiPrioritas?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-sm">
                      Rekomendasi Langkah Kecil (Micro-habits)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiRecommendation.rekomendasiPrioritas.map((rec, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-blue-700">
                            {rec.habitTitle}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border">
                            5 - 15 Menit
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {rec.langkahPraktis}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kiat Konsistensi & Kutipan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    💡 Kiat Konsistensi Realistis:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {aiRecommendation.tipsKonsistensi}
                  </p>
                </div>
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    ✨ Penyemangat Karakter:
                  </span>
                  <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
                    "{aiRecommendation.kutipanPenyemangat}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Interactive Chatbot Tab */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
          {/* Quick Prompt Chips */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-700 shrink-0">
              Pintasan Cepat:
            </span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={isLoadingChat}
                className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full border border-slate-200 text-xs font-medium shrink-0 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? studentProfile.name.charAt(0) : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/70'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {m.content}
                    </div>
                    <div
                      className={`text-[10px] mt-1.5 flex justify-end font-medium ${
                        isUser ? 'text-blue-100' : 'text-slate-700'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoadingChat && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-700 border border-slate-200 flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>KAIH AI sedang menyusun jawaban berdasarkan datamu...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan kiat kebiasaan, jadwal belajar seimbang, atau cara atasi stres..."
                disabled={isLoadingChat}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 bg-slate-50 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoadingChat}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <span>Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Schedule Generator Tab */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Generator Jadwal 7KAIH Cerdas</span>
            </h2>
            <p className="text-xs text-slate-700 font-medium">
              Masukkan jam sekolah dan target belajarmu, AI Gemini akan menyusun jadwal proporsional 7KAIH.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Jam Masuk Sekolah</label>
              <input
                type="text"
                value={schoolStart}
                onChange={(e) => setSchoolStart(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Jam Pulang Sekolah</label>
              <input
                type="text"
                value={schoolEnd}
                onChange={(e) => setSchoolEnd(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Tidur Malam</label>
              <input
                type="text"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700">Kegiatan Ekstrakurikuler/Hobi</label>
              <input
                type="text"
                value={extracurricular}
                onChange={(e) => setExtracurricular(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Target Belajar Siswa</label>
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateSchedule}
            disabled={isGeneratingSchedule}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
          >
            {isGeneratingSchedule ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Merancang Jadwal Seimbang...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Rancang Jadwal 7KAIH Sekarang</span>
              </>
            )}
          </button>

          {generatedSchedule && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Rekomendasi Jadwal Harian Proporsional</span>
              </h3>

              {scheduleTips && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium leading-relaxed">
                  💡 <strong>Kiat Sukses:</strong> {scheduleTips}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3 rounded-l-lg">Waktu</th>
                      <th className="py-2.5 px-3">Pilar 7KAIH</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Aktivitas & Tips Pelaksanaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {generatedSchedule.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-blue-700 whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {item.habit}
                        </td>
                        <td className="py-3 px-3 text-slate-700 leading-relaxed font-medium">
                          {item.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
