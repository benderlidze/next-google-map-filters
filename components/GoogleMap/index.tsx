"use client";
import React, { useState } from "react";
import { APIProvider, Map, ControlPosition } from "@vis.gl/react-google-maps";
import { Markers } from "@components/Markers";
import { POIMArkers } from "@components/POIMarkers";
import { Filter, PropertyFilters } from "@components/PropertyFilters";
import { Route } from "@components/Route";
import { DirectionsRenderer } from "../DirectionRender";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const filterInit = {
  categroryList: [],
  bedrooms: 0,
  bathrooms: 0,
  propertyType: "",
  minSqft: 0,
  maxSqft: 0,
} as Filter;

export const GoogleMap = () => {
  const [markerFilter, setMarkerFilter] = useState<Filter>(filterInit);
  const [geometryRoute, setGeometryRoute] =
    useState<google.maps.DirectionsResult | null>(null);

  console.log("geometryRoute", geometryRoute);
  return (
    <div className=" w-full h-[800px] ">
      <div className="flex flex-col gap-4 w-full h-full p-20 ">
        <PropertyFilters
          initFilterValues={filterInit}
          filterVals={markerFilter}
          setApplyFilter={setMarkerFilter}
        />

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
          >
            <POIMArkers />
            <Markers markerFilter={markerFilter} />
            <DirectionsRenderer route={geometryRoute} />
          </Map>

          <Route setGeometryRoute={setGeometryRoute} />
        </APIProvider>
      </div>
    </div>
  );
};
