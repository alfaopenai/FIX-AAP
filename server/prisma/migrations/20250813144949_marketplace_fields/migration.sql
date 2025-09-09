-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "original_price" INTEGER;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "image_url" TEXT;
