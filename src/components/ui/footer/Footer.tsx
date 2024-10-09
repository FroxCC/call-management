'use client';
import { useCall } from "@/context/CallContext"; // Asegúrate de ajustar la ruta de importación

export const Footer = () => {
  const { time } = useCall();

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
<footer className="flex w-full mx-auto bg-gray-800 text-white p-4 justify-center items-center">
  <span>Duración de la llamada actual: {formatTime(time)}</span>
</footer>

  );
};
