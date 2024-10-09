import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server'; // Importar Clerk para obtener la autenticación del usuario

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtener la autenticación del usuario
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener solo las categorías del usuario autenticado
    const categories = await prisma.categoria.findMany({
      where: {
        usuarioId: userId,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, usuarioId } = body;

    if (!nombre || typeof nombre !== 'string') {
      return NextResponse.json({ error: 'Nombre de categoría inválido' }, { status: 400 });
    }

    if (!usuarioId || typeof usuarioId !== 'string') {
      return NextResponse.json({ error: 'Usuario inválido' }, { status: 400 });
    }

    const newCategory = await prisma.categoria.create({
      data: {
        nombre,
        usuarioId,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
