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
  phone: string;
};

type POIMArkersProps = {
  // selectedMarker: Marker | null;
  selectedProperty: Marker;
  POIList: IPOI[];
  activePOI: IPOI | null;
  setActivePOI: React.Dispatch<React.SetStateAction<IPOI | null>>;
};

export const POIMArkers = ({
  // selectedMarker,
  activePOI,
  setActivePOI,
  POIList,
  selectedProperty,
}: POIMArkersProps) => {
  const map = useMap();
  const [filtersList, setFiltersList] = useState<IFilter[]>(poiFiltersList);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    console.log("fitPOIBounds");
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

    if (filtered.length > 1) {
      filtered.forEach((poi) => {
        bounds.extend(poi);
      });
      map.fitBounds(bounds);
    } else {
      map.setCenter(
        new google.maps.LatLng(
          +selectedProperty.latitude,
          +selectedProperty.longitude
        )
      );
      map.setZoom(13);
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
                  key={poiMarker.address}
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
