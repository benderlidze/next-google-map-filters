import { AutocompletePlaces } from "@components/GoogleMap/AutocompletePlaces";
import { useEffect, useState } from "react";

type Route = {
  origin: string;
  destination: string;
};

type RouteProps = {
  setGeometryRoute: (route: google.maps.DirectionsResult | null) => void;
};

export const Route = ({ setGeometryRoute }: RouteProps) => {
  const [route, setRoute] = useState<Route>({
    origin: "",
    destination: "",
  });

  useEffect(() => {
    if (route.origin && route.destination) {
      console.log("Route", route);

      const directions = new google.maps.DirectionsService();
      console.log("directions", directions);

      const request = {
        origin: { placeId: route.origin },
        destination: { placeId: route.destination },
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
  }, [route]);

  return (
    <div className="flex flex-row gap-4">
      <AutocompletePlaces
        placeHolder="From"
        onSelect={(route) => {
          setRoute((prev) => ({
            ...prev,
            origin: route.place_id || "",
          }));
        }}
      />
      <AutocompletePlaces
        placeHolder="To"
        onSelect={(route) => {
          setRoute((prev) => ({
            ...prev,
            destination: route.place_id || "",
          }));
        }}
      />
    </div>
  );
};
