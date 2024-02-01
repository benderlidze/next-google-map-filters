"use client";
import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { GrayStyle } from "@components/GoogleMapStyle";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

export const GoogleMap = () => {
  return (
    <div className="w-full h-[600px] ">
      <APIProvider apiKey={"AIzaSyBOQFulljufGt3VDhBAwNjZN09KEFufVyg"}>
        <Map
          zoom={3}
          center={{ lat: 40.74310957141404, lng: -73.99123022232035 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          style={{ borderRadius: "20px", border: "none" }}
          styles={GrayStyle}
        />
      </APIProvider>
    </div>
  );
};
