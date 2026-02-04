
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { CarbonStats, ServiceType, UserProfile } from '../types';
import { PASSIVE_EMISSION_PER_SEC, AVG_POWER_WATTS } from '../constants';
import { logAction } from '../services/carbonIntelligenceEngine';
import { createOrUpdateUser } from '../services/authService';

interface CarbonContextType {
  stats: CarbonStats;
  trackAction: (type: ServiceType | string, emission: number, saved: number) => void;
  setUser: (user: UserProfile | null) => void;
  syncAuthStats: (authStats: CarbonStats) => void;
}

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

const INITIAL_STATS: CarbonStats = {
  emission: 0,
  saved: 0,
  energy: 0,
  idleEmission: 0,
  activeEmission: 0,
  idleTime: 0
};

export const CarbonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<CarbonStats>(INITIAL_STATS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Use ref for stats to avoid dependency loops in interval
  const statsRef = useRef(stats);
  const userRef = useRef(currentUser);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    userRef.current = currentUser;
    // Load initial stats if user logs in
    if (currentUser && currentUser.usageStats) {
        // Ensure we respect existing idle data if present, else default to 0
        const existing = currentUser.usageStats.carbon;
        setStats(prev => ({
            ...existing,
            // If new fields are missing in old data, preserve current session accumulation or default
            idleEmission: existing.idleEmission || prev.idleEmission || 0,
            activeEmission: existing.activeEmission || prev.activeEmission || 0,
            idleTime: existing.idleTime || prev.idleTime || 0
        }));
    }
  }, [currentUser]);

  // Always-on Passive Tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const passiveEmission = PASSIVE_EMISSION_PER_SEC;
        const passiveEnergy = PASSIVE_EMISSION_PER_SEC / 0.82; // Reverse calc from factor

        const newStats = {
          ...prev,
          emission: prev.emission + passiveEmission,
          energy: prev.energy + passiveEnergy,
          idleEmission: prev.idleEmission + passiveEmission,
          idleTime: prev.idleTime + 1
        };

        // Auto-persist to local storage if user is logged in
        // We do this inside the interval to ensure Admin sees "Live" updates
        if (userRef.current) {
             const updatedUser = {
                 ...userRef.current,
                 usageStats: {
                     ...(userRef.current.usageStats || { totalRevenue: 0, totalAiTasks: 0, lastActive: Date.now() }),
                     carbon: newStats,
                     lastActive: Date.now()
                 }
             };
             // We use the service but suppress the full list return to avoid re-renders
             // This effectively writes to localStorage 'mavionix_recent_users'
             createOrUpdateUser(updatedUser);
        }

        return newStats;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const trackAction = (type: ServiceType | string, emission: number, saved: number) => {
    setStats(prev => {
      const energy = emission / 0.82;
      const newStats = {
        ...prev,
        emission: prev.emission + emission,
        saved: prev.saved + saved,
        energy: prev.energy + energy,
        activeEmission: prev.activeEmission + emission
      };
      
      // Log to history engine
      if (userRef.current) {
          logAction(userRef.current.id, type, emission);
      }
      
      return newStats;
    });
  };

  const syncAuthStats = (authStats: CarbonStats) => {
      setStats(prev => ({
          ...prev,
          emission: prev.emission + authStats.emission,
          saved: prev.saved + authStats.saved,
          energy: prev.energy + authStats.energy,
          activeEmission: prev.activeEmission + authStats.emission
          // We don't sync idleTime from auth as it's a different context
      }));
  };

  return (
    <CarbonContext.Provider value={{ stats, trackAction, setUser: setCurrentUser, syncAuthStats }}>
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
};
