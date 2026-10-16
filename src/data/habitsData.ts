import { HabitItem, BadgeItem, HabitId } from '../types';

export const HABITS_LIST: HabitItem[] = [
  {
    id: 'bangun_pagi',
    order: 1,
    title: 'Bangun Pagi',
    tagline: 'Sambut mentari dengan energi dan tekad juara',
    category: 'Kedisiplinan',
    targetTime: '04.30 - 05.30 WIB',
    points: 15,
    icon: 'Sunrise',
    accentColor: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Membiasakan diri bangun di awal pagi sebelum matahari terbit melatih kedisiplinan diri, ketenangan pikiran, dan memberi waktu persiapan yang cukup sebelum berangkat ke sekolah tanpa tergesa-gesa.',
    benefits: [
      'Meningkatkan konsentrasi dan daya ingat saat belajar di kelas',
      'Mencegah stres akibat terburu-buru terlambat ke sekolah',
      'Memperbaiki ritme sirkadian tubuh dan keseimbangan hormon',
      'Memberi waktu berkualitas untuk ibadah pagi dan sarapan bergizi'
    ],
    tips: [
      'Hindari menekan tombol snooze alarm; letakkan alarm agak jauh dari ranjang.',
      'Langsung minum segelas air putih hangat saat pertama kali bangun tidur.',
      'Segera buka jendela kamar untuk membiarkan cahaya alami dan udara segar masuk.',
      'Rapikan tempat tidur sebagai kemenangan kecil pertama hari ini.'
    ],
    options: [
      'Bangun sebelum 05.00 WIB & merapikan kamar',
      'Bangun pukul 05.00 - 05.30 WIB & minum air hangat',
      'Merapikan tempat tidur & membuka ventilasi udara'
    ]
  },
  {
    id: 'beribadah',
    order: 2,
    title: 'Beribadah',
    tagline: 'Memperkuat iman, rasa syukur, dan ketenangan jiwa',
    category: 'Spiritual',
    targetTime: 'Pagi, Siang, & Malam',
    points: 20,
    icon: 'HeartHandshake',
    accentColor: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Menjalankan kewajiban ibadah sesuai agama dan keyakinan masing-masing (Sholat, Doa, Renungan Alkitab, Puja Bakti, Meditasi). Menumbuhkan akhlak mulia dan ketenangan batin dalam menghadapi dinamika masa SMA.',
    benefits: [
      'Menanamkan fondasi integritas, kejujuran, dan kepekaan nurani',
      'Meredakan kecemasan akademik, ujian, dan pergaulan remaja',
      'Meningkatkan rasa syukur dan optimisme dalam menjalani hari',
      'Menumbuhkan empati serta penghormatan terhadap sesama'
    ],
    tips: [
      'Jadikan ibadah sebagai prioritas utama sebelum menyentuh smartphone di pagi hari.',
      'Sempatkan 2 menit setelah beribadah untuk berdoa memohon kelancaran belajar & berbuat baik.',
      'Bagi siswa Muslim: jaga sholat fardhu tepat waktu & tadarus Al-Quran.',
      'Bagi siswa non-Muslim: luangkan waktu saat teduh, renungan harian firman Tuhan, atau kebaktian.'
    ],
    options: [
      'Ibadah pagi / Sholat Subuh tepat waktu',
      'Membaca kitab suci / Saat Teduh / Renungan rohani (10-15 menit)',
      'Menjaga ibadah wajib di sela aktivitas sekolah',
      'Ibadah petang / malam bersama keluarga'
    ]
  },
  {
    id: 'berolahraga',
    order: 3,
    title: 'Berolahraga',
    tagline: 'Tubuh sehat bugar, pikiran tangguh dan segar',
    category: 'Kesehatan',
    targetTime: 'Pagi (05.30) atau Sore (16.30)',
    points: 15,
    icon: 'Activity',
    accentColor: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Melakukan aktivitas fisik minimal 15 hingga 30 menit setiap hari untuk menjaga kebugaran jantung, kekuatan otot, pelepasan endorfin anti-stres, dan mencegah penyakit akibat gaya hidup pasif.',
    benefits: [
      'Melancarkan sirkulasi oksigen ke otak sehingga belajar lebih cepat paham',
      'Meningkatkan stamina untuk mengikuti kegiatan sekolah seharian',
      'Menjaga postur tubuh ideal dan mencegah pegal saat duduk lama',
      'Meningkatkan kualitas tidur malam secara alami'
    ],
    tips: [
      'Tak perlu alat mahal: jogging santai, lompat tali (skipping), atau senam kalistenik sudah cukup.',
      'Jika sibuk belajar, lakukan "micro-workout" 10 menit peregangan otot di kamar.',
      'Ajak teman bermain futsal, basket, bulutangkis, atau voli setelah jam sekolah.',
      'Gunakan tangga daripada lift/eskalator untuk membakar kalori ekstra.'
    ],
    options: [
      'Jogging / jalan santai pagi (15 - 30 menit)',
      'Senam aerobik / SKJ / calisthenics di rumah',
      'Olahraga permainan (futsal / basket / bulutangkis)',
      'Peregangan otot & push-up / sit-up 15 menit'
    ]
  },
  {
    id: 'makan_sehat',
    order: 4,
    title: 'Makan Sehat dan Bergizi',
    tagline: 'Bahan bakar alami untuk energi dan ketajaman otak',
    category: 'Kesehatan',
    targetTime: 'Sarapan, Siang, & Malam',
    points: 15,
    icon: 'Apple',
    accentColor: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    description: 'Membiasakan sarapan sebelum sekolah dengan pola gizi seimbang "Isi Piringku" (karbohidrat, protein, sayuran, dan buah), memenuhi hidrasi air putih minimal 2 liter per hari, dan membatasi konsumsi makanan olahan tinggi gula & garam.',
    benefits: [
      'Mencegah lemas, mengantuk, dan sakit maag saat jam pelajaran pagi',
      'Memperkuat sistem imun tubuh agar tidak mudah terserang flu dan demam',
      'Mendukung pertumbuhan fisik optimal di usia pubertas SMA',
      'Meningkatkan kestabilan mood dan konsentrasi berpikir'
    ],
    tips: [
      'Jangan pernah lewatkan sarapan, walau hanya telur rebus, oatmeal, atau pisang dan susu.',
      'Bawa botol minum isi ulang sendiri ke sekolah dan habiskan minimal 1,5 - 2 liter.',
      'Kurangi minuman berpemanis boba, kopi saset manis berlebih, atau minuman energi bersoda.',
      'Perbanyak protein hewani/nabati (tempe, tahu, telur, ikan) untuk regenerasi sel tubuh.'
    ],
    options: [
      'Sarapan bergizi seimbang sebelum berangkat sekolah',
      'Minum air putih minimal 8 gelas (2 liter) hari ini',
      'Makan porsi sayuran hijau dan buah segar',
      'Membawa bekal higienis sehat dari rumah'
    ]
  },
  {
    id: 'gemar_belajar',
    order: 5,
    title: 'Gemar Belajar',
    tagline: 'Kembangkan rasa ingin tahu, jadilah cendekiawan masa depan',
    category: 'Intelektual',
    targetTime: 'Sore s/d Malam (18.30 - 20.30)',
    points: 20,
    icon: 'GraduationCap',
    accentColor: 'from-cyan-600 to-blue-700',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    description: 'Menumbuhkan kecintaan belajar mandiri tanpa harus dipaksa: membaca buku literasi, mengulang materi sulit, berlatih soal ujian/UTBK, atau mempelajari keterampilan baru (coding, bahasa asing, sains teknologi).',
    benefits: [
      'Membangun pemahaman konsep mendalam bukan sekadar hafalan sesaat',
      'Mempersiapkan diri bersaing masuk perguruan tinggi impian (PTN/Kedinasan)',
      'Mempertajam daya nalar kritis dan pemecahan masalah (critical thinking)',
      'Membentuk mental pembelajar sepanjang hayat (lifelong learner)'
    ],
    tips: [
      'Gunakan teknik Pomodoro: 25 menit fokus penuh tanpa notifikasi HP, lalu 5 menit istirahat.',
      'Terapkan metode Feynman: jelaskan konsep pelajaran dengan kata-katamu sendiri.',
      'Catat materi dengan ringkas menggunakan peta konsep (mind mapping).',
      'Belajar secara konsisten 45 menit setiap hari jauh lebih efektif daripada begadang semalam sebelum ujian.'
    ],
    options: [
      'Membaca buku non-pelajaran / literasi min. 20 menit',
      'Mengulang materi pelajaran sekolah & mengerjakan PR tepat waktu',
      'Berlatih soal UTBK / Sains / Bahasa / Logika (min. 30 menit)',
      'Mempelajari materi baru secara mandiri via video edukasi / artikel ilmiah'
    ]
  },
  {
    id: 'bermasyarakat',
    order: 6,
    title: 'Bermasyarakat',
    tagline: 'Tebar manfaat, rawat gotong royong, dan peduli sesama',
    category: 'Sosial',
    targetTime: 'Lingkungan Sekolah, Rumah, & Komunitas',
    points: 15,
    icon: 'Users',
    accentColor: 'from-teal-500 to-emerald-700',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Menjadi agen kebaikan di lingkungan sekitar: menghormati orang tua dan guru, menyapa teman dengan santun, menjaga kebersihan ruang publik, aktif dalam kegiatan sosial/OSIS/pramuka, dan membiasakan gotong royong.',
    benefits: [
      'Melatih kepemimpinan, komunikasi antarpribadi, dan resolusi konflik',
      'Menciptakan lingkungan sekolah yang aman dari perundungan (anti-bullying)',
      'Menumbuhkan rasa cinta tanah air dan persaudaraan Bhinneka Tunggal Ika',
      'Memperluas jejaring pertemanan positif yang saling mendukung'
    ],
    tips: [
      'Terapkan 5S: Senyum, Salam, Sapa, Sopan, Santun kepada guru, satpam, dan rekan sekolah.',
      'Tawarkan bantuan kecil di rumah, misalnya menyapu lantai atau mencuci piring sendiri.',
      'Bantu teman yang kesulitan memahami materi pelajaran tanpa pamrih.',
      'Pungut sampah yang berserakan di lorong sekolah dan buang pada tempatnya.'
    ],
    options: [
      'Membantu pekerjaan orang tua / keluarga di rumah',
      'Aktif bergotong royong membersihkan kelas / lingkungan sekitar',
      'Menolong teman sekelas yang kesulitan belajar atau sedang tertimpa musibah',
      'Berpartisipasi aktif dalam kegiatan OSIS / ekskul / bakti sosial'
    ]
  },
  {
    id: 'tidur_cepat',
    order: 7,
    title: 'Tidur Cepat',
    tagline: 'Istirahat berkualitas untuk pemulihan otak dan tubuh',
    category: 'Kedisiplinan',
    targetTime: 'Maksimal 21.30 - 22.00 WIB',
    points: 15,
    icon: 'Moon',
    accentColor: 'from-indigo-600 to-purple-700',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Tidur tepat waktu sebelum pukul 22.00 WIB untuk mendapatkan 7-8 jam istirahat pulas. Menghindari "doom-scrolling" gawai larut malam agar hormon melatonin bekerja maksimal meregenerasi sel-sel saraf otak.',
    benefits: [
      'Konsolidasi memori otak: materi yang dipelajari siang hari disimpan ke ingatan jangka panjang',
      'Menjaga suasana hati tetap ceria dan mencegah depresi atau kecemasan remaja',
      'Menguatkan sistem kekebalan tubuh dan menjaga kesegaran kulit',
      'Memastikan bangun pagi esok hari dengan mata bugar tanpa rasa kantuk'
    ],
    tips: [
      'Aktifkan mode malam / "Do Not Disturb" pada HP 30 menit sebelum jadwal tidur.',
      'Redupkan lampu kamar tidur dan jaga suhu ruangan tetap sejuk dan hening.',
      'Hindari makan berat dan minuman berkafein (kopi, teh pekat) setelah pukul 19.00.',
      'Lakukan pernapasan relaksasi 4-7-8 untuk menenangkan detak jantung sebelum memejamkan mata.'
    ],
    options: [
      'Tidur tepat waktu sebelum pukul 21.30 WIB',
      'Tidur sebelum pukul 22.00 WIB dan mematikan notifikasi HP',
      'Membaca buku santai atau relaksasi tanpa layar gadget sebelum tidur',
      'Mencapai tidur cukup 7 hingga 8 jam penuh semalam'
    ]
  }
];

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'first_step',
    title: 'Langkah Pertama Juara',
    description: 'Menandai kebiasaan 7KAIH pertama kali dengan penuh komitmen.',
    category: 'Pencapaian',
    icon: 'Sparkles',
    rarity: 'Pemula',
    pointsRequired: 15,
    unlocked: false
  },
  {
    id: 'fajar_menyingsing',
    title: 'Ksatria Fajar',
    description: 'Konsisten bangun pagi sebelum matahari terbit selama 3 hari beruntun.',
    category: 'Kedisiplinan',
    icon: 'Sunrise',
    rarity: 'Terampil',
    habitSpecific: 'bangun_pagi',
    streakRequired: 3,
    unlocked: false
  },
  {
    id: 'jiwa_sehat',
    title: 'Raga Tangguh Bugar',
    description: 'Rutin berolahraga minimal 20 menit untuk menjaga stamina prima.',
    category: 'Kesehatan',
    icon: 'Activity',
    rarity: 'Terampil',
    habitSpecific: 'berolahraga',
    pointsRequired: 60,
    unlocked: false
  },
  {
    id: 'cendekiawan_muda',
    title: 'Cendekiawan Muda',
    description: 'Menyelesaikan kebiasaan gemar belajar mandiri dengan tekun.',
    category: 'Intelektual',
    icon: 'GraduationCap',
    rarity: 'Teladan',
    habitSpecific: 'gemar_belajar',
    pointsRequired: 100,
    unlocked: false
  },
  {
    id: 'duta_kebaikan',
    title: 'Duta Sahabat Sosial',
    description: 'Aktif bergotong royong dan membantu sesama di sekolah maupun rumah.',
    category: 'Sosial',
    icon: 'Users',
    rarity: 'Teladan',
    habitSpecific: 'bermasyarakat',
    pointsRequired: 80,
    unlocked: false
  },
  {
    id: 'disiplin_emas',
    title: 'Bintang 7KAIH Paripurna',
    description: 'Menyelesaikan seluruh 7 kebiasaan lengkap dalam satu hari penuh.',
    category: 'Spesial',
    icon: 'Award',
    rarity: 'Teladan',
    pointsRequired: 135,
    unlocked: false
  },
  {
    id: 'generasi_emas_2045',
    title: 'Pionir Generasi Emas',
    description: 'Meraih total lebih dari 500 poin 7KAIH untuk masa depan gemilang.',
    category: 'Legenda',
    icon: 'Crown',
    rarity: 'Legenda',
    pointsRequired: 500,
    unlocked: false
  }
];


