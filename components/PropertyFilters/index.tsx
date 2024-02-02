import { useState } from "react";

export const PropertyFilters = () => {
  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(0);

  return (
    <div className="p-2 bg-white rounded-lg w-fit">
      <div className="p-2  w-fit">
        No of Bedrooms
        <div className="flex flex-row gap-2 align-middle items-center">
          <div
            className="border w-fit px-3 select-none border-gray-200 p-2 cursor-pointer :hover:border-gray-400"
            onClick={() =>
              setNumberOfBedrooms((prev) => (prev > 0 ? prev - 1 : prev))
            }
          >
            -
          </div>
          <div className="w-5 flex justify-center">{numberOfBedrooms}</div>
          <div
            className="border w-fit px-3 select-none border-gray-200 p-2 cursor-pointer :hover:border-gray-400"
            onClick={() =>
              setNumberOfBedrooms((prev) => {
                return prev + 1;
              })
            }
          >
            +
          </div>
        </div>
      </div>

      <div className="text-white select-none bg-slate-800 p-3 rounded-lg  cursor-pointer">
        Apply Filters
      </div>
    </div>
  );
};
