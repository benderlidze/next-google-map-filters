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
};

export const PropsDropDownList = ({
  markers,
  selectedMarker,
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
  }, [selectedMarker]);

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInputValue(value);
  };

  const handleSelectedPlace = (place: Marker) => {
    const value = `${place.name}`;
    setInputValue(value);
    setIsOpen(false);
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
      {isOpen && markers && markers.length > 0 && (
        <ul
          ref={ulRef}
          className="bg-white max-h-[220px] mt-2 absolute z-10 w-96  text-ellipsis overflow-y-auto"
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
                  key={place.id}
                  onClick={() => handleSelectedPlace(place)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents the input field from losing focus before handling the selection
                    handleSelectedPlace(place);
                    inputRef && inputRef.current && inputRef.current.blur();
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: replacedText }}></div>
                  {/* <div className="text-xs">{place.street}</div> */}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};
