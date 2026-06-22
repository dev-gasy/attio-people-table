import { useQuery } from "@tanstack/react-query";
import { vinOptions } from "./vin.options";

export const useVinBrandsQuery = () => useQuery(vinOptions.brands());

export const useVinModelsQuery = ({
  brand,
  year,
}: {
  brand: string;
  year: string;
}) => useQuery(vinOptions.models({ brand, year }));

export const useVinWmisQuery = (brand: string) =>
  useQuery(vinOptions.wmis(brand));
