/*
  Warnings:

  - Added the required column `usuarioId` to the `AudioClip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioClip" ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AudioClip" ADD CONSTRAINT "AudioClip_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
