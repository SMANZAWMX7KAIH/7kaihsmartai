import React, { useEffect, useRef } from 'react';

/**
 * IndonesianStudentsBackground - Latar Belakang Animasi Ilustrasi 2D Anak Indonesia
 * 
 * Menampilkan:
 * 1. Beberapa anak sekolah Indonesia (Siswa & Siswi SMA) dengan seragam sekolah rapi,
 *    ekspresi ceria, ramah, dan penuh semangat pendidikan.
 * 2. Bendera Merah Putih yang berkibar tertiup angin secara halus dan terus-menerus
 *    (bendera utama pada tiang + bendera kecil di tangan siswa).
 * 3. Gerakan alami yang hidup: napas/ayunan tubuh halus, kedipan mata kartun, rambut
 *    dan dasi yang bergoyang tertiup angin, serta awan berarak di langit cerah.
 * 4. Penataan di latar belakang & sisi halaman dengan lapisan pelindung keterbacaan (scrim)
 *    agar seluruh teks, kartu, tombol, dan menu tetap kontras dan nyaman dibaca.
 * 5. Mendukung 'prefers-reduced-motion' dan hemat daya di HP maupun desktop.
 */

// Helper fungsi gambar persegi melengkung (roundRect) dengan fallback penuh untuk peramban Android lama
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number | number[] = 0
) {
  if (typeof (ctx as any).roundRect === 'function') {
    try {
      (ctx as any).roundRect(x, y, w, h, radii);
      return;
    } catch {}
  }
  let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] || 0 : 0);
  r = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

