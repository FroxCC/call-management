'use client'
import { useState, useEffect } from 'react';

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
  

export function ReferenceModal({ onClose, onAddReference }: { onClose: () => void, onAddReference: (clip: AudioClip) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedClip, setSelectedClip] = useState<AudioClip | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/allCategories');
        if (!response.ok) {
          throw new Error('Error al obtener categorías');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-2/3">
        <h2 className="text-xl font-bold mb-4">Agregar referencia de otra categoría</h2>
        <div className="max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold">{category.nombre}</h3>
              <ul>
                {category.audioClips.map((clip) => (
                  <li key={clip.id} className="flex items-center justify-between">
                    <span>{clip.nombre}</span>
                    <button
                      className={`ml-4 px-2 py-1 text-sm ${selectedClip?.id === clip.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setSelectedClip(clip)}
                    >
                      Seleccionar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-full mr-2">Cancelar</button>
          <button
            onClick={() => {
              if (selectedClip) {
                onAddReference(selectedClip);
                onClose();
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-full"
          >
            Agregar referencia
          </button>
        </div>
      </div>
    </div>
  );
}
