'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'; 
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
  const [hasIntroCategory, setHasIntroCategory] = useState<boolean>(true); 
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (!isLoaded || !userId) return;

      try {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Error al verificar o crear el usuario');
        }

        const data = await response.json();
        console.log('Resultado:', data);
      } catch (error) {
        console.error('Error al verificar o crear el usuario:', error);
      }
    };

    checkOrCreateUser();

    const fetchIntroClips = async () => {
      try {
        const response = await fetch(`/api/audioClips/introClips?userId=${userId}`);
        if (response.status === 404) {
          setHasIntroCategory(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Error al obtener los clips de audio de la categoría "Intro"');
        }

        const data = await response.json();
        setAudioClips(data);
      } catch (error) {
        console.error('Error al obtener los clips de audio de la categoría "Intro":', error);
        setError('No se pudieron cargar los clips de la categoría "Intro". Inténtalo de nuevo más tarde.');
      }
    };

    fetchIntroClips();
  }, [isLoaded, userId]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!hasIntroCategory) {
    return (
      <div className="p-4">
        <h1 className="text-7xl font-bold mb-4">Bienvenido</h1>
        <p className='text-3xl'>Parece que no tienes una categoría <strong>NORMAL</strong>. Por favor, agrega una para poder verla en el inicio.</p>
      </div>
    );
  }

  const filteredClips = audioClips.filter(
    (clip) =>
      clip.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Call Management - Normal</h1>
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
