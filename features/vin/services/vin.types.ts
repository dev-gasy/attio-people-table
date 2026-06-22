export interface VinBrandDto {
  MakeId?: number | string | null;
  MakeName?: string | null;
  VehicleTypeName?: string | null;
}

export interface VinModelDto {
  Make_ID?: number | string | null;
  Make_Name?: string | null;
  Model_ID?: number | string | null;
  Model_Name?: string | null;
}

export interface VinWmiDto {
  Country?: string | null;
  DateAvailableToPublic?: string | null;
  Id?: number | string | null;
  Name?: string | null;
  VehicleType?: string | null;
  WMI?: string | null;
}

export interface VinApiResponseDto<TDto> {
  Count?: number;
  Message?: string;
  Results?: TDto[];
  SearchCriteria?: string;
}

export interface VinBrandModel {
  id: string;
  name: string;
  vehicleType: string | null;
}

export interface VinVehicleModel {
  id: string;
  makeId: string;
  makeName: string;
  name: string;
}

export interface VinWmiModel {
  country: string | null;
  id: string;
  name: string;
  vehicleType: string | null;
  wmi: string;
}
