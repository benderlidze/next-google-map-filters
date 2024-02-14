"use client";
import React, { use, useEffect, useState } from "react";
import { APIProvider, Map, ControlPosition } from "@vis.gl/react-google-maps";
import { Marker, Markers } from "@components/GoogleMap/Markers";
import { IPOI, POIMArkers } from "@components/GoogleMap/POIMarkers";
import { Filter, PropertyFilters } from "@components/GoogleMap/PropertyFilters";
import { Route } from "@components/GoogleMap/Route";
import { DirectionsRenderer } from "@components/GoogleMap/DirectionRender";
import { GridView } from "@components/GoogleMap/GridView";
import { SearchBar } from "./SearchBar";
import { PropsDropDownList } from "./PropsDropDownList";
import { csvParse } from "d3-dsv";

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
  const [selectedMarkerFromDropDown, setSelectedMarkerFromDropDown] =
    useState<Marker | null>(null);

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

  const [POIList, setPOIList] = useState<IPOI[]>([]);
  const [activePOI, setActivePOI] = useState<IPOI | null>(null);

  const fetchData = async () => {
    const csvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ16MnkkuBPjJiE9owxU6ooL8uLeNRfNaXUama-jUN8tr9SP2cKo8mUOikxBTIEEJVpMMUBhFbfbD1E/pub?gid=0&single=true&output=csv`;
    const res = await fetch(csvUrl);
    const text = await res.text();
    const locations = await csvParse(text);

    // const res = await fetch("data.json");
    // const data = await res.json();
    // const locations = data?.data?.livingLocations?.collection;
    if (locations?.length > 0) {
      //TODO remove random filters
      //FILL MARKERS WITH RANDOM DATA
      const randomFiltersPropsTEST: Marker[] = locations.map((l: any) => ({
        ...l,
        latitude: +l.lat,
        longitude: +l.lng,
        name: l["Property Name"],
        street: l["Street"],
        state: l["State"],
        thumbnail: l["Photo URL"],
        phone: l["Phone (MT Subsite)"],
        stars: 5,
        price: 10000000,

        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 5) + 1,
        sqFt: Math.floor(Math.random() * 1000) + 500,
      }));

      setMarkers(randomFiltersPropsTEST as Marker[]);
      setFilteredMarkers(randomFiltersPropsTEST);
    }
  };

  const fetchPOI = async () => {
    const csvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ16MnkkuBPjJiE9owxU6ooL8uLeNRfNaXUama-jUN8tr9SP2cKo8mUOikxBTIEEJVpMMUBhFbfbD1E/pub?gid=1370915233&single=true&output=csv`;
    //const res = await fetch("poi.json");
    const res = await fetch(csvUrl);
    const text = await res.text();
    const csv = await csvParse(text);

    const poiList = csv.map((poi: any) => {
      return {
        name: poi["POI Name"],
        category: poi["Category"],
        address: poi["Address"],
        lat: +poi["lat"],
        lon: +poi["lng"],
        property: poi["Property"],
        phone: poi["Phone"],
      };
    });

    if (csv?.length > 0) {
      setPOIList(poiList);
    }
  };

  const filterMarkers = () => {
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
    fetchPOI();
  }, []);

  useEffect(() => {
    filterMarkers();
  }, [markerFilter]);

  useEffect(() => {
    // click on close button in a  drop down component
    if (selectedMarkerFromDropDown) {
      setFilteredMarkers([selectedMarkerFromDropDown]);
    }
    if (selectedMarkerFromDropDown === null) {
      setFilteredMarkers(markers);
    }
  }, [selectedMarkerFromDropDown]);

  const handleShowGrid = () => {
    setShowGrid(!showGrid);
  };

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
            {selectedMarker && (
              <POIMArkers
                // selectedMarker={selectedMarker}
                activePOI={activePOI}
                setActivePOI={setActivePOI}
                POIList={POIList}
                selectedProperty={selectedMarker}
              />
            )}

            <Markers
              activePOI={activePOI}
              markers={filteredMarkers}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
              setSelectedMarkerFromDropDown={setSelectedMarkerFromDropDown}
            />
            <DirectionsRenderer route={geometryRoute} />
          </Map>

          <Route
            markers={markers}
            setGeometryRoute={setGeometryRoute}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            setSelectedMarkerFromDropDown={setSelectedMarkerFromDropDown}
          />

          {/* <PropsDropDownList markers={markers} /> */}
        </APIProvider>
      </div>
    </div>
  );
};
