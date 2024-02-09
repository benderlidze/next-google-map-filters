import { ChangeEvent, KeyboardEventHandler, createRef, useState } from "react";
import { Marker } from "./Markers";

type PropsDropDownList = {
  markers: Marker[];
};

export const PropsDropDownList = ({ markers }: PropsDropDownList) => {
  const inputRef = createRef<HTMLInputElement>();
  const ulRef = createRef<HTMLUListElement>();
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  console.log("markers", markers);

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    console.log("value", value);
  };

  const handleSelectedPlace = (place: Marker) => {
    console.log("place", place);
    const value = `${place.street} ${place.state}`;
    setInputValue(value);
    setIsOpen(false);
  };

  const next = () => {
    if (markers && selectedPlace < markers.length - 1) {
      const index = selectedPlace + 1;
      setSelectedPlace(index);
      scrollToItem(index);
    }
  };
  const prev = () => {
    if (markers && selectedPlace > 0) {
      const index = selectedPlace - 1;
      setSelectedPlace(index);
      scrollToItem(index);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
    console.log("ev", selectedPlace, ev);
    switch (ev.key) {
      case "ArrowUp":
        ev.preventDefault();
        prev();
        break;
      case "ArrowDown":
        ev.preventDefault();
        next();
        break;
      case "Enter":
        ev.preventDefault();
        handleSelectedPlace(markers[selectedPlace]);
        break;
      default:
        break;
    }
  };

  const scrollToItem = (index: number) => {
    if (ulRef.current && ulRef.current.children[index]) {
      const item = ulRef.current.children[index] as HTMLElement;
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="flex-1">
      <input
        ref={inputRef}
        className="p-2 rounded-xl border border-gray-300 w-full focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
        value={inputValue}
        // onChange={onInputChange}
        tabIndex={0}
        onBlur={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        placeholder={"From"}
        onKeyDown={handleKeyDown}
      />
      {isOpen && markers && markers.length > 0 && (
        <ul
          ref={ulRef}
          className="bg-white h-[200px] mt-2 absolute z-10 w-96  text-ellipsis overflow-y-auto"
        >
          {markers.map((place, index) => (
            <li
              className={`cursor-pointer whitespace-nowrap p-1 hover:bg-slate-100 overflow-hidden ${
                index === selectedPlace ? `bg-slate-100` : ""
              }`}
              key={place.id}
              onClick={() => handleSelectedPlace(place)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents the input field from losing focus before handling the selection
                handleSelectedPlace(place);
                inputRef && inputRef.current && inputRef.current.blur();
              }}
            >
              {place.street} {place.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
