import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { IFilter, POIFilter } from "@components/GoogleMap/POIFilter";
import { MapOverlay } from "@components/GoogleMap/MapOverlay";
import { useEffect, useState } from "react";
import { POICard } from "@components/GoogleMap/POICard";

const poiFiltersList = [
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

export type IPOI = {
  name: string;
  category: string;
  lat: string;
  lon: string;
  description: string;
};

export const POIMArkers = () => {
  const map = useMap();
  const [activePOI, setActivePOI] = useState<IPOI | null>(null);
  const [filtersList, setFiltersList] = useState<IFilter[]>(poiFiltersList);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [POIList, setPOIList] = useState<IPOI[]>([]);

  const fetchPOI = async () => {
    const res = await fetch("poi.json");
    const poi = await res.json();
    if (poi?.length > 0) {
      setPOIList(poi);
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

  return (
    <>
      <>
        {POIList.length > 0 &&
          POIList.filter((poi) => {
            const filter = filtersList.find((f) => f.name === poi.category);
            return filter?.selected;
          }).map((poiMarker) => {
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

      <div className="absolute left-[15px]  bottom-5  ">
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
