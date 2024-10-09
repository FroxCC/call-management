import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo de la solicitud POST
export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, categoriaId, audioClipIds } = body;

  // Validar que los datos requeridos estén presentes
  if (!nombre || !categoriaId || !Array.isArray(audioClipIds) || audioClipIds.length === 0) {
    return NextResponse.json({ error: 'Faltan datos requeridos o son inválidos' }, { status: 400 });
  }

  try {
    // Crear la nueva sección y asignar los clips de audio como referencias
    const newSection = await prisma.seccionReferencia.create({
      data: {
        nombre,
        categoriaId: parseInt(categoriaId, 10), // Asegurarse de que categoriaId sea un número
        audios: {
          connect: audioClipIds.map((id: string) => ({ id })),
        },
      },
      include: {
        audios: true,
      },
    });

    return NextResponse.json(newSection, { status: 200 });
  } catch (error) {
    console.error('Error al crear la sección de referencia:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
}
