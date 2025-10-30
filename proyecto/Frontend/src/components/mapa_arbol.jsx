import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const conglomeradoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});


const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const Mapa = ({ selectedConglomerado, onSelect }) => {
  const [individuoPos, setIndividuoPos] = useState(null);

 
  const initialPosition = selectedConglomerado
    ? [selectedConglomerado.latitud, selectedConglomerado.longitud]
    : [4.711, -74.0721]; 

 
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setIndividuoPos([lat, lng]); 
        onSelect({ lat, lng }); 
      },
    });
    return null;
  };

 
  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 16, { animate: true });
      }
    }, [center, map]);
    return null;
  };

  
  useEffect(() => {
    setIndividuoPos(null);
  }, [selectedConglomerado]);

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      key={`${initialPosition[0]}-${initialPosition[1]}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />

      
      {selectedConglomerado && (
        <ChangeView
          center={[selectedConglomerado.latitud, selectedConglomerado.longitud]}
        />
      )}

      <MapClickHandler />

      
      {selectedConglomerado && (
        <Marker
          position={[
            selectedConglomerado.latitud,
            selectedConglomerado.longitud,
          ]}
          icon={conglomeradoIcon}
        >
          <Popup>
            📍 Conglomerado: <strong>{selectedConglomerado.nombre}</strong>
            <br />
            Lat: {selectedConglomerado.latitud.toFixed(6)}, Lng:{" "}
            {selectedConglomerado.longitud.toFixed(6)}
          </Popup>
        </Marker>
      )}

      
      {individuoPos && (
        <Marker position={individuoPos} icon={individuoIcon}>
          <Popup>
            🌳 Individuo Arbóreo
            <br />
            Lat: {individuoPos[0].toFixed(6)}, Lng: {individuoPos[1].toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Mapa;
