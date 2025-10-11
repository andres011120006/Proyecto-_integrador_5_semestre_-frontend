import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 Ícono del marcador del conglomerado (azul)
const conglomeradoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔹 Ícono del marcador del individuo (rojo)
const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const Mapa = ({ selectedConglomerado, onSelect }) => {
  const [individuoPos, setIndividuoPos] = useState(null);

  // 🔹 Coordenadas iniciales
  const initialPosition = selectedConglomerado
    ? [selectedConglomerado.latitud, selectedConglomerado.longitud]
    : [4.711, -74.0721]; // Bogotá por defecto

  // 🔹 Componente que detecta clics y permite marcar el individuo
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setIndividuoPos([lat, lng]); // guarda posición del individuo
        onSelect({ lat, lng }); // envía al componente padre
      },
    });
    return null;
  };

  // 🔹 Este componente ajusta el mapa cuando cambia el conglomerado
  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 16, { animate: true }); // 🔍 Zoom automático
      }
    }, [center, map]);
    return null;
  };

  // 🔹 Resetear marcador del individuo al cambiar conglomerado
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

      {/* 🔹 Mueve la vista automáticamente al conglomerado */}
      {selectedConglomerado && (
        <ChangeView
          center={[selectedConglomerado.latitud, selectedConglomerado.longitud]}
        />
      )}

      <MapClickHandler />

      {/* 🔹 Marcador del conglomerado */}
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

      {/* 🔹 Marcador del individuo (si fue seleccionado en el mapa) */}
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
