import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 Ícono del individuo normal (rojo)
const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔹 Ícono del individuo seleccionado (verde)
const individuoSeleccionadoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔹 Componente auxiliar para mover el mapa cuando cambian las coordenadas
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
};

// 🔹 Componente principal del mapa
const MapaMuestra = ({ individuos = [], onSelect, center, individuoSeleccionado }) => {
  // Si se pasa un centro desde props, úsalo. Si no, usa el primero disponible.
  const initialPosition =
    center && Array.isArray(center) && center.length === 2
      ? center
      : individuos.length > 0 && individuos[0].latitud && individuos[0].longitud
      ? [individuos[0].latitud, individuos[0].longitud]
      : [4.711, -74.0721]; // Bogotá por defecto

  // Filtramos individuos válidos
  const individuosValidos = individuos.filter(
    (i) => typeof i.latitud === "number" && typeof i.longitud === "number"
  );

  return (
    <div style={{ height: "400px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
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

        {/* 🔹 Centrar el mapa al conglomerado seleccionado */}
        <ChangeView center={initialPosition} />

        {/* 🔹 Mostrar los individuos */}
        {individuosValidos.map((individuo) => {
          const isSelected = individuoSeleccionado && individuo.id === individuoSeleccionado.id;
          return (
            <Marker
              key={individuo.id}
              position={[individuo.latitud, individuo.longitud]}
              icon={isSelected ? individuoSeleccionadoIcon : individuoIcon}
              eventHandlers={{
                click: () => onSelect(individuo),
              }}
            >
              <Popup>
                🌳 <strong>{individuo.nombre || "Individuo"}</strong>
                <br />
                Lat: {individuo.latitud.toFixed(5)} <br />
                Lng: {individuo.longitud.toFixed(5)}
                {isSelected && <p style={{ color: "green", fontWeight: "bold" }}>✅ Seleccionado</p>}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapaMuestra;
