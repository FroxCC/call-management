// src/components/Sidenav.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';

interface Category {
  id: number;
  nombre: string;
  tags?: string[];
}

export const Sidenav = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { searchTerm, setSearchTerm } = useSearch(); // Obtener `searchTerm` y `setSearchTerm` del contexto
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

  const handleCategoryClick = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ?? false)
  );

  return (
    <nav className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <input
        type="text"
        placeholder="Buscar por categorías o tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualizar `searchTerm` en el contexto
        className="w-full p-2 mb-4 border rounded"
      />

      {filteredCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className="w-full mb-2 px-4 py-2 text-lg font-bold flex items-center justify-start relative bg-gray-200 rounded-lg"
        >
          <span className="ml-2">{category.nombre}</span>
        </button>
      ))}
    </nav>
  );
};
