const express = require("express");
const Stripe = require("stripe");
const prisma = require("../lib/prisma");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// POST /api/checkout/create-session
// Body: { customerName, customerEmail, address, items: [{ productId, quantity }] }
//
// This creates the Order in our own DB first (status PENDING, stock already
// decremented — same as the mock checkout flow), then creates a Stripe
// Checkout Session in TEST MODE and returns its hosted payment page URL.
// No real money moves; this is Stripe's sandbox environment.
router.post("/create-session", async (req, res) => {
  const { customerName, customerEmail, address, items } = req.body;

  if (!customerName || !customerEmail || !address || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let totalCents = 0;
      const orderItemsData = [];
      const lineItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        totalCents += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceCents: product.price,
        });
        lineItemsData.push({
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      const created = await tx.order.create({
        data: { customerName, customerEmail, address, totalCents, items: { create: orderItemsData } },
      });

      return { created, lineItemsData };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: order.lineItemsData,
      success_url: `${FRONTEND_URL}/order/${order.created.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout?cancelled=1&orderId=${order.created.id}`,
      metadata: { orderId: order.created.id },
    });

    await prisma.order.update({
      where: { id: order.created.id },
      data: { stripeSessionId: session.id },
    });

    res.status(201).json({ url: session.url, orderId: order.created.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to start checkout" });
  }
});

// GET /api/checkout/verify-session?session_id=...
// Called from the order confirmation page after Stripe redirects back.
// Confirms payment actually succeeded before marking the order PAID —
// never trust the redirect alone, always verify server-side with Stripe.
router.get("/verify-session", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "session_id is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const order = await prisma.order.findUnique({ where: { stripeSessionId: session_id } });

    if (!order) {
      return res.status(404).json({ error: "Order not found for this session" });
    }

    if (session.payment_status === "paid" && order.status === "PENDING") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    }

    res.json({ paymentStatus: session.payment_status, orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify payment session" });
  }
});

// POST /api/checkout/cancel/:orderId
// Called if the customer lands back on the cancel URL — restores stock
// and marks the order cancelled instead of leaving stock decremented
// for an order that was never paid.
router.post("/cancel/:orderId", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { items: true },
    });

    if (!order || order.status !== "PENDING") {
      return res.json({ cancelled: false });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    });

    res.json({ cancelled: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

module.exports = router;
