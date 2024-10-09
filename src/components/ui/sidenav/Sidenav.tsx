// src/components/Sidenav.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { useCategories } from "@/context/CategoriesContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Category {
  id: number;
  nombre: string;
}

export const Sidenav: React.FC = () => {
  const { categories } = useCategories();
  const { searchTerm, setSearchTerm } = useSearch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const router = useRouter();

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCallbkClick = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleConfirmDate = () => {
    if (selectedDate) {
      alert(`Callback set for: ${selectedDate.toLocaleString()}`);
    }
    setShowDatePicker(false);
  };

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
        <button
          className="px-4 py-2 mb-4 bg-green-700 text-white rounded-lg hover:bg-green-600"
          onClick={handleCallbkClick}
        >
          Callbk
        </button>
      </div>
      {showDatePicker && (
        <div className="mt-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleConfirmDate}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Confirmar Fecha y Hora
          </button>
        </div>
      )}
    </nav>
  );
};
