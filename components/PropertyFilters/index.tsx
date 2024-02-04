import React, { useState } from "react";
import { NumberFilter } from "@components/NumberFilter";

const categories = [
  "Upscale Living",
  "Pet Friendly",
  "Fitness Center",
  "Resort Style Pool",
  "Situate Downtown",
  "Clubhouse",
];

export type Filter = {
  prefferedCategory: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  minSqft: number;
  maxSqft: number;
};

enum NumberFilterType {
  bedrooms,
  bathrooms,
}
type PropertyFiltersProps = {
  filterInit: Filter;
  setApplyFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export const PropertyFilters = ({
  filterInit,
  setApplyFilter,
}: PropertyFiltersProps) => {
  const [filter, setFilter] = useState<Filter>(filterInit);
  const setFilterValue = (name: NumberFilterType) => {
    return (value: string | number) =>
      setFilter((prev) => ({
        ...prev,
        [NumberFilterType[name]]: value,
      }));
  };

  const handleApplyFilters = () => {
    setApplyFilter(filter);
  };

  return (
    <div className="p-2  bg-white rounded-lg w-fit ">
      <div className="flex flex-row gap-2 align-middle items-center">
        <NumberFilter
          filterName="No of Bedrooms"
          number={filter.bedrooms}
          setValue={setFilterValue(NumberFilterType.bedrooms)}
        />
        <NumberFilter
          filterName="No of Bathrooms"
          number={filter.bathrooms}
          setValue={setFilterValue(NumberFilterType.bathrooms)}
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="border select-none  p-3 rounded-lg  cursor-pointer">
          Clear Filters
        </div>
        <div
          onClick={handleApplyFilters}
          className="text-white select-none bg-slate-800 p-3 rounded-lg  cursor-pointer"
        >
          Apply Filters
        </div>
      </div>
    </div>
  );
};
