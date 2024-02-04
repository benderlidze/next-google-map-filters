type NumberFilterProps = {
  filterName: string;
  number: number;
  setValue: (value: number) => void;
};

export const NumberFilter = ({
  filterName,
  number,
  setValue,
}: NumberFilterProps) => {
  return (
    <div className="p-2  w-fit">
      {filterName}
      <div className="flex flex-row gap-2 align-middle items-center">
        <div
          className="border w-fit px-3 select-none border-gray-200 p-2 cursor-pointer :hover:border-gray-400"
          onClick={() => setValue(number > 0 ? number - 1 : number)}
        >
          -
        </div>
        <div className="w-5 flex justify-center">{number}</div>
        <div
          className="border w-fit px-3 select-none border-gray-200 p-2 cursor-pointer :hover:border-gray-400"
          onClick={() => setValue(number + 1)}
        >
          +
        </div>
      </div>
    </div>
  );
};
