import {
  ChangeEvent,
  KeyboardEventHandler,
  createRef,
  useEffect,
  useState,
} from "react";
import { Marker } from "./Markers";

type PropsDropDownList = {
  markers: Marker[];
  selectedMarker: Marker | null;
  setSelectedMarkerFromDropDown: React.Dispatch<
    React.SetStateAction<Marker | null>
  >;
  setSelectedMarker: React.Dispatch<React.SetStateAction<Marker | null>>;
};

export const PropsDropDownList = ({
  markers,
  selectedMarker,
  setSelectedMarkerFromDropDown,
  setSelectedMarker,
}: PropsDropDownList) => {
  const inputRef = createRef<HTMLInputElement>();
  const ulRef = createRef<HTMLUListElement>();
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (selectedMarker) {
      //setInputValue(selectedMarker.name);
      handleSelectedPlace(selectedMarker);
    }

    if (selectedMarker === null) {
      setInputValue("");
    }
  }, [selectedMarker]);

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInputValue(value);
  };

  const handleClearInput = () => {
    setInputValue("");
    setIsOpen(false);
    setSelectedMarkerFromDropDown(null);
    setSelectedMarker(null);
  };

  const handleSelectedPlace = (place: Marker) => {
    const value = `${place.name}`;
    setInputValue(value);
    setIsOpen(false);
    setSelectedMarkerFromDropDown(place);
    setSelectedMarker(place);
  };

  const next = () => {
    const filtered = markers.filter((place) => {
      return place.name.toLowerCase().includes(inputValue.toLowerCase());
    });
    if (filtered && selectedPlace < filtered.length - 1) {
      const index = selectedPlace + 1;
      scrollToItem(index);
      setSelectedPlace(index);
    }
  };

  const prev = () => {
    if (markers && selectedPlace > 0) {
      const index = selectedPlace - 1;
      scrollToItem(index);
      setSelectedPlace(index);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
    setIsOpen(true);
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
        const filtered = markers.filter((place) => {
          return place.name.toLowerCase().includes(inputValue.toLowerCase());
        });
        handleSelectedPlace(filtered[selectedPlace]);
        break;
      case "Escape":
        console.log("Escape");
        break;
    }
  };

  const scrollToItem = (index: number) => {
    if (ulRef.current && ulRef.current.children[index]) {
      const item = ulRef.current.children[index] as HTMLElement;
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  type ReplaceAllCaseInsensitive = {
    text: string;
    search: string;
    replace: string;
  };

  const replaceAllCaseInsensitive = ({
    text,
    search,
  }: ReplaceAllCaseInsensitive) => {
    const regex = new RegExp(search, "gi");
    return text.replace(regex, `<b>$&</b>`);
  };

  return (
    <div className="flex-1">
      <div className="flex flex-row align-middle self-center">
        <input
          type="search"
          ref={inputRef}
          className="input-search p-2 rounded-xl border border-gray-300 w-full focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          onBlur={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onClick={() => {
            setSelectedPlace(0);
            setIsOpen(true);
          }}
          placeholder={"From"}
        />
        <div className="relative">
          <div
            onClick={handleClearInput}
            className="absolute hover:bg-slate-400 bg-slate-300 rounded-full p-2 m-2 right-[0px]   cursor-pointer"
          >
            <svg
              fill="#000000"
              height="10px"
              width="10px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 490 490"
            >
              <polygon
                points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
	489.292,457.678 277.331,245.004 489.292,32.337 "
              />
            </svg>
          </div>
        </div>
      </div>
      {isOpen && markers && markers.length > 0 && (
        <div className="relative">
          <ul
            ref={ulRef}
            className="bg-white absolute max-h-[220px] min-w-full max-w-full mt-2 z-10 text-ellipsis overflow-y-auto overflow-x-hidden"
            style={{ width: "inherit" }}
          >
            {markers
              .filter((place) => {
                return place.name
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              })
              .map((place, index) => {
                // Example usage:

                const replacedText = replaceAllCaseInsensitive({
                  text: place.name,
                  search: inputValue,
                  replace: `<span class="font-bold">${inputValue}</span>`,
                });

                return (
                  <li
                    className={`cursor-pointer whitespace-nowrap p-2 hover:bg-slate-100 overflow-hidden ${
                      index === selectedPlace ? `bg-slate-100` : ""
                    }`}
                    key={place.street}
                    onClick={() => handleSelectedPlace(place)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents the input field from losing focus before handling the selection
                      handleSelectedPlace(place);
                      inputRef && inputRef.current && inputRef.current.blur();
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: replacedText }}
                    ></div>
                    {/* <div className="text-xs">{place.street}</div> */}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};
