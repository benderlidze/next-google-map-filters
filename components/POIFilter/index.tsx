import { useState } from "react";

export type IFilter = {
  id: number;
  name: string;
  icon: string;
  selected: boolean;
};

type POIFilterProps = {
  poiList: IFilter[];
  setFiltersList: React.Dispatch<React.SetStateAction<IFilter[]>>;
};

export const POIFilter = ({ poiList, setFiltersList }: POIFilterProps) => {
  const updateFilters = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFiltersList &&
      setFiltersList((prev) => {
        return prev.map((filter) => {
          if (filter.name === name) {
            return { ...filter, selected: event.target.checked };
          }
          return filter;
        });
      });
  };

  const POIItem = ({ data }: { data: IFilter }) => {
    const { name, selected } = data;
    return (
      <div className="flex select-none flex-row items-center gap-2 whitespace-nowrap ">
        <input
          id={name}
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={selected}
          onChange={(event) => updateFilters(event, name)}
        />
        <label className="cursor-pointer" htmlFor={name}>
          {name}
        </label>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-xl p-3 ">
      {poiList.map((poi) => (
        <POIItem data={poi} />
      ))}
    </div>
  );
};
