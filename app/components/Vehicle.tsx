"use client";

import { Equipment, Prisma } from "@prisma/client";
import { useCallback, useState } from "react";
import { addEquipment, removeEquipment, updateVehicle } from "./actions";
import { Term } from "./Term";

type Vehicle = Prisma.VehicleGetPayload<{
  include: {
    equipments: true;
  };
}>;

type VehicleCardProps = {
  vehicle: Vehicle;
  equipmentList: Equipment[];
};

export default function VehicleCard({
  vehicle,
  equipmentList,
}: VehicleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    equipmentList[0]?.id
  );
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState(vehicle.active);
  const [driver, setDriver] = useState(vehicle.driver);
  const [fuelType, setFuelType] = useState(vehicle.fuelType);

  const addedIds = vehicle.equipments.map((equipment) => equipment.id);

  const reset = useCallback(() => {
    setActive(vehicle.active);
    setDriver(vehicle.driver);
    setFuelType(vehicle.fuelType);
  }, [vehicle.active, vehicle.driver, vehicle.fuelType]);

  const activeId = `vehicle-${vehicle.id}-active`;
  const driverId = `vehicle-${vehicle.id}-driver`;
  const fuelTypeId = `vehicle-${vehicle.id}-fueltype`;

  return (
    <article className="p-3 bg-zinc-100" key={vehicle.id}>
      <header className="flex justify-between">
        <h2>{vehicle.id}</h2>

        <button
          onClick={() => {
            setEditMode((prev) => !prev);
            reset();
          }}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </header>

      {editMode ? (
        <form
          action={() => {
            // Do not await the promise since we want to exit edit mode first.
            // The mutated and refreshed data will then rerender the component
            updateVehicle({
              active,
              driver,
              fuelType,
              id: vehicle.id,
              name: vehicle.name,
            });
            reset();
            setEditMode(false);
          }}
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <span>Name</span>

              <span>{vehicle.name}</span>
            </div>

            <div className="flex flex-col">
              <span>ID</span>

              <span>{vehicle.id}</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={active}
                id={activeId}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label htmlFor={activeId}>Is active</label>
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor={driverId}>Driver</label>

              <input
                type="text"
                className="max-w-full w-full p-2"
                value={driver}
                id={driverId}
                onChange={(e) => setDriver(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor={fuelTypeId}>Fuel type</label>

              <input
                type="text"
                className="max-w-full w-full p-2"
                value={fuelType}
                id={fuelTypeId}
                onChange={(e) => setFuelType(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">Save</button>
        </form>
      ) : (
        <dl className="grid grid-cols-2 gap-3">
          <Term label="Name" value={vehicle.name} />

          <Term label="ID" value={vehicle.id} />

          <Term label="Is active" value={vehicle.active ? "True" : "False"} />

          <Term label="Driver" value={vehicle.driver} />

          <Term label="Fuel type" value={vehicle.fuelType} />
        </dl>
      )}

      <h3 className="font-bold mb-1 mt-4">Equipment</h3>

      {editMode && (
        <div className="flex gap-2 mb-3">
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">-- Select equipment --</option>
            {equipmentList.map((equipment) => (
              <option
                disabled={addedIds.includes(equipment.id)}
                key={equipment.id}
                value={equipment.id}
              >
                {equipment.name}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedOption}
            onClick={async () => {
              if (!selectedOption) {
                return;
              }

              await addEquipment(vehicle.id, selectedOption);
              setSelectedOption("");
            }}
          >
            Add
          </button>
        </div>
      )}

      <ul>
        {vehicle.equipments.map((equipment) => (
          <li
            key={equipment.id}
            className="flex justify-between my-2 items-center"
          >
            <span>{equipment.name}</span>

            {editMode && (
              <button
                className="px-2 py-2"
                onClick={async () => removeEquipment(vehicle.id, equipment.id)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
