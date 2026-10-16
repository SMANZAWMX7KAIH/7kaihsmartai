import { useState, useEffect, useCallback } from 'react';

export interface LiveClockData {
  timeString: string; // HH:MM:SS
  dateString: string; // e.g. "Jumat, 16 Oktober 2026"
  periodGreeting: string; // "Selamat Pagi" | "Selamat Siang" | "Selamat Sore" | "Selamat Malam"
  fullGreeting: (studentName?: string) => string; // "[Salam], [Nama]! 🇮🇩"
  hours: number;
  minutes: number;
  seconds: number;
}

const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Aturan Salam Berdasarkan Waktu HP Lokal:
 * - 00.00–10.59: Selamat Pagi
 * - 11.00–14.59: Selamat Siang
 * - 15.00–17.59: Selamat Sore
 * - 18.00–23.59: Selamat Malam
 */
export function getPeriodGreeting(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 00.00 - 10.59 (0 - 659 menit)
  if (totalMinutes <= 10 * 60 + 59) {
    return 'Selamat Pagi';
  }
  // 11.00 - 14.59 (660 - 899 menit)
  if (totalMinutes <= 14 * 60 + 59) {
    return 'Selamat Siang';
  }
  // 15.00 - 17.59 (900 - 1079 menit)
  if (totalMinutes <= 17 * 60 + 59) {
    return 'Selamat Sore';
  }
  // 18.00 - 23.59
  return 'Selamat Malam';
}

export function formatFullIndonesianDate(date: Date = new Date()): string {
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const dateNum = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

export function formatLiveTimeString(date: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function useLiveDeviceClock(): LiveClockData {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const updateClock = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    // Jalankan pembaruan setiap 1 detik
    const timerId = setInterval(updateClock, 1000);

    // Sinkronisasi ulang saat pengguna membuka kembali tab / kembali dari aplikasi lain
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateClock();
      }
    };

    const handleFocus = () => {
      updateClock();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [updateClock]);

  const timeString = formatLiveTimeString(currentDate);
  const dateString = formatFullIndonesianDate(currentDate);
  const periodGreeting = getPeriodGreeting(currentDate);

  const fullGreeting = useCallback(
    (name?: string) => {
      const trimmedName = name?.trim();
      const studentLabel = trimmedName && trimmedName.length > 0 ? trimmedName : 'Sobat 7KAIH';
      return `${periodGreeting}, ${studentLabel}! 🇮🇩`;
    },
    [periodGreeting]
  );

  return {
    timeString,
    dateString,
    periodGreeting,
    fullGreeting,
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
  };
}
