// Importación de dependencias principales de React y librerías auxiliares
import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/registroArbol.css";
import MapaMuestra from "./mapa_muestra"; // Componente de mapa interactivo

// Componente principal para registrar una muestra biológica asociada a un individuo arbóreo
const RegistroMuestra = () => {

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    nombreConglomerado: "",   // Nombre del conglomerado seleccionado
    subparcela: "",           // Número de subparcela
    categoria: "",            // Tipo de muestra (Hoja, Corteza, etc.)
    latitud: "",              // Latitud del individuo seleccionado
    longitud: "",             // Longitud del individuo seleccionado
    imagen: null,             // Archivo de imagen cargado
    individuoSeleccionado: null, // Objeto con datos del individuo
  });

  // Estado para el paso actual del formulario (1 a 4)
  const [step, setStep] = useState(1);

  // Listas de datos cargados desde el backend
  const [conglomerados, setConglomerados] = useState([]);
  const [individuos, setIndividuos] = useState([]);

  // Estados auxiliares
  const [errors, setErrors] = useState({});  // Errores de validación
  const [success, setSuccess] = useState(false); // Éxito del registro
  const [loading, setLoading] = useState(false); // Indicador de carga

  // --- useEffect 1: Carga de conglomerados al iniciar el componente ---
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        // Solicitud al backend para obtener los conglomerados disponibles
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data); // Se almacenan en el estado
      } catch (err) {
        console.error("Error cargando conglomerados:", err);
      }
    };
    fetchConglomerados();
  }, []);

  // --- useEffect 2: Carga de individuos según el conglomerado y subparcela seleccionados ---
  useEffect(() => {
    const fetchIndividuos = async () => {
      if (formData.nombreConglomerado && formData.subparcela) {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/individuos?conglomerado=${formData.nombreConglomerado}&subparcela=${formData.subparcela}`
          );
          setIndividuos(res.data || []);
        } catch (err) {
          console.error("Error cargando individuos:", err);
          setIndividuos([]);
        }
      }
    };
    fetchIndividuos();
  }, [formData.nombreConglomerado, formData.subparcela]);

  // --- Manejo de cambios en los inputs ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el input es de tipo archivo, guarda el archivo. Si no, el valor.
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // --- Validación de cada paso del formulario ---
  const validateStep = () => {
    const newErrors = {};

    if (step === 1 && !formData.nombreConglomerado)
      newErrors.nombreConglomerado = "Debe seleccionar un conglomerado.";

    if (step === 2 && !formData.subparcela)
      newErrors.subparcela = "Debe seleccionar una subparcela.";

    if (step === 3 && !formData.individuoSeleccionado)
      newErrors.individuoSeleccionado = "Debe seleccionar un individuo arbóreo.";

    if (step === 4 && !formData.categoria)
      newErrors.categoria = "Debe seleccionar una categoría.";

    setErrors(newErrors);
    // Devuelve true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // --- Avanzar al siguiente paso ---
  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // --- Envío final del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return; // No continuar si hay errores
    setLoading(true);

    try {
      // Crear objeto FormData para enviar archivos e información
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend.append(key, value);
      });

      // Petición POST al backend
      await axios.post("http://localhost:4000/api/muestras", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Mostrar mensaje de éxito y limpiar formulario
      setSuccess(true);
      setStep(1);
      setFormData({
        nombreConglomerado: "",
        subparcela: "",
        categoria: "",
        latitud: "",
        longitud: "",
        imagen: null,
        individuoSeleccionado: null,
      });

      // Ocultar mensaje después de 4 segundos
      setTimeout(() => setSuccess(false), 4000);

    } catch (err) {
      console.error("Error al guardar la muestra:", err);
      alert("Ocurrió un error al guardar la muestra.");
    } finally {
      setLoading(false);
    }
  };

  // --- Obtener información del conglomerado actualmente seleccionado ---
  const selectedConglomerado = conglomerados.find(
    (c) => c.nombre === formData.nombreConglomerado
  );

  // --- Renderizado del formulario por pasos ---
  return (
    <div className="arbol-container my-5">
      <h1>Registro de Muestra</h1>

      <form onSubmit={handleSubmit}>

        {/* Paso 1: Selección de conglomerado */}
        {step === 1 && (
          <>
            <h3>Paso 1: Seleccione un conglomerado</h3>
            <select
              name="nombreConglomerado"
              value={formData.nombreConglomerado}
              onChange={handleChange}
              className={`form-select ${errors.nombreConglomerado ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione un conglomerado</option>
              {conglomerados.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>

            {errors.nombreConglomerado && (
              <div className="invalid-feedback">{errors.nombreConglomerado}</div>
            )}

            {/* Mostrar mapa centrado en el conglomerado seleccionado */}
            {selectedConglomerado && (
              <div className="mapa-arbol my-4" style={{ height: "400px" }}>
                <MapaMuestra
                  individuos={[]} // Vacío en este paso
                  onSelect={() => {}}
                  center={[selectedConglomerado.latitud, selectedConglomerado.longitud]}
                />
              </div>
            )}

            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 2: Selección de subparcela */}
        {step === 2 && (
          <>
            <h3>Paso 2: Seleccione una subparcela</h3>
            <select
              name="subparcela"
              value={formData.subparcela}
              onChange={handleChange}
              className={`form-select ${errors.subparcela ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione subparcela</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            {errors.subparcela && (
              <div className="invalid-feedback">{errors.subparcela}</div>
            )}

            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 3: Selección de individuo */}
        {step === 3 && (
          <>
            <h3>Paso 3: Seleccione el individuo arbóreo</h3>
            <p>El mapa muestra los individuos registrados. Seleccione uno para continuar.</p>

            <div className="mapa-arbol my-4" style={{ height: "400px" }}>
              <MapaMuestra
                individuos={individuos}
                onSelect={(individuo) => {
                  // Guarda el individuo y sus coordenadas en el formulario
                  if (individuo && individuo.latitud && individuo.longitud) {
                    setFormData({
                      ...formData,
                      individuoSeleccionado: individuo,
                      latitud: individuo.latitud,
                      longitud: individuo.longitud,
                    });
                  } else {
                    console.warn("Individuo sin coordenadas válidas:", individuo);
                  }
                }}
                individuoSeleccionado={formData.individuoSeleccionado}
                center={[
                  selectedConglomerado?.latitud || 4.711,
                  selectedConglomerado?.longitud || -74.0721,
                ]}
              />
            </div>

            {/* Mostrar coordenadas seleccionadas */}
            <p><strong>Latitud:</strong> {formData.latitud ? formData.latitud.toFixed(6) : "No definida"}</p>
            <p><strong>Longitud:</strong> {formData.longitud ? formData.longitud.toFixed(6) : "No definida"}</p>

            {errors.individuoSeleccionado && (
              <div className="invalid-feedback d-block">{errors.individuoSeleccionado}</div>
            )}

            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 4: Selección de tipo de muestra e imagen */}
        {step === 4 && (
          <>
            <h3>Paso 4: Tipo de muestra e imagen</h3>

            {/* Selección de categoría */}
            <label htmlFor="categoria">Tipo de muestra</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione tipo de muestra</option>
              <option value="Hoja">Hoja</option>
              <option value="Corteza">Corteza</option>
              <option value="Fruto">Fruto</option>
              <option value="Madera">Madera</option>
            </select>

            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}

            {/* Carga de imagen */}
            <label htmlFor="imagen" className="mt-3">Imagen de la muestra (opcional)</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />

            <button type="submit" className="btn btn-success mt-3" disabled={loading}>
              {loading ? "Guardando..." : "Enviar"}
            </button>
          </>
        )}
      </form>

      {/* Mensaje de éxito */}
      {success && (
        <div className="arbol-success-message" role="alert">
          ¡Registro exitoso!
        </div>
      )}
    </div>
  );
};

// Exporta el componente para su uso en otras partes del sistema
export default RegistroMuestra;
