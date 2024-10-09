import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Manejar las peticiones DELETE para eliminar una sección
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const sectionId = parseInt(params.id);

  if (isNaN(sectionId)) {
    return NextResponse.json({ error: "ID de sección inválido" }, { status: 400 });
  }

  try {
    await prisma.seccionReferencia.delete({
      where: { id: sectionId },
    });

    return NextResponse.json({ message: "Sección eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la sección:", error);
    return NextResponse.json({ error: "Error al eliminar la sección" }, { status: 500 });
  }
}
