// Seeds the database with categories, sample products, and an admin user.
// Run with: node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const headphones = await prisma.category.upsert({
    where: { slug: "headphones" },
    update: {},
    create: { name: "Headphones", slug: "headphones" },
  });

  const speakers = await prisma.category.upsert({
    where: { slug: "speakers" },
    update: {},
    create: { name: "Speakers", slug: "speakers" },
  });

  const earbuds = await prisma.category.upsert({
    where: { slug: "earbuds" },
    update: {},
    create: { name: "Earbuds", slug: "earbuds" },
  });

  // Products
  const products = [
    {
      name: "Resonate Aura Over-Ear",
      slug: "aura-over-ear",
      description:
        "Premium over-ear headphones with active noise cancellation and 40-hour battery life. Tuned for warm, detailed sound.",
      price: 24900,
      imageUrl: "https://picsum.photos/seed/aura-over-ear/800/800",
      stock: 25,
      featured: true,
      categoryId: headphones.id,
    },
    {
      name: "Resonate Drift Wireless",
      slug: "drift-wireless",
      description:
        "Lightweight on-ear wireless headphones built for all-day comfort. Foldable design with a 30-hour battery.",
      price: 14900,
      imageUrl: "https://picsum.photos/seed/drift-wireless/800/800",
      stock: 40,
      featured: false,
      categoryId: headphones.id,
    },
    {
      name: "Resonate Pulse Pods",
      slug: "pulse-pods",
      description:
        "True wireless earbuds with adaptive EQ and a compact charging case. Sweat resistant for workouts.",
      price: 9900,
      imageUrl: "https://picsum.photos/seed/pulse-pods/800/800",
      stock: 60,
      featured: true,
      categoryId: earbuds.id,
    },
    {
      name: "Resonate Nano Buds",
      slug: "nano-buds",
      description:
        "Ultra-compact earbuds with surprisingly big sound. 6-hour battery, 24-hour case.",
      price: 6900,
      imageUrl: "https://picsum.photos/seed/nano-buds/800/800",
      stock: 55,
      featured: false,
      categoryId: earbuds.id,
    },
    {
      name: "Resonate Orb Mini Speaker",
      slug: "orb-mini-speaker",
      description:
        "Pocket-sized Bluetooth speaker with 360-degree sound and waterproof housing.",
      price: 7900,
      imageUrl: "https://picsum.photos/seed/orb-mini-speaker/800/800",
      stock: 35,
      featured: true,
      categoryId: speakers.id,
    },
    {
      name: "Resonate Column Studio Speaker",
      slug: "column-studio-speaker",
      description:
        "Home studio-grade speaker with deep bass and crisp highs. Perfect for a desk or living room setup.",
      price: 34900,
      imageUrl: "https://picsum.photos/seed/column-studio-speaker/800/800",
      stock: 15,
      featured: false,
      categoryId: speakers.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // Admin user (change this password after first login!)
  const passwordHash = await bcrypt.hash("changeme123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@resonate.dev" },
    update: {},
    create: {
      email: "admin@resonate.dev",
      passwordHash,
    },
  });

  console.log("Seed complete.");
  console.log("Admin login -> email: admin@resonate.dev / password: changeme123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
