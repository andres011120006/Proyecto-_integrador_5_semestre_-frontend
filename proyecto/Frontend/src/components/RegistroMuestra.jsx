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
    categoria: "",            // Tipo de muestra (Muestras Fertiles, Muestras Infertiles)
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
  const [serverError, setServerError] = useState(""); // Error del servidor

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
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (serverError) setServerError("");
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

  // --- Retroceder al paso anterior ---
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // --- Envío final del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return; // No continuar si hay errores
    setLoading(true);
    setServerError("");

    try {
      // Crear objeto FormData para enviar archivos e información
      const dataToSend = new FormData();
      
      // Agregar todos los campos con los nombres correctos
      dataToSend.append("nombreConglomerado", formData.nombreConglomerado);
      dataToSend.append("subparcela", formData.subparcela);
      dataToSend.append("categoria", formData.categoria);
      dataToSend.append("latitud", formData.latitud);
      dataToSend.append("longitud", formData.longitud);
      
      if (formData.individuoSeleccionado) {
        dataToSend.append("individuoSeleccionado", JSON.stringify(formData.individuoSeleccionado));
      }
      
      if (formData.imagen) {
        dataToSend.append("imagen", formData.imagen);
      }

      // Log para debugging
      console.log("📤 Enviando datos al servidor:", {
        nombreConglomerado: formData.nombreConglomerado,
        subparcela: formData.subparcela,
        categoria: formData.categoria,
        latitud: formData.latitud,
        longitud: formData.longitud,
        tieneImagen: !!formData.imagen,
        tieneIndividuo: !!formData.individuoSeleccionado
      });

      // Petición POST al backend
      const response = await axios.post("http://localhost:4000/api/muestras", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Respuesta del servidor:", response.data);

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

      setTimeout(() => setSuccess(false), 5000);

    } catch (err) {
      console.error("❌ Error al guardar la muestra:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message;
      setServerError(`Error al guardar la muestra: ${errorMessage}`);
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

            <div className="d-flex justify-content-between mt-3">
              <div></div> {/* Espacio vacío para alinear */}
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Siguiente
              </button>
            </div>
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

            <div className="d-flex justify-content-between mt-3">
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Anterior
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Siguiente
              </button>
            </div>
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
            <div className="coordinates-info mb-3">
              <p><strong>Latitud:</strong> {formData.latitud ? formData.latitud.toFixed(6) : "No definida"}</p>
              <p><strong>Longitud:</strong> {formData.longitud ? formData.longitud.toFixed(6) : "No definida"}</p>
              {formData.individuoSeleccionado && (
                <p><strong>Individuo seleccionado:</strong> {formData.individuoSeleccionado.id || "ID no disponible"}</p>
              )}
            </div>

            {errors.individuoSeleccionado && (
              <div className="invalid-feedback d-block">{errors.individuoSeleccionado}</div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Anterior
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Siguiente
              </button>
            </div>
          </>
        )}

        {/* Paso 4: Selección de tipo de muestra e imagen */}
        {step === 4 && (
          <>
            <h3>Paso 4: Tipo de muestra e imagen</h3>

            {/* Selección de categoría */}
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">
                <strong>Tipo de muestra *</strong>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
              >
                <option value="">Seleccione tipo de muestra</option>
                <option value="Muestras Fertiles">Muestras Fértiles</option>
                <option value="Muestras Infertiles">Muestras Infértiles</option>
              </select>
              {errors.categoria && (
                <div className="invalid-feedback">{errors.categoria}</div>
              )}
            </div>

            {/* Cards informativas */}
            <div className="categorias-info mb-4">
              <h6 className="mb-3">Información sobre categorías:</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card border-success">
                    <div className="card-body">
                      <h6 className="card-title text-success">
                        Muestras Fértiles
                      </h6>
                      <p className="card-text small">
                        Se denomina muestras fértiles cuando la muestra recolectada posee flores, frutos o semillas. Estos individuos arbóreos han alcanzado la madurez reproductiva y contribuyen activamente a la regeneración del bosque.
                        <br />
                        <strong>Ejemplos:</strong> Árboles con flores, frutos maduros, semillas, etc.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card border-success">
                    <div className="card-body">
                      <h6 className="card-title text-success">
                        Muestras Infértiles
                      </h6>
                      <p className="card-text small">
                        Se denomina muestras infértiles cuando la muestra recolectada no posee flores, frutos o semillas. Estos individuos arbóreos aún no han alcanzado la madurez reproductiva o están en una fase de desarrollo donde no producen estructuras reproductivas visibles.
                        <br />
                        <strong>Ejemplos:</strong> Árboles jóvenes, hojas sin flores, ramas sin frutos, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carga de imagen */}
            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">
                <strong>Imagen de la muestra (opcional)</strong>
              </label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                className="form-control"
              />
              <div className="form-text">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 10MB
              </div>
            </div>

            {/* Resumen del registro */}
            <div className="summary-card card mb-4">
              <div className="card-header">
                <strong>Resumen del registro</strong>
              </div>
              <div className="card-body">
                <p><strong>Conglomerado:</strong> {formData.nombreConglomerado}</p>
                <p><strong>Subparcela:</strong> {formData.subparcela}</p>
                <p><strong>Tipo de muestra:</strong> {formData.categoria}</p>
                <p><strong>Ubicación:</strong> {formData.latitud?.toFixed(6)}, {formData.longitud?.toFixed(6)}</p>
                {formData.imagen && (
                  <p><strong>Imagen:</strong> {formData.imagen.name}</p>
                )}
              </div>
            </div>

            {/* Botones finales */}
            <div className="d-flex justify-content-between mt-3">
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Anterior
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  "✅ Guardar Muestra"
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Mensaje de éxito */}
      {success && (
        <div className="alert alert-success mt-3" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>¡Muestra registrada exitosamente!</strong>
          <br />
          La muestra ha sido guardada en la base de datos correctamente.
        </div>
      )}

      {/* Mensaje de error del servidor */}
      {serverError && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {serverError}
        </div>
      )}
    </div>
  );
};

// Exporta el componente para su uso en otras partes del sistema
export default RegistroMuestra;