'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useCategories } from '@/context/CategoriesContext'; // Importar el contexto de categorías
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  nombre: string;
}

export const NewAudioForm = () => {
  const [clipName, setClipName] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { updateCategories } = useCategories();
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleAddClip = async () => {
    if (!clipName || (!selectedCategoryId && !newCategoryName) || !audioFile) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Error al subir el archivo a Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const audioUrl = cloudinaryData.secure_url;

      let categoryId = selectedCategoryId;

      if (!categoryId && newCategoryName) {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }

        const categoryResponse = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: newCategoryName,
            usuarioId: userId,
          }),
        });

        if (!categoryResponse.ok) {
          throw new Error('Error al crear la nueva categoría');
        }

        const newCategory = await categoryResponse.json();
        categoryId = newCategory.id;

        updateCategories();
      }

      const response = await fetch('/api/audioClips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: clipName,
          categoriaId: categoryId,
          tags: tags.split(',').map(tag => tag.trim()),
          url: audioUrl,
          usuarioId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los detalles del clip de audio');
      }

      updateCategories();
      router.push(`/category/${categoryId}`);

      setClipName('');
      setSelectedCategoryId(null);
      setNewCategoryName('');
      setTags('');
      setAudioFile(null);
      
      
    } catch (error) {
      console.error('Error al agregar el clip de audio:', error);
      alert('Error al agregar el clip de audio. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Agregar Nuevo Clip de Audio</h2>
      <div className="mb-4">
        <p className="font-bold mb-2">Seleccionar Categoría:</p>
        <div className="flex flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 text-white ${
                selectedCategoryId === category.id ? 'bg-blue-700' : 'bg-blue-500'
              }`}
            >
              {category.nombre}
            </button>
          ))}
        </div>
      </div>
      <p className="font-bold mb-2">O Ingresa nueva categoría:</p>
      <input
        type="text"
        placeholder="O ingresa una nueva categoría"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <p className="font-bold mb-2">Nombre del clip:</p>
      <input
        type="text"
        placeholder="Nombre del clip"
        value={clipName}
        onChange={(e) => setClipName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
<p className="font-bold mb-2">Tags:</p>
      <textarea
        placeholder="Ingresa etiquetas (separadas por comas)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 mb-4 border rounded h-24 resize-none"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <Link href="/">
        <button
          onClick={handleAddClip}
          className="px-4 py-2 bg-green-500 text-white rounded-full"
        >
          Agregar Clip
        </button>
      </Link>
    </div>
  );
};
