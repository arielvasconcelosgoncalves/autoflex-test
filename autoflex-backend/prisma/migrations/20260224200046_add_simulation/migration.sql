-- CreateTable
CREATE TABLE "ProductionSimulation" (
    "id" SERIAL NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionSimulationItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,
    "simulationId" INTEGER NOT NULL,

    CONSTRAINT "ProductionSimulationItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductionSimulationItem" ADD CONSTRAINT "ProductionSimulationItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSimulationItem" ADD CONSTRAINT "ProductionSimulationItem_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "ProductionSimulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
