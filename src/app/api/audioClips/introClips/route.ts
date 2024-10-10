// src/pages/api/audioClips/intro.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server'; // Para obtener la autenticación del usuario

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener la categoría 'Intro' específica del usuario
    const introCategory = await prisma.categoria.findFirst({
      where: {
        nombre: 'NORMAL',
        usuarioId: userId,
      },
      include: {
        audioClips: true, // Incluir los clips de audio asociados
      },
    });

    if (!introCategory) {
      return NextResponse.json({ error: 'Categoría "Intro" no encontrada' }, { status: 404 });
    }

    return NextResponse.json(introCategory.audioClips, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los clips de audio de la categoría "Intro":', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
