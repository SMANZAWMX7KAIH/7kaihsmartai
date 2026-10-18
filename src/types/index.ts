export type HabitId = 
  | 'bangun_pagi'
  | 'beribadah'
  | 'berolahraga'
  | 'makan_sehat'
  | 'gemar_belajar'
  | 'bermasyarakat'
  | 'tidur_cepat';

export interface HabitItem {
  id: HabitId;
  order: number;
  title: string;
  tagline: string;
  category: 'Kedisiplinan' | 'Spiritual' | 'Kesehatan' | 'Intelektual' | 'Sosial';
  targetTime: string;
  points: number;
  icon: string;
  accentColor: string;
  badgeColor: string;
  description: string;
  benefits: string[];
  tips: string[];
  options: string[]; // Contoh sub-kegiatan praktis
  image?: string;
}

export interface HabitCheckState {
  completed: boolean;
  timestamp?: string;
  selectedOption?: string;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  habits: Record<HabitId, HabitCheckState>;
  dailyMood?: 'semangat' | 'senang' | 'fokus' | 'lelah' | 'butuh_motivasi';
  dailyReflection?: string;
  pointsEarned: number;
}

export interface StudentProfile {
  name: string;
  age: number; // Umur dalam tahun
  school?: string;
  grade?: string;
  nisn?: string;
  avatarIcon?: string;
  motto?: string;
  isRegistered?: boolean;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  rarity: 'Pemula' | 'Terampil' | 'Teladan' | 'Legenda';
  pointsRequired?: number;
  streakRequired?: number;
  habitSpecific?: HabitId;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
