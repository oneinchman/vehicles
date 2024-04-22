"use server";

import prisma from "@/app/lib/prisma";
import { Vehicle } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function removeEquipment(vehicleId: string, equipmentId: string) {
  await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      equipments: {
        disconnect: {
          id: equipmentId,
        },
      },
    },
  });

  // revalidate home to get the updated data
  revalidatePath("/");
}

export async function addEquipment(vehicleId: string, equipmentId: string) {
  await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      equipments: {
        connect: {
          id: equipmentId,
        },
      },
    },
  });

  // revalidate home to get the updated data
  revalidatePath("/");
}

export async function updateVehicle(vehicle: Vehicle) {
  await prisma.vehicle.update({
    where: {
      id: vehicle.id,
    },
    data: vehicle,
  });

  // revalidate home to get the updated data
  revalidatePath("/");
}
