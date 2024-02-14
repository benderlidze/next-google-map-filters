import { AutocompletePlaces } from "@components/GoogleMap/AutocompletePlaces";
import { useEffect, useState } from "react";
import { Marker } from "@components/GoogleMap/Markers";
import { PropsDropDownList } from "./PropsDropDownList";

type TRoute = {
  type: "text" | "placeId";
  value: string;
};
type Route = {
  origin: TRoute;
  destination: TRoute;
};

type RouteProps = {
  markers: Marker[];
  selectedMarker: Marker | null;
  setGeometryRoute: (route: google.maps.DirectionsResult | null) => void;
  setSelectedMarkerFromDropDown: React.Dispatch<
    React.SetStateAction<Marker | null>
  >;
  setSelectedMarker: React.Dispatch<React.SetStateAction<Marker | null>>;
};

export const Route = ({
  setSelectedMarkerFromDropDown,
  setGeometryRoute,
  setSelectedMarker,
  selectedMarker,
  markers,
}: RouteProps) => {
  const [route, setRoute] = useState<Route>({
    origin: { type: "text", value: "" },
    destination: { type: "text", value: "" },
  });

  useEffect(() => {
    if (selectedMarker) {
      setRoute((prev) => ({
        ...prev,
        origin: {
          type: "text",
          value: `${selectedMarker.street} ${selectedMarker.state}`,
        },
      }));
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (route.origin.value !== "" && route.destination.value !== "") {
      const directions = new google.maps.DirectionsService();
      const request = {
        origin:
          route.origin.type === "placeId"
            ? { placeId: route.origin.value }
            : route.origin.value,
        destination: { placeId: route.destination.value },
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directions.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          setGeometryRoute(response);
        }
      });
    }
  }, [route, selectedMarker]);

  const homeAddress = selectedMarker
    ? `${selectedMarker.street} ${selectedMarker.state}`
    : "";

  return (
    <div className="flex flex-row gap-4">
      <PropsDropDownList
        markers={markers}
        selectedMarker={selectedMarker}
        setSelectedMarkerFromDropDown={setSelectedMarkerFromDropDown}
        setSelectedMarker={setSelectedMarker}
      />

      {/* <AutocompletePlaces
        placeHolder="From"
        initialPlace={homeAddress}
        onSelect={(route) => {
          setRoute((prev) => ({
            ...prev,
            origin: { type: "placeId", value: route.place_id || "" },
          }));
        }}
      /> */}

      <AutocompletePlaces
        placeHolder="To"
        onSelect={(route) => {
          setRoute((prev) => ({
            ...prev,
            destination: { type: "placeId", value: route.place_id || "" },
          }));
        }}
      />
    </div>
  );
};
