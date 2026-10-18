import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat endpoint for 7KAIH Smart Assistant
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, studentProfile, currentStats } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Daftar pesan (messages) diperlukan.' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not yet supplied in environment
      return res.json({
        reply: `Halo ${studentProfile?.name || 'Sobat 7KAIH'}! 🌟 Saya Asisten Cerdas 7KAIH. Kunci API Gemini belum dikonfigurasi di server, namun saya tetap siap menyemangatimu!\n\nIngat 7 Kebiasaan Anak Indonesia Hebat hari ini:\n1. Bangun Pagi 🌅\n2. Beribadah 🤲\n3. Berolahraga 🏃\n4. Makan Sehat & Bergizi 🥗\n5. Gemar Belajar 📚\n6. Bermasyarakat 🤝\n7. Tidur Cepat 🌙\n\nMulailah dengan langkah kecil hari ini! Kamu pasti bisa!`,
      });
    }

    const systemInstruction = `Anda adalah "KAIH AI", asisten pintar pembimbing karakter dan kebiasaan positif untuk siswa SMA di Indonesia berdasarkan gerakan "7 Kebiasaan Anak Indonesia Hebat" (7KAIH):
1. Bangun Pagi (pukul 04.30 - 05.30, sambut fajar dengan semangat)
2. Beribadah (menjaga kewajiban agama, sholat/kebaktian/doa/meditasi, mensyukuri hidup)
3. Berolahraga (minimal 15-30 menit, senam/lari/stretching agar tubuh fit dan otak fokus)
4. Makan Sehat dan Bergizi (sarapan bergizi seimbang 'Isi Piringku', kurangi mie instan & junk food berlebih, minum air 2 liter)
5. Gemar Belajar (membaca buku, persiapan materi sekolah, eksplorasi sains & teknologi, tidak hanya SKS/Sistem Kebut Semalam)
6. Bermasyarakat (gotong royong, ramah terhadap teman & guru, menjaga kebersihan, menghormati orang tua, empati sosial)
7. Tidur Cepat (istirahat cukup 7-8 jam, tidur maksimal pukul 21.30-22.00, batasi paparan layar gawai sebelum tidur)

Konteks Siswa:
- Nama: ${studentProfile?.name || 'Siswa SMA'}
- Kelas: ${studentProfile?.grade || 'SMA'}
- Peminatan: ${studentProfile?.major || 'Umum'}
- Capaian Hari ini: ${currentStats?.completedCount || 0} dari 7 kebiasaan telah dicentang (${currentStats?.completionRate || 0}%).

Pedoman Komunikasi:
- Gunakan Bahasa Indonesia yang ramah, hangat, santun, memotivasi, dan relevan dengan realitas siswa SMA masa kini.
- Hindari menghakimi, menyalahkan, atau menakut-nakuti siswa. Gunakan pendekatan psikologi positif (growth mindset) dan 'micro-habits' (langkah-langkah kecil tapi konsisten).
- Jika siswa meminta jadwal belajar atau persiapan ujian, rancang pembagian waktu yang proporsional antara belajar, istirahat, dan olahraga.
- Sajikan jawaban dengan format Markdown yang rapi (gunakan poin-poin tebal, emoji yang pas, dan kutipan motivasi singkat di akhir).`;

    // Format chat history into contents
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    let reply = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      reply = response.text || '';
    } catch (genError: any) {
      console.warn('Primary Gemini call error, providing contextual smart fallback:', genError?.message);
      // Fallback response tailored to 7KAIH high school students
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      reply = `Halo ${studentProfile?.name?.split(' ')[0] || 'Sobat 7KAIH'}! 🌟\n\nMenjawab pertanyaanmu mengenai **"${lastUserMsg.slice(0, 50)}..."**:\n\nKunci utama membangun 7 Kebiasaan Anak Indonesia Hebat adalah **konsistensi langkah kecil (micro-habits)**:\n1. 🌅 **Fokus Satu Hari Sekaligus**: Mulailah dari kebiasaan yang paling mudah kamu capai hari ini (misalnya minum segelas air saat bangun tidur atau peregangan 10 menit).\n2. 📚 **Manajemen Belajar**: Gunakan teknik Pomodoro (25 menit fokus, 5 menit rehat) agar otak tetap segar.\n3. 🌙 **Ritme Istirahat**: Jauhkan layar gawai 30 menit sebelum tidur agar besok bangun bugar.\n\n*"Kebiasaan baik hari ini adalah fondasi prestasimu di masa depan!"* Tetap semangat! 💪`;
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.json({
      reply: 'Halo Sobat 7KAIH! Tetap semangat mempraktikkan 7 Kebiasaan Anak Indonesia Hebat hari ini. Jadikan setiap langkah kecil sebagai jalan menuju kesuksesan!',
    });
  }
});

