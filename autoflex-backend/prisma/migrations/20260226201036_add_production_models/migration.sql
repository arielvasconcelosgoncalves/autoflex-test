-- CreateTable
CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantityProduced" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionMaterial" (
    "id" SERIAL NOT NULL,
    "productionId" INTEGER NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "quantityUsed" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ProductionMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionMaterial" ADD CONSTRAINT "ProductionMaterial_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionMaterial" ADD CONSTRAINT "ProductionMaterial_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
