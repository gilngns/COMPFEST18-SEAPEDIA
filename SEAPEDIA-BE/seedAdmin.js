const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@seapedia.com";
  const password = "password123";
  const username = "AdminSeapedia";

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      roles: {
        deleteMany: {},
        create: [{ role: "ADMIN" }]
      }
    },
    create: {
      username,
      email,
      password: hashed,
      roles: {
        create: [{ role: "ADMIN" }]
      }
    }
  });

  console.log("Admin account created successfully!");
  console.log("Email: " + admin.email);
  console.log("Password: " + password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
