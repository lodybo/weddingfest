/*
  Warnings:

  - You are about to drop the column `potluck` on the `Rsvp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Rsvp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `camping` to the `Rsvp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diet` to the `Rsvp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guests` to the `Rsvp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `Rsvp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rsvp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rsvp" DROP COLUMN "potluck",
ADD COLUMN     "camping" BOOLEAN NOT NULL,
ADD COLUMN     "diet" TEXT NOT NULL,
ADD COLUMN     "guests" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Rsvp_userId_key" ON "Rsvp"("userId");

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
