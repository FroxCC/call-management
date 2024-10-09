/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `AudioClip` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioClip" DROP CONSTRAINT "AudioClip_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_usuarioId_fkey";

-- AlterTable
ALTER TABLE "AudioClip" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "usuarioId";

-- DropTable
DROP TABLE "Usuario";
