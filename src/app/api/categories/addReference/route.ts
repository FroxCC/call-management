import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Modificación en la función POST
export async function POST(request: NextRequest) {
    try {
      const { categoryId, referenceClipIds } = await request.json();
      
      if (!categoryId || !referenceClipIds || !Array.isArray(referenceClipIds)) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
      }
  
      // Asegúrate de que referenceClipIds sea un array de strings
      const updatedCategory = await prisma.categoria.update({
        where: { id: categoryId },
        data: {
          referenceClips: {
            connect: referenceClipIds.map((id: string) => ({ id })), // Asegurarte que id sea string
          },
        },
        include: {
          referenceClips: true,
        },
      });
  
      return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
      console.error('Error al agregar los clips de referencia:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
  