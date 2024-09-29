import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { clipId: string } }) {
  const { clipId } = params;

  try {
    await prisma.audioClip.delete({
      where: {
        id: clipId,
      },
    });

    return NextResponse.json({ message: 'Clip de audio eliminado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el clip de audio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { clipId: string } }) {
    const { clipId } = params;
    const { nombre, tags } = await request.json();
  
    try {
      const updatedClip = await prisma.audioClip.update({
        where: {
          id: clipId,
        },
        data: {
          nombre,
          tags,
        },
      });
  
      return NextResponse.json(updatedClip);
    } catch (error) {
      console.error('Error al actualizar el clip de audio:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
