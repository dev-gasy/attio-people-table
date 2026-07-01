import { useQuery } from "@tanstack/react-query";
import { vinQueryOptions } from "./vin.query-options";

export const useVinBrandsQuery = () => useQuery(vinQueryOptions.brands());

export const useVinModelsQuery = ({
  brand,
  year,
}: {
  brand: string;
  year: string;
}) => useQuery(vinQueryOptions.models({ brand, year }));

export const useVinWmisQuery = (brand: string) =>
  useQuery(vinQueryOptions.wmis(brand));
