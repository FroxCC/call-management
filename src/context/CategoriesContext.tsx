'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Category {
  id: number;
  nombre: string;
}

interface CategoriesContextProps {
  categories: Category[];
  updateCategories: () => void;
}

const CategoriesContext = createContext<CategoriesContextProps | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  // Llamar a `fetchCategories` para actualizar las categorías
  const updateCategories = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, updateCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories debe ser usado dentro de CategoriesProvider');
  }
  return context;
};
