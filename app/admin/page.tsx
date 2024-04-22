import { uploadEquipment, uploadVehicles } from "./actions";
import Link from "next/link";
import { UploadingForm } from "../components/UploadingForm";

/**
 * Page for uploading equipment and vehicles (assuming it should be its own page)
 *
 * Uses server actions
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */
export default function AdminPage() {
  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1>Admin</h1>

        <Link className="block" href={"/"}>
          View vehicles
        </Link>
      </header>

      <UploadingForm
        name="equipment"
        label="Upload equipment"
        serverAction={uploadEquipment}
      />

      <UploadingForm
        name="vehicles"
        label="Upload vehicles"
        serverAction={uploadVehicles}
      />
    </>
  );
}
