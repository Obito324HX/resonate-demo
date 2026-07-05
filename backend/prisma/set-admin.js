// One-off script to set the admin login credentials.
// Usage:
//   node prisma/set-admin.js <email> <password>
//
// This removes the old seeded default admin (admin@resonate.dev) if present,
// and creates (or updates) an admin with the email/password you provide.
// Run this against whichever DATABASE_URL is in your .env — since Render
// and your local setup point at the same Neon database, running this once
// locally updates the live site too.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const [, , email, password] = process.argv;

  if (!email || !password) {
    console.error("Usage: node prisma/set-admin.js <email> <password>");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Choose a password that's at least 8 characters.");
    process.exit(1);
  }

  // Remove the old seeded default admin, if it's still there.
  await prisma.admin.deleteMany({ where: { email: "admin@resonate.dev" } });

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin credentials set for: ${admin.email}`);
  console.log("You can now log in at /admin/login with this email and the password you chose.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