// 3. AI Smart Schedule Generator
app.post('/api/gemini/generate-schedule', async (req: Request, res: Response) => {
  try {
    const { schoolStart, schoolEnd, sleepTarget, extracurricular, studyGoal } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        schedule: [
          { time: '04:45 - 05:15', habit: 'Bangun Pagi & Ibadah', activity: 'Bangun, merapikan kasur, minum segelas air hangat, ibadah subuh/doa pagi.' },
          { time: '05:15 - 05:45', habit: 'Berolahraga', activity: 'Peregangan ringan, jalan pagi/push up 15 menit, mandi pagi.' },
          { time: '05:45 - 06:15', habit: 'Makan Sehat & Bergizi', activity: 'Sarapan bernutrisi seimbang (nasi/roti, telur/tahu, sayur/buah) & persiapan tas sekolah.' },
          { time: `${schoolStart || '06:45'} - ${schoolEnd || '15:30'}`, habit: 'Gemar Belajar & Bermasyarakat', activity: 'Aktivitas belajar di sekolah, ramah pada teman, aktif di kelas, gotong royong piket.' },
          { time: '16:00 - 17:30', habit: 'Bermasyarakat / Ekstrakurikuler', activity: extracurricular || 'Kegiatan ekstrakurikuler sekolah atau membantu orang tua di rumah.' },
          { time: '18:00 - 19:00', habit: 'Beribadah & Makan Malam', activity: 'Ibadah petang, makan malam bergizi bersama keluarga, istirahat sejenak.' },
          { time: '19:00 - 20:30', habit: 'Gemar Belajar', activity: studyGoal ? `Fokus belajar: ${studyGoal} (Teknik Pomodoro 25 menit belajar + 5 menit istirahat)` : 'Mengulang materi pelajaran hari ini & mengerjakan tugas.' },
          { time: '20:30 - 21:30', habit: 'Bermasyarakat & Relaksasi', activity: 'Refleksi harian, komunikasi hangat dengan keluarga, matikan gawai.' },
          { time: `21:30 / ${sleepTarget || '22:00'} - 04:45`, habit: 'Tidur Cepat', activity: 'Tidur nyenyak 7-8 jam untuk regenerasi sel tubuh dan kesegaran otak.' }
        ],
        tips: 'Kunci sukses jadwal adalah fleksibel namun berkomitmen pada 7KAIH!'
      });
    }

    const prompt = `Buatlah rekomendasi jadwal harian terstruktur yang mengintegrasikan "7 Kebiasaan Anak Indonesia Hebat" (Bangun Pagi, Beribadah, Berolahraga, Makan Sehat, Gemar Belajar, Bermasyarakat, Tidur Cepat) untuk siswa SMA dengan parameter:
- Jam Sekolah: ${schoolStart || '07:00'} s/d ${schoolEnd || '15:30'}
- Target Tidur: ${sleepTarget || '21:30'}
- Kegiatan Ekstrakurikuler/Hobi: ${extracurricular || 'Pramuka/OSIS/Olahraga'}
- Target Belajar Siswa: ${studyGoal || 'Persiapan UTBK & Ulangan Harian'}

Berikan respon JSON valid dengan struktur:
{
  "schedule": [
    { "time": "05:00 - 05:30", "habit": "Nama Kebiasaan", "activity": "Deskripsi kegiatan praktis" }
  ],
  "tips": "Tips motivasi dan strategi konsistensi untuk siswa SMA"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-schedule:', error);
    res.status(500).json({ error: 'Gagal membuat jadwal otomatis.' });
  }
});


// 5. AI Grounded Habit Recommendations based purely on real user checklist records
app.post('/api/gemini/habit-recommendations', async (req: Request, res: Response) => {
  try {
    const { studentName, currentDate, completedHabits, pendingHabits, streak } = req.body;

    const completedList = Array.isArray(completedHabits) ? completedHabits : [];
    const pendingList = Array.isArray(pendingHabits) ? pendingHabits : [];

    const ai = getGenAI();

    // Fallback based strictly on true input if AI is offline or busy
    const buildFallback = () => {
      let apresiasiText = '';
      if (completedList.length === 7) {
        apresiasiText = `Luar biasa, ${studentName || 'Sobat 7KAIH'}! Seluruh 7 kebiasaan telah tuntas kamu laksanakan hari ini (${currentDate}). Kemenangan penuh untuk kedisiplinan dirimu!`;
      } else if (completedList.length > 0) {
        const titles = completedList.map((h: any) => h.title).join(', ');
        apresiasiText = `Bagus sekali, ${studentName || 'Sobat 7KAIH'}! Kamu telah berhasil melaksanakan ${completedList.length} kebiasaan hari ini: ${titles}. Setiap langkah nyata ini sangat berharga.`;
      } else {
        apresiasiText = `Halo ${studentName || 'Sobat 7KAIH'}, hari ini (${currentDate}) belum ada kebiasaan yang dicentang. Tenang, belum terlambat untuk memulai dari satu langkah kecil sekarang!`;
      }

      const rekomendasi = pendingList.slice(0, 2).map((h: any) => ({
        habitTitle: h.title,
        langkahPraktis: `Mulailah dengan tindakan 5-10 menit untuk ${h.title}: ${h.tagline || 'Lakukan sekarang tanpa menunda.'}`,
      }));

      return {
        apresiasi: apresiasiText,
        rekomendasiPrioritas: rekomendasi,
        tipsKonsistensi: completedList.length >= 4 
          ? 'Pertahankan momentum positif ini hingga malam hari dengan tidur tepat waktu.' 
          : 'Pilih satu kebiasaan yang paling ringan bagimu saat ini, lalu beri tanda centang.',
        kutipanPenyemangat: 'Bukan kesempurnaan yang dicari, melainkan ketekunan melangkah setiap hari.'
      };
    };

    if (!ai) {
      return res.json(buildFallback());
    }

    const prompt = `Anda adalah "KAIH AI", asisten pembina 7 Kebiasaan Anak Indonesia Hebat untuk siswa SMA.