export const IndonesianStudentsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    // Deteksi prefers-reduced-motion kompatibel dengan peramban HP Android lama
    let isReducedMotion = false;
    let mediaQuery: MediaQueryList | null = null;
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        isReducedMotion = Boolean(mediaQuery.matches);
      }
    } catch {}

    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      isReducedMotion = Boolean(e.matches);
    };

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMotionChange);
      } else if (typeof (mediaQuery as any).addListener === 'function') {
        (mediaQuery as any).addListener(handleMotionChange);
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        if (typeof ctx.resetTransform === 'function') {
          ctx.resetTransform();
        } else {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.scale(dpr, dpr);
      } catch (e) {
        console.warn('Canvas resize error caught:', e);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Variasi awan 2D di langit
    const clouds = [
      { x: 0.15 * width, y: 70, scale: 1.1, speed: 0.25 },
      { x: 0.55 * width, y: 110, scale: 0.85, speed: 0.18 },
      { x: 0.82 * width, y: 60, scale: 1.3, speed: 0.3 },
      { x: -0.1 * width, y: 140, scale: 0.95, speed: 0.22 },
    ];

    // Partikel cahaya semangat keemasan
    const sparkles = Array.from({ length: 18 }, (_, i) => ({
      x: (i * 0.055 * width + 50) % width,
      y: (i * 45 + 80) % (height * 0.85),
      size: 2 + (i % 3) * 1.5,
      speed: 0.4 + (i % 4) * 0.2,
      phase: i * 0.7,
    }));

    // Gambar Awan Kartun Halus
    const drawCartoonCloud = (cx: number, cy: number, scale: number) => {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(cx, cy, 26 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 24 * scale, cy - 12 * scale, 32 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 56 * scale, cy - 8 * scale, 28 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 80 * scale, cy + 4 * scale, 24 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 38 * scale, cy + 14 * scale, 28 * scale, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // Cloud soft highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(cx + 26 * scale, cy - 15 * scale, 18 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 54 * scale, cy - 12 * scale, 16 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Fungsi Penggambaran Bendera Merah Putih Berkibar (Realtime Wave Cloth Simulation)
    const drawWavingFlag = (
      originX: number,
      originY: number,
      flagWidth: number,
      flagHeight: number,
      windPhase: number,
      clothFrequency = 0.045,
      waveHeight = 14
    ) => {
      ctx.save();
      const step = 3;
      const numSteps = Math.ceil(flagWidth / step);

      for (let i = 0; i < numSteps; i++) {
        const x = originX + i * step;
        const progress = i / numSteps;
        // Amp bertambah semakin jauh dari tiang
        const amp = progress * waveHeight;
        const yOffset = Math.sin(progress * 12 - windPhase * 3.5) * amp +
                        Math.sin(progress * 24 - windPhase * 5.2) * (amp * 0.35);

        // Slope untuk bayangan / kilau kain
        const slope = Math.cos(progress * 12 - windPhase * 3.5) * amp;
        const shadow = Math.sin(slope * 0.15);

        const currentTop = originY + yOffset;
        const currentMid = originY + flagHeight * 0.5 + yOffset;
        const currentBottom = originY + flagHeight + yOffset;

        // Bagian MERAH
        ctx.fillStyle = '#D6001C';
        ctx.fillRect(x, currentTop, step + 0.5, currentMid - currentTop);

        // Shading kain merah
        if (shadow < 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.28, -shadow * 0.4)})`;
          ctx.fillRect(x, currentTop, step + 0.5, currentMid - currentTop);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.25, shadow * 0.35)})`;
          ctx.fillRect(x, currentTop, step + 0.5, currentMid - currentTop);
        }

        // Bagian PUTIH
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, currentMid, step + 0.5, currentBottom - currentMid);

        // Shading kain putih
        if (shadow < 0) {
          ctx.fillStyle = `rgba(71, 85, 105, ${Math.min(0.25, -shadow * 0.35)})`;
          ctx.fillRect(x, currentMid, step + 0.5, currentBottom - currentMid);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.3, shadow * 0.4)})`;
          ctx.fillRect(x, currentMid, step + 0.5, currentBottom - currentMid);
        }
      }
      ctx.restore();
    };

    // Fungsi Penggambaran Karakter Kartun 2D Murid Indonesia
    // 1. Siswa Laki-laki memegang tiang bendera besar
    const drawBoyWithBigFlag = (
      baseX: number,
      baseY: number,
      scale: number,
      windPhase: number,
      blinkProgress: number
    ) => {
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.scale(scale, scale);

      // Ayunan napas lembut
      const breathY = isReducedMotion ? 0 : Math.sin(windPhase * 2) * 2;
      const windSway = isReducedMotion ? 0 : Math.sin(windPhase * 2.5) * 0.025;

      ctx.rotate(windSway);

      // Tiang Bendera
      const poleX = 35;
      const poleTopY = -280;
      const poleBottomY = 40;

      // Tiang bambu / logam perak
      const poleGrad = ctx.createLinearGradient(poleX - 4, 0, poleX + 4, 0);
      poleGrad.addColorStop(0, '#cbd5e1');
      poleGrad.addColorStop(0.5, '#f8fafc');
      poleGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = poleGrad;
      ctx.fillRect(poleX - 3.5, poleTopY, 7, poleBottomY - poleTopY);

      // Ujung emas tiang bendera (golden finial)
      const finialGrad = ctx.createRadialGradient(poleX, poleTopY, 1, poleX, poleTopY, 8);
      finialGrad.addColorStop(0, '#fef08a');
      finialGrad.addColorStop(0.7, '#eab308');
      finialGrad.addColorStop(1, '#a16207');
      ctx.fillStyle = finialGrad;
      ctx.beginPath();
      ctx.arc(poleX, poleTopY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Bendera Merah Putih Utama Berkibar di Tiang
      drawWavingFlag(poleX + 3.5, poleTopY + 4, 160, 95, windPhase, 0.05, 16);

      // Tali pengikat tiang
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(poleX, poleTopY + 12);
      ctx.lineTo(poleX - 10, poleTopY + 30);
      ctx.lineTo(poleX, poleTopY + 45);
      ctx.stroke();

      // --- BADAN & SERAGAM SISWA (SMA PUTIH ABU-ABU) ---
      // Kaki & Celana Abu-abu SMA
      ctx.fillStyle = '#64748b'; // Abu-abu seragam SMA
      ctx.beginPath();
      drawRoundRect(ctx, -22, -40 + breathY, 18, 75, 4);
      drawRoundRect(ctx, 4, -40 + breathY, 18, 75, 4);
      ctx.fill();

      // Sepatu hitam sekolah rapi
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      drawRoundRect(ctx, -24, 30 + breathY, 22, 14, 4);
      drawRoundRect(ctx, 2, 30 + breathY, 22, 14, 4);
      ctx.fill();

      // Kemeja Putih Siswa
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      drawRoundRect(ctx, -28, -125 + breathY, 56, 90, 8);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Sabuk hitam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-28, -38 + breathY, 56, 8);
      ctx.fillStyle = '#f59e0b'; // Kepala sabuk kuningan
      ctx.fillRect(-5, -39 + breathY, 10, 10);

      // Kantong Kemeja dengan Lambang OSIS & Merah Putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, -100 + breathY, 14, 16);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(8, -100 + breathY, 14, 16);

      // Pita kecil Merah Putih di kantong
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(10, -96 + breathY, 10, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, -93 + breathY, 10, 3);

      // Dasi Abu-abu SMA
      const tieWave = Math.sin(windPhase * 3.5) * 4;
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(0, -122 + breathY);
      ctx.lineTo(-7, -108 + breathY);
      ctx.lineTo(-5 + tieWave, -68 + breathY);
      ctx.lineTo(0 + tieWave, -60 + breathY);
      ctx.lineTo(5 + tieWave, -68 + breathY);
      ctx.lineTo(7, -108 + breathY);
      ctx.closePath();
      ctx.fill();

      // Kerah kemeja putih
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-16, -125 + breathY);
      ctx.lineTo(0, -112 + breathY);
      ctx.lineTo(16, -125 + breathY);
      ctx.lineTo(0, -120 + breathY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      // Lengan Kiri & Kanan memegang tiang bendera
      // Lengan kiri (belakang)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-26, -118 + breathY);
      ctx.lineTo(-38, -90 + breathY);
      ctx.lineTo(-30, -82 + breathY);
      ctx.lineTo(-20, -108 + breathY);
      ctx.closePath();
      ctx.fill();

      // Tangan kanan memegang erat tiang bendera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(22, -120 + breathY);
      ctx.lineTo(poleX, -102 + breathY);
      ctx.lineTo(poleX - 6, -92 + breathY);
      ctx.lineTo(16, -104 + breathY);
      ctx.closePath();
      ctx.fill();

      // Telapak tangan memegang tiang
      ctx.fillStyle = '#fed7aa'; // Warna kulit hangat alami
      ctx.beginPath();
      ctx.arc(poleX, -98 + breathY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Leher
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-8, -135 + breathY, 16, 14);

      // --- KEPALA & WAJAH CERIA SISWA ---
      // Kepala
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(0, -155 + breathY, 20, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pipi Merona Ceria (Rosy Cheeks)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.beginPath();
      ctx.arc(-11, -150 + breathY, 4.5, 0, Math.PI * 2);
      ctx.arc(11, -150 + breathY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Mata Kartun Ceria & Berkedip
      if (blinkProgress > 0.88) {
        // Mata terpejam saat berkedip (senyum mata bahagia)
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-8, -156 + breathY, 4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.arc(8, -156 + breathY, 4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else {
        // Mata terbuka cerah & binar harapan
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-8, -156 + breathY, 3.5, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(8, -156 + breathY, 3.5, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Binar mata putih
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-9, -158 + breathY, 1.5, 0, Math.PI * 2);
        ctx.arc(7, -158 + breathY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Alis ramah
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-8, -164 + breathY, 5, 1.2 * Math.PI, 1.8 * Math.PI);
      ctx.arc(8, -164 + breathY, 5, 1.2 * Math.PI, 1.8 * Math.PI);
      ctx.stroke();

      // Senyum Hangat Ceria Pelajar
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.arc(0, -147 + breathY, 6.5, 0, Math.PI);
      ctx.fill();
      // Gigi putih bersih dalam senyuman
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -147 + breathY, 5.5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.fill();

      // Rambut Rapi Siswa Indonesia
      const hairWind = Math.sin(windPhase * 2.8) * 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -162 + breathY, 22, Math.PI, 2 * Math.PI);
      ctx.lineTo(21, -155 + breathY);
      ctx.lineTo(16 + hairWind, -172 + breathY);
      ctx.lineTo(-3, -178 + breathY);
      ctx.lineTo(-20, -170 + breathY);
      ctx.lineTo(-21, -155 + breathY);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // 2. Siswi Perempuan memegang bendera kecil berkibar & melambai ceria
    const drawGirlWithSmallFlag = (
      baseX: number,
      baseY: number,
      scale: number,
      windPhase: number,
      blinkProgress: number
    ) => {
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.scale(scale, scale);

      const breathY = isReducedMotion ? 0 : Math.sin(windPhase * 2 + 1.2) * 2.2;
      const windSway = isReducedMotion ? 0 : Math.sin(windPhase * 2.2 + 0.8) * 0.03;

      ctx.rotate(windSway);

      // Kaki & Rok Abu-abu SMA
      ctx.fillStyle = '#64748b'; // Rok lipit SMA
      ctx.beginPath();
      ctx.moveTo(-22, -45 + breathY);
      ctx.lineTo(22, -45 + breathY);
      ctx.lineTo(28, 5 + breathY);
      ctx.lineTo(-28, 5 + breathY);
      ctx.closePath();
      ctx.fill();

      // Garis lipatan rok
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-10, -45 + breathY);
      ctx.lineTo(-14, 5 + breathY);
      ctx.moveTo(0, -45 + breathY);
      ctx.lineTo(0, 5 + breathY);
      ctx.moveTo(10, -45 + breathY);
      ctx.lineTo(14, 5 + breathY);
      ctx.stroke();

      // Kaus kaki putih & sepatu hitam
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-18, 5 + breathY, 10, 22);
      ctx.fillRect(8, 5 + breathY, 10, 22);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      drawRoundRect(ctx, -20, 24 + breathY, 15, 12, 3);
      drawRoundRect(ctx, 6, 24 + breathY, 15, 12, 3);
      ctx.fill();

      // Kemeja Putih Siswi
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      drawRoundRect(ctx, -24, -120 + breathY, 48, 78, 6);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Dasi pita / dasi rapi siswi
      ctx.fillStyle = '#dc2626'; // Aksen merah simbol kebangsaan
      ctx.beginPath();
      ctx.arc(0, -108 + breathY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -108 + breathY);
      ctx.lineTo(-8, -98 + breathY);
      ctx.lineTo(0, -96 + breathY);
      ctx.lineTo(8, -98 + breathY);
      ctx.closePath();
      ctx.fill();

      // Kerah kemeja rapi
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(-14, -120 + breathY);
      ctx.lineTo(0, -108 + breathY);
      ctx.lineTo(14, -120 + breathY);
      ctx.closePath();
      ctx.fill();

      // Tangan kanan memegang bendera kecil di atas kepala
      const armWave = Math.sin(windPhase * 3) * 0.08;
      ctx.save();
      ctx.translate(20, -105 + breathY);
      ctx.rotate(-0.45 + armWave);

      // Lengan baju putih
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      drawRoundRect(ctx, 0, -8, 38, 12, 6);
      ctx.fill();

      // Telapak tangan memegang tangkai bendera
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(38, -2, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Tangkai bendera kayu halus
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(38, 18);
      ctx.lineTo(38, -48);
      ctx.stroke();

      // Bendera Merah Putih Kecil yang Berkibar Cepat
      drawWavingFlag(39, -46, 56, 32, windPhase * 1.3, 0.08, 9);
      ctx.restore();

      // Tangan kiri di samping tubuh dengan anggun
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      drawRoundRect(ctx, -26, -112 + breathY, 12, 42, 6);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(-20, -68 + breathY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Leher
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-7, -130 + breathY, 14, 12);

      // Kepala
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(0, -148 + breathY, 19, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pipi Merona Ceria
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(-10, -144 + breathY, 4, 0, Math.PI * 2);
      ctx.arc(10, -144 + breathY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Mata Kartun Ceria
      if (blinkProgress > 0.88) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(-7, -150 + breathY, 3.5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.arc(7, -150 + breathY, 3.5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-7, -150 + breathY, 3.2, 4.8, 0, 0, Math.PI * 2);
        ctx.ellipse(7, -150 + breathY, 3.2, 4.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-8, -152 + breathY, 1.4, 0, Math.PI * 2);
        ctx.arc(6, -152 + breathY, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Senyuman Manis Pelajar Putri
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, -141 + breathY, 6, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -141 + breathY, 5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.fill();

      // Rambut Dikuncir Rapi (Ponytail) dengan Pita Merah Putih
      const ponyWave = Math.sin(windPhase * 3.2) * 4;
      ctx.fillStyle = '#1e1b4b'; // Rambut hitam kebiruan mengkilap
      ctx.beginPath();
      ctx.arc(0, -155 + breathY, 21, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();

      // Kuncir kuda ke samping kanan tertiup angin
      ctx.beginPath();
      ctx.moveTo(14, -156 + breathY);
      ctx.quadraticCurveTo(34 + ponyWave, -164 + breathY, 36 + ponyWave, -140 + breathY);
      ctx.quadraticCurveTo(24, -144 + breathY, 12, -148 + breathY);
      ctx.closePath();
      ctx.fill();

      // Pita Merah Putih di Kuncir
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(16, -156 + breathY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(16, -156 + breathY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // 3. Siswi Berjilbab Putih Rapi memegang Buku Panduan 7 Kebiasaan
    const drawHijabStudentWithBook = (
      baseX: number,
      baseY: number,
      scale: number,
      windPhase: number,
      blinkProgress: number
    ) => {
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.scale(scale, scale);

      const breathY = isReducedMotion ? 0 : Math.sin(windPhase * 2 + 2.4) * 2;
      const windSway = isReducedMotion ? 0 : Math.sin(windPhase * 2.3 + 1.5) * 0.02;
      ctx.rotate(windSway);

      // Rok Panjang Abu-abu SMA
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      drawRoundRect(ctx, -24, -30 + breathY, 48, 65, 4);
      ctx.fill();

      // Sepatu hitam rapi
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      drawRoundRect(ctx, -18, 30 + breathY, 14, 10, 3);
      drawRoundRect(ctx, 4, 30 + breathY, 14, 10, 3);
      ctx.fill();

      // Kemeja Lengan Panjang Putih
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      drawRoundRect(ctx, -26, -118 + breathY, 52, 90, 8);
      ctx.fill();

      // Jilbab Putih Rapi Siswi SMA Indonesia
      const hijabFlutter = Math.sin(windPhase * 2.8) * 3;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      // Bentuk jilbab menutup dada dengan rapi
      ctx.moveTo(0, -165 + breathY);
      ctx.bezierCurveTo(-26, -165 + breathY, -30, -110 + breathY, -26 + hijabFlutter, -85 + breathY);
      ctx.lineTo(0, -78 + breathY);
      ctx.lineTo(26 + hijabFlutter, -85 + breathY);
      ctx.bezierCurveTo(30, -110 + breathY, 26, -165 + breathY, 0, -165 + breathY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Bukaan Wajah pada Jilbab
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(0, -145 + breathY, 14, 17, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pipi merona
      ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.beginPath();
      ctx.arc(-8, -142 + breathY, 3.5, 0, Math.PI * 2);
      ctx.arc(8, -142 + breathY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Mata Kartun Ceria & Berkedip
      if (blinkProgress > 0.88) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(-6, -147 + breathY, 3, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.arc(6, -147 + breathY, 3, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-6, -147 + breathY, 2.8, 4.2, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -147 + breathY, 2.8, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-7, -149 + breathY, 1.2, 0, Math.PI * 2);
        ctx.arc(5, -149 + breathY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Senyum Hangat & Santun
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, -137 + breathY, 5, 0, Math.PI);
      ctx.fill();

      // Buku Pelajaran dipegang di depan dada
      // Buku Bersampul Merah Putih
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      drawRoundRect(ctx, -18, -100 + breathY, 36, 26, 3);
      ctx.fill();

      // Lembaran halaman putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-18, -96 + breathY, 36, 18);

      // Teks mini pada buku
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('7 KEBIASAAN', 0, -88 + breathY);
      ctx.fillText('INDONESIA', 0, -81 + breathY);

      // Tangan memegang buku
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(-16, -88 + breathY, 5, 0, Math.PI * 2);
      ctx.arc(16, -88 + breathY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Loop Animasi Utama (60 FPS Silky Smooth)
    const render = () => {
      try {
        time += isReducedMotion ? 0.005 : 0.024;

        ctx.clearRect(0, 0, width, height);

        // 1. Langit Biru Cerah Nusantara (Indonesian Morning Sky Gradient)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#5ea2f8'); // Biru langit cerah
        skyGrad.addColorStop(0.35, '#93c5fd'); // Biru muda cerah
        skyGrad.addColorStop(0.65, '#dbeafe'); // Biru pastel
        skyGrad.addColorStop(1, '#f8fafc'); // Putih lembut
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sinar Matahari Pagi Hangat di Kanan Atas
        const sunX = width * 0.88;
        const sunY = 75;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, Math.max(width, height) * 0.6);
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
        sunGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.15)');
        sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Awan Kartun Berarak Lembut
        clouds.forEach((cloud) => {
          cloud.x += cloud.speed;
          if (cloud.x > width + 100) {
            cloud.x = -120;
          }
          drawCartoonCloud(cloud.x, cloud.y, cloud.scale);
        });

        // 3. Bukit Hijau Bergelombang di Horizon (Indonesian Lush Rolling Hills)
        // Bukit Jauh
        ctx.fillStyle = 'rgba(187, 247, 208, 0.55)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, height * 0.72);
        ctx.bezierCurveTo(width * 0.25, height * 0.68, width * 0.65, height * 0.76, width, height * 0.7);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Bukit Depan (Lebih cerah & segar)
        ctx.fillStyle = 'rgba(134, 239, 172, 0.65)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, height * 0.82);
        ctx.bezierCurveTo(width * 0.35, height * 0.76, width * 0.75, height * 0.85, width, height * 0.79);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // 4. Partikel Cahaya Semangat & Binar Keemasan
        sparkles.forEach((s) => {
          s.y -= s.speed;
          if (s.y < 0) s.y = height * 0.85;
          const alpha = Math.sin(time * 3 + s.phase) * 0.35 + 0.35;
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // 5. Perhitungan Siklus Kedipan Mata Kartun Alami
        // Setiap ~3.5 detik mata berkedip cepat
        const blinkCycle = (time * 0.5) % 3.5;
        const blinkProgress = blinkCycle > 3.35 ? 1 : 0;

        // 6. Penempatan Dinamis Murid-Murid Indonesia Berseragam Sekolah
        // Diposisikan di sisi kanan bawah dan sisi halaman agar elegan dan tidak menutupi konten
        const isMobile = width < 768;

        if (isMobile) {
          // Tampilan Layar HP: Ditempatkan di pojok kanan bawah secara proporsional
          const mobileScale = 0.82;
          const anchorX = width * 0.82;
          const anchorY = height * 0.94;

          // Siswa Pembawa Tiang Bendera Merah Putih
          drawBoyWithBigFlag(anchorX, anchorY, mobileScale, time, blinkProgress);
          // Siswi dengan Bendera Kecil di sampingnya
          drawGirlWithSmallFlag(anchorX - 70, anchorY + 12, mobileScale * 0.92, time, blinkProgress);
        } else {
          // Tampilan Layar Komputer / Tablet:
          // Komposisi 3 Murid Ceria di sisi kanan bawah dengan bendera berkibar gagah
          const baseScale = 1.05;
          const groupRightX = width * 0.86;
          const groupBottomY = height * 0.96;

          // Siswa Laki-laki memegang tiang bendera Merah Putih utama
          drawBoyWithBigFlag(groupRightX, groupBottomY, baseScale, time, blinkProgress);

          // Siswi Ceria memegang bendera tangan kecil & melambai
          drawGirlWithSmallFlag(groupRightX - 105, groupBottomY + 15, baseScale * 0.96, time, blinkProgress);

          // Siswi Berjilbab Rapi memegang Buku Panduan 7 Kebiasaan
          drawHijabStudentWithBook(groupRightX - 200, groupBottomY + 20, baseScale * 0.94, time, blinkProgress);
        }
      } catch (renderError) {
        console.warn('Silent canvas render frame catch:', renderError);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleMotionChange);
        } else if (typeof (mediaQuery as any).removeListener === 'function') {
          (mediaQuery as any).removeListener(handleMotionChange);
        }
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Kanvas Animasi 2D Anak Indonesia & Bendera Merah Putih Berkibar */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />

      {/* Lapisan Transparan Pelindung Keterbacaan Teks (Readability Scrim Overlay) */}
      {/* Memastikan seluruh judul, teks, kartu kebiasaan, checklist, dan asisten AI tetap sangat jelas dan nyaman dibaca */}
      <div className="absolute inset-0 bg-linear-to-b from-white/75 via-white/85 to-slate-50/92 backdrop-blur-[0.5px]" />
    </div>
  );
};
