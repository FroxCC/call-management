import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server"; // Clerk o cualquier autenticación que estés usando

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { userId } = getAuth(request); // Obtener el ID del usuario autenticado
  const { categoryId } = params;

  try {
    const categoryIdNumber = parseInt(categoryId);
    if (isNaN(categoryIdNumber)) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    // Verificar si la categoría pertenece al usuario
    if (!userId) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const category = await prisma.categoria.findFirst({
      where: {
        id: categoryIdNumber,
        usuarioId: userId, // Verificar que la categoría pertenece al usuario autenticado
      },
      include: {
        referenceClips: true,
        seccionesReferencia: {
          include: {
            audios: true,  // Incluye los audios dentro de cada sección de referencia
          },
        },
        audioClips: {
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada o no tienes acceso" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { userId } = getAuth(request); // Obtener el ID del usuario autenticado
  const { categoryId } = params;

  try {
    const categoryIdNumber = parseInt(categoryId);
    if (isNaN(categoryIdNumber)) {
      return NextResponse.json({ error: 'ID de categoría inválido' }, { status: 400 });
    }

    // Verificar que la categoría pertenece al usuario antes de eliminarla
    if (!userId) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const category = await prisma.categoria.findFirst({
      where: {
        id: categoryIdNumber,
        usuarioId: userId, // Verificar que la categoría pertenece al usuario autenticado
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada o no tienes acceso" },
        { status: 404 }
      );
    }

    await prisma.categoria.delete({
      where: {
        id: categoryIdNumber,
      },
    });

    return NextResponse.json({ message: 'Categoría y clips eliminados con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}