const categoriesList = [
  {
    name: "Upscale Living",
    img: "https://mt.gounion.com/assets/svg/upscale-living.svg",
  },
  {
    name: "Pet Friendly",
    img: "https://mt.gounion.com/assets/svg/pet-friendly.svg",
  },
  {
    name: "Fitness Center",
    img: "https://mt.gounion.com/assets/svg/fitness-center.svg",
  },
  {
    name: "Resort Style Pool",
    img: "https://mt.gounion.com/assets/svg/resort-style.svg",
  },
  {
    name: "Situate Downtown",
    img: "https://mt.gounion.com/assets/svg/situated-downtown.svg",
  },
  {
    name: "Clubhouse",
    img: "https://mt.gounion.com/assets/svg/rooftop-deck.svg",
  },
] as Category[];

type Category = {
  name: string;
  img: string;
};

type CategoryFilterProps = {
  selectedCategories: string[];
  setValue: (value: string[]) => void;
};

export const CategoryFilter = ({
  selectedCategories,
  setValue,
}: CategoryFilterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cat = e.target.value;
    if (selectedCategories.includes(cat)) {
      setValue(selectedCategories.filter((c) => c !== cat));
    } else {
      setValue([...selectedCategories, cat]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {categoriesList.map((category, index) => {
          const { name, img } = category;
          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={name}
                name={name}
                value={name}
                onChange={handleChange}
                checked={selectedCategories.includes(name)}
              />
              <label
                htmlFor={name}
                className="flex flex-row gap-1 cursor-pointer select-none"
              >
                <img className="w-[18px] h-auto" src={img} />
                {name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
