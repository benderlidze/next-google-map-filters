"use client";
import React, { useEffect, useState } from "react";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { PropertyCard } from "@components/PropertyCard";
import { IFilter, POIFilter } from "@components/POIFilter";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

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
};

const poiList = [
  { name: "Restaurants", id: 0, icon: "", selected: true },
  { name: "Grocery Store", id: 0, icon: "", selected: true },
  { name: "Parking Lot", id: 0, icon: "", selected: true },
  { name: "Train Station", id: 0, icon: "", selected: true },
  { name: "Bakery", id: 0, icon: "", selected: true },
  { name: "Park", id: 0, icon: "", selected: true },
  { name: "Light Rail", id: 0, icon: "", selected: true },
  { name: "School", id: 0, icon: "", selected: true },
  { name: "Shops", id: 0, icon: "", selected: true },
  { name: "Museum", id: 0, icon: "", selected: true },
] as IFilter[];

const MapOverlay = ({
  closeClick,
  children,
}: {
  closeClick?: () => void;
  children: React.ReactNode;
}) => {
  const handleCloseClick = () => {
    closeClick && closeClick();
  };
  return (
    <div className="absolute top-5 left-5 flex flex-row">
      {children}
      <div
        onClick={handleCloseClick}
        className="mx-3 select-none p-1 px-2 bg-white rounded-full h-fit cursor-pointer"
      >
        x
      </div>
    </div>
  );
};

export const GoogleMap = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersList, setFiltersList] = useState<IFilter[]>(poiList);

  const fetchData = async () => {
    const res = await fetch("data.json");
    const data = await res.json();
    console.log(data);
    const locations = data?.data?.livingLocations?.collection;
    if (locations?.length > 0) {
      setMarkers(locations);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkerClick = (marker: Marker) => {
    setActiveMarker(marker);
  };

  return (
    <div className="w-full h-[600px] ">
      <APIProvider
        apiKey={"AIzaSyBOQFulljufGt3VDhBAwNjZN09KEFufVyg"}
        libraries={["marker"]}
      >
        <Map
          mapId={"bf51a910020fa25a"}
          zoom={9}
          center={{ lat: 33.48359643064377, lng: -112.09282344673318 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          style={{ borderRadius: "20px", border: "none" }}
          //styles={GrayStyle}
        >
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
                      background: "white",
                      border: "2px solid red",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                    }}
                  ></div>
                </AdvancedMarker>
              );
            })}

          {activeMarker && (
            <MapOverlay closeClick={() => setActiveMarker(null)}>
              <PropertyCard marker={activeMarker} />
            </MapOverlay>
          )}

          <div className="absolute left-1/2 transform -translate-x-1/2 w-fit bottom-5 flex flex-col items-center justify-center gap-2">
            {filtersOpen && (
              <POIFilter
                poiList={filtersList}
                setFiltersList={setFiltersList}
              />
            )}
            <div
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="bg-slate-700 w-fit select-none py-2 px-4 rounded-xl text-white cursor-pointer"
            >
              Map Settings &#9660;
            </div>
          </div>
        </Map>
      </APIProvider>
    </div>
  );
};
