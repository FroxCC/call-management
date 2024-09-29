'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


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
  const { categoryId } = useParams(); // Usar useParams para obtener categoryId
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClip, setEditingClip] = useState<AudioClip | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedTags, setEditedTags] = useState<string>('');

  useEffect(() => {
    if (!categoryId) return;

    // Fetch category data from the server
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
    const confirmed = confirm("¿Estás seguro de que deseas eliminar esta categoría junto con todos sus clips de audio?");
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
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este clip de audio?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/audioClips/${clipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el clip de audio');
      }

      // Actualizar la lista de clips después de eliminar uno
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

  const handleEditClip = async () => {
    if (!editingClip) return;

    try {
      const response = await fetch(`/api/audioClips/${editingClip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editedName,
          tags: editedTags.split(',').map(tag => tag.trim()), // Convertir los tags en un array
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el clip de audio');
      }

      // Actualizar la lista de clips después de la edición
      setCategory((prevCategory) => {
        if (!prevCategory) return null;
        return {
          ...prevCategory,
          audioClips: prevCategory.audioClips.map((clip) =>
            clip.id === editingClip.id
              ? { ...clip, nombre: editedName, tags: editedTags.split(',').map(tag => tag.trim()) }
              : clip
          ),
        };
      });

      alert('Clip de audio actualizado con éxito');
      setEditingClip(null);
    } catch (error) {
      console.error('Error al actualizar el clip de audio:', error);
      alert('Error al actualizar el clip de audio. Por favor, intenta nuevamente.');
    }
  };

  const startEditing = (clip: AudioClip) => {
    setEditingClip(clip);
    setEditedName(clip.nombre);
    setEditedTags(clip.tags.join(', '));
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{category.nombre}</h1>
      <button
        onClick={handleDeleteCategory}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Eliminar Categoría
      </button>
      <div>
        <h2 className="text-xl font-semibold mb-2">Clips de Audio:</h2>
        {category.audioClips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.audioClips.map((clip) => (
              <div key={clip.id} className="bg-gray-200 p-4 rounded shadow">
                <h3 className="font-bold">{clip.nombre}</h3>
                <p className="text-sm">Fecha de creación: {new Date(clip.fechaCreacion).toLocaleDateString()}</p>
                <p className="text-sm">Tags: {clip.tags.join(', ')}</p>
                <audio controls className="w-full mt-2">
                  <source src={clip.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
                <button
                  onClick={() => startEditing(clip)}
                  className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClip(clip.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay clips de audio asignados a esta categoría.</p>
        )}
      </div>
      {editingClip && (
        <div className="mt-8 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Editar Clip de Audio</h2>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Nombre del clip"
            className="w-full p-2 mb-4 border rounded"
          />
          <textarea
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            placeholder="Tags (separados por coma)"
            className="w-full p-2 mb-4 border rounded h-24 resize-none"
          />
          <button
            onClick={handleEditClip}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setEditingClip(null)}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
