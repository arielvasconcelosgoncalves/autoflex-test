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

export default router;