Berikut adalah DATA NYATA catatan kebiasaan siswa saat ini:
- Nama Siswa: ${studentName || 'Siswa SMA'}
- Tanggal Catatan: ${currentDate}
- Kebiasaan yang SUDAH SELESAI DILAKUKAN (${completedList.length} dari 7):
${completedList.length > 0 ? completedList.map((h: any) => `  * ${h.title}${h.option ? ` (kegiatan: ${h.option})` : ''}${h.notes ? ` [catatan siswa: "${h.notes}"]` : ''}`).join('\n') : '  * Belum ada yang dicentang hari ini.'}

- Kebiasaan yang BELUM SELESAI DILAKUKAN (${pendingList.length} dari 7):
${pendingList.length > 0 ? pendingList.map((h: any) => `  * ${h.title} (${h.category} - ${h.tagline})`).join('\n') : '  * Sempurna! Semua 7 kebiasaan sudah tuntas.'}

- Konsistensi (Streak): ${streak || 0} hari berturut-turut.

ATURAN KETAT DAN WAJIB DIPATUHI:
1. HANYA gunakan data nyata di atas! JANGAN PERNAH mengarang riwayat, kegiatan, atau pencapaian yang tidak ada dalam daftar di atas.
2. Apresiasi secara spesifik kebiasaan yang benar-benar tercantum dalam daftar "SUDAH SELESAI DILAKUKAN".
3. Jika ada kebiasaan yang "BELUM SELESAI", berikan saran ramah berupa micro-habits (tindakan 5-15 menit) yang realistis untuk siswa SMA hari ini.
4. Jangan menghukum atau membebani siswa.

Kembalikan jawaban HANYA berupa JSON valid dengan format:
{
  "apresiasi": "Apresiasi hangat dan spesifik untuk kebiasaan nyata yang telah diselesaikan",
  "rekomendasiPrioritas": [
    {
      "habitTitle": "Nama Kebiasaan yang belum selesai",
      "langkahPraktis": "Langkah awal 5-10 menit yang sangat mudah dikerjakan sekarang"
    }
  ],
  "tipsKonsistensi": "Saran realistis untuk menjaga ritme hari ini",
  "kutipanPenyemangat": "Kutipan penguat karakter"
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (e: any) {
      console.warn('Gemini habit-recommendations fallback used:', e.message);
      res.json(buildFallback());
    }
  } catch (error: any) {
    console.error('Error in /api/gemini/habit-recommendations:', error);
    res.status(500).json({ error: 'Gagal memproses rekomendasi AI.' });
  }
});

// Production / Dev Vite routing
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use('/7kaihsmartai', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 7 KEBIASAAN ANAK INDONESIA HEBAT 🇮🇩 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
