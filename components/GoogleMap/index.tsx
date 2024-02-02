"use client";
import React, { use, useEffect, useState } from "react";

import { APIProvider, Map, ControlPosition } from "@vis.gl/react-google-maps";
import { IFilter, POIFilter } from "@components/POIFilter";
import { AutocompletePlaces } from "@components/Directions";
import { Marker, Markers } from "@components/Markers";
import { POIMArkers } from "../POIMarkers";
import { PropertyFilters } from "../PropertyFilters";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

export const GoogleMap = () => {
  const handleMapClick = () => {};

  return (
    <div className="w-full h-[600px] ">
      <PropertyFilters />
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={["places"]}
      >
        <Map
          id={"one-of-my-maps"}
          mapId={"bf51a910020fa25a"}
          zoom={9}
          center={{ lat: 33.48359643064377, lng: -112.09282344673318 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          style={{ borderRadius: "20px", border: "none" }}
          fullscreenControl={false}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={true}
          zoomControlOptions={{
            position: ControlPosition.TOP_RIGHT,
          }}
          onClick={handleMapClick}
        >
          <POIMArkers />
          <Markers />
        </Map>
        <AutocompletePlaces />
      </APIProvider>
    </div>
  );
};
