import { Marker } from "@components/GoogleMap/Markers";

type PropertyCardProps = {
  marker: Marker;
};

export const PropertyCard = ({ marker }: PropertyCardProps) => {
  const { name, street, price, thumbnail, state } = marker;

  const handleViewClick = () => {
    console.log("marker", marker);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-3">
      <div className="relative">
        <img
          src={thumbnail}
          className="rounded-lg w-fit bg-slate-300 max-h-[250px] "
        />
        <div className="absolute top-2 left-2 ">
          <div className="bg-white flex flex-row p-2 rounded-lg align-middle gap-2">
            <svg
              height="15px"
              width="15px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 47.94 47.94"
            >
              <path
                fill="#f1c40f"
                d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	C22.602,0.567,25.338,0.567,26.285,2.486z"
              />
            </svg>
            <div>4.8</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow py-2">
        <div className="text-xl">{name}</div>
        <div className="font-bold">$1,234+</div>
        <div className="">
          {street}
          {state}
        </div>
      </div>

      <div
        onClick={handleViewClick}
        className="flex cursor-pointer bg-slate-700 text-white justify-center p-4 rounded-lg "
      >
        View
      </div>
    </div>
  );
};
