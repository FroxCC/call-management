-- AlterTable
ALTER TABLE "AudioClip" ADD COLUMN     "referenceCategoriaId" INTEGER,
ALTER COLUMN "orden" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "AudioClip" ADD CONSTRAINT "AudioClip_referenceCategoriaId_fkey" FOREIGN KEY ("referenceCategoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
