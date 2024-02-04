type DropDownFilterProps = {
  filterName: string;
  valueList: string[];
  value: string;
  setValue: (value: string) => void;
};

export const DropDownFilter = ({
  filterName,
  value,
  valueList,
  setValue,
}: DropDownFilterProps) => {
  return (
    <div className="p-2  w-fit">
      <span className="font-bold">{filterName}</span>
      <div className="flex flex-row gap-2 align-middle items-center">
        <select
          className="border select-none  p-3 rounded-lg  cursor-pointer"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        >
          <option value="">Select</option>
          {valueList.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
