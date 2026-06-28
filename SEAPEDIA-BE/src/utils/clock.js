const prisma = require("../config/prisma");

async function getSimulatedDate() {
  let clock = await prisma.systemClock.findUnique({ where: { id: 1 } });
  if (!clock) {
    clock = await prisma.systemClock.create({ data: { id: 1, dayOffset: 0 } });
  }
  
  const date = new Date();
  date.setDate(date.getDate() + clock.dayOffset);
  return date;
}

module.exports = { getSimulatedDate };