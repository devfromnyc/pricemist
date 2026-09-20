-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('DEMO', 'INGEST', 'MANUAL');

-- CreateEnum
CREATE TYPE "StorePlatform" AS ENUM ('SHOPIFY', 'CUSTOM', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('HISTORICAL_LOW', 'NEAR_HISTORICAL_LOW', 'SIGNIFICANT_DROP', 'TYPICAL_SALE', 'SALE_BUT_NOT_UNUSUAL', 'PRICE_INCREASED', 'STABLE', 'INSUFFICIENT_HISTORY');

-- CreateEnum
CREATE TYPE "PriceEventType" AS ENUM ('PRICE_DROP', 'PRICE_INCREASE', 'HISTORICAL_LOW', 'RETURN_TO_LOW', 'PROMOTION_STARTED', 'PROMOTION_ENDED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('TARGET_PRICE', 'HISTORICAL_LOW', 'PERCENT_DROP');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CLOTHING', 'SHOES', 'ELECTRONICS', 'BEAUTY', 'KIDS', 'HOME', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logoUrl" TEXT,
    "platform" "StorePlatform" NOT NULL DEFAULT 'UNKNOWN',
    "adapterKey" TEXT NOT NULL,
    "source" "DataSource" NOT NULL DEFAULT 'DEMO',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStore" (
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStore_pkey" PRIMARY KEY ("userId","storeId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "category" "ProductCategory" NOT NULL DEFAULT 'OTHER',
    "subcategory" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currentPriceCents" INTEGER NOT NULL,
    "compareAtPriceCents" INTEGER,
    "source" "DataSource" NOT NULL DEFAULT 'DEMO',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "compareAtPriceCents" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "source" "DataSource" NOT NULL DEFAULT 'DEMO',

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMetrics" (
    "productId" TEXT NOT NULL,
    "previousPriceCents" INTEGER,
    "priceChangeCents" INTEGER NOT NULL,
    "priceChangePercent" DOUBLE PRECISION NOT NULL,
    "average30Cents" INTEGER,
    "average60Cents" INTEGER,
    "average90Cents" INTEGER,
    "historicalLowCents" INTEGER NOT NULL,
    "historicalHighCents" INTEGER NOT NULL,
    "distanceFromLowCents" INTEGER NOT NULL,
    "percentBelow30DayAverage" DOUBLE PRECISION,
    "percentBelow90DayAverage" DOUBLE PRECISION,
    "advertisedDiscountPercent" DOUBLE PRECISION,
    "historicalDiscountPercent" DOUBLE PRECISION,
    "historicalPercentile" DOUBLE PRECISION,
    "daysAtCurrentPrice" INTEGER NOT NULL,
    "observationCount" INTEGER NOT NULL,
    "historySpanDays" INTEGER NOT NULL,
    "status" "DealStatus" NOT NULL,
    "lastPriceChangedAt" TIMESTAMP(3),
    "computedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductMetrics_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "PriceEvent" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "PriceEventType" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB,

    CONSTRAINT "PriceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("userId","productId")
);

-- CreateTable
CREATE TABLE "PriceAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "threshold" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCache" (
    "productId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCache_pkey" PRIMARY KEY ("productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");

-- CreateIndex
CREATE INDEX "Product_storeId_category_idx" ON "Product"("storeId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Product_storeId_externalId_key" ON "Product"("storeId", "externalId");

-- CreateIndex
CREATE INDEX "ProductPrice_productId_recordedAt_idx" ON "ProductPrice"("productId", "recordedAt");

-- CreateIndex
CREATE INDEX "ProductMetrics_status_priceChangePercent_idx" ON "ProductMetrics"("status", "priceChangePercent");

-- CreateIndex
CREATE INDEX "ProductMetrics_lastPriceChangedAt_idx" ON "ProductMetrics"("lastPriceChangedAt");

-- CreateIndex
CREATE INDEX "PriceEvent_productId_occurredAt_idx" ON "PriceEvent"("productId", "occurredAt");

-- AddForeignKey
ALTER TABLE "UserStore" ADD CONSTRAINT "UserStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStore" ADD CONSTRAINT "UserStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMetrics" ADD CONSTRAINT "ProductMetrics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEvent" ADD CONSTRAINT "PriceEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceAlert" ADD CONSTRAINT "PriceAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceAlert" ADD CONSTRAINT "PriceAlert_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCache" ADD CONSTRAINT "AiCache_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

