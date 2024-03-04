import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import React from "react";

const Map: React.FC = () => {
  const icon = L.icon({
    iconUrl: "/images/logo-notbg.png",
    iconSize: [80, 90],
    shadowUrl: "https://docs.maptiler.com/leaflet/assets/leaf_shadow.png",
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  return (
    <MapContainer
      center={[38.0268432, 32.5101583]}
      zoom={15}
      style={{ width: "500px", height: "500px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[38.0268432, 32.5101583]} icon={icon}>
        <Popup>
          Kidoku Akademi
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
