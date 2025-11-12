// Importa hooks y componentes necesarios de React
import { useEffect, useState } from "react";
// Importa componentes principales de React Leaflet para renderizar el mapa
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
// Importa los estilos base del mapa de Leaflet
import "leaflet/dist/leaflet.css";
// Importa la librería Leaflet para crear y personalizar íconos
import L from "leaflet";

/* ============================= ICONOS PERSONALIZADOS ============================= */

// Ícono azul para marcar conglomerados (agrupaciones)
const conglomeradoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-dot.png", // URL del ícono
  iconSize: [30, 30],     // Tamaño del ícono en píxeles
  iconAnchor: [15, 30],   // Punto de anclaje (parte del ícono que se posiciona en el mapa)
});

// Ícono rojo para marcar individuos arbóreos
const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

/* ============================= COMPONENTE PRINCIPAL ============================= */

const Mapa = ({ selectedConglomerado, onSelect, movableMarker = false, initialPosition }) => {
  // Estado para almacenar la posición del individuo (latitud y longitud)
  const [individuoPos, setIndividuoPos] = useState(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null // Si existe posición inicial, la usa; de lo contrario, null
  );

  /* ------------------- CÁLCULO DE LA POSICIÓN INICIAL DEL MAPA ------------------- */
  const mapCenter = selectedConglomerado
    ? [selectedConglomerado.latitud, selectedConglomerado.longitud] // Centra el mapa en el conglomerado seleccionado
    : initialPosition
    ? [initialPosition.lat, initialPosition.lng] // Si hay una posición inicial, la usa
    : [4.711, -74.0721]; // Valor por defecto: Bogotá

  /* ------------------- MANEJO DE EVENTOS DE CLICK EN EL MAPA ------------------- */
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!movableMarker) return; // Si el marcador no es movible, ignora el clic
        const { lat, lng } = e.latlng; // Obtiene coordenadas del clic
        setIndividuoPos([lat, lng]); // Actualiza la posición del individuo
        if (typeof onSelect === "function") {
          onSelect(lat, lng); // Llama a la función del padre (callback) con las coordenadas seleccionadas
        }
      },
    });
    return null; // No renderiza nada, solo maneja eventos
  };

  /* ------------------- CAMBIO DE VISTA AL SELECCIONAR UN CONGLOMERADO ------------------- */
  const ChangeView = ({ center }) => {
    const map = useMap(); // Obtiene la instancia del mapa actual
    useEffect(() => {
      // Si el centro existe, cambia la vista del mapa hacia esas coordenadas con zoom 16
      if (center && center[0] != null && center[1] != null) {
        map.setView(center, 16, { animate: true });
      }
    }, [center, map]);
    return null;
  };

  /* ------------------- EFECTO: RESETEA POSICIÓN AL CAMBIAR CONGLOMERADO ------------------- */
  useEffect(() => {
    if (!movableMarker) setIndividuoPos(null); // Si el marcador no es movible, se limpia la posición del individuo
  }, [selectedConglomerado, movableMarker]);

  /* ============================= RENDERIZADO DEL MAPA ============================= */
  return (
    <MapContainer
      center={mapCenter} // Centro inicial del mapa
      zoom={13} // Nivel de zoom inicial
      style={{ height: "400px", width: "100%" }} // Tamaño del mapa
      key={`${mapCenter[0]}-${mapCenter[1]}`} // Fuerza el re-render si cambian las coordenadas
    >
      {/* Capa base del mapa utilizando OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL del proveedor de mapas
        attribution='© OpenStreetMap contributors' // Atribución obligatoria
      />

      {/* Si hay un conglomerado seleccionado, centra la vista en sus coordenadas */}
      {selectedConglomerado && (
        <ChangeView center={[selectedConglomerado.latitud, selectedConglomerado.longitud]} />
      )}

      {/* Activa el manejo de clics si corresponde */}
      <MapClickHandler />

      {/* ================== MARCADOR DE CONGLOMERADO ================== */}
      {selectedConglomerado?.latitud != null && selectedConglomerado?.longitud != null && (
        <Marker
          position={[selectedConglomerado.latitud, selectedConglomerado.longitud]} // Posición del marcador
          icon={conglomeradoIcon} // Ícono azul definido arriba
        >
          {/* Popup (ventana flotante) con información del conglomerado */}
          <Popup>
            📍 Conglomerado: <strong>{selectedConglomerado.nombre}</strong>
            <br />
            Lat: {selectedConglomerado.latitud.toFixed(6)}, Lng: {selectedConglomerado.longitud.toFixed(6)}
          </Popup>
        </Marker>
      )}

      {/* ================== MARCADOR DE INDIVIDUO ================== */}
      {individuoPos?.[0] != null && individuoPos?.[1] != null && (
        <Marker
          position={individuoPos} // Posición del individuo
          icon={individuoIcon} // Ícono rojo definido arriba
          draggable={movableMarker} // Permite arrastrar si se activó movableMarker
          eventHandlers={{
            // Evento que se ejecuta al soltar el marcador luego de arrastrarlo
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng(); // Obtiene la nueva posición
              setIndividuoPos([lat, lng]); // Actualiza el estado
              if (typeof onSelect === "function") onSelect(lat, lng); // Envía la posición al componente padre
            },
          }}
        >
          {/* Popup con información del individuo */}
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

// Exporta el componente para su uso en otros módulos
export default Mapa;
