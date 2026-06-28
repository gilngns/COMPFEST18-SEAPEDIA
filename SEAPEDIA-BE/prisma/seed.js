const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding vouchers and promos...");

  // Generate Voucher
  await prisma.voucher.upsert({
    where: { code: "POTONGAN20K" },
    update: {},
    create: {
      code: "POTONGAN20K",
      description: "Diskon 20 Ribu Rupiah",
      amount: 20000,
      isPercent: false,
      expiryDate: new Date("2026-12-31T23:59:59Z"),
      remainingUsage: 100,
    },
  });

  // Generate Promo
  await prisma.promo.upsert({
    where: { code: "DISKON10PERSEN" },
    update: {},
    create: {
      code: "DISKON10PERSEN",
      description: "Diskon 10% Semua Produk",
      amount: 10,
      isPercent: true,
      expiryDate: new Date("2026-12-31T23:59:59Z"),
    },
  });

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
