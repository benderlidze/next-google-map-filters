import React, { useState } from "react";
import { NumberFilter } from "@components/NumberFilter";
import { DropDownFilter } from "../DropDownFilter";
import { CategoryFilter } from "../CategoryFilter";
import { create } from "domain";
import { createPortal } from "react-dom";

const propertyTypes = [
  "Apartments",
  "Apartment Rental Agencies",
  "Housing Development",
  "Townhouse Complex",
  "Real Estate Rental Agency",
];

export type Filter = {
  categroryList: string[];
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  minSqft: number;
  maxSqft: number;
};

enum NumberFilterType {
  categroryList,
  bedrooms,
  bathrooms,
  propertyType,
}

type PropertyFiltersProps = {
  initFilterValues: Filter;
  filterVals: Filter;
  setApplyFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export const PropertyFilters = ({
  initFilterValues,
  filterVals,
  setApplyFilter,
}: PropertyFiltersProps) => {
  const [filter, setFilter] = useState<Filter>(filterVals);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const setFilterValue = (name: NumberFilterType) => {
    return (value: string | number | string[]) =>
      setFilter((prev) => ({
        ...prev,
        [NumberFilterType[name]]: value,
      }));
  };

  const handleClearFilters = () => {
    console.log("filterInit ", initFilterValues);
    setFilter(initFilterValues);
    setApplyFilter(initFilterValues);
  };

  const handleApplyFilters = () => {
    setApplyFilter(filter);
  };

  const handleClose = () => {
    setIsFiltersOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsFiltersOpen(true)}
        className="text-black bg-white p-2 border rounded-lg hover:bg-slate-100"
      >
        Filter
      </button>

      {isFiltersOpen &&
        createPortal(
          <>
            <div className="absolute flex flex-row-reverse w-full h-full z-10 top-0  bg-slate-700 bg-opacity-50 ">
              <div className="p-4 flex flex-col gap-5 bg-white w-3/5 h-full">
                <div className=" flex flex-row justify-between items-center ">
                  <div className="text-xl">PREFERRED CATEGORY</div>
                  <div>
                    <button
                      onClick={handleClose}
                      className="text-black p-2 rounded-full hover:bg-slate-100"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-row gap-2 align-middle items-center">
                  <CategoryFilter
                    selectedCategories={filter.categroryList}
                    setValue={setFilterValue(NumberFilterType.categroryList)}
                  />
                </div>
                <div className="text-xl">FILTER RESULTS BY</div>
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
                  <div
                    onClick={handleClearFilters}
                    className="border select-none  p-3 rounded-lg  cursor-pointer"
                  >
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
            </div>
          </>,
          document.body
        )}
    </div>
  );
};
