// src/components/Sidenav.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { useCategories } from '@/context/CategoriesContext';

interface Category {
  id: number;
  nombre: string;
  // Remover la propiedad tags si no existe
}

export const Sidenav: React.FC = () => {
  const { categories } = useCategories(); // Obtener las categorías del contexto
  const { searchTerm, setSearchTerm } = useSearch(); // Obtener `searchTerm` y `setSearchTerm` del contexto
  const router = useRouter();

  // Filtrar las categorías de acuerdo al término de búsqueda
  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  return (
    <nav className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por categorías..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualizar `searchTerm` en el contexto
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Mostrar categorías filtradas */}
      {filteredCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className="w-full mb-2 px-4 py-2 text-lg font-bold flex items-center justify-start relative bg-gray-200 rounded-lg"
        >
          <span className="ml-2">{category.nombre}</span>
        </button>
      ))}

      {/* Botones adicionales */}
      <div className="mt-4 flex justify-between flex-wrap">
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          WRG #
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          N./A
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          V.M.
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          UnSb
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          NCC
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          NCO
        </button>
        <button className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600">
          Callbk
        </button>
      </div>
    </nav>
  );
};
