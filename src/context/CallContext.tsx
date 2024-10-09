'use client'
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface CallContextProps {
  time: number;
  isPlaying: boolean;
  startCall: () => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTime(0);
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const endCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
  };

  return (
    <CallContext.Provider value={{ time, isPlaying, startCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