export const INITIAL_STUDENT_PROFILE = {
  name: '',
  age: 0,
  school: 'SMA Negeri Indonesia Hebat',
  grade: 'Tingkat SMA',
  nisn: '',
  avatarIcon: 'GraduationCap',
  motto: 'Karakter unggul, masa depan cerah untuk Indonesia Hebat!',
  isRegistered: false,
};

export const INITIAL_CLASS_STUDENTS: any[] = [
  {
    id: 'std_01',
    nisn: '0078921456',
    name: 'Ahmad Faiz Pratama',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 94,
    totalPoints: 345,
    streak: 6,
    todayCompletedCount: 5,
    lastActive: 'Hari ini, 06.15 WIB',
    strongestHabit: 'Gemar Belajar',
    habitNeedsEncouragement: 'Tidur Cepat',
    teacherNote: 'Sangat tekun dan sopan di kelas, pertahankan istirahat teratur.'
  },
  {
    id: 'std_02',
    nisn: '0078921457',
    name: 'Siti Nurhaliza',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 98,
    totalPoints: 410,
    streak: 9,
    todayCompletedCount: 6,
    lastActive: 'Hari ini, 06.00 WIB',
    strongestHabit: 'Beribadah',
    habitNeedsEncouragement: 'Berolahraga',
    teacherNote: 'Teladan bagi teman-teman, selalu tepat waktu dan santun.'
  },
  {
    id: 'std_03',
    nisn: '0078921458',
    name: 'Bima Satria Yudha',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 86,
    totalPoints: 290,
    streak: 4,
    todayCompletedCount: 4,
    lastActive: 'Hari ini, 07.10 WIB',
    strongestHabit: 'Berolahraga',
    habitNeedsEncouragement: 'Gemar Belajar',
    teacherNote: 'Semangat atletik luar biasa, perlu pendampingan manajemen waktu belajar.'
  },
  {
    id: 'std_04',
    nisn: '0078921459',
    name: 'Cantika Putri Maharani',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 92,
    totalPoints: 360,
    streak: 7,
    todayCompletedCount: 5,
    lastActive: 'Hari ini, 06.30 WIB',
    strongestHabit: 'Makan Sehat & Bergizi',
    habitNeedsEncouragement: 'Tidur Cepat',
    teacherNote: 'Siswa ceria, aktif membagikan tips bekal sehat kepada kawan.'
  },
  {
    id: 'std_05',
    nisn: '0078921460',
    name: 'David Christian',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 88,
    totalPoints: 310,
    streak: 5,
    todayCompletedCount: 4,
    lastActive: 'Kemarin, 21.00 WIB',
    strongestHabit: 'Bermasyarakat',
    habitNeedsEncouragement: 'Bangun Pagi',
    teacherNote: 'Jiwa sosial tinggi, aktif membantu teman dalam kerja kelompok.'
  },
  {
    id: 'std_06',
    nisn: '0078921461',
    name: 'Eka Lestari',
    grade: 'XI MIPA 1',
    weeklyAttendanceRate: 90,
    totalPoints: 325,
    streak: 5,
    todayCompletedCount: 5,
    lastActive: 'Hari ini, 06.45 WIB',
    strongestHabit: 'Beribadah',
    habitNeedsEncouragement: 'Berolahraga',
    teacherNote: 'Konsisten dalam kehadiran dan disiplin mengerjakan tugas.'
  }
];

