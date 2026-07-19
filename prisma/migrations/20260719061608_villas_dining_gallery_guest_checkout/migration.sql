/*
  Warnings:

  - You are about to drop the column `roomTypeId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Resort` table. All the data in the column will be lost.
  - You are about to drop the `RoomType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomTypeAmenities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `guestEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestPhone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villaId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'GCASH', 'PAYMAYA', 'BANK_TRANSFER', 'PAY_AT_RESORT');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('VILLA', 'DINING', 'RESORT', 'ACTIVITIES');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomType" DROP CONSTRAINT "RoomType_resortId_fkey";

-- DropForeignKey
ALTER TABLE "_RoomTypeAmenities" DROP CONSTRAINT "_RoomTypeAmenities_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomTypeAmenities" DROP CONSTRAINT "_RoomTypeAmenities_B_fkey";

-- DropIndex
DROP INDEX "Booking_roomTypeId_checkIn_checkOut_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "roomTypeId",
ADD COLUMN     "guestEmail" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "guestPhone" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "villaId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resort" DROP COLUMN "images";

-- DropTable
DROP TABLE "RoomType";

-- DropTable
DROP TABLE "_RoomTypeAmenities";

-- CreateTable
CREATE TABLE "Villa" (
    "id" TEXT NOT NULL,
    "resortId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "basePricePerNight" DECIMAL(10,2) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "totalRooms" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Villa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dining" (
    "id" TEXT NOT NULL,
    "resortId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "cuisineType" TEXT,
    "openingHours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "category" "GalleryCategory" NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "resortId" TEXT NOT NULL,
    "villaId" TEXT,
    "diningId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VillaAmenities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VillaAmenities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Villa_slug_key" ON "Villa"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dining_slug_key" ON "Dining"("slug");

-- CreateIndex
CREATE INDEX "GalleryImage_category_idx" ON "GalleryImage"("category");

-- CreateIndex
CREATE INDEX "_VillaAmenities_B_index" ON "_VillaAmenities"("B");

-- CreateIndex
CREATE INDEX "Booking_villaId_checkIn_checkOut_idx" ON "Booking"("villaId", "checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "Booking_guestEmail_idx" ON "Booking"("guestEmail");

-- AddForeignKey
ALTER TABLE "Villa" ADD CONSTRAINT "Villa_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "Resort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dining" ADD CONSTRAINT "Dining_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "Resort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "Resort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_villaId_fkey" FOREIGN KEY ("villaId") REFERENCES "Villa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_diningId_fkey" FOREIGN KEY ("diningId") REFERENCES "Dining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_villaId_fkey" FOREIGN KEY ("villaId") REFERENCES "Villa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VillaAmenities" ADD CONSTRAINT "_VillaAmenities_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VillaAmenities" ADD CONSTRAINT "_VillaAmenities_B_fkey" FOREIGN KEY ("B") REFERENCES "Villa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
