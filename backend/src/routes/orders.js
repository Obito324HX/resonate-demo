const express = require("express");
const prisma = require("../lib/prisma");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders  (checkout — public)
// Body: { customerName, customerEmail, address, items: [{ productId, quantity }] }
// This is a mock checkout: no real payment is processed, but the order
// is persisted to the DB and stock is decremented, mirroring what a
// real checkout flow would do.
router.post("/", async (req, res) => {
  const { customerName, customerEmail, address, items } = req.body;

  if (!customerName || !customerEmail || !address || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let totalCents = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        totalCents += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceCents: product.price,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          address,
          totalCents,
          items: { create: orderItemsData },
        },
        include: { items: { include: { product: true } } },
      });

      return order;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to place order" });
  }
});

// GET /api/orders/:id  (order confirmation lookup — public)
router.get("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ---- Admin-only routes below ----

// GET /api/orders  (admin — list all orders)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT /api/orders/:id/status  (admin — update order status)
router.put("/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
