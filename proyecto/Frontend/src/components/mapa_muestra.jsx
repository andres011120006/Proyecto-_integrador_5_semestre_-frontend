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
  
  // ✅ CORRECCIÓN CRÍTICA: Asegurar que individuos sea siempre un array
  const individuosArray = Array.isArray(individuos) ? individuos : [];
  
  console.log("MapaMuestra - individuos recibidos:", individuos);
  console.log("MapaMuestra - individuosArray procesado:", individuosArray);

  // ✅ CORRECCIÓN: Filtra los individuos que tengan coordenadas válidas
  const individuosValidos = individuosArray.filter(
    (i) => i && typeof i.latitud === "number" && typeof i.longitud === "number"
  );

  console.log("MapaMuestra - individuosValidos:", individuosValidos);

  // ✅ CORRECCIÓN: Determina la posición inicial del mapa de forma segura
  const getInitialPosition = () => {
    // Si hay centro definido y válido, usa ese
    if (center && Array.isArray(center) && center.length === 2) {
      return center;
    }
    
    // Si hay individuos válidos, centra en el primero
    if (individuosValidos.length > 0) {
      const primerIndividuo = individuosValidos[0];
      return [primerIndividuo.latitud, primerIndividuo.longitud];
    }
    
    // Si no hay datos, centra en Bogotá (por defecto)
    return [4.711, -74.0721];
  };

  const initialPosition = getInitialPosition();

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

        {/* ✅ CORRECCIÓN: Renderiza un marcador por cada individuo válido */}
        {individuosValidos.map((individuo) => {
          const isSelected = individuoSeleccionado && individuo.id === individuoSeleccionado.id;
          return (
            <Marker
              key={individuo.id || `ind-${individuo.latitud}-${individuo.longitud}`} // Clave única para React
              position={[individuo.latitud, individuo.longitud]} // Posición del marcador
              icon={isSelected ? individuoSeleccionadoIcon : individuoIcon} // Ícono dinámico
              eventHandlers={{
                // Al hacer clic en el marcador, se ejecuta onSelect
                click: () => {
                  if (onSelect && typeof onSelect === 'function') {
                    onSelect(individuo);
                  }
                },
              }}
            >
              {/* Popup informativo del marcador */}
              <Popup>
                <div>
                  <strong>Individuo {individuo.id || "N/A"}</strong>
                  <br />
                  {individuo.dap && <><strong>DAP:</strong> {individuo.dap} cm<br /></>}
                  {individuo.categoria && <><strong>Categoría:</strong> {individuo.categoria}<br /></>}
                  {individuo.azimut && <><strong>Azimut:</strong> {individuo.azimut}°<br /></>}
                  {individuo.distancia && <><strong>Distancia:</strong> {individuo.distancia} m<br /></>}
                  <strong>Coordenadas:</strong><br />
                  Lat: {individuo.latitud.toFixed(6)}<br />
                  Lng: {individuo.longitud.toFixed(6)}
                  {/* Muestra etiqueta verde si está seleccionado */}
                  {isSelected && (
                    <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
                      ✅ SELECCIONADO
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ✅ CORRECCIÓN: Marcador adicional para el individuo seleccionado si no está en la lista */}
        {individuoSeleccionado && 
         individuoSeleccionado.latitud && 
         individuoSeleccionado.longitud &&
         !individuosValidos.some(ind => ind.id === individuoSeleccionado.id) && (
          <Marker
            position={[individuoSeleccionado.latitud, individuoSeleccionado.longitud]}
            icon={individuoSeleccionadoIcon}
          >
            <Popup>
              <div>
                <strong>Individuo Seleccionado</strong>
                <br />
                <strong>ID:</strong> {individuoSeleccionado.id}
                <br />
                {individuoSeleccionado.dap && <><strong>DAP:</strong> {individuoSeleccionado.dap} cm<br /></>}
                {individuoSeleccionado.categoria && <><strong>Categoría:</strong> {individuoSeleccionado.categoria}<br /></>}
                <strong>Coordenadas:</strong><br />
                Lat: {individuoSeleccionado.latitud.toFixed(6)}<br />
                Lng: {individuoSeleccionado.longitud.toFixed(6)}
                <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
                  ✅ SELECCIONADO
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

// Exportación del componente principal
export default MapaMuestra;