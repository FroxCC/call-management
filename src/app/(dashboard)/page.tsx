// src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearch } from '@/context/SearchContext';

interface AudioClip {
  id: string;
  nombre: string;
  categoriaId: number;
  tags: string[];
  audioUrl: string;
}

export default function Home() {
  const { searchTerm } = useSearch();
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioClips = async () => {
      try {
        const response = await fetch('/api/audioClips');
        if (!response.ok) {
          throw new Error('Error al obtener los clips de audio');
        }

        const data = await response.json();
        setAudioClips(data);
      } catch (error) {
        console.error('Error al obtener los clips de audio:', error);
        setError('No se pudieron cargar los clips de audio. Inténtalo de nuevo más tarde.');
      }
    };

    fetchAudioClips();
  }, []);

  const filteredClips = audioClips.filter(
    (clip) =>
      clip.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clips de Audio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClips.map((clip) => (
          <div key={clip.id} className="bg-gray-200 p-4 rounded shadow">
            <h3 className="font-bold">{clip.nombre}</h3>
            <p className="text-sm">Tags: {clip.tags.join(', ')}</p>
            <audio controls className="w-full mt-2">
              <source src={clip.audioUrl} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
