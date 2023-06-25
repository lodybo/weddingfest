/*
  Warnings:

  - Changed the type of `attendance` on the `Rsvp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ATTENDANCE" AS ENUM ('ALL_DAY', 'EVENING', 'NONE');

-- AlterTable
ALTER TABLE "Rsvp" DROP COLUMN "attendance",
ADD COLUMN     "attendance" "ATTENDANCE" NOT NULL;
