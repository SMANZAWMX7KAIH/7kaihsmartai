import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { StudentIdentityModal } from './components/StudentIdentityModal';
import { AudioControlWidget } from './components/AudioControlWidget';
import { IndonesianStudentsBackground } from './components/IndonesianStudentsBackground';
import { audioService } from './utils/audioService';
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

  const prevUnlockedBadgeCount = useRef<number>(
    Array.isArray(badges) ? badges.filter((b) => b && b.unlocked).length : 0
  );

  const isFirstTime = !studentProfile.isRegistered || !studentProfile.name?.trim() || !studentProfile.age || studentProfile.age <= 0;

  // Beri konfirmasi ke browser bahwa aplikasi telah berhasil dirender
  useEffect(() => {
    try {
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.setAttribute('data-loaded', 'true');
      }
    } catch {}
  }, []);

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

  // Sinkronisasi tanggal Checklist Harian secara real-time berdasarkan waktu lokal HP
  useEffect(() => {
    const syncLocalDate = () => {
      const realLocalToday = formatDateKey(new Date());
      setCurrentDateKey((prevKey) => {
        if (prevKey !== realLocalToday) {
          return realLocalToday;
        }
        return prevKey;
      });
    };

    syncLocalDate();
    const intervalId = setInterval(syncLocalDate, 1000);

    const handleWindowActive = () => {
      syncLocalDate();
      reloadDataFromStorage();
    };

    document.addEventListener('visibilitychange', handleWindowActive);
    window.addEventListener('focus', handleWindowActive);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleWindowActive);
      window.removeEventListener('focus', handleWindowActive);
    };
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

    // Audio SFX & Toast feedback
    const habitDef = HABITS_LIST.find((h) => h.id === habitId);
    if (completed) {
      const completedCount = HABITS_LIST.filter(
        (h) => updatedLog.habits?.[h.id]?.completed
      ).length;

      if (completedCount === 7) {
        audioService.playCelebrationSFX();
        showToast('🎉 Hebat! Kamu telah menyelesaikan ke-7 kebiasaan hari ini! Bonus +30 Poin!');
      } else {
        audioService.playHabitCheckSFX();
        showToast(`✓ Berhasil mencatat ${habitDef?.title}! (+${habitDef?.points} Poin)`);
      }
    } else {
      audioService.playHabitUncheckSFX();
      showToast(`Tanda ${habitDef?.title} dibatalkan (-${habitDef?.points} Poin)`);
    }

    // Check if new badge unlocked
    const currentUnlockedCount = updatedBadges.filter(b => b.unlocked).length;
    if (currentUnlockedCount > prevUnlockedBadgeCount.current) {
      setTimeout(() => {
        audioService.playBadgeUnlockedSFX();
        showToast('🏆 Selamat! Kamu membuka lencana penghargaan baru!');
      }, 500);
    }
    prevUnlockedBadgeCount.current = currentUnlockedCount;
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
        ? `Selamat datang di 7 KEBIASAAN ANAK INDONESIA HEBAT, ${updated.name}! Langkah kecilmu membentuk masa depan hebat.`
        : 'Identitas profil siswa berhasil diperbarui.'
    );
  };

  const todayKey = formatDateKey(new Date());
  const todayLog = (allLogs && allLogs[todayKey] && typeof allLogs[todayKey] === 'object' && allLogs[todayKey].habits)
    ? allLogs[todayKey]
    : getOrCreateDayLog(todayKey);
  const currentViewLog = (allLogs && allLogs[currentDateKey] && typeof allLogs[currentDateKey] === 'object' && allLogs[currentDateKey].habits)
    ? allLogs[currentDateKey]
    : getOrCreateDayLog(currentDateKey);

  const completedTodayCount = HABITS_LIST.filter(
    (h) => todayLog.habits && todayLog.habits[h.id]?.completed
  ).length;

  const todayCompletedHabitsMap: Record<string, boolean> = {};
  HABITS_LIST.forEach((h) => {
    todayCompletedHabitsMap[h.id] = Boolean(todayLog.habits && todayLog.habits[h.id]?.completed);
  });

  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Latar Belakang Animasi 2D Anak-Anak Indonesia & Bendera Merah Putih Berkibar */}
      <IndonesianStudentsBackground />

      {/* Top Navigation - Student Only */}
      <div className="relative z-20">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentProfile={studentProfile}
          totalPoints={totalPoints}
          streak={streak}
          todayCount={completedTodayCount}
          onEditProfile={() => setIsEditingProfile(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            onSelectDate={() => {}}
            dayLog={allLogs[currentDateKey] || getOrCreateDayLog(currentDateKey)}
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
            studentProfile={studentProfile}
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
      </main>

      {/* Audio Controller Widget (BGM & SFX) */}
      <AudioControlWidget />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

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
