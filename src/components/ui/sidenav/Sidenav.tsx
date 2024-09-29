'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  nombre: string;
}

export const Sidenav = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const router = useRouter();

  // useEffect para obtener las categorías desde el servidor cuando el componente se monta
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

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") {
      alert("Por favor, ingresa un nombre para la categoría.");
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: newCategoryName }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result = await response.json();
      alert(`Categoría agregada con éxito: ${result.nombre}`);
      setNewCategoryName(""); // Limpia el input después de agregar la categoría

      // Actualiza la lista de categorías
      setCategories((prevCategories) => [...prevCategories, result]);
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      alert('Error al agregar la categoría. Por favor, intenta nuevamente.');
    }
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/category/${category.id}`); // Navegar a la página de la categoría seleccionada
  };

  return (
    <nav className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      {/* Botones de categorías existentes */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className="w-full mb-2 px-4 py-2 text-lg font-bold flex items-center justify-start relative bg-gray-200 rounded-lg"
        >
          <span className="ml-2">{category.nombre}</span>
        </button>
      ))}

      {/* Input y botón para agregar una nueva categoría */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Nueva categoría..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddCategory} // Llama a la función al hacer clic
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Agregar Categoría
        </button>
      </div>

      {/* Otros botones */}
      <div className="mt-4 flex justify-between flex-wrap">
      <button className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          Edit
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          Full Audio List
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          CLEAR
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          Icons
        </button>
      </div>
    </nav>
  );
};
