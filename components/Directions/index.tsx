import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export const AutocompletePlaces = () => {
  const placesLibrary = useMapsLibrary("places");
  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [results, setResults] = useState<
    google.maps.places.QueryAutocompletePrediction[] | null
  >([]);
  const [inputValue, setInputValue] = useState<string>("");

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
    setResults([]);
  };

  if (!service) return null;

  return (
    <div className="max-w-96">
      <input
        className="p-2 rounded-xl border border-gray-300 w-full focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
        value={inputValue}
        onChange={onInputChange}
      />
      {results && results.length > 0 && (
        <ul className="bg-white mt-2">
          {results.map((place) => (
            <li
              className="cursor-pointer whitespace-nowrap p-1 hover:bg-slate-100 overflow-hidden"
              key={place.place_id}
              onClick={() => handleSelectedPlace(place)}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
