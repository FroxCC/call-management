import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Manejar las peticiones GET para obtener las secciones
export async function GET() {
  try {
    const seccionesReferencia = await prisma.seccionReferencia.findMany({
      include: {
        audios: true, // Incluir los audios relacionados
        categoria: true, // Incluir la categoría relacionada
      },
    });

    return NextResponse.json(seccionesReferencia);
  } catch (error) {
    console.error("Error al obtener las secciones de referencia:", error);
    return NextResponse.json(
      { error: "Error al obtener las secciones de referencia" },
      { status: 500 }
    );
  }
}
