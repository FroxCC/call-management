import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {

    const { userId } = getAuth(request);
    try {
      if (!userId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
  
      // Obtener el usuario autenticado con la URL de despedida
      const user = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { despedidaAudioUrl: true }
      });

      if (!user || !user.despedidaAudioUrl) {
        return NextResponse.json({ error: 'No se encontró el audio de despedida' }, { status: 404 });
      }
  
      return NextResponse.json({ audioUrl: user.despedidaAudioUrl });
    } catch (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }

export async function POST(request: NextRequest) {
  try {
    // Obtener el userId autenticado
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el archivo del formData
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 });
    }

    // Subir el archivo a Cloudinary
    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formDataToSend,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Error al subir el archivo a Cloudinary');
    }

    const cloudinaryData = await cloudinaryResponse.json();
    const despedidaUrl = cloudinaryData.secure_url;

    // Actualizar el usuario con la URL del clip de despedida
    const updatedUser = await prisma.usuario.update({
      where: { id: userId }, // Usando el ID del usuario autenticado
      data: {
        despedidaAudioUrl: despedidaUrl,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error al guardar la despedida:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
