import React from 'react';
import { AudioClip } from '@prisma/client';

interface SectionReferencesProps {
  seccionesReferencia: {
    id: number;
    nombre: string;
    audios: AudioClip[];
  }[];
}

const SectionReferences: React.FC<SectionReferencesProps> = ({ seccionesReferencia }) => {
  return (
    <div>
      {seccionesReferencia.map((section) => (
        <div key={section.id} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{section.nombre}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.audios.map((audio) => (
              <div key={audio.id} className="bg-gray-200 p-4 rounded shadow">
                <h4>{audio.nombre}</h4>
                <audio controls src={audio.audioUrl}></audio>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionReferences;
