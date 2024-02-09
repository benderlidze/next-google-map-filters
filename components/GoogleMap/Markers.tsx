import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { PropertyCard } from "@components/GoogleMap/PropertyCard";
import { MapOverlay } from "@components/GoogleMap/MapOverlay";

export type Marker = {
  id: number;
  name: string;
  street: string;
  price: number;
  thumbnail: string;
  stars: number;
  latitude: number;
  longitude: number;
  state: string;

  properties: any;

  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  propertyType: string;
};

type MarkersProps = {
  markers: Marker[];
  setSelectedMarker: React.Dispatch<React.SetStateAction<Marker | null>>;
};

export const Markers = ({ markers, setSelectedMarker }: MarkersProps) => {
  const map = useMap();
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);

  useEffect(() => {
    const fitBounds = () => {
      console.log("filteredMarkers", markers);
      if (map) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(
            new google.maps.LatLng(+marker.latitude, +marker.longitude)
          );
        });
        map.fitBounds(bounds);
      }
    };

    fitBounds();
  }, [map, markers]);

  const handleMarkerClick = (marker: Marker) => {
    setActiveMarker(marker);
    setSelectedMarker(marker);
  };

  return (
    <div>
      <>
        {markers.length > 0 &&
          markers.map((marker) => {
            const { id, latitude: lat, longitude: lng } = marker;
            return (
              <AdvancedMarker
                position={{ lat: +lat, lng: +lng }}
                onClick={() => handleMarkerClick(marker)}
                key={marker.id}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    background: "red",
                    border: "1px solid white",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                  }}
                ></div>
              </AdvancedMarker>
            );
          })}
      </>
      <>
        {activeMarker && (
          <MapOverlay closeClick={() => setActiveMarker(null)}>
            <PropertyCard marker={activeMarker} />
          </MapOverlay>
        )}
      </>
    </div>
  );
};
