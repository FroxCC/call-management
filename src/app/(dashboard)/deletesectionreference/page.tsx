'use client';
import React, { useState, useEffect } from 'react';

export default function DeleteSectionPage() {
  const [sections, setSections] = useState<any[]>([]); // Inicializa las secciones
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch para obtener las secciones de referencia al cargar la página
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/sections');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error al obtener las secciones');
        }

        setSections(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Hubo un error');
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleDelete = async (sectionId: number) => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta sección?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar la sección');
      }

      // Actualiza la lista de secciones después de la eliminación
      setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
      alert('Sección eliminada exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar la sección:', error);
      alert('Hubo un error al eliminar la sección.');
    }
  };

  if (loading) return <p>Cargando secciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Eliminar Sección de Referencia</h1>
      <ul>
        {sections.length > 0 ? (
          sections.map((section) => (
            <li key={section.id} className="mb-4">
              <h2 className="text-xl font-semibold">{section.nombre}</h2>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleDelete(section.id)}
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <p>No hay secciones disponibles</p>
        )}
      </ul>
    </div>
  );
}
