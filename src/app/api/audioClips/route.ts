import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server'; // Importar Clerk para obtener la autenticación del usuario

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Falta el userId' }, { status: 400 });
    }

    const audioClips = await prisma.audioClip.findMany({
      where: {
        usuarioId: userId,
      },
      orderBy: {
        orden: 'asc', // Ordenar los clips según el campo `orden`
      },
    });

    return NextResponse.json(audioClips, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los clips de audio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}




export async function POST(request: NextRequest) {
  try {
    // Obtener la autenticación del usuario
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { nombre, categoriaId, nuevaCategoria, tags, url, referenceCategoriaId } = await request.json();

    let categoryId = categoriaId;

    // Si no se proporciona `categoriaId` y se ingresa una nueva categoría, crearla
    if (!categoriaId && nuevaCategoria) {
      const newCategory = await prisma.categoria.create({
        data: {
          nombre: nuevaCategoria,
          usuarioId: userId, // Asociar la nueva categoría al usuario autenticado
        },
      });
      categoryId = newCategory.id;
    }

    const existingClipsCount = await prisma.audioClip.count({
      where: {
        categoriaId: categoryId,
      },
    });

    // Crear el nuevo clip de audio y asociarlo al usuario autenticado
    const newAudioClip = await prisma.audioClip.create({
      data: {
        nombre,
        fechaCreacion: new Date(),
        tags,
        categoriaId: categoryId,
        audioUrl: url,
        usuarioId: userId, // Asociar el clip al usuario autenticado
        ...(referenceCategoriaId && { referenceCategoriaId }),
        orden: existingClipsCount + 1,
      },
    });

    return NextResponse.json(newAudioClip, { status: 201 });
  } catch (error) {
    console.error('Error al guardar el clip de audio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
