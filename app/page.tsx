import prisma from "@/app/lib/prisma";
import VehicleCard from "./components/Vehicle";
import Link from "next/link";

// prevent database query cache
export const revalidate = 0;

async function getData() {
  return {
    vehicles: await prisma.vehicle.findMany({
      include: {
        equipments: true,
      },
    }),
    equipment: await prisma.equipment.findMany(),
  };
}

export default async function Vehicles() {
  const { vehicles, equipment } = await getData();

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1>My Vehicles</h1>

        <Link className="block" href={"/admin"}>
          Add vehicles/equipment
        </Link>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            equipmentList={equipment}
            vehicle={vehicle}
          />
        ))}
      </section>
    </>
  );
}
