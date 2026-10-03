import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in G-Tec store application:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center mb-6">
            <span className="text-cyan-400 font-black text-2xl tracking-tighter">G-Tec</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">G-Tec Technology Storefront</h1>
          <p className="text-slate-400 max-w-md text-sm mb-6">
            An unexpected error occurred while loading this view. You can reload the page or clear the local session cache.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-rose-400 max-w-lg overflow-x-auto text-left mb-6">
            {this.state.error?.message || 'Unknown Application Error'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Reload Store
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  window.location.reload();
                } catch (e) {
                  window.location.reload();
                }
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Reset Session Cache
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error("Critical: Could not locate '#root' mounting element.");
}

