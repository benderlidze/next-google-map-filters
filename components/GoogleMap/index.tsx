"use client";
import React, { useEffect, useState } from "react";
import { GrayStyle } from "@components/GoogleMapStyle";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin,
} from "@vis.gl/react-google-maps";
import { PropertyCard } from "../PropertyCard";

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

  const fetchData = async () => {
    const res = await fetch("data.json");
    const data = await res.json();
    console.log(data);
    const locations = data?.data?.livingLocations?.collection;
    if (locations?.length > 0) {
      console.log("111", 111);
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
        </Map>
      </APIProvider>
    </div>
  );
};
