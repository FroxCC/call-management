'use client';
import React, { useState } from 'react';

export const InicioForm = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await fetch('/api/iniciollamada', {
        method: 'POST',
        body: formData, // Aquí enviamos FormData con multipart/form-data
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      alert('Archivo subido con éxito');

      window.location.reload();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo. Intenta nuevamente.');
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-4">Subir clip para iniciar llamada</h2>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </label>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-full">Subir Inicio de llamada</button>
    </form>
    </div>

  );
};
