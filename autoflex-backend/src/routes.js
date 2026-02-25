import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/*
  PRODUCT CRUD
*/

// CREATE
router.post("/products", async (req, res) => {
  const { code, name, price } = req.body;

  const product = await prisma.product.create({
    data: {
      code,
      name,
      price,
    },
  });

  return res.status(201).json(product);
});

// LIST
router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  return res.json(products);
});

// UPDATE
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, price } = req.body;

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { code, name, price },
  });

  return res.json(product);
});

// DELETE
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return res.status(204).send();
});

// CREATE RawMaterial
router.post("/raw-materials", async (req, res) => {
  const { code, name, stockQuantity } = req.body;

  const rawMaterial = await prisma.rawMaterial.create({
    data: {
      code,
      name,
      stockQuantity,
    },
  });

  return res.status(201).json(rawMaterial);
});

// LIST RawMaterials
router.get("/raw-materials", async (req, res) => {
  const rawMaterials = await prisma.rawMaterial.findMany();
  return res.json(rawMaterials);
});

// UPDATE RawMaterial
router.put("/raw-materials/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, stockQuantity } = req.body;

  const rawMaterial = await prisma.rawMaterial.update({
    where: { id: Number(id) },
    data: { code, name, stockQuantity },
  });

  return res.json(rawMaterial);
});

// DELETE RawMaterial
router.delete("/raw-materials/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.rawMaterial.delete({
    where: { id: Number(id) },
  });

  return res.status(204).send();
});

// ADD RawMaterial to Product
router.post("/products/:productId/materials", async (req, res) => {
  const { productId } = req.params;
  const { rawMaterialId, requiredQuantity } = req.body;

  const association = await prisma.productRawMaterial.create({
    data: {
      productId: Number(productId),
      rawMaterialId: Number(rawMaterialId),
      requiredQuantity,
    },
  });

  return res.status(201).json(association);
});

// LIST materials of a product
router.get("/products/:productId/materials", async (req, res) => {
  const { productId } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: {
      materials: {
        include: {
          rawMaterial: true,
        },
      },
    },
  });

  return res.json(product);
});

// REMOVE association
router.delete("/product-materials/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.productRawMaterial.delete({
    where: { id: Number(id) },
  });

  return res.status(204).send();
});

// PRODUCTION SUGGESTION
router.get("/production/suggestions", async (req, res) => {
  // 1️⃣ Buscar produtos ordenados por maior preço
  const products = await prisma.product.findMany({
    orderBy: { price: "desc" },
    include: {
      materials: {
        include: {
          rawMaterial: true,
        },
      },
    },
  });

  // 2️⃣ Criar mapa de estoque em memória
  const stockMap = {};

  const rawMaterials = await prisma.rawMaterial.findMany();

  rawMaterials.forEach((material) => {
    stockMap[material.id] = Number(material.stockQuantity);
  });

  const suggestions = [];
  let totalValue = 0;

  // 3️⃣ Simular produção
  for (const product of products) {
    if (product.materials.length === 0) continue;

    let maxUnits = Infinity;

    for (const item of product.materials) {
      const available = stockMap[item.rawMaterialId];
      const required = Number(item.requiredQuantity);

      const possibleUnits = Math.floor(available / required);

      maxUnits = Math.min(maxUnits, possibleUnits);
    }

    if (maxUnits > 0 && maxUnits !== Infinity) {
      // consumir estoque simulado
      for (const item of product.materials) {
        stockMap[item.rawMaterialId] -=
          Number(item.requiredQuantity) * maxUnits;
      }

      const productTotal = Number(product.price) * maxUnits;

      suggestions.push({
        productId: product.id,
        name: product.name,
        unitPrice: Number(product.price),
        quantity: maxUnits,
        total: productTotal,
      });

      totalValue += productTotal;
    }
  }

  // 4️⃣ Salvar simulação no banco
  const simulation = await prisma.productionSimulation.create({
    data: {
      totalValue,
      items: {
        create: suggestions.map((s) => ({
          productId: s.productId,
          quantity: s.quantity,
          unitPrice: s.unitPrice,
          total: s.total,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return res.json(simulation);
});

// LISTAR HISTÓRICO DE SIMULAÇÕES
router.get("/production/simulations", async (req, res) => {
  const simulations = await prisma.productionSimulation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return res.json(simulations);
});
export default router;
