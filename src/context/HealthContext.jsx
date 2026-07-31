import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import healthApi from '../api/healthApi';

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
  const [healthState, setHealthState] = useState({
    isHealthy: true,
    dbConnected: true,
    isChecking: false,
    lastChecked: null,
    details: null,
    errorCount: 0
  });

  const checkServerHealth = useCallback(async () => {
    setHealthState(prev => ({ ...prev, isChecking: true }));
    const result = await healthApi.checkHealth();
    
    const isHealthy = result?.success === true && result?.status === 'healthy';
    const dbConnected = result?.database?.status === 'connected';

    setHealthState(prev => ({
      isHealthy,
      dbConnected,
      isChecking: false,
      lastChecked: new Date(),
      details: result,
      errorCount: isHealthy ? 0 : prev.errorCount + 1
    }));

    return result;
  }, []);

  useEffect(() => {
    // Initial health check on mount
    checkServerHealth();

    // Poll health status: check more frequently if unhealthy (10s), otherwise every 45s
    const intervalTime = healthState.isHealthy ? 45000 : 10000;
    const timer = setInterval(() => {
      checkServerHealth();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [checkServerHealth, healthState.isHealthy]);

  return (
    <HealthContext.Provider value={{ ...healthState, recheckHealth: checkServerHealth }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export default HealthContext;
