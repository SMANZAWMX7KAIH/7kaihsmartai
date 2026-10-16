import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  ListChecks, 
  BookOpen, 
  Bot, 
  BarChart3, 
  Award, 
  School,
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: '7 Kebiasaan', icon: BookOpen },
    { id: 'checklist', label: 'Checklist Harian', icon: ListChecks, badge: `${todayCount}/7` },
    { id: 'assistant', label: 'Asisten AI Gemini', icon: Bot, isAi: true },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
    { id: 'badges', label: 'Poin & Lencana', icon: Award },
    { id: 'teacher', label: 'Dashboard Guru', icon: School },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleSelectTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-extrabold text-lg tracking-wider">
              7K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-blue-700 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  7KAIH SMART AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5" /> SMA
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block font-medium">
                7 Kebiasaan Anak Indonesia Hebat
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {item.isAi && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User quick stats header pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div 
              onClick={() => handleSelectTab('badges')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-bold cursor-pointer hover:bg-amber-100/80 transition-colors"
              title={`${streak} hari berturut-turut mencatat kebiasaan 7KAIH`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak} Hari</span>
            </div>

            {/* Total Points */}
            <div 
              onClick={() => handleSelectTab('badges')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-800 border border-blue-200/80 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100/80 transition-colors"
              title="Total poin penghargaan 7KAIH"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span>{totalPoints} Poin</span>
            </div>

            {/* Student profile avatar badge */}
            <div 
              onClick={() => onEditProfile ? onEditProfile() : handleSelectTab('dashboard')}
              className="flex items-center gap-2 pl-1.5 cursor-pointer group p-1 rounded-xl hover:bg-slate-100/80 transition-colors"
              title="Klik untuk melihat atau mengubah identitas siswa"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {studentProfile.name || 'Siswa 7KAIH'}
                </p>
                <p className="text-[10px] text-slate-700 font-medium">
                  {studentProfile.age > 0 ? `${studentProfile.age} Tahun` : studentProfile.grade}
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="py-2.5 mb-2 border-b border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">{studentProfile.name || 'Siswa 7KAIH'}</span>
              <span className="text-slate-500 ml-1">({studentProfile.age > 0 ? `${studentProfile.age} Thn` : studentProfile.grade})</span>
            </div>
            {onEditProfile && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEditProfile();
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Ubah Identitas
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
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
