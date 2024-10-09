import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    const { categoryId, referenceClipId } = await request.json();

    if (!categoryId || !referenceClipId) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Actualiza la categoría para desconectar el clip de referencia
    const updatedCategory = await prisma.categoria.update({
      where: { id: categoryId },
      data: {
        referenceClips: {
          disconnect: { id: referenceClipId }, // Desconectar el clip de referencia
        },
      },
      include: { referenceClips: true }, // Incluir los clips de referencia en la respuesta
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el clip de referencia:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
