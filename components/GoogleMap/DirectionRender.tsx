import { useMap } from "@vis.gl/react-google-maps";
import { use, useEffect } from "react";

type DirectionsRendererProps = {
  route: google.maps.DirectionsResult | null;
};

export const DirectionsRenderer = ({ route }: DirectionsRendererProps) => {
  const map = useMap();

  useEffect(() => {
    if (route && map) {
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsRenderer.setDirections(route);
    }
  }, [map, route]);

  return null;
};
