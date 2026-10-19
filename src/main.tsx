import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    // Tandai data-loaded setelah mounting dijadwalkan
    rootElement.setAttribute('data-loaded', 'true');
  } catch (err) {
    console.error('Fatal initialization error:', err);
    try {
      rootElement.removeAttribute('data-loaded');
      rootElement.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: #f8fafc; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; text-align: center;">
          <div style="max-width: 380px; width: 100%; background: #ffffff; border-radius: 1.5rem; padding: 2rem 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); border: 1px solid #fecaca;">
            <div style="width: 56px; height: 56px; border-radius: 1rem; background: linear-gradient(135deg, #dc2626, #e11d48); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; margin: 0 auto 1rem; box-shadow: 0 8px 16px -4px rgba(220, 38, 38, 0.3);">
              7K
            </div>
            <span style="font-size: 0.6875rem; font-weight: 800; color: #dc2626; background: #fee2e2; padding: 0.25rem 0.625rem; border-radius: 9999px; display: inline-block; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
              🇮🇩 7KAIH SMART AI
            </span>
            <h2 style="font-size: 1.125rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem;">
              Terjadi Kendala Memuat Aplikasi
            </h2>
            <p style="font-size: 0.8125rem; color: #64748b; line-height: 1.5; margin: 0 0 1.25rem;">
              Sistem mendeteksi kendala pada inisialisasi antarmuka. Silakan muat ulang atau pulihkan data awal untuk melanjutkan.
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <button onclick="window.location.reload(true);" style="width: 100%; padding: 0.75rem 1rem; background: linear-gradient(to right, #dc2626, #e11d48); color: #ffffff; border: none; border-radius: 0.75rem; font-weight: 800; font-size: 0.8125rem; cursor: pointer;">
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      `;
    } catch {}
  }
}
