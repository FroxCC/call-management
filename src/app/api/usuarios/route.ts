import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Falta el userId' }, { status: 400 });
    }

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Crear un nuevo usuario si no existe
      const newUser = await prisma.usuario.create({
        data: { id: userId },
      });
      return NextResponse.json(newUser, { status: 201 });
    }

    // Si el usuario ya existe, devolver un mensaje de éxito
    return NextResponse.json({ message: 'Usuario ya existe' }, { status: 200 });
  } catch (error) {
    console.error('Error al verificar o crear el usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
