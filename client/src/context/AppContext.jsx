import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchKelas } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Cek apakah ada sesi user tersimpan di localStorage
  const savedUser = (() => {
    try {
      const data = localStorage.getItem('portal_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const [currentUser, setCurrentUser] = useState(savedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedUser);

  // Role: 'siswa' atau 'guru'
  const activeRole = currentUser?.role || 'siswa';

  // Daftar kelas dinamis
  const [daftarKelas, setDaftarKelas] = useState(['7-A', '7-B', '8-A', '8-B', '9-A', '9-B']);

  const loadDaftarKelas = async () => {
    try {
      const res = await fetchKelas();
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setDaftarKelas(list);
      }
    } catch (e) {
      console.warn('Gagal memuat daftar kelas:', e);
    }
  };

  useEffect(() => {
    loadDaftarKelas();
  }, []);

  // Kelas terpilih (contoh '7-A', '8-B', dsb)
  const [activeKelas, setActiveKelas] = useState(() => {
    if (savedUser?.role === 'siswa' && savedUser?.kelas) {
      return savedUser.kelas;
    }
    return localStorage.getItem('pai_kelas') || '7-A';
  });

  // Tab aktif: disesuaikan berdasarkan peran
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('portal_active_tab');
    if (savedTab) return savedTab;
    return activeRole === 'guru' ? 'admin_dashboard' : 'dashboard';
  });
  
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('portal_active_tab', activeTab);
    }
  }, [activeTab]);

  // State navigasi detail
  const [activeMateriDetailId, setActiveMateriDetailId] = useState(null);
  const [activeKuisId, setActiveKuisId] = useState(null);
  const [activeUlanganId, setActiveUlanganId] = useState(null);

  // Progres materi tuntas baca
  const [readMateriIds, setReadMateriIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pai_read_materi') || '[]');
    } catch {
      return [];
    }
  });

  // Toast notification
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pai_kelas', activeKelas);
  }, [activeKelas]);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('portal_user', JSON.stringify(userData));

    if (userData.role === 'siswa' && userData.kelas) {
      setActiveKelas(userData.kelas);
      setActiveTab('dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('portal_user');
    localStorage.removeItem('portal_active_tab');
    setActiveTab('dashboard');
    setActiveMateriDetailId(null);
    setActiveKuisId(null);
    setActiveUlanganId(null);
  };

  const toggleMateriComplete = (id) => {
    setReadMateriIds(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('pai_read_materi', JSON.stringify(updated));
      return updated;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setActiveMateriDetailId(null);
    setActiveKuisId(null);
    setActiveUlanganId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRole,
        login,
        logout,
        activeKelas,
        setActiveKelas,
        daftarKelas,
        setDaftarKelas,
        loadDaftarKelas,
        activeTab,
        setActiveTab: switchTab,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
        activeMateriDetailId,
        setActiveMateriDetailId,
        activeKuisId,
        setActiveKuisId,
        activeUlanganId,
        setActiveUlanganId,
        readMateriIds,
        toggleMateriComplete,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
