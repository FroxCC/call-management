import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { categoryId } = params;

  try {
    const categoryIdNumber = parseInt(categoryId);
    if (isNaN(categoryIdNumber)) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    const category = await prisma.categoria.findUnique({
      where: {
        id: categoryIdNumber,
      },
      include: {
        audioClips: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
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

export async function DELETE(request: NextRequest, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  try {
    const categoryIdNumber = parseInt(categoryId);
    if (isNaN(categoryIdNumber)) {
      return NextResponse.json({ error: 'ID de categoría inválido' }, { status: 400 });
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