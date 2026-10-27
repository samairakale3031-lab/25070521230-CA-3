import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, savedDiscoveriesApi } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedPlanetSlugs, setSavedPlanetSlugs] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const fetchSavedDiscoveries = useCallback(async () => {
    try {
      const res = await savedDiscoveriesApi.getAll();
      if (res?.savedDiscoveries) {
        const slugs = new Set(res.savedDiscoveries.map((s) => s.planetSlug));
        setSavedPlanetSlugs(slugs);
      }
    } catch {
      // Ignored if unauthenticated
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res?.user) {
        setUser(res.user);
        await fetchSavedDiscoveries();
      } else {
        setUser(null);
        setSavedPlanetSlugs(new Set());
      }
    } catch {
      setUser(null);
      setSavedPlanetSlugs(new Set());
      localStorage.removeItem('orbit_jwt');
    } finally {
      setLoading(false);
    }
  }, [fetchSavedDiscoveries]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.token) {
      localStorage.setItem('orbit_jwt', res.token);
    }
    setUser(res.user);
    await fetchSavedDiscoveries();
    showToast(`Welcome back, ${res.user.displayName}!`, 'success');
    return res.user;
  };

  const register = async (displayName, email, password, confirmPassword) => {
    const res = await authApi.register({ displayName, email, password, confirmPassword });
    if (res?.token) {
      localStorage.setItem('orbit_jwt', res.token);
    }
    setUser(res.user);
    await fetchSavedDiscoveries();
    showToast(`Account created! Welcome to ORBIT, ${res.user.displayName}!`, 'success');
    return res.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed even if network fails
    }
    localStorage.removeItem('orbit_jwt');
    setUser(null);
    setSavedPlanetSlugs(new Set());
    showToast('You have been logged out.', 'info');
  };

  const toggleSavePlanet = async (planetSlug, planetName = '') => {
    if (!user) {
      showToast('Please log in to save planets in your Observatory.', 'warning');
      return { requiresAuth: true };
    }

    const isAlreadySaved = savedPlanetSlugs.has(planetSlug);
    const displayName = planetName || planetSlug.charAt(0).toUpperCase() + planetSlug.slice(1);

    try {
      if (isAlreadySaved) {
        await savedDiscoveriesApi.remove(planetSlug);
        setSavedPlanetSlugs((prev) => {
          const next = new Set(prev);
          next.delete(planetSlug);
          return next;
        });
        showToast(`${displayName} removed from your Observatory.`, 'info');
        return { saved: false };
      } else {
        await savedDiscoveriesApi.save(planetSlug);
        setSavedPlanetSlugs((prev) => {
          const next = new Set(prev);
          next.add(planetSlug);
          return next;
        });
        showToast(`${displayName} added to your Observatory!`, 'success');
        return { saved: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update saved discoveries.', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        savedPlanetSlugs,
        toggleSavePlanet,
        isPlanetSaved: (slug) => savedPlanetSlugs.has(slug),
        fetchSavedDiscoveries,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
