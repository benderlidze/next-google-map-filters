import { Marker } from "@components/Markers";
import { PropertyCard } from "@components/PropertyCard";

type GridViewProps = {
  markers: Marker[];
};

export const GridView = ({ markers }: GridViewProps) => {
  console.log("marker", markers);

  return (
    <div className="bg-slate-300 rounded-xl p-4 h-500 overflow-y-scroll border grid grid-cols-3 gap-5 ">
      {markers.length > 0 &&
        markers.map((marker) => {
          return <PropertyCard key={marker.id} marker={marker} />;
        })}
    </div>
  );
};
