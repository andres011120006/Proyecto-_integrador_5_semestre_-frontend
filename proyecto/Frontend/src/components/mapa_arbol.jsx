import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Iconos
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

const Mapa = ({ selectedConglomerado, onSelect, movableMarker = false, initialPosition }) => {
  const [individuoPos, setIndividuoPos] = useState(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );

  // Posición inicial del mapa
  const mapCenter = selectedConglomerado
    ? [selectedConglomerado.latitud, selectedConglomerado.longitud]
    : initialPosition
    ? [initialPosition.lat, initialPosition.lng]
    : [4.711, -74.0721]; // Bogotá por defecto

  // Manejo de clicks en el mapa
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!movableMarker) return; // Solo permite click si es marcador movible
        const { lat, lng } = e.latlng;
        setIndividuoPos([lat, lng]);
        if (typeof onSelect === "function") {
          onSelect(lat, lng);
        }
      },
    });
    return null;
  };

  // Cambiar la vista cuando se seleccione un conglomerado
  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center && center[0] != null && center[1] != null) {
        map.setView(center, 16, { animate: true });
      }
    }, [center, map]);
    return null;
  };

  // Resetear posición si cambia el conglomerado
  useEffect(() => {
    if (!movableMarker) setIndividuoPos(null);
  }, [selectedConglomerado, movableMarker]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      key={`${mapCenter[0]}-${mapCenter[1]}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />

      {selectedConglomerado && (
        <ChangeView center={[selectedConglomerado.latitud, selectedConglomerado.longitud]} />
      )}

      <MapClickHandler />

      {/* Marcador del conglomerado */}
      {selectedConglomerado?.latitud != null && selectedConglomerado?.longitud != null && (
        <Marker
          position={[selectedConglomerado.latitud, selectedConglomerado.longitud]}
          icon={conglomeradoIcon}
        >
          <Popup>
            📍 Conglomerado: <strong>{selectedConglomerado.nombre}</strong>
            <br />
            Lat: {selectedConglomerado.latitud.toFixed(6)}, Lng: {selectedConglomerado.longitud.toFixed(6)}
          </Popup>
        </Marker>
      )}

      {/* Marcador del individuo */}
      {individuoPos?.[0] != null && individuoPos?.[1] != null && (
        <Marker
          position={individuoPos}
          icon={individuoIcon}
          draggable={movableMarker}
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setIndividuoPos([lat, lng]);
              if (typeof onSelect === "function") onSelect(lat, lng);
            },
          }}
        >
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
