import { CarFront } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible-section";
import { InsuranceRecordBlock } from "@/features/insurance/components/insurance-record-block";
import { getVehicleFields } from "@/features/insurance/domain/insurance-detail";
import type { InsuranceVehicle } from "@/features/insurance/insurance-mappers";

export function InsuranceVehiclesSection({
  vehicles,
}: {
  vehicles: InsuranceVehicle[];
}) {
  return (
    <Collapsible title="Vehicles" count={vehicles.length} icon={CarFront}>
      <div className="divide-y divide-border/60">
        {vehicles.map((vehicle) => (
          <InsuranceRecordBlock
            key={vehicle.id}
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fields={getVehicleFields(vehicle)}
            icon={CarFront}
          />
        ))}
      </div>
    </Collapsible>
  );
}
