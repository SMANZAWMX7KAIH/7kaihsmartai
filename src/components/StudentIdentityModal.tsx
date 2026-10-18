import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  X,
  Heart
} from 'lucide-react';
import { StudentProfile } from '../types';
import heroStudentsAnime from '../assets/images/bg_anime_bendera_merah_putih_1792359577913.jpg';

interface StudentIdentityModalProps {
  isOpen: boolean;
  isFirstTime: boolean;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onClose?: () => void;
}

export const StudentIdentityModal: React.FC<StudentIdentityModalProps> = ({
  isOpen,
  isFirstTime,
  currentProfile,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name || '');
      setAge(currentProfile.age > 0 ? String(currentProfile.age) : '');
      setSchool(currentProfile.school || 'SMA Negeri Indonesia Hebat');
      setGrade(currentProfile.grade || 'Tingkat SMA');
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { name?: string; age?: string } = {};

    // 1. Kolom nama wajib diisi dan tidak boleh hanya berisi spasi
    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = 'Kolom nama wajib diisi dan tidak boleh hanya berisi spasi.';
    } else if (trimmedName.length < 2) {
      errs.name = 'Nama minimal terdiri dari 2 karakter.';
    }

    // 2. Kolom umur wajib diisi dengan angka yang valid
    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge) || parsedAge <= 0) {
      errs.age = 'Kolom umur wajib diisi dengan angka yang valid.';
    } else if (parsedAge < 6 || parsedAge > 25) {
      errs.age = 'Masukkan umur yang valid untuk pelajar (antara 6 s/d 25 tahun).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validate()) return;

    const trimmedName = name.trim();
    const parsedAge = parseInt(age, 10);

    const updated: StudentProfile = {
      ...currentProfile,
      name: trimmedName,
      age: parsedAge,
      school: school.trim() || 'SMA Negeri Indonesia Hebat',
      grade: grade.trim() || 'Tingkat SMA',
      isRegistered: true,
    };

    onSaveProfile(updated);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header Banner with Anime Students Visual */}
        <div className="relative overflow-hidden bg-slate-900 text-white text-center">
          <div className="relative aspect-16/7 w-full overflow-hidden">
            <img
              src={heroStudentsAnime}
              alt="Pelajar Indonesia Anime"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-blue-950/60 to-black/30" />
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-rose-500 to-sky-400" />
            
            {!isFirstTime && onClose && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/90 hover:text-white p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xs transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="absolute bottom-3 left-4 right-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-amber-300 text-[10px] font-black border border-white/20 mb-1">
                🇮🇩 ANAK HEBAT, INDONESIA KUAT!
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight text-white drop-shadow-md">
                {isFirstTime ? '7 Kebiasaan Anak Indonesia Hebat' : 'Identitas Siswa'}
              </h2>
            </div>
          </div>
          <div className="bg-linear-to-r from-blue-700 via-sky-600 to-emerald-600 px-4 py-2 text-[11px] font-semibold text-blue-50">
            "Mulai dari kebiasaan kecil, untuk masa depan besar!"
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {isFirstTime && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-blue-950">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Mulai dengan Identitas Diri</span>
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                Silakan isi nama dan umur Anda untuk mempersonalisasi kata motivasi dan lembar laporan kegiatan 7 Kebiasaan Anak Indonesia Hebat.
              </p>
            </div>
          )}

          {/* Input Nama */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Nama Lengkap atau Nama Panggilan <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (submitted) validate();
              }}
              placeholder="Contoh: Budi Santoso atau Budi"
              className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all focus:outline-hidden ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 ring-1 ring-rose-300'
                  : 'border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Input Umur */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Umur dalam Tahun <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="number"
              min={6}
              max={25}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (submitted) validate();
              }}
              placeholder="Contoh: 16"
              className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all focus:outline-hidden ${
                errors.age
                  ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 ring-1 ring-rose-300'
                  : 'border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            />
            {errors.age && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.age}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-500 font-medium">
              Masukkan angka usia Anda saat ini (misal: 15, 16, 17 tahun).
            </p>
          </div>

          {/* Optional: Sekolah & Kelas untuk mempercantik Rapor Siswa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">
                Nama Sekolah (Opsional)
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Contoh: SMA Negeri 1"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">
                Kelas (Opsional)
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Contoh: Kelas XI MIPA 1"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Jaminan Privasi Perlindungan Anak & Remaja */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-900">
                Privasi Terjamin & Minim Data
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                Data nama dan umur Anda <strong>hanya disimpan secara lokal di perangkat Anda (browser ini)</strong>. Kami tidak meminta alamat rumah, nomor telepon, atau data sensitif lainnya. Data tidak diunggah ke publik.
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <span>{isFirstTime ? 'MULAI PERJALANAN 7KAIH' : 'SIMPAN PERUBAHAN IDENTITAS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
