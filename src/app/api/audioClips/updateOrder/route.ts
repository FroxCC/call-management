// src/app/api/audioClips/updateOrder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { updatedClips } = body;

    if (!Array.isArray(updatedClips) || updatedClips.some(clip => typeof clip.id !== 'string' || typeof clip.orden !== 'number')) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Actualizar el orden de cada clip
    const updatePromises = updatedClips.map((clip) =>
      prisma.audioClip.update({
        where: { id: clip.id },
        data: { orden: clip.orden },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Orden actualizado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el orden de los clips:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