export const HABIT_MOTIVATIONAL_QUOTES: Record<HabitId, string> = {
  bangun_pagi: 'Bangun lebih awal bukan hanya tentang mengalahkan waktu, tetapi tentang mempersiapkan diri untuk meraih kesempatan baru.',
  beribadah: 'Jadikan ibadah sebagai bagian dari kehidupan yang menguatkan hati, membimbing tindakan, dan menumbuhkan rasa syukur.',
  berolahraga: 'Tubuh yang aktif membantu kita menjalani hari dengan lebih bersemangat. Mulailah dari gerakan kecil dan lakukan secara teratur.',
  makan_sehat: 'Jaga tubuhmu dengan makanan bergizi. Tubuh yang dirawat dengan baik mendukungmu belajar, tumbuh, dan berkarya.',
  gemar_belajar: 'Kamu tidak harus mengetahui semuanya hari ini. Pelajari satu hal baru setiap hari dan teruslah melangkah.',
  bermasyarakat: 'Jadilah anak hebat bukan hanya karena prestasimu, tetapi juga karena kebaikan yang kamu berikan kepada orang lain dan lingkunganmu.',
  tidur_cepat: 'Istirahat adalah bagian dari perjuangan. Berikan tubuh dan pikiranmu waktu untuk pulih agar siap menyambut esok hari.',
};

