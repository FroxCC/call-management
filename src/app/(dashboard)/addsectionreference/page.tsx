// app/addsectionreference/page.tsx
"use client";
import { useAuth } from "@clerk/nextjs";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


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

export default function AddSectionReferencePage() {
    const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [audioClipIds, setAudioClipIds] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]); // Inicializado como arreglo vacío
  const { isLoaded, userId } = useAuth();


  // Fetch categorías y clips al montar el componente
  useEffect(() => {
    if (!isLoaded || !userId) return;
    const fetchCategorias = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategorias(data);
    };

    const fetchAudioClips = async () => {
      try {
        const response = await fetch(`/api/audioClips?userId=${userId}`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de audioClips no es un arreglo");
        }
        setAudioClips(data);
      } catch (error) {
        console.error("Error al obtener los clips de audio:", error);
      }
    };

    fetchCategorias();
    fetchAudioClips();
  }, [isLoaded, userId]);

  // Manejar el cambio de selección de clips
  const handleClipSelect = (clipId: string) => {
    setAudioClipIds(
      (prev) =>
        prev.includes(clipId)
          ? prev.filter((id) => id !== clipId) // Quitar si ya está seleccionado
          : [...prev, clipId] // Agregar si no está
    );
  };


  // Manejar la creación de la nueva sección
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/sections/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          categoriaId,
          audioClipIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al crear la sección");
      }

      alert("Sección creada exitosamente");
      router.push(`/category/${categoriaId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear la sección.");
    }
  };

  return (
    <div className="p-8">
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Crear Sección de Referencia</h1>
        <Link href="/deletesectionreference">
      <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-300"
          title="Eliminar Sección de Referencia"
        >
           <Trash2Icon/>
        </button>
        </Link>
        </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre de la Sección</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Selecciona la Categoría</label>

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Selecciona los Clips de Audio
          </label>
          {audioClips.length > 0 ? (
            audioClips.map((clip) => (
              <div key={clip.id}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={clip.id}
                    onChange={() => handleClipSelect(clip.id)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{clip.nombre}</span>
                </label>
              </div>
            ))
          ) : (
            <p>No hay clips disponibles</p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
           Crear Sección
        </button>

      </form>
    </div>
  );
}