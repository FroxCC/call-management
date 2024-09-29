import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { nombre, categoriaId, nuevaCategoria, tags, url } = await request.json();

    let categoryId = categoriaId;

    if (!categoriaId && nuevaCategoria) {
      const newCategory = await prisma.categoria.create({
        data: {
          nombre: nuevaCategoria,
        },
      });
      categoryId = newCategory.id;
    }

    const newAudioClip = await prisma.audioClip.create({
      data: {
        nombre,
        fechaCreacion: new Date(),
        tags,
        categoriaId: categoryId,
        audioUrl: url,
      },
    });

    return NextResponse.json(newAudioClip, { status: 201 });
  } catch (error) {
    console.error('Error al guardar el clip de audio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
