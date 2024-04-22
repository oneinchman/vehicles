import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.equipment.createMany({
    data: [
      {
        id: "eq1",
        externalId: 1,
        name: "Crane",
      },
      {
        id: "eq2",
        externalId: 2,
        name: "Tachograph",
      },
    ],
  });

  await prisma.vehicle.create({
    data: {
      active: true,
      driver: "SpongeBob SquarePants",
      fuelType: "LNG",
      id: "v1",
      name: "ABC23",
      equipments: {
        connect: [
          {
            id: "eq1",
          },
          {
            id: "eq2",
          },
        ],
      },
    },
  });

  await prisma.vehicle.create({
    data: {
      id: "v2",
      name: "XXW123",
      driver: "Patrick Star",
      active: true,
      fuelType: "Diesel",
      equipments: {
        connect: {
          id: "eq1",
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
