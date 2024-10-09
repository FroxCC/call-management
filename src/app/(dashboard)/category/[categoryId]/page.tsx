"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from '@dnd-kit/core';
import { ReferenceModal} from '@/components';
import { Separator } from "@/components/ui/separator";

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
  seccionesReferencia: {
    id: number;
    nombre: string;
    audios: AudioClip[];
  }[];
}

interface SortableClipProps {
  clip: AudioClip;
  toggleMenu: (clipId: string) => void;
  menuOpen: { [key: string]: boolean };
  handleDeleteClip: (clipId: string) => void;
  handleEditClip: (clipId: string, nombre: string, tags: string[]) => void;
  handleRemoveReference: (clipId: string) => void;
  isReferenceClip: boolean;
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { searchTerm } = useSearch();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referenceClips, setReferenceClips] = useState<AudioClip[]>([]);


  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Error al obtener la categoría");
        }
        const data = await response.json();
        setCategory(data);
        setReferenceClips(data.referenceClips || []);
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
        setError("Error al cargar la categoría");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryWithSectionReferences = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la categoría");
        }
        const data = await response.json();
        setCategory(data); // Asegúrate de que el estado `category` incluya `seccionesReferencia`
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
        setError("Error al cargar los datos de la categoría");
      } finally {
        setLoading(false);
      }
    };


    const fetchCategoryWithReferences = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}/clipsWithReferences`);
        if (!response.ok) {
          throw new Error('Error al obtener los clips de la categoría con referencias');
        }

        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error al obtener los clips:', error);
        setError('Error al cargar la categoría con referencias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryWithSectionReferences();
    fetchCategoryWithReferences();
    fetchCategory();
    
  }, [categoryId]);

  const handleEditClip = async (clipId: string, nombre: string, tags: string[]) => {
    try {
      const response = await fetch(`/api/audioClips/${clipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el clip de audio');
      }

      // Actualizar el estado local después de la edición
      setCategory((prevCategory) => {
        if (!prevCategory) return null;
        return {
          ...prevCategory,
          audioClips: prevCategory.audioClips.map((clip) =>
            clip.id === clipId ? { ...clip, nombre, tags } : clip
          ),
        };
      });

      alert('Clip de audio actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el clip de audio:', error);
      alert('Error al actualizar el clip de audio. Por favor, intenta nuevamente.');
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este clip de audio?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/audioClips/${clipId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el clip de audio");
      }

      setCategory((prevCategory) => {
        if (!prevCategory) return null;
        return {
          ...prevCategory,
          audioClips: prevCategory.audioClips.filter(
            (clip) => clip.id !== clipId
          ),
        };
      });

      alert("Clip de audio eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el clip de audio:", error);
      alert(
        "Error al eliminar el clip de audio. Por favor, intenta nuevamente."
      );
    }
  };

  const handleAddReference = async (selectedClip: AudioClip) => {
    try {
      // Hacer la llamada al backend para persistir los clips de referencia
      const response = await fetch('/api/categories/addReference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: category?.id ?? "", // ID de la categoría actual
          referenceClipIds: [...referenceClips.map((c) => c.id), selectedClip.id],// El ID del clip de referencia seleccionado
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar los clips de referencia');
      }
  
      const updatedCategory = await response.json();
  
      // Actualizar el estado de los clips de referencia localmente
      setReferenceClips(updatedCategory.referenceClips || []);
      alert('Referencia agregada con éxito');
    } catch (error) {
      console.error('Error al agregar la referencia:', error);
      alert('No se pudo agregar el clip de referencia');
    }
  };

  const handleRemoveReference = async (clipId: string) => {
    try {
      const response = await fetch('/api/categories/removeReference', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: category?.id ?? "", // ID de la categoría actual
          referenceClipId: clipId, // ID del clip de referencia que se desea eliminar
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el clip de referencia');
      }
  
      const updatedCategory = await response.json();
      
      // Actualiza el estado local para remover el clip de referencia
      setReferenceClips(updatedCategory.referenceClips);
      alert('Referencia eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar el clip de referencia:', error);
      alert('Error al eliminar la referencia. Por favor, intenta nuevamente.');
    }
  };
  
  

  const toggleMenu = (clipId: string) => {
    setMenuOpen((prev) => ({
      ...prev,
      [clipId]: !prev[clipId],
    }));
  };

  const handleDragEnd = ({ active, over }: { active: { id: UniqueIdentifier }; over: { id: UniqueIdentifier } | null }) => {
    if (!over) return;

    const oldIndex =
      category?.audioClips.findIndex((clip) => clip.id === active.id) ?? -1;
    const newIndex =
      category?.audioClips.findIndex((clip) => clip.id === over.id) ?? -1;

    if (oldIndex !== -1 && newIndex !== -1) {
      // Actualiza el estado local con el nuevo orden
      const reorderedClips = arrayMove(
        category!.audioClips,
        oldIndex,
        newIndex
      );
      setCategory((prevCategory) => {
        if (!prevCategory) return null;
        return {
          ...prevCategory,
          audioClips: reorderedClips,
        };
      });

      // Enviar el nuevo orden al backend
      saveOrderToBackend(reorderedClips);
    }
  };

  const saveOrderToBackend = async (updatedClips: AudioClip[]) => {
    const updatedOrder = updatedClips.map((clip, index) => ({
      id: clip.id,
      orden: index,
    }));

    try {
      const response = await fetch("/api/audioClips/updateOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedClips: updatedOrder }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el orden de los clips de audio");
      }

      alert("Orden guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el orden de los clips de audio:", error);
      alert("Error al guardar el orden. Por favor, intenta nuevamente.");
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!category) {
    return <div>Categoría no encontrada</div>;
  }

  const filteredAudioClips = category.audioClips.filter(
    (clip) =>
      clip.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{category.nombre}</h1>
      <h2 className="text-xl font-semibold mb-2">Clips de Audio:</h2>
  
      {filteredAudioClips.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredAudioClips.map((clip) => clip.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAudioClips.map((clip) => (
                <SortableClip
                  key={clip.id}
                  clip={clip}
                  toggleMenu={toggleMenu}
                  menuOpen={menuOpen}
                  handleDeleteClip={handleDeleteClip}
                  handleEditClip={handleEditClip}
                  isReferenceClip={false} 
                  handleRemoveReference={handleRemoveReference}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p>No hay clips de audio asignados a esta categoría.</p>
      )}
  
{referenceClips.length > 0 && (
  <>
    <Separator className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Clips de Acesso rapido:</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {referenceClips.map((clip) => (
        <SortableClip
          key={clip.id}
          clip={clip}
          toggleMenu={toggleMenu}
          menuOpen={menuOpen}
          handleDeleteClip={handleDeleteClip}
          handleEditClip={handleEditClip}
          handleRemoveReference={handleRemoveReference}  // Pasar la función
          isReferenceClip={true}
        />
      ))}
    </div>
  </>
)}

  
      <div className="flex w-full mx-auto justify-center my-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-full"
        >
          Agregar acceso rapido
        </button>
      </div>


      {category.seccionesReferencia && category.seccionesReferencia.length > 0 && (
  <>
    <Separator className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Secciones:</h2>

    {category.seccionesReferencia.map((seccion) => (
      <div key={seccion.id} className="mb-8">
        <h3 className="text-lg font-semibold mb-2">{seccion.nombre}</h3> {/* Nombre de la sección */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {seccion.audios.map((clip) => (
            <div key={clip.id} className="bg-gray-200 p-4 rounded shadow">
              <h4 className="font-bold">{clip.nombre}</h4>
              <audio controls className="w-full mt-2">
                <source src={clip.audioUrl} type="audio/mpeg" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          ))}
        </div>
      </div>
    ))}
  </>
)}

  
      {isModalOpen && (
        <ReferenceModal
          onClose={() => setIsModalOpen(false)}
          onAddReference={handleAddReference}
        />
      )}
    </div>
  );
}




function SortableClip({ clip, toggleMenu, menuOpen, handleDeleteClip, handleEditClip, handleRemoveReference,isReferenceClip }: SortableClipProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: clip.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editNombre, setEditNombre] = useState(clip.nombre);
  const [editTags, setEditTags] = useState(clip.tags.join(', '));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
 // Función para guardar los cambios en el backend
 const handleSaveEdit = () => {
  handleEditClip(clip.id, editNombre, editTags.split(',').map((tag:string) => tag.trim()));
  setIsEditing(false);
};

return (
  <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative bg-gray-200 p-4 rounded shadow">
    <div className="absolute top-2 right-2">
      <button onClick={() => toggleMenu(clip.id)} className="p-2 rounded-full hover:bg-gray-300">
        ⋮
      </button>
      {menuOpen[clip.id] && (
        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="block px-4 py-2 w-full text-left hover:bg-blue-500 hover:text-white"
          >
            Editar
          </button>
          {/* Solo mostrar el botón de "Quitar Referencia" si el clip es de referencia */}
          {isReferenceClip && (
            <button
              onClick={() => handleRemoveReference(clip.id)}
              className="block px-4 py-2 w-full text-left hover:bg-red-500 hover:text-white"
            >
              Quitar Referencia
            </button>
          )}
          <button
            onClick={() => handleDeleteClip(clip.id)}
            className="block px-4 py-2 w-full text-left hover:bg-red-500 hover:text-white"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>

    {isEditing ? (
      <div>
        <input
          type="text"
          value={editNombre}
          onChange={(e) => setEditNombre(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={editTags}
          onChange={(e) => setEditTags(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded">
          Guardar Cambios
        </button>
        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">
          Cancelar
        </button>
      </div>
    ) : (
      <>
        <h3 className="font-bold">{clip.nombre}</h3>
        <p className="text-sm">Fecha de creación: {new Date(clip.fechaCreacion).toLocaleDateString()}</p>
        <p className="text-sm">Tags: {clip.tags.join(', ')}</p>
        <audio controls className="w-full mt-2">
          <source src={clip.audioUrl} type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      </>
    )}
  </div>
);
}