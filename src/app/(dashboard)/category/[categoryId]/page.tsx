'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';

interface AudioClip {
  id: string;
  nombre: string;
  fechaCreacion: string;
  tags: string[];
  audioUrl: string;
}

interface Category {
  id: number;
  nombre: string;
  audioClips: AudioClip[];
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { searchTerm } = useSearch();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error('Error al obtener la categoría');
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error al obtener la categoría:', error);
        setError('Error al cargar la categoría');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleDeleteCategory = async () => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta categoría junto con todos sus clips de audio?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }

      alert('Categoría eliminada con éxito');
      router.push('/');
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar la categoría. Por favor, intenta nuevamente.');
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este clip de audio?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/audioClips/${clipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el clip de audio');
      }

      setCategory((prevCategory) => {
        if (!prevCategory) return null;
        return {
          ...prevCategory,
          audioClips: prevCategory.audioClips.filter((clip) => clip.id !== clipId),
        };
      });

      alert('Clip de audio eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el clip de audio:', error);
      alert('Error al eliminar el clip de audio. Por favor, intenta nuevamente.');
    }
  };

  const toggleMenu = (clipId: string) => {
    setMenuOpen((prev) => ({
      ...prev,
      [clipId]: !prev[clipId],
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!category) {
    return <div>Categoría no encontrada</div>;
  }

  const filteredAudioClips = category.audioClips.filter(
    (clip) =>
      clip.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{category.nombre}</h1>
      <button onClick={handleDeleteCategory} className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg">
        Eliminar Categoría
      </button>
      <div>
        <h2 className="text-xl font-semibold mb-2">Clips de Audio:</h2>
        {filteredAudioClips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAudioClips.map((clip) => (
              <div key={clip.id} className="relative bg-gray-200 p-4 rounded shadow">
                {/* Dropdown Menu Button */}
                <div className="absolute top-2 right-2">
                  <button onClick={() => toggleMenu(clip.id)} className="p-2 rounded-full hover:bg-gray-300">
                    ⋮
                  </button>
                  {menuOpen[clip.id] && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => alert(`Editing clip: ${clip.nombre}`)} // Placeholder for the edit action
                        className="block px-4 py-2 w-full text-left hover:bg-blue-500 hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="block px-4 py-2 w-full text-left hover:bg-red-500 hover:text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-bold">{clip.nombre}</h3>
                <p className="text-sm">Fecha de creación: {new Date(clip.fechaCreacion).toLocaleDateString()}</p>
                <p className="text-sm">Tags: {clip.tags.join(', ')}</p>
                <audio controls className="w-full mt-2">
                  <source src={clip.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay clips de audio asignados a esta categoría.</p>
        )}
      </div>
    </div>
  );
}
