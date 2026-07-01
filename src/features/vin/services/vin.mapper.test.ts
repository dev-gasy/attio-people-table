import { describe, expect, it } from "vitest";
import { vinMapper } from "./vin.mapper";
import type { VinBrandDto, VinModelDto, VinWmiDto } from "./vin.types";

describe("vinMapper", () => {
  it("normalizes, sorts, and deduplicates brand DTOs", () => {
    const dtos: VinBrandDto[] = [
      { MakeId: 2, MakeName: " BMW ", VehicleTypeName: " Passenger Car " },
      { MakeId: 3, MakeName: "bmw", VehicleTypeName: "Passenger Car" },
      { MakeId: null, MakeName: "Audi", VehicleTypeName: "" },
      { MakeId: 4, MakeName: " ", VehicleTypeName: "Truck" },
    ];

    expect(vinMapper.toBrandModels(dtos)).toEqual([
      { id: "Audi", name: "Audi", vehicleType: null },
      { id: "2", name: "BMW", vehicleType: "Passenger Car" },
    ]);
  });

  it("normalizes, sorts, and deduplicates vehicle model DTOs", () => {
    const dtos: VinModelDto[] = [
      { Make_ID: 1, Make_Name: " BMW ", Model_ID: 20, Model_Name: " X5 " },
      { Make_ID: 1, Make_Name: "BMW", Model_ID: 21, Model_Name: "x5" },
      {
        Make_ID: 1,
        Make_Name: "BMW",
        Model_ID: null,
        Model_Name: " 3 Series ",
      },
      { Make_ID: 1, Make_Name: "BMW", Model_ID: 22, Model_Name: "" },
    ];

    expect(vinMapper.toVehicleModels(dtos)).toEqual([
      { id: "3 Series", makeId: "1", makeName: "BMW", name: "3 Series" },
      { id: "20", makeId: "1", makeName: "BMW", name: "X5" },
    ]);
  });

  it("normalizes WMI DTOs and filters invalid codes", () => {
    const dtos: VinWmiDto[] = [
      {
        Country: " Germany ",
        Id: 10,
        Name: " BMW AG ",
        VehicleType: " Passenger Car ",
        WMI: " wba ",
      },
      {
        Country: "",
        Id: null,
        Name: "",
        VehicleType: "",
        WMI: "abc",
      },
      {
        Country: "United States",
        Id: 11,
        Name: "Invalid",
        VehicleType: "Truck",
        WMI: "IOQ",
      },
      {
        Country: "Germany",
        Id: 12,
        Name: "Duplicate",
        VehicleType: "Passenger Car",
        WMI: "WBA",
      },
    ];

    expect(vinMapper.toWmiModels(dtos)).toEqual([
      {
        country: null,
        id: "abc",
        name: "Unknown manufacturer",
        vehicleType: null,
        wmi: "ABC",
      },
      {
        country: "Germany",
        id: "10",
        name: "BMW AG",
        vehicleType: "Passenger Car",
        wmi: "WBA",
      },
    ]);
  });
});
