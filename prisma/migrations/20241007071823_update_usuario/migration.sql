/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `AudioClip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioClip" DROP CONSTRAINT "AudioClip_usuarioId_fkey";

-- AlterTable
ALTER TABLE "AudioClip" DROP COLUMN "usuarioId";
