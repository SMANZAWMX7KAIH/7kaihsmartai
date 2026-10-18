import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('7KAIH App Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    if (window.confirm('Pulihkan data aplikasi ke kondisi awal? Riwayat tersimpan di browser akan diatur ulang.')) {
      try {
        localStorage.clear();
      } catch {}
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-red-200 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-red-500/20">
              7K
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
                🇮🇩 7 Kebiasaan Anak Indonesia Hebat
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Terjadi Kendala Memuat Aplikasi
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sistem mendeteksi kendala pada antarmuka. Silakan muat ulang halaman untuk melanjutkan pencatatan kebiasaan hebatmu.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-xl text-left border border-slate-200 max-h-32 overflow-y-auto">
                <p className="font-mono text-[11px] text-rose-700 font-bold break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Pulihkan Awal</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
