import React, { useState } from "react";
import { NumberFilter } from "@components/NumberFilter";
import { DropDownFilter } from "../DropDownFilter";

const categories = [
  "Upscale Living",
  "Pet Friendly",
  "Fitness Center",
  "Resort Style Pool",
  "Situate Downtown",
  "Clubhouse",
];

const propertyTypes = [
  "Apartments",
  "Apartment Rental Agencies",
  "Housing Development",
  "Townhouse Complex",
  "Real Estate Rental Agency",
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
  propertyType,
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
    <div className="p-2 flex flex-col gap-5 bg-white rounded-lg w-fit ">
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
        <DropDownFilter
          filterName={"Property Type"}
          valueList={propertyTypes}
          value={filter.propertyType}
          setValue={setFilterValue(NumberFilterType.propertyType)}
        />
      </div>

      <div className="flex flex-row gap-4 justify-center">
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
