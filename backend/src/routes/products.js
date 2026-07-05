const express = require("express");
const prisma = require("../lib/prisma");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/products
// Supports optional query params: ?category=slug&search=text&featured=true
router.get("/", async (req, res) => {
  const { category, search, featured } = req.query;

  const where = {};

  if (category) {
    where.category = { slug: category };
  }

  if (featured === "true") {
    where.featured = true;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET /api/products/categories/all
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ---- Admin-only routes below ----

// POST /api/products (admin)
router.post("/", requireAdmin, async (req, res) => {
  const { name, slug, description, price, imageUrl, stock, featured, categoryId } = req.body;

  if (!name || !slug || !price || !categoryId) {
    return res.status(400).json({ error: "name, slug, price, and categoryId are required" });
  }

  try {
    const product = await prisma.product.create({
      data: { name, slug, description, price, imageUrl, stock, featured, categoryId },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
