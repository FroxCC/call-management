'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir la interfaz para una categoría
interface Category {
  id: number;
  nombre: string;
}

// Definir la interfaz del contexto
interface CategoriesContextProps {
  categories: Category[];
  addCategory: (newCategory: Category) => void;
}

const CategoriesContext = createContext<CategoriesContextProps | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories when the context is mounted
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

  const addCategory = (newCategory: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextProps => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories debe ser utilizado dentro de un CategoriesProvider');
  }
  return context;
};
