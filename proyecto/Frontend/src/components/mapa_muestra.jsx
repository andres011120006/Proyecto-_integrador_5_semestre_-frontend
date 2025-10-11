import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 Ícono del individuo
const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔹 Componente auxiliar para mover el mapa cuando cambian las coordenadas
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
};

const MapaMuestra = ({ individuos = [], onSelect }) => {
  // Si hay individuos, centramos el mapa en el primero
  const initialPosition =
    individuos.length > 0
      ? [individuos[0].latitud, individuos[0].longitud]
      : [4.711, -74.0721]; // Bogotá por defecto

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
        key={`${initialPosition[0]}-${initialPosition[1]}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* 🔹 Centrar el mapa al primer individuo */}
        <ChangeView center={initialPosition} />

        {/* 🔹 Mostrar todos los individuos como marcadores */}
        {individuos.map((individuo) => (
          <Marker
            key={individuo.id}
            position={[individuo.latitud, individuo.longitud]}
            icon={individuoIcon}
            eventHandlers={{
              click: () => onSelect(individuo),
            }}
          >
            <Popup>
              🌳 <strong>{individuo.nombre || "Individuo"}</strong>
              <br />
              Lat: {individuo.latitud.toFixed(5)} <br />
              Lng: {individuo.longitud.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaMuestra;
