import { DailyLog, HabitId, StudentProfile, BadgeItem } from '../types';
import { HABITS_LIST, INITIAL_BADGES, INITIAL_STUDENT_PROFILE } from '../data/habitsData';

export const STORAGE_KEYS = {
  DAILY_LOGS: '7kaih_daily_logs_v2',
  STUDENT_PROFILE: '7kaih_student_profile_v2',
  BADGES: '7kaih_badges_v2',
  TOTAL_POINTS: '7kaih_total_points_v2',
};

// Clear level rules with transparent XP thresholds
export const LEVEL_RULES = [
  { level: 1, title: 'Pejuang Kebiasaan Muda', minXP: 0, maxXP: 99, desc: 'Langkah awal pembentukan 7KAIH secara mandiri' },
  { level: 2, title: 'Pelajar Tangguh Berkarakter', minXP: 100, maxXP: 249, desc: 'Mulai konsisten menjaga rutinitas positif harian' },
  { level: 3, title: 'Teladan Hebat Nusantara', minXP: 250, maxXP: 449, desc: 'Menjadi teladan disiplin bagi rekan sebaya di SMA' },
  { level: 4, title: 'Bintang 7KAIH Berprestasi', minXP: 450, maxXP: 699, desc: 'Keseimbangan intelektual, spiritual, dan sosial prima' },
  { level: 5, title: 'Pionir Generasi Emas 2045', minXP: 700, maxXP: Infinity, desc: 'Karakter unggul paripurna menyongsong masa depan Indonesia' },
];

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatIndonesianDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[date.getDay()]}, ${d} ${months[m - 1]} ${y}`;
  } catch (e) {
    return dateStr;
  }
}

export function createEmptyDayLog(dateKey: string): DailyLog {
  const habits: any = {};
  HABITS_LIST.forEach((h) => {
    habits[h.id] = { completed: false };
  });

  return {
    date: dateKey,
    habits,
    pointsEarned: 0,
    dailyMood: undefined,
    dailyReflection: undefined,
  };
}

// Calculate points earned for a single date strictly without duplicates
export function calculateDayPoints(dayLog: DailyLog): number {
  if (!dayLog || !dayLog.habits) return 0;
  let points = 0;
  let completedCount = 0;

  HABITS_LIST.forEach((habit) => {
    if (dayLog.habits[habit.id]?.completed) {
      points += habit.points;
      completedCount++;
    }
  });

  // Perfect 7 habits bonus: +30 points bonus
  if (completedCount === 7) {
    points += 30;
  }

  return points;
}

// Sum of points across all dates in real logs
export function calculateTotalPoints(logs: Record<string, DailyLog>): number {
  let total = 0;
  Object.values(logs).forEach((log) => {
    total += calculateDayPoints(log);
  });
  return total;
}

// Get stored logs or initialize strictly clean (0 fake data)
export function getDailyLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (!raw) {
      const todayKey = formatDateKey(new Date());
      const initialLogs: Record<string, DailyLog> = {
        [todayKey]: createEmptyDayLog(todayKey),
      };
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get daily logs:', e);
    const todayKey = formatDateKey(new Date());
    return { [todayKey]: createEmptyDayLog(todayKey) };
  }
}

export function saveDailyLogs(logs: Record<string, DailyLog>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save daily logs:', e);
  }
}

export function getOrCreateDayLog(dateKey: string): DailyLog {
  const logs = getDailyLogs();
  if (logs[dateKey]) {
    return logs[dateKey];
  }

  const newLog = createEmptyDayLog(dateKey);
  logs[dateKey] = newLog;
  saveDailyLogs(logs);
  return newLog;
}

// Deduplicated toggle function: updates habit, recalculates points cleanly
export function toggleHabitCheck(
  dateKey: string,
  habitId: HabitId,
  completed: boolean,
  option?: string,
  notes?: string
): { updatedLog: DailyLog; newTotalPoints: number } {
  const logs = getDailyLogs();
  const dayLog = logs[dateKey] || createEmptyDayLog(dateKey);

  dayLog.habits[habitId] = {
    completed,
    timestamp: completed ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : undefined,
    selectedOption: option || dayLog.habits[habitId]?.selectedOption,
    notes: notes !== undefined ? notes : dayLog.habits[habitId]?.notes,
  };

  // Strictly recalculate day points based solely on currently checked habits
  dayLog.pointsEarned = calculateDayPoints(dayLog);

  logs[dateKey] = dayLog;
  saveDailyLogs(logs);

  const newTotalPoints = calculateTotalPoints(logs);
  localStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, String(newTotalPoints));

  return { updatedLog: dayLog, newTotalPoints };
}

export function getStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (!raw) return INITIAL_STUDENT_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STUDENT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch (e) {}
}

export function getBadges(): BadgeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
      return INITIAL_BADGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BADGES;
  }
}

export function saveBadges(badges: BadgeItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {}
}

// Dynamically unlock badges based on genuine user milestones
export function checkAndUnlockBadges(
  totalPoints: number,
  streak: number,
  logs: Record<string, DailyLog>
): BadgeItem[] {
  const badges = getBadges();
  let changed = false;

  const updated = badges.map((badge) => {
    if (badge.unlocked) return badge;

    let shouldUnlock = false;
    if (badge.pointsRequired && totalPoints >= badge.pointsRequired) {
      shouldUnlock = true;
    }
    if (badge.streakRequired && streak >= badge.streakRequired) {
      shouldUnlock = true;
    }

    if (badge.id === 'disiplin_emas') {
      // Check if any date has all 7 habits completed
      const hasPerfectDay = Object.values(logs).some((l) => {
        return HABITS_LIST.filter((h) => l.habits?.[h.id]?.completed).length === 7;
      });
      if (hasPerfectDay) shouldUnlock = true;
    }

    if (shouldUnlock) {
      changed = true;
      return {
        ...badge,
        unlocked: true,
        unlockedAt: formatDateKey(new Date()),
      };
    }
    return badge;
  });

  if (changed) {
    saveBadges(updated);
  }
  return updated;
}

// Calculate streak based strictly on recorded user entries
export function calculateStreak(logs: Record<string, DailyLog>): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const log = logs[key];

    if (!log) {
      if (i === 0) continue; // If today hasn't been logged yet, still evaluate yesterday
      break;
    }

    const doneCount = Object.values(log.habits || {}).filter((h) => h.completed).length;
    if (doneCount >= 1) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}

// Level evaluation based on LEVEL_RULES
export function getStudentLevel(totalPoints: number): {
  level: number;
  title: string;
  nextThreshold: number;
  currentProgress: number;
  description: string;
} {
  for (let i = 0; i < LEVEL_RULES.length; i++) {
    const rule = LEVEL_RULES[i];
    if (totalPoints <= rule.maxXP) {
      const prevMin = rule.minXP;
      const range = rule.maxXP === Infinity ? 300 : rule.maxXP - prevMin;
      const progress = Math.min(
        100,
        Math.max(0, Math.round(((totalPoints - prevMin) / range) * 100))
      );
      return {
        level: rule.level,
        title: rule.title,
        nextThreshold: rule.maxXP === Infinity ? 1000 : rule.maxXP + 1,
        currentProgress: progress,
        description: rule.desc,
      };
    }
  }

  const top = LEVEL_RULES[LEVEL_RULES.length - 1];
  return {
    level: top.level,
    title: top.title,
    nextThreshold: 1000,
    currentProgress: 100,
    description: top.desc,
  };
}

// Calculate real 7-day trend
export function getWeeklyTrendData(logs: Record<string, DailyLog>): {
  days: {
    dateKey: string;
    dayLabel: string;
    completedCount: number;
    percentage: number;
    points: number;
    hasEntry: boolean;
  }[];
  hasAnyRecordedData: boolean;
  totalCompletedInWeek: number;
} {
  const today = new Date();
  const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const days = [];
  let totalCompletedInWeek = 0;
  let hasAnyRecordedData = false;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const log = logs[key];

    let count = 0;
    let points = 0;
    let hasEntry = false;

    if (log && log.habits) {
      count = HABITS_LIST.filter((h) => log.habits[h.id]?.completed).length;
      points = calculateDayPoints(log);
      hasEntry = count > 0 || Boolean(log.dailyMood) || Boolean(log.dailyReflection);
      if (count > 0) {
        hasAnyRecordedData = true;
        totalCompletedInWeek += count;
      }
    }

    days.push({
      dateKey: key,
      dayLabel: i === 0 ? 'Hari Ini' : dayNamesShort[d.getDay()],
      completedCount: count,
      percentage: Math.round((count / 7) * 100),
      points,
      hasEntry,
    });
  }

  return { days, hasAnyRecordedData, totalCompletedInWeek };
}

// Export backup to JSON file
export function exportDataBackup(): void {
  const data = {
    app: '7 KEBIASAAN ANAK INDONESIA HEBAT',
    version: 2,
    exportedAt: new Date().toISOString(),
    logs: getDailyLogs(),
    profile: getStudentProfile(),
    badges: getBadges(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cadangan_7kaih_${formatDateKey(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data from JSON string
export function importDataBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.logs) {
      saveDailyLogs(parsed.logs);
      if (parsed.profile) saveStudentProfile(parsed.profile);
      if (parsed.badges) saveBadges(parsed.badges);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}

// Reset all data to clean initial state
export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
  localStorage.removeItem(STORAGE_KEYS.BADGES);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_POINTS);
  const todayKey = formatDateKey(new Date());
  const initialLogs = { [todayKey]: createEmptyDayLog(todayKey) };
  saveDailyLogs(initialLogs);
  saveBadges(INITIAL_BADGES);
}
