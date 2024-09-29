/*
  Warnings:

  - Added the required column `audioUrl` to the `AudioClip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioClip" ADD COLUMN     "audioUrl" TEXT NOT NULL;
