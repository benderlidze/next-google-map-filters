import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { PropertyCard } from "@components/PropertyCard";
import { MapOverlay } from "@components/MapOverlay";
import { Filter } from "../PropertyFilters";

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
  markerFilter: Filter;
};

export const Markers = ({ markerFilter }: MarkersProps) => {
  console.log("markerFilter", markerFilter);

  const map = useMap();
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<Marker[]>([]);

  const fetchData = async () => {
    const res = await fetch("data.json");
    const data = await res.json();
    const locations = data?.data?.livingLocations?.collection;
    if (locations?.length > 0) {
      //TODO remove random filters
      //FILL MARKERS WITH RANDOM DATA
      const randomFiltersPropsTEST = locations.map((l: any) => ({
        ...l,
        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 5) + 1,
        sqFt: Math.floor(Math.random() * 1000) + 500,
      }));

      console.log("randomFiltersPropsTEST", randomFiltersPropsTEST);
      setMarkers(randomFiltersPropsTEST);
      setFilteredMarkers(randomFiltersPropsTEST);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fitBounds();
  }, [map, filteredMarkers]);

  useEffect(() => {
    filterMarkers();
  }, [markerFilter]);

  const filterMarkers = () => {
    console.log("markerFilter", markerFilter);
    if (markerFilter) {
      const filteredMarkers = markers.filter((marker) => {
        const { bedrooms, bathrooms, propertyType } = markerFilter;
        if (bedrooms && marker.bedrooms !== bedrooms) {
          return false;
        }

        if (bathrooms && marker.bathrooms !== bathrooms) {
          return false;
        }

        const propetyTypes = marker.properties.bing_categories.map(
          (f: any) => f.CategoryName
        );
        console.log(
          "propetyTypes",
          propertyType,
          propetyTypes !== "",
          propetyTypes.indexOf(propertyType) === -1
        );
        if (
          propertyType &&
          propetyTypes !== "" &&
          propetyTypes.indexOf(propertyType) === -1
        ) {
          return false;
        }
        return true;
      });
      setFilteredMarkers(filteredMarkers);
    }
  };

  const fitBounds = () => {
    console.log("filteredMarkers", filteredMarkers);
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      filteredMarkers.forEach((marker) => {
        bounds.extend(
          new google.maps.LatLng(+marker.latitude, +marker.longitude)
        );
      });
      map.fitBounds(bounds);
    }
  };

  const handleMarkerClick = (marker: Marker) => {
    setActiveMarker(marker);
  };

  return (
    <div>
      <>
        {filteredMarkers.length > 0 &&
          filteredMarkers.map((marker) => {
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
