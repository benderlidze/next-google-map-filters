import { Marker } from "@components/GoogleMap/Markers";
import { PropertyCard } from "@components/GoogleMap/PropertyCard";

type GridViewProps = {
  markers: Marker[];
};

export const GridView = ({ markers }: GridViewProps) => {
  return (
    <div className="bg-slate-300 rounded-xl p-4 h-500 overflow-y-scroll border grid grid-cols-3 gap-5 ">
      {markers.length > 0 &&
        markers.map((marker) => {
          return <PropertyCard key={marker.id} marker={marker} />;
        })}
    </div>
  );
};
