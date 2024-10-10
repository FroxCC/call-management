'use client'
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useCall } from "@/context/CallContext"; // Asegúrate de ajustar la ruta de importación
import { useEffect, useState } from "react";

export const Header = () => {
  const { startCall, endCall } = useCall();
  const [despedidaUrl, setDespedidaUrl] = useState<string | null>(null);
  const [inicioUrl, setInicioUrl] = useState<string | null>(null);

  // Función para obtener la URL del audio de despedida
  const fetchDespedidaAudio = async () => {
    try {
      const response = await fetch('/api/despedida');
      const data = await response.json();
  
      if (!response.ok || !data.audioUrl) {
        throw new Error('Error al obtener el audio de despedida');
      }
  
      setDespedidaUrl(data.audioUrl); // Guardar la URL del audio de despedida
    } catch (error) {
      console.error('Error al obtener el audio de despedida:', error);
    }
  };
  const fetchInicioAudio = async () => {
    try {
      const response = await fetch('/api/iniciollamada');
      const data = await response.json();
  
      if (!response.ok || !data.audioUrl) {
        throw new Error('Error al obtener el audio de despedida');
      }
  
      setInicioUrl(data.audioUrl); // Guardar la URL del audio de despedida
    } catch (error) {
      console.error('Error al obtener el audio de despedida:', error);
    }
  };

  // Obtener la URL del audio de despedida al cargar el componente
  useEffect(() => {
    fetchDespedidaAudio();
    fetchInicioAudio();
  }, []);

  // Manejar el evento de despedida y reproducir el audio
  const handleDespedida = async () => {
    endCall();
  
    if (!despedidaUrl) {
      await fetchDespedidaAudio(); // Intentar obtener la URL antes de reproducir el audio
    }
  
    // Esperar hasta que despedidaUrl no sea null
    if (despedidaUrl) {
      const audio = new Audio(despedidaUrl);
      audio.play();
    } else {
      console.error("No se encontró la URL del audio de despedida.");
    }
  };
  const handleInicio = async () => {
    startCall();
  
    if (!inicioUrl) {
      await fetchDespedidaAudio(); // Intentar obtener la URL antes de reproducir el audio
    }
  
    // Esperar hasta que despedidaUrl no sea null
    if (inicioUrl) {
      const audio = new Audio(inicioUrl);
      audio.play();
    } else {
      console.error("No se encontró la URL del audio de despedida.");
    }
  };
  

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold mr-4">Call Interface</h1>
        </Link>

        <div className="mr-4 flex items-end">
          <span className="font-semibold mr-2 pr-2">Info del Cliente:</span>
          John Doe
          <div className="relative pr-3 ml-2 font-bold text-2xl">
            25
          </div>
          234567890
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleInicio}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded-full mr-4"
        >
          Iniciar llamada
        </button>

        <button
          onClick={handleDespedida}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-full mr-4"
        >
          Despedida
        </button>

        <Link href={'/editdespedida'}>
          <button
            className="px-4 py-2 text-sm bg-gray-400 text-white rounded-full mr-4"
            title="Editar Audio Despedida"
          >
            <PencilIcon/>
          </button>
        </Link>

        <Link href="/addaudio">
          <button className="px-4 py-2 bg-green-500 text-white rounded-full mr-4" title="Agregar AudioClip">
            <PlusIcon />
          </button>
        </Link>

        <UserButton />
      </div>
    </header>
  );
};
