export const MapOverlay = ({
  closeClick,
  children,
}: {
  closeClick?: () => void;
  children: React.ReactNode;
}) => {
  const handleCloseClick = () => {
    closeClick && closeClick();
  };
  return (
    <div className="absolute top-5 left-5 flex flex-row ">
      <div className="w-[240px]">{children}</div>

      <div
        onClick={handleCloseClick}
        className="absolute shadow-lg -right-[30px] hover:bg-slate-400 bg-white rounded-full p-2 cursor-pointer"
      >
        <svg
          fill="#000000"
          height="10px"
          width="10px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 490 490"
        >
          <polygon
            points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
	489.292,457.678 277.331,245.004 489.292,32.337 "
          />
        </svg>
      </div>
    </div>
  );
};
