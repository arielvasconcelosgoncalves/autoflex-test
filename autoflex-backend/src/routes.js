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

router.post("/productions", async (req, res) => {
  const { productId, quantityProduced, materials } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Verificar estoque
      for (const item of materials) {
        const rawMaterial = await tx.rawMaterial.findUnique({
          where: { id: item.rawMaterialId },
        });

        if (!rawMaterial) {
          throw new Error("Raw material not found");
        }

        if (Number(rawMaterial.stockQuantity) < Number(item.quantityUsed)) {
          throw new Error(`Insufficient stock for ${rawMaterial.name}`);
        }
      }

      // 2️⃣ Criar produção
      const production = await tx.production.create({
        data: {
          productId,
          quantityProduced,
          materials: {
            create: materials.map((m) => ({
              rawMaterialId: m.rawMaterialId,
              quantityUsed: m.quantityUsed,
            })),
          },
        },
        include: {
          materials: {
            include: {
              rawMaterial: true,
            },
          },
          product: true,
        },
      });

      // 3️⃣ Atualizar estoque matéria-prima
      for (const item of materials) {
        await tx.rawMaterial.update({
          where: { id: item.rawMaterialId },
          data: {
            stockQuantity: {
              decrement: Number(item.quantityUsed),
            },
          },
        });
      }

      // 4️⃣ Atualizar estoque produto acabado
      await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: {
            increment: Number(quantityProduced),
          },
        },
      });

      return production;
    });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

router.get("/productions", async (req, res) => {
  try {
    const productions = await prisma.production.findMany({
      include: {
        product: true,
        materials: {
          include: {
            rawMaterial: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // se você tiver esse campo
      },
    });

    return res.json(productions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/productions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const production = await prisma.production.findUnique({
      where: { id: Number(id) },
      include: {
        materials: true,
      },
    });

    if (!production) {
      return res.status(404).json({ error: "Production not found" });
    }

    // 🔁 Devolver matéria-prima ao estoque
    for (const item of production.materials) {
      await prisma.rawMaterial.update({
        where: { id: item.rawMaterialId },
        data: {
          stockQuantity: {
            increment: Number(item.quantityUsed),
          },
        },
      });
    }

    // 🔻 Remover produto acabado do estoque
    await prisma.product.update({
      where: { id: production.productId },
      data: {
        stockQuantity: {
          decrement: Number(production.quantityProduced),
        },
      },
    });

    // 🗑 Deletar produção
    await prisma.production.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Production canceled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reports/material-consumption", async (req, res) => {
  try {
    const report = await prisma.productionMaterial.groupBy({
      by: ["rawMaterialId"],
      _sum: {
        quantityUsed: true,
      },
    });

    const detailedReport = await Promise.all(
      report.map(async (item) => {
        const rawMaterial = await prisma.rawMaterial.findUnique({
          where: { id: item.rawMaterialId },
        });

        return {
          rawMaterialId: item.rawMaterialId,
          rawMaterialName: rawMaterial.name,
          totalConsumed: item._sum.quantityUsed,
          currentStock: rawMaterial.stockQuantity,
        };
      }),
    );

    return res.json(detailedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
