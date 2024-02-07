import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { AutocompletePlaces } from "./AutocompletePlaces";
import { useEffect, useState } from "react";

type SearchBarProps = {
  setSearchResults: (results: { lat: number; lng: number } | null) => void;
};

export const SearchBar = ({ setSearchResults }: SearchBarProps) => {
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLibrary) {
      setGeocodingService(new google.maps.Geocoder());
    }
    return () => setGeocodingService(null);
  }, [geocodingLibrary]);

  const handleSelectedPlace = (
    place: google.maps.places.QueryAutocompletePrediction
  ) => {
    console.log("place", place);
    geocodingService?.geocode({ placeId: place.place_id }, (res) => {
      console.log("res", res);
      if (res && res.length > 0) {
        const location = res[0].geometry.location as google.maps.LatLng;
        console.log("location", location);

        setSearchResults({
          lat: location.lat(),
          lng: location.lng(),
        });
      }
    });
  };

  return (
    <div>
      <AutocompletePlaces
        placeHolder="Search by City, State..."
        onSelect={(route) => {
          handleSelectedPlace(route);
        }}
      />
    </div>
  );
};
