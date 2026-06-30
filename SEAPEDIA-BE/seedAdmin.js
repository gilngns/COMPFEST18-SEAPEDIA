const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo accounts...");

  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  const adminPassword = await hashPassword('password123');
  await prisma.user.upsert({
    where: { email: 'admin@seapedia.com' },
    update: {},
    create: {
      username: 'Admin Seapedia',
      email: 'admin@seapedia.com',
      password: adminPassword,
      roles: {
        create: [{ role: 'ADMIN' }]
      }
    }
  });
  console.log("Admin account created");

  const jokoPassword = await hashPassword('password123');
  await prisma.user.upsert({
    where: { email: 'joko@gmail.com' },
    update: {},
    create: {
      username: 'Joko',
      email: 'joko@gmail.com',
      password: jokoPassword,
      roles: {
        create: [{ role: 'BUYER' }]
      },
      wallet: {
        create: { balance: 0 }
      },
      cart: {
        create: {}
      }
    }
  });
  console.log("Buyer account created");

  const hendriPassword = await hashPassword('123123');
  await prisma.user.upsert({
    where: { email: 'hendri@gmail.com' },
    update: {},
    create: {
      username: 'Hendri',
      email: 'hendri@gmail.com',
      password: hendriPassword,
      roles: {
        create: [{ role: 'SELLER' }]
      },
      wallet: {
        create: { balance: 0 }
      },
      store: {
        create: {
          name: 'Toko Hendri',
          domain: 'tokohendri',
          city: 'Jakarta',
          address: 'Jalan Kenangan No. 1'
        }
      }
    }
  });
  console.log("Seller account created");

  const budiPassword = await hashPassword('12345678');
  await prisma.user.upsert({
    where: { email: 'budi@gmail.com' },
    update: {},
    create: {
      username: 'Budi',
      email: 'budi@gmail.com',
      password: budiPassword,
      roles: {
        create: [{ role: 'DRIVER' }]
      },
      wallet: {
        create: { balance: 0 }
      }
    }
  });
  console.log("Driver account created");
  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
