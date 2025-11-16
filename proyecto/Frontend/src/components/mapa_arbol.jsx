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

// Ícono verde para el individuo calculado automáticamente
const individuoCalculadoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Ícono naranja para el centro de subparcela
const centroSubparcelaIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/orange-dot.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

/* ============================= COMPONENTE PRINCIPAL ============================= */

const Mapa = ({ 
  selectedConglomerado, 
  onSelect, 
  movableMarker = false, 
  initialPosition,
  individuoPosition, // NUEVA: posición calculada del individuo desde azimut + distancia
  centroSubparcela,   // NUEVA: centro de la subparcela seleccionada
  mediciones          // NUEVA: objeto con azimut y distancia para mostrar en etiquetas
}) => {
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

  /* ------------------- EFECTO: ACTUALIZAR POSICIÓN CUANDO CAMBIA individuoPosition ------------------- */
  useEffect(() => {
    if (individuoPosition && individuoPosition.lat && individuoPosition.lng) {
      setIndividuoPos([individuoPosition.lat, individuoPosition.lng]);
    }
  }, [individuoPosition]);

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

  // Función para calcular la distancia entre dos puntos (en metros)
  const calcularDistancia = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  /* ============================= RENDERIZADO DEL MAPA ============================= */
  return (
    <MapContainer
      center={mapCenter} // Centro inicial del mapa
      zoom={16} // Aumenté el zoom para mejor visualización de las subparcelas
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

      {/* ================== MARCADOR DE CENTRO DE SUBPARCELA ================== */}
      {centroSubparcela?.lat != null && centroSubparcela?.lng != null && (
        <Marker
          position={[centroSubparcela.lat, centroSubparcela.lng]}
          icon={centroSubparcelaIcon}
        >
          <Popup>
            🎯 Centro de Subparcela
            <br />
            Lat: {centroSubparcela.lat.toFixed(6)}, Lng: {centroSubparcela.lng.toFixed(6)}
            <br />
            <small>Punto de referencia para mediciones</small>
            {mediciones?.azimut && (
              <div>
                <small>Azimut: {mediciones.azimut}°</small>
              </div>
            )}
          </Popup>
        </Marker>
      )}

      {/* ================== MARCADOR DE INDIVIDUO (CALCULADO AUTOMÁTICAMENTE) ================== */}
      {individuoPosition?.lat != null && individuoPosition?.lng != null && (
        <Marker
          position={[individuoPosition.lat, individuoPosition.lng]}
          icon={individuoCalculadoIcon}
        >
          <Popup>
            🌳 Individuo Arbóreo (Calculado)
            <br />
            Lat: {individuoPosition.lat.toFixed(6)}, Lng: {individuoPosition.lng.toFixed(6)}
            <br />
            {mediciones?.azimut && mediciones?.distancia && (
              <div>
                <small>Azimut: {mediciones.azimut}° | Distancia: {mediciones.distancia}m</small>
              </div>
            )}
          </Popup>
        </Marker>
      )}

      {/* ================== MARCADOR DE INDIVIDUO (MANUAL - ARRASTRABLE) ================== */}
      {individuoPos?.[0] != null && individuoPos?.[1] != null && movableMarker && (
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
            🌳 Individuo Arbóreo (Manual)
            <br />
            Lat: {individuoPos[0].toFixed(6)}, Lng: {individuoPos[1].toFixed(6)}
            <br />
            <small>Puede arrastrar para ajustar posición</small>
          </Popup>
        </Marker>
      )}

      {/* ================== ETIQUETA DE DISTANCIA (OPCIONAL - VISUAL) ================== */}
      {centroSubparcela?.lat != null && centroSubparcela?.lng != null && individuoPosition?.lat != null && (
        <Marker
          position={[
            (centroSubparcela.lat + individuoPosition.lat) / 2,
            (centroSubparcela.lng + individuoPosition.lng) / 2
          ]}
          icon={L.divIcon({
            html: `<div style="
              background: rgba(255,255,255,0.9); 
              border: 2px solid #28a745; 
              border-radius: 5px; 
              padding: 3px 8px; 
              font-size: 11px;
              font-weight: bold;
              color: #155724;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            ">📏 ${mediciones?.distancia || calcularDistancia(centroSubparcela.lat, centroSubparcela.lng, individuoPosition.lat, individuoPosition.lng).toFixed(1)}m</div>`,
            className: 'distance-label',
            iconSize: [70, 25],
            iconAnchor: [35, 12]
          })}
        />
      )}
    </MapContainer>
  );
};

// Exporta el componente para su uso en otros módulos
export default Mapa;