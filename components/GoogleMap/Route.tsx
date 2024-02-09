import { AutocompletePlaces } from "@components/GoogleMap/AutocompletePlaces";
import { useEffect, useState } from "react";
import { Marker } from "@components/GoogleMap/Markers";

type TRoute = {
  type: "text" | "placeId";
  value: string;
};
type Route = {
  origin: TRoute;
  destination: TRoute;
};

type RouteProps = {
  selectedMarker: Marker | null;
  setGeometryRoute: (route: google.maps.DirectionsResult | null) => void;
};

export const Route = ({ setGeometryRoute, selectedMarker }: RouteProps) => {
  const [route, setRoute] = useState<Route>({
    origin: { type: "text", value: "" },
    destination: { type: "text", value: "" },
  });

  useEffect(() => {
    console.log("  selectedMarker", selectedMarker);
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
    console.log("route", route);
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

      console.log("request", request);
      directions.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("response===>>>>", response);
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
      <AutocompletePlaces
        placeHolder="From"
        initialPlace={homeAddress}
        onSelect={(route) => {
          setRoute((prev) => ({
            ...prev,
            origin: { type: "placeId", value: route.place_id || "" },
          }));
        }}
      />
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