export interface PersonalizedMotivation {
  id: string;
  template: (name: string, age: number) => string;
  challenge: string;
  recommendedHabitId: 'bangun_pagi' | 'beribadah' | 'berolahraga' | 'makan_sehat' | 'gemar_belajar' | 'bermasyarakat' | 'tidur_cepat';
}

export const PERSONALIZED_MOTIVATIONS: PersonalizedMotivation[] = [
  {
    id: 'mot_1',
    template: (name, age) =>
      `Halo, ${name}! Kamu berusia ${age} tahun dan hari ini adalah kesempatan baru untuk menjadi lebih baik. Tidak perlu langsung sempurna. Mulailah dengan satu kebiasaan baik, lakukan dengan konsisten, dan teruslah berkembang!`,
    challenge: 'Pilih satu kebiasaan yang belum kamu lakukan secara konsisten dan buat rencana sederhana untuk melaksanakannya.',
    recommendedHabitId: 'bangun_pagi'
  },
  {
    id: 'mot_2',
    template: (name, _age) =>
      `Halo, ${name}! Jangan menunggu sampai kamu merasa siap untuk memulai. Mulailah dari hal kecil yang bisa kamu lakukan hari ini. Setiap kebiasaan baik adalah langkah menuju versi dirimu yang lebih hebat.`,
    challenge: 'Luangkan 15 menit hari ini untuk menggerakkan tubuhmu atau membaca materi baru yang menarik.',
    recommendedHabitId: 'berolahraga'
  },
  {
    id: 'mot_3',
    template: (name, age) =>
      `Semangat pagi, ${name}! Usia ${age} tahun adalah masa keemasan untuk menanam kebiasaan juara. Satu tindakan baik hari ini akan berbuah kesuksesan besar di masa depan.`,
    challenge: 'Tuliskan satu target belajar atau ibadah yang ingin kamu selesaikan dengan fokus hari ini.',
    recommendedHabitId: 'gemar_belajar'
  },
  {
    id: 'mot_4',
    template: (name, _age) =>
      `Halo, ${name}! Kehebatan sejati dibangun dari hal-hal kecil yang diulang setiap hari dengan penuh kesabaran dan cinta.`,
    challenge: 'Bagikan satu kebaikan sederhana untuk teman, guru, atau keluarga di sekitarmu hari ini.',
    recommendedHabitId: 'bermasyarakat'
  },
  {
    id: 'mot_5',
    template: (name, _age) =>
      `Halo, ${name}! Tubuh dan pikiranmu adalah aset paling berharga. Berikan nutrisi terbaik dan istirahat yang cukup malam ini.`,
    challenge: 'Rencanakan makan sarapan bergizi dan siapkan target tidur sebelum pukul 22.00 WIB.',
    recommendedHabitId: 'makan_sehat'
  }
];

export const DAILY_QUOTES = [
  {
    quote: 'Masa depan Indonesia ada di tangan anak-anak muda yang berkarakter kuat, sehat raganya, dan cerdas pikirannya.',
    author: 'Inspirasi Pelajar Pancasila'
  },
  {
    quote: 'Kebiasaan kecil yang kamu lakukan hari ini dengan disiplin akan menjadi nasib besar yang membanggakan esok hari.',
    author: 'Filosofi 7KAIH'
  },
  {
    quote: 'Bukan kecerdasan semata yang menentukan puncak prestasimu, melainkan ketekunan dan akhlak mulia dalam melangkah.',
    author: 'Pendidikan Karakter SMA'
  },
  {
    quote: 'Tidur cepat dan bangun pagi adalah hadiah terbaik yang bisa kamu berikan pada otakmu untuk menaklukkan hari esok.',
    author: 'Sains Kebugaran Otak'
  }
];
