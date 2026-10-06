import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Kelas terpilih (7, 8, atau 9)
  const [activeKelas, setActiveKelas] = useState(() => {
    if (savedUser?.role === 'siswa' && savedUser?.kelas) {
      return savedUser.kelas.charAt(0);
    }
    return localStorage.getItem('pai_kelas') || '7';
  });

  // Tab aktif: disesuaikan berdasarkan peran
  const [activeTab, setActiveTab] = useState(() => {
    return activeRole === 'guru' ? 'admin_dashboard' : 'dashboard';
  });

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

  useEffect(() => {
    localStorage.setItem('pai_kelas', activeKelas);
  }, [activeKelas]);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('portal_user', JSON.stringify(userData));

    if (userData.role === 'siswa' && userData.kelas) {
      setActiveKelas(userData.kelas.charAt(0));
      setActiveTab('dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('portal_user');
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
        activeTab,
        setActiveTab: switchTab,
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
