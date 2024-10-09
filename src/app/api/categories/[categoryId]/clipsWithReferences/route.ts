import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const { categoryId } = params;

    const categoryWithReferences = await prisma.categoria.findUnique({
      where: { id: parseInt(categoryId) },
      include: {
        audioClips: true, // Incluir los clips de audio regulares de la categoría
        referenceClips: true, // Incluir los clips de referencia de la categoría
      },
    });

    if (!categoryWithReferences) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(categoryWithReferences, { status: 200 });
  } catch (error) {
    console.error('Error al obtener la categoría con referencias:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
