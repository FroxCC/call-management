'use client';
import React, { useEffect, useState, useRef } from 'react';

export const Footer = () => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  console.log(isPlaying);

  useEffect(() => {
    // Clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handlePlay = () => {
    // Reset the timer and restart counting from 0
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTime(0);
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handleDespedida = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);

    if (!audioRef.current) {
      audioRef.current = new Audio('/despedida.mp3'); // Ruta del audio en la carpeta public
    }

    audioRef.current.play();
  };

  return (
    <footer className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={handlePlay} className="px-4 py-2 text-xl bg-green-500 text-white rounded-full">
          Iniciar llamada
        </button>
        <span>Duración de la llamada actual: {formatTime(time)}</span>
      </div>
      <div>
        <button onClick={handleDespedida} className="px-4 py-2 text-2xl bg-blue-500 text-white rounded-full">
          Despedida
        </button>
      </div>
    </footer>
  );
};
