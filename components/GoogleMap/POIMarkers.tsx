import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { IFilter, POIFilter } from "@components/GoogleMap/POIFilter";
import { MapOverlay } from "@components/GoogleMap/MapOverlay";
import { useEffect, useState } from "react";
import { POICard } from "@components/GoogleMap/POICard";
import { csvParse } from "d3-dsv";
import { Marker } from "./Markers";

// const poiFiltersList = [
//   { name: "Restaurants", id: 0, icon: "", selected: true },
//   { name: "Grocery Store", id: 0, icon: "", selected: true },
//   { name: "Parking Lot", id: 0, icon: "", selected: true },
//   { name: "Train Station", id: 0, icon: "", selected: true },
//   { name: "Bakery", id: 0, icon: "", selected: true },
//   { name: "Park", id: 0, icon: "", selected: true },
//   { name: "Light Rail", id: 0, icon: "", selected: true },
//   { name: "School", id: 0, icon: "", selected: true },
//   { name: "Shops", id: 0, icon: "", selected: true },
//   { name: "Museum", id: 0, icon: "", selected: true },
// ] as IFilter[];

const poiFiltersList = [
  { name: "Restaurants", id: 0, icon: "", selected: true },
  { name: "Grocery Store", id: 0, icon: "", selected: true },
  { name: "Other - Medical", id: 0, icon: "", selected: true },
  { name: "Park", id: 0, icon: "", selected: true },
  { name: "Other - Hotels", id: 0, icon: "", selected: true },
  { name: "School", id: 0, icon: "", selected: true },
  { name: "Shops", id: 0, icon: "", selected: true },
  { name: "Other - Sports", id: 0, icon: "", selected: true },
] as IFilter[];

export type IPOI = {
  name: string;
  address: string;
  category: string;
  lat: number;
  lon: number;
  property: string;
};

type POIMArkersProps = {
  selectedProperty: Marker;
};

export const POIMArkers = ({ selectedProperty }: POIMArkersProps) => {
  const map = useMap();
  const [activePOI, setActivePOI] = useState<IPOI | null>(null);
  const [filtersList, setFiltersList] = useState<IFilter[]>(poiFiltersList);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [POIList, setPOIList] = useState<IPOI[]>([]);

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
      };
    });

    if (csv?.length > 0) {
      setPOIList(poiList);
    }
  };

  useEffect(() => {
    fetchPOI();
  }, []);

  useEffect(() => {
    if (map) {
      google.maps.event.addListener(map, "click", () => {
        setFiltersOpen(false);
      });
    }
    return () => {
      if (map) {
        google.maps.event.clearListeners(map, "click");
      }
    };
  }, [map]);

  useEffect(() => {
    fitPOIBounds();
  }, [selectedProperty, filtersList, map, POIList]);

  const fitPOIBounds = () => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    const filtered = POIList.filter(
      (poi) => poi.property === selectedProperty.name
    )
      .filter((poi) => {
        const filter = filtersList.find((f) => f.name === poi.category);
        return filter?.selected;
      })
      .map((poiMarker) => {
        return new google.maps.LatLng(+poiMarker.lat, +poiMarker.lon);
      });

    //add selected property to bounds
    filtered.push(
      new google.maps.LatLng(
        +selectedProperty.latitude,
        +selectedProperty.longitude
      )
    );

    console.log("filtered", filtered, filtered.length);

    if (filtered.length > 1) {
      filtered.forEach((poi) => {
        bounds.extend(poi);
      });

      console.log("fit BOUNDS");
      map.fitBounds(bounds);
    }
  };

  return (
    <>
      <>
        {POIList.length > 0 &&
          POIList.filter((poi) => poi.property === selectedProperty.name)
            .filter((poi) => {
              const filter = filtersList.find((f) => f.name === poi.category);
              return filter?.selected;
            })
            .map((poiMarker) => {
              const { name, lat, lon: lng } = poiMarker;
              return (
                <AdvancedMarker
                  position={{ lat: +lat, lng: +lng }}
                  onClick={() => setActivePOI(poiMarker)}
                  key={poiMarker.name}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      background: "blue",
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
        {activePOI && (
          <MapOverlay closeClick={() => setActivePOI(null)}>
            <POICard poiData={activePOI} />
          </MapOverlay>
        )}
      </>

      <div className="absolute left-[15px]  bottom-5 z-10 ">
        {filtersOpen && (
          <POIFilter poiList={filtersList} setFiltersList={setFiltersList} />
        )}
        <div
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="bg-slate-700 w-fit select-none py-2 px-4 rounded-xl text-white cursor-pointer"
        >
          Map Settings &#9660;
        </div>
      </div>
    </>
  );
};
