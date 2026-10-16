import React, { useState, useEffect, useCallback } from 'react';
import { 
  formatDateKey, 
  getDailyLogs, 
  getOrCreateDayLog, 
  toggleHabitCheck, 
  calculateStreak, 
  calculateTotalPoints,
  getStudentProfile, 
  saveStudentProfile,
  getBadges, 
  checkAndUnlockBadges,
  saveDailyLogs
} from './utils/storage';
import { HabitId, DailyLog, StudentProfile, BadgeItem } from './types';
import { HABITS_LIST } from './data/habitsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { HabitsGuideView } from './components/HabitsGuideView';
import { ChecklistView } from './components/ChecklistView';
import { GeminiAssistantView } from './components/GeminiAssistantView';
import { StatsView } from './components/StatsView';
import { BadgesAndPointsView } from './components/BadgesAndPointsView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { StudentIdentityModal } from './components/StudentIdentityModal';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentDateKey, setCurrentDateKey] = useState<string>(formatDateKey(new Date()));
  const [allLogs, setAllLogs] = useState<Record<string, DailyLog>>(() => getDailyLogs());
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => getStudentProfile());
  const [badges, setBadges] = useState<BadgeItem[]>(() => getBadges());
  const [totalPoints, setTotalPoints] = useState<number>(() => calculateTotalPoints(getDailyLogs()));
  const [streak, setStreak] = useState<number>(() => calculateStreak(getDailyLogs()));
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  const isFirstTime = !studentProfile.isRegistered || !studentProfile.name?.trim() || !studentProfile.age || studentProfile.age <= 0;

  const reloadDataFromStorage = useCallback(() => {
    const logs = getDailyLogs();
    setAllLogs(logs);
    const pts = calculateTotalPoints(logs);
    setTotalPoints(pts);
    const s = calculateStreak(logs);
    setStreak(s);
    const updatedBadges = checkAndUnlockBadges(pts, s, logs);
    setBadges(updatedBadges);
    setStudentProfile(getStudentProfile());
  }, []);

  // Initialize and ensure badges sync with real points
  useEffect(() => {
    reloadDataFromStorage();
  }, [reloadDataFromStorage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleHabit = (
    habitId: HabitId,
    completed: boolean,
    option?: string,
    notes?: string
  ) => {
    const { updatedLog, newTotalPoints } = toggleHabitCheck(
      currentDateKey,
      habitId,
      completed,
      option,
      notes
    );

    const updatedAllLogs = {
      ...allLogs,
      [currentDateKey]: updatedLog,
    };
    setAllLogs(updatedAllLogs);
    setTotalPoints(newTotalPoints);

    const newStreak = calculateStreak(updatedAllLogs);
    setStreak(newStreak);

    const updatedBadges = checkAndUnlockBadges(newTotalPoints, newStreak, updatedAllLogs);
    setBadges(updatedBadges);

    // Toast feedback
    const habitDef = HABITS_LIST.find((h) => h.id === habitId);
    if (completed) {
      const completedCount = HABITS_LIST.filter(
        (h) => updatedLog.habits?.[h.id]?.completed
      ).length;

      if (completedCount === 7) {
        showToast('🎉 Hebat! Kamu telah menyelesaikan ke-7 kebiasaan hari ini! Bonus +30 Poin!');
      } else {
        showToast(`✓ Berhasil mencatat ${habitDef?.title}! (+${habitDef?.points} Poin)`);
      }
    } else {
      showToast(`Tanda ${habitDef?.title} dibatalkan (-${habitDef?.points} Poin)`);
    }
  };

  const handleUpdateDailyMood = (mood: any) => {
    const log = allLogs[currentDateKey] || getOrCreateDayLog(currentDateKey);
    log.dailyMood = mood;
    const updated = { ...allLogs, [currentDateKey]: log };
    setAllLogs(updated);
    saveDailyLogs(updated);
    showToast(`Suasana hati tersimpan: ${mood}`);
  };

  const handleUpdateReflection = (reflection: string) => {
    const log = allLogs[currentDateKey] || getOrCreateDayLog(currentDateKey);
    log.dailyReflection = reflection;
    const updated = { ...allLogs, [currentDateKey]: log };
    setAllLogs(updated);
    saveDailyLogs(updated);
  };

  const handleAskAIWithTopic = (topic: string) => {
    setAiInitialPrompt(topic);
    setActiveTab('assistant');
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    saveStudentProfile(updated);
    setStudentProfile(updated);
    setIsEditingProfile(false);
    showToast(
      isFirstTime
        ? `Selamat datang di 7KAIH SMART AI, ${updated.name}! Langkah kecilmu membentuk masa depan hebat.`
        : 'Identitas profil siswa berhasil diperbarui.'
    );
  };

  const todayKey = formatDateKey(new Date());
  const todayLog = allLogs[todayKey] || getOrCreateDayLog(todayKey);
  const currentViewLog = allLogs[currentDateKey] || getOrCreateDayLog(currentDateKey);

  const completedTodayCount = HABITS_LIST.filter(
    (h) => todayLog.habits?.[h.id]?.completed
  ).length;

  const todayCompletedHabitsMap: Record<string, boolean> = {};
  HABITS_LIST.forEach((h) => {
    todayCompletedHabitsMap[h.id] = Boolean(todayLog.habits?.[h.id]?.completed);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={studentProfile}
        totalPoints={totalPoints}
        streak={streak}
        todayCount={completedTodayCount}
        onEditProfile={() => setIsEditingProfile(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            todayKey={todayKey}
            todayLog={todayLog}
            onToggleHabit={(id, completed) => handleToggleHabit(id, completed)}
            onNavigate={(tab) => setActiveTab(tab)}
            studentProfile={studentProfile}
            totalPoints={totalPoints}
            streak={streak}
            onEditProfile={() => setIsEditingProfile(true)}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsGuideView
            onAskAIWithTopic={handleAskAIWithTopic}
            onCheckHabit={(habitId) => {
              const currentState = Boolean(todayLog.habits?.[habitId]?.completed);
              handleToggleHabit(habitId, !currentState);
            }}
            todayCompletedHabits={todayCompletedHabitsMap}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistView
            currentDateKey={currentDateKey}
            onSelectDate={(dKey) => setCurrentDateKey(dKey)}
            dayLog={currentViewLog}
            allLogs={allLogs}
            onToggleHabit={handleToggleHabit}
            onUpdateDailyMood={handleUpdateDailyMood}
            onUpdateReflection={handleUpdateReflection}
            onDataResetOrImported={reloadDataFromStorage}
          />
        )}

        {activeTab === 'assistant' && (
          <GeminiAssistantView
            studentProfile={studentProfile}
            todayLog={todayLog}
            streak={streak}
            initialPrompt={aiInitialPrompt}
            onClearInitialPrompt={() => setAiInitialPrompt('')}
            onToggleHabit={(habitId, completed) => handleToggleHabit(habitId, completed)}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            allLogs={allLogs}
            totalPoints={totalPoints}
            streak={streak}
            onNavigateToChecklist={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'badges' && (
          <BadgesAndPointsView
            badges={badges}
            totalPoints={totalPoints}
            streak={streak}
            studentProfile={studentProfile}
          />
        )}

        {activeTab === 'teacher' && <TeacherDashboardView />}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Student Identity Modal for First-time and Profile Editing */}
      <StudentIdentityModal
        isOpen={isFirstTime || isEditingProfile}
        isFirstTime={isFirstTime}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
        onClose={() => {
          if (!isFirstTime) setIsEditingProfile(false);
        }}
      />
    </div>
  );
}
