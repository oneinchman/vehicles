"use server";

import { Equipment, Vehicle } from "@prisma/client";
import prisma from "@/app/lib/prisma";

type VehicleInput = Omit<Vehicle, "active" | "name"> & {
  status: "active" | "inactive";
  equipments?: number[];
  name?: string;
};

export async function uploadVehicles(prevState: any, formData: FormData) {
  const blob = formData.get("file") as Blob | null;

  if (!blob?.size) {
    return {
      error: "No file selected",
    };
  }

  const content = await blob.text();
  const vehicles = JSON.parse(content) as VehicleInput[];

  try {
    for (const vehicle of vehicles) {
      // name is required
      if (!vehicle.name) {
        continue;
      }

      // update the vehicle if found, otherwise create it
      // 'active' and 'driver' are not in the requirements, but I'm assuming they should be present
      await prisma.vehicle.upsert({
        where: {
          id: vehicle.id,
        },
        create: {
          id: vehicle.id,
          fuelType: vehicle.fuelType,
          name: vehicle.name,
          active: vehicle.status === "active",
          driver: vehicle.driver,
        },
        update: {
          active: vehicle.status === "active",
          driver: vehicle.driver,
          fuelType: vehicle.fuelType,
          name: vehicle.name,
        },
      });

      if (!vehicle.equipments?.length) {
        continue;
      }

      for (const equipmentId of vehicle.equipments) {
        const equipmentInDb = await prisma.equipment.findUnique({
          where: {
            externalId: equipmentId,
          },
        });

        if (!equipmentInDb) {
          continue;
        }

        // add the equipment to the vehicle if the equipment is found
        await prisma.vehicle.update({
          where: {
            id: vehicle.id,
          },
          data: {
            equipments: {
              connect: {
                id: equipmentInDb.id,
              },
            },
          },
        });
      }
    }

    return {
      message: "Vehicles uploaded successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      error: "An error occured when trying to upload vehicles",
    };
  }
}

type EquipmentInput = Omit<Equipment, "id"> & {
  id: number;
};

export async function uploadEquipment(prevState: any, formData: FormData) {
  const blob = formData.get("file") as Blob | null;

  if (!blob?.size) {
    return {
      error: "No file selected",
    };
  }

  const content = await blob.text();
  const equipmentList = JSON.parse(content) as EquipmentInput[];

  try {
    for (const equipment of equipmentList) {
      // update the equipment if found, otherwise create it
      await prisma.equipment.upsert({
        where: {
          externalId: equipment.id,
        },
        create: {
          externalId: equipment.id,
          name: equipment.name,
        },
        update: {
          externalId: equipment.id,
          name: equipment.name,
        },
      });
    }
  } catch (error) {
    console.log(error);

    return {
      error: "An error occured when trying to upload equipments",
    };
  }

  return {
    message: "Equipments uploaded successfully",
  };
}
