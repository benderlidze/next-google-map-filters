import { IPOI } from "@components/GoogleMap/POIMarkers";

type POICardProps = {
  poiData: IPOI;
};

export const POICard = ({ poiData }: POICardProps) => {
  const { name, category, address, phone } = poiData;

  return (
    <div className="flex flex-col w-[240px] bg-white rounded-xl shadow-lg p-3">
      <div className="flex flex-col flex-grow py-2 gap-3">
        <div className="text-xl ">{name}</div>
        <div className="font-bold">{category}</div>
        <div className="">{address}</div>
        <div className="">{phone}</div>
      </div>
    </div>
  );
};
