"use client";
import React, { useEffect, useState } from "react";
import { APIProvider, Map, ControlPosition } from "@vis.gl/react-google-maps";
import { Marker, Markers } from "@components/GoogleMap/Markers";
import { POIMArkers } from "@components/GoogleMap/POIMarkers";
import { Filter, PropertyFilters } from "@components/GoogleMap/PropertyFilters";
import { Route } from "@components/GoogleMap/Route";
import { DirectionsRenderer } from "@components/GoogleMap/DirectionRender";
import { GridView } from "@components/GoogleMap/GridView";
import { SearchBar } from "./SearchBar";
import { PropsDropDownList } from "./PropsDropDownList";

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
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [markerFilter, setMarkerFilter] = useState<Filter>(filterInit);
  const [filteredMarkers, setFilteredMarkers] = useState<Marker[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>({
    lat: 33.48359643064377,
    lng: -112.09282344673318,
  });
  const [geometryRoute, setGeometryRoute] =
    useState<google.maps.DirectionsResult | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMarkers();
  }, [markerFilter]);

  const handleShowGrid = () => {
    setShowGrid(!showGrid);
  };

  console.log("geometryRoute", geometryRoute);
  return (
    <div className=" w-full h-[800px] ">
      <div className="flex flex-col gap-4 w-full h-full p-20 ">
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={["places"]}
        >
          <div className="flex flex-row justify-between">
            <PropertyFilters
              initFilterValues={filterInit}
              filterVals={markerFilter}
              setApplyFilter={setMarkerFilter}
            />
            <SearchBar setSearchResults={setCenter} />
            <div>
              <button
                onClick={handleShowGrid}
                className="text-black bg-white p-2 border rounded-lg hover:bg-slate-100"
              >
                Show Grid
              </button>
            </div>
          </div>

          {showGrid && <GridView markers={filteredMarkers} />}
          <Map
            id={"one-of-my-maps"}
            mapId={"bf51a910020fa25a"}
            zoom={9}
            center={center}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            style={{
              borderRadius: "20px",
              border: "none",
              display: showGrid ? "none" : "block",
            }}
            fullscreenControl={false}
            mapTypeControl={false}
            streetViewControl={false}
            zoomControl={true}
            zoomControlOptions={{
              position: ControlPosition.TOP_RIGHT,
            }}
          >
            <POIMArkers />
            <Markers
              markers={filteredMarkers}
              setSelectedMarker={setSelectedMarker}
            />
            <DirectionsRenderer route={geometryRoute} />
          </Map>

          <Route
            setGeometryRoute={setGeometryRoute}
            selectedMarker={selectedMarker}
          />

          <PropsDropDownList markers={markers} />
        </APIProvider>
      </div>
    </div>
  );
};
