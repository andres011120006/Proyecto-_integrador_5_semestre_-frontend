// Importaciones necesarias desde React y React Leaflet
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ================= ICONOS PERSONALIZADOS =================

// Ícono rojo para los individuos (por defecto)
const individuoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/red-dot.png", // URL del ícono
  iconSize: [30, 30],       // Tamaño del ícono
  iconAnchor: [15, 30],     // Punto de anclaje (centro inferior)
});

// Ícono verde para el individuo seleccionado
const individuoSeleccionadoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// ================= COMPONENTE AUXILIAR =================

// Componente para cambiar la vista del mapa al centro indicado
const ChangeView = ({ center }) => {
  const map = useMap(); // Acceso a la instancia del mapa Leaflet
  useEffect(() => {
    // Solo cambia la vista si el centro es un array válido de coordenadas
    if (center && Array.isArray(center) && center.length === 2) {
      map.setView(center, 15, { animate: true }); // Mueve el mapa con animación
    }
  }, [center, map]);
  return null; // No renderiza nada visual
};

// ================= COMPONENTE PRINCIPAL =================

/**
 * Componente: MapaMuestra
 * Descripción:
 * Muestra un mapa con múltiples marcadores correspondientes a individuos arbóreos.
 * Permite seleccionar un individuo haciendo clic en su marcador.
 * 
 * Props:
 * - individuos: Array de objetos con latitud, longitud, id y nombre.
 * - onSelect: Función que se ejecuta al seleccionar un individuo.
 * - center: Coordenadas iniciales del mapa [lat, lng].
 * - individuoSeleccionado: Objeto con el individuo actualmente seleccionado.
 */
const MapaMuestra = ({ individuos = [], onSelect, center, individuoSeleccionado }) => {

  // Determina la posición inicial del mapa
  const initialPosition =
    center && Array.isArray(center) && center.length === 2
      ? center // Si hay centro definido, usa ese
      : individuos.length > 0 && individuos[0].latitud && individuos[0].longitud
      ? [individuos[0].latitud, individuos[0].longitud] // Si hay individuos, centra en el primero
      : [4.711, -74.0721]; // Si no hay datos, centra en Bogotá (por defecto)

  // Filtra los individuos que tengan coordenadas válidas
  const individuosValidos = individuos.filter(
    (i) => typeof i.latitud === "number" && typeof i.longitud === "number"
  );

  return (
    // Contenedor principal del mapa con estilos responsivos
    <div style={{ height: "400px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <MapContainer
        center={initialPosition}    // Centro inicial del mapa
        zoom={13}                   // Nivel de zoom inicial
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)", // Estilo visual del contenedor
        }}
        key={`${initialPosition[0]}-${initialPosition[1]}`} // Forzar rerender al cambiar centro
      >
        {/* Capa base del mapa (OpenStreetMap) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* Actualiza la vista del mapa cuando cambia el centro */}
        <ChangeView center={initialPosition} />

        {/* Renderiza un marcador por cada individuo válido */}
        {individuosValidos.map((individuo) => {
          const isSelected = individuoSeleccionado && individuo.id === individuoSeleccionado.id;
          return (
            <Marker
              key={individuo.id} // Clave única para React
              position={[individuo.latitud, individuo.longitud]} // Posición del marcador
              icon={isSelected ? individuoSeleccionadoIcon : individuoIcon} // Ícono dinámico
              eventHandlers={{
                // Al hacer clic en el marcador, se ejecuta onSelect
                click: () => onSelect(individuo),
              }}
            >
              {/* Popup informativo del marcador */}
              <Popup>
                 <strong>{individuo.nombre || "Individuo"}</strong>
                <br />
                Lat: {individuo.latitud.toFixed(5)} <br />
                Lng: {individuo.longitud.toFixed(5)}
                {/* Muestra etiqueta verde si está seleccionado */}
                {isSelected && <p style={{ color: "green", fontWeight: "bold" }}> Seleccionado</p>}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

// Exportación del componente principal
export default MapaMuestra;
