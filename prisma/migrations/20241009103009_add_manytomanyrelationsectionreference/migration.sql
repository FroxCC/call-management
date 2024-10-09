/*
  Warnings:

  - You are about to drop the column `seccionReferenciaId` on the `AudioClip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioClip" DROP CONSTRAINT "AudioClip_seccionReferenciaId_fkey";

-- AlterTable
ALTER TABLE "AudioClip" DROP COLUMN "seccionReferenciaId";

-- CreateTable
CREATE TABLE "_SeccionAudioClips" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeccionAudioClips_AB_unique" ON "_SeccionAudioClips"("A", "B");

-- CreateIndex
CREATE INDEX "_SeccionAudioClips_B_index" ON "_SeccionAudioClips"("B");

-- AddForeignKey
ALTER TABLE "_SeccionAudioClips" ADD CONSTRAINT "_SeccionAudioClips_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioClip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeccionAudioClips" ADD CONSTRAINT "_SeccionAudioClips_B_fkey" FOREIGN KEY ("B") REFERENCES "SeccionReferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
