import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import MateriPage from './pages/MateriPage';
import TugasPage from './pages/TugasPage';
import AbsensiPage from './pages/AbsensiPage';

import UlanganPage from './pages/UlanganPage';
import GuruAdminPage from './pages/GuruAdminPage';
import NilaiPage from './pages/NilaiPage';
import LoginPage from './pages/LoginPage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function MainContent() {
  const { activeTab, toast, isAuthenticated, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'materi':
        return <MateriPage />;
      case 'absensi':
        return <AbsensiPage />;
      case 'tugas':
        return <TugasPage />;
case 'ulangan':
        return <UlanganPage />;
      case 'admin':
        return <GuruAdminPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Kontainer Utama */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-blue-900 text-white border-blue-700 shadow-blue-950/20'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
