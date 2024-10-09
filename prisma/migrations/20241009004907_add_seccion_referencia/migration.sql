-- AlterTable
ALTER TABLE "AudioClip" ADD COLUMN     "seccionReferenciaId" INTEGER;

-- CreateTable
CREATE TABLE "SeccionReferencia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "SeccionReferencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudioClip" ADD CONSTRAINT "AudioClip_seccionReferenciaId_fkey" FOREIGN KEY ("seccionReferenciaId") REFERENCES "SeccionReferencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeccionReferencia" ADD CONSTRAINT "SeccionReferencia_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
