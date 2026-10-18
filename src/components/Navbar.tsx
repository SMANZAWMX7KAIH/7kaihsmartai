import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  ListChecks, 
  BookOpen, 
  Bot, 
  BarChart3, 
  Award, 
  Flame,
  Menu,
  X
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentProfile: StudentProfile;
  totalPoints: number;
  streak: number;
  todayCount: number;
  onEditProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  totalPoints,
  streak,
  todayCount,
  onEditProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'habits', label: '7 Kebiasaan', icon: BookOpen },
    { id: 'checklist', label: 'Checklist Harian', icon: ListChecks, badge: `${todayCount}/7` },
    { id: 'assistant', label: 'Asisten AI Gemini', icon: Bot, isAi: true },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
    { id: 'badges', label: 'Poin & Lencana', icon: Award },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      {/* Top subtle Indonesian national red-white accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-red-600 via-rose-500 via-white to-sky-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleSelectTab('dashboard')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 font-black text-base sm:text-lg tracking-wider border-2 border-white ring-2 ring-red-100 group-hover:scale-105 group-hover:rotate-1 transition-all shrink-0">
              7K
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight bg-linear-to-r from-slate-900 via-blue-900 to-red-600 bg-clip-text text-transparent leading-tight block">
                  7 Kebiasaan Anak Indonesia Hebat
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                  SMA 🇮🇩
                </span>
              </div>
              <p className="text-[11px] text-sky-700 hidden sm:block font-semibold">
                Platform Edukasi Karakter & Pembiasaan Pelajar Unggul
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-extrabold rounded-md ${
                      isActive ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isAi && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User quick stats header pill & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <button 
              onClick={() => handleSelectTab('badges')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-xl text-xs font-extrabold shadow-2xs hover:shadow-xs transition-all active:scale-95"
              title={`${streak} hari berturut-turut mencatat kebiasaan 7KAIH`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak} Hari</span>
            </button>

            {/* Total Points */}
            <button 
              onClick={() => handleSelectTab('badges')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/90 rounded-xl text-xs font-extrabold shadow-2xs hover:shadow-xs transition-all active:scale-95"
              title="Total poin penghargaan 7KAIH"
            >
              <Award className="w-4 h-4 text-sky-600" />
              <span>{totalPoints} XP</span>
            </button>

            {/* Student profile avatar button */}
            <button 
              onClick={() => onEditProfile ? onEditProfile() : handleSelectTab('dashboard')}
              className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all group active:scale-95 text-left"
              title="Profil Siswa — Klik untuk melihat atau mengubah identitas"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-sm ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform">
                {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden xl:block text-left text-xs pr-1">
                <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate max-w-[110px]">
                  {studentProfile.name || 'Siswa 7KAIH'}
                </p>
                <p className="text-[10px] text-sky-600 font-semibold">
                  {studentProfile.age > 0 ? `${studentProfile.age} Thn` : 'Profil Siswa'}
                </p>
              </div>
            </button>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 lg:hidden transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="p-3 mb-2 bg-linear-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block">{studentProfile.name || 'Siswa 7KAIH'}</span>
                <span className="text-[11px] text-sky-700 font-medium">{studentProfile.age > 0 ? `${studentProfile.age} Tahun` : studentProfile.school || 'Pelajar SMA'}</span>
              </div>
            </div>
            {onEditProfile && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEditProfile();
                }}
                className="px-2.5 py-1 rounded-lg bg-white text-blue-700 font-extrabold border border-blue-200 shadow-2xs hover:bg-blue-50"
              >
                Ubah Profil
              </button>
            )}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-blue-600 to-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-black rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
