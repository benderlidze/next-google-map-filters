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
    <div className="absolute top-5 left-5 flex flex-row">
      {children}
      <div
        onClick={handleCloseClick}
        className="mx-3 select-none p-1 px-2 bg-white rounded-full h-fit cursor-pointer"
      >
        x
      </div>
    </div>
  );
};
