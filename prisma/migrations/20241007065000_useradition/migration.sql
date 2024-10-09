/*
  Warnings:

  - Added the required column `usuarioId` to the `AudioClip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Categoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioClip" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clerkUserId_key" ON "Usuario"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioClip" ADD CONSTRAINT "AudioClip_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
