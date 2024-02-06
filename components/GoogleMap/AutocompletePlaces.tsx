import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

type AutocompletePlacesProps = {
  placeHolder: string;
  onSelect: (place: google.maps.places.QueryAutocompletePrediction) => void;
};

export const AutocompletePlaces = ({
  onSelect,
  placeHolder,
}: AutocompletePlacesProps) => {
  const placesLibrary = useMapsLibrary("places");
  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [results, setResults] = useState<
    google.maps.places.QueryAutocompletePrediction[] | null
  >([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState(0);

  useEffect(() => {
    if (placesLibrary) setService(new placesLibrary.AutocompleteService());
    return () => setService(null);
  }, [placesLibrary]);

  const updateResults = (inputValue: string) => {
    if (!service || inputValue.length === 0) {
      setResults([]);
      return;
    }
    const request = { input: inputValue };
    service.getQueryPredictions(request, (res) => {
      setResults(res);
    });
  };

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInputValue(value);
    updateResults(value);
  };

  const handleSelectedPlace = (
    place: google.maps.places.QueryAutocompletePrediction
  ) => {
    setInputValue(place.description);
    onSelect && onSelect(place);
    setResults([]);
  };

  const next = () => {
    if (results && selectedPlace < results.length - 1) {
      setSelectedPlace(selectedPlace + 1);
    }
  };
  const prev = () => {
    if (results && selectedPlace > 0) {
      setSelectedPlace(selectedPlace - 1);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
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
        results &&
          results[selectedPlace] &&
          handleSelectedPlace(results[selectedPlace]);
        break;
      default:
        break;
    }
  };

  if (!service) return null;

  console.log("results", results, selectedPlace);

  return (
    <div className="flex-1">
      <input
        className="p-2 rounded-xl border border-gray-300 w-full focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
        value={inputValue}
        onChange={onInputChange}
        tabIndex={0}
        onBlur={() => setResults([])}
        placeholder={placeHolder}
        onKeyDown={handleKeyDown}
      />
      {results && results.length > 0 && (
        <ul className="bg-white mt-2 absolute w-96  text-ellipsis">
          {results.map((place, index) => (
            <li
              className={`cursor-pointer whitespace-nowrap p-1 hover:bg-slate-100 overflow-hidden ${
                index === selectedPlace ? `bg-slate-100` : ""
              }`}
              key={place.place_id}
              onClick={() => handleSelectedPlace(place)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents the input field from losing focus before handling the selection
                handleSelectedPlace(place);
              }}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
