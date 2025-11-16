// Importación de hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importación de Axios para realizar solicitudes HTTP al backend
import axios from "axios";
// Importación del archivo CSS asociado al componente
import "../assets/css/registroArbol.css";
// Importación del componente Mapa que se utiliza en los pasos del formulario
import Mapa from "./mapa_arbol";

const RegistroArbol = () => {
  // Obtener información del usuario desde localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // Estado inicial del formulario que contiene los datos del individuo
  const [formData, setFormData] = useState({
    nombreConglomerado: userInfo.conglomerado?.nombre || "",
    subparcela: "",
    dap: "",
    azimut: "",
    distancia: "",
    categoria: "",
    imagen: null,
  });

  // Estado para los individuos registrados en la sesión actual
  const [individuosRegistrados, setIndividuosRegistrados] = useState([]);

  // Estado que controla el paso actual del formulario (1 a 4)
  const [step, setStep] = useState(1);

  // Estado para manejar los mensajes de error de validación
  const [errors, setErrors] = useState({});

  // Estado para indicar si el registro fue exitoso
  const [success, setSuccess] = useState(false);

  // Estado para controlar la carga mientras se envían los datos
  const [loading, setLoading] = useState(false);

  // Estado para las coordenadas del centro de la subparcela
  const [centroSubparcela, setCentroSubparcela] = useState(null);

  // Estado para la posición calculada del individuo (solo para visualización)
  const [posicionCalculada, setPosicionCalculada] = useState(null);

  // Función para determinar la categoría basada en el DAP
  const determinarCategoria = (dap) => {
    const dapNum = parseFloat(dap);
    if (isNaN(dapNum)) return "";
    
    if (dapNum < 10) return "Brinzales";
    if (dapNum >= 10 && dapNum < 30) return "Latizales";
    if (dapNum >= 30 && dapNum < 50) return "Fustal";
    if (dapNum >= 50) return "Fustal grande";
    return "";
  };

  // Función para calcular la posición del individuo basada en azimut y distancia (solo para visualización)
  const calcularPosicionDesdeAzimut = (centroLat, centroLng, azimut, distancia) => {
    // Radio de la Tierra en metros
    const R = 6378137;
    
    // Convertir azimut a radianes (el azimut en geodesia se mide desde el norte en sentido horario)
    const azimuthRad = (450 - parseFloat(azimut)) * Math.PI / 180; // Ajuste para que 0° sea norte
    
    // Convertir distancia a radianes angulares
    const distRad = parseFloat(distancia) / R;
    
    // Convertir coordenadas del centro a radianes
    const centroLatRad = centroLat * Math.PI / 180;
    const centroLngRad = centroLng * Math.PI / 180;
    
    // Calcular nueva latitud
    const nuevaLatRad = Math.asin(
      Math.sin(centroLatRad) * Math.cos(distRad) + 
      Math.cos(centroLatRad) * Math.sin(distRad) * Math.cos(azimuthRad)
    );
    
    // Calcular nueva longitud
    const nuevaLngRad = centroLngRad + Math.atan2(
      Math.sin(azimuthRad) * Math.sin(distRad) * Math.cos(centroLatRad),
      Math.cos(distRad) - Math.sin(centroLatRad) * Math.sin(nuevaLatRad)
    );
    
    // Convertir de vuelta a grados
    const nuevaLat = nuevaLatRad * 180 / Math.PI;
    const nuevaLng = nuevaLngRad * 180 / Math.PI;
    
    return { lat: nuevaLat, lng: nuevaLng };
  };

  // Efecto para calcular automáticamente la posición cuando cambian azimut o distancia (solo visual)
  useEffect(() => {
    if (formData.azimut && formData.distancia && centroSubparcela) {
      const { lat: centroLat, lng: centroLng } = centroSubparcela;
      const nuevaPosicion = calcularPosicionDesdeAzimut(
        centroLat, 
        centroLng, 
        formData.azimut, 
        formData.distancia
      );
      
      setPosicionCalculada(nuevaPosicion);
    } else {
      setPosicionCalculada(null);
    }
  }, [formData.azimut, formData.distancia, centroSubparcela]);

  // Función para obtener las coordenadas del centro de la subparcela seleccionada
  const obtenerCentroSubparcela = (subparcela, conglomerado) => {
    if (!conglomerado || !subparcela) return null;
    
    // Coordenadas base del conglomerado
    const baseLat = conglomerado.latitud || 4.711;
    const baseLng = conglomerado.longitud || -74.0721;
    
    // Desplazamientos aproximados para cada subparcela (en grados)
    const desplazamientos = {
      '1': { lat: 0.0001, lng: 0.0001 },   // NE
      '2': { lat: 0.0001, lng: -0.0001 },  // NW
      '3': { lat: -0.0001, lng: -0.0001 }, // SW
      '4': { lat: -0.0001, lng: 0.0001 }   // SE
    };
    
    const desplazamiento = desplazamientos[subparcela] || { lat: 0, lng: 0 };
    
    return {
      lat: baseLat + desplazamiento.lat,
      lng: baseLng + desplazamiento.lng
    };
  };

  // Maneja los cambios de los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Si es el campo DAP, determinar categoría automáticamente
    if (name === "dap") {
      const categoria = determinarCategoria(value);
      setFormData({ 
        ...formData, 
        [name]: value,
        categoria: categoria
      });
    } 
    // Si es subparcela, calcular centro de subparcela
    else if (name === "subparcela") {
      const nuevoCentro = obtenerCentroSubparcela(value, userInfo.conglomerado);
      setCentroSubparcela(nuevoCentro);
      setFormData({ ...formData, [name]: value });
      // Limpiar individuos registrados al cambiar subparcela
      setIndividuosRegistrados([]);
    }
    else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };

  // Función de validación por cada paso del formulario
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 2) {
      if (!formData.subparcela) newErrors.subparcela = "Debe seleccionar una subparcela.";
      if (!formData.dap) newErrors.dap = "Debe ingresar el DAP.";
      if (!formData.azimut) newErrors.azimut = "Debe ingresar el azimut.";
      else if (formData.azimut < 0 || formData.azimut > 360) newErrors.azimut = "El azimut debe estar entre 0° y 360°.";
      if (!formData.distancia) newErrors.distancia = "Debe ingresar la distancia.";
      else if (formData.distancia <= 0) newErrors.distancia = "La distancia debe ser mayor a 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanza al siguiente paso si la validación es correcta
  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // Retrocede al paso anterior
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // Agrega un individuo a la lista sin enviar a la base de datos
  const handleAgregarIndividuo = () => {
    if (!validateStep()) return;

    const nuevoIndividuo = {
      id: Date.now(), // ID temporal
      nombreConglomerado: formData.nombreConglomerado,
      subparcela: formData.subparcela,
      dap: formData.dap,
      azimut: formData.azimut,
      distancia: formData.distancia,
      categoria: formData.categoria,
      imagen: formData.imagen,
      fechaRegistro: new Date().toLocaleString()
    };

    setIndividuosRegistrados(prev => [...prev, nuevoIndividuo]);
    
    // Limpiar formulario para nuevo registro (mantener subparcela)
    setFormData(prev => ({
      ...prev,
      dap: "",
      azimut: "",
      distancia: "",
      categoria: "",
      imagen: null
    }));

    setPosicionCalculada(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Envía TODOS los individuos registrados al backend
  const handleEnviarTodos = async () => {
    if (individuosRegistrados.length === 0) {
      alert("No hay individuos para enviar.");
      return;
    }

    setLoading(true);

    try {
      // Enviar cada individuo por separado
      const promesas = individuosRegistrados.map(async (individuo) => {
        const dataToSend = new FormData();
        
        // Solo enviar los campos que se guardan en la base de datos
        dataToSend.append("nombreConglomerado", individuo.nombreConglomerado);
        dataToSend.append("subparcela", individuo.subparcela);
        dataToSend.append("dap", individuo.dap);
        dataToSend.append("azimut", individuo.azimut);
        dataToSend.append("distancia", individuo.distancia);
        dataToSend.append("categoria", individuo.categoria);
        
        if (individuo.imagen) {
          dataToSend.append("imagen", individuo.imagen);
        }

        return axios.post("http://localhost:4000/api/individuos", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      await Promise.all(promesas);

      // Limpiar todo después del envío exitoso
      setIndividuosRegistrados([]);
      setFormData({
        nombreConglomerado: userInfo.conglomerado?.nombre || "",
        subparcela: "",
        dap: "",
        azimut: "",
        distancia: "",
        categoria: "",
        imagen: null,
      });
      setCentroSubparcela(null);
      setStep(1);
      
      alert(`¡Éxito! Se enviaron ${individuosRegistrados.length} individuos a la base de datos.`);
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("Ocurrió un error al guardar los registros.");
    } finally {
      setLoading(false);
    }
  };

  // Elimina un individuo de la lista temporal
  const handleEliminarIndividuo = (id) => {
    setIndividuosRegistrados(prev => prev.filter(ind => ind.id !== id));
  };

  // Definir colores para cada categoría
  const getCardColor = (categoria) => {
    switch(categoria) {
      case "Brinzales": return "border-primary bg-primary-light";
      case "Latizales": return "border-success bg-success-light"; 
      case "Fustal": return "border-warning bg-warning-light";
      case "Fustal grande": return "border-danger bg-danger-light";
      default: return "border-secondary bg-light";
    }
  };

  // Información de categorías
  const categoriasInfo = [
    {
      id: "Brinzales",
      nombre: "Brinzales",
      descripcion: "Son los individuos arbóreos más jóvenes del bosque, con un DAP menor a 10 cm.",
      ejemplos: "Árboles jóvenes, retoños, plántulas",
      color: "primary"
    },
    { 
      id: "Latizales",
      nombre: "Latizales",
      descripcion: "Son los individuos arbóreos en fase intermedia de crecimiento. DAP entre 10 y 30 cm.",
      ejemplos: "Árboles en crecimiento, juveniles",
      color: "success"
    },
    { 
      id: "Fustal",
      nombre: "Fustal",
      descripcion: "Son individuos arbóreos con un DAP entre 30 y 50 cm, que ya alcanzaron la madurez estructural.",
      ejemplos: "Árboles maduros",
      color: "warning"
    },
    { 
      id: "Fustal grande",
      nombre: "Fustal grande",
      descripcion: "Son los individuos arbóreos más desarrollados, con un DAP superior a 50 cm.",
      ejemplos: "Árboles centenarios, gigantes",
      color: "danger"
    }
  ];

  return (
    <div className="arbol-container my-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header con información del conglomerado */}
            <div className="arbol-header text-center mb-4">
              <h1 className="display-5 fw-bold text-gradient">Registro de Individuos Arbóreos</h1>
              {userInfo.conglomerado && (
                <div className="conglomerado-badge">
                  <span className="badge bg-primary fs-6">
                    📍 Conglomerado: {userInfo.conglomerado.nombre}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="progress-steps mb-5">
              <div className="progress" style={{height: "8px"}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${(step / 3) * 100}%`}}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                {[1, 2, 3].map((stepNum) => (
                  <div 
                    key={stepNum} 
                    className={`step-indicator ${step >= stepNum ? 'active' : ''}`}
                  >
                    {stepNum}
                  </div>
                ))}
              </div>
            </div>

            {/* Contador de individuos registrados */}
            {individuosRegistrados.length > 0 && (
              <div className="alert alert-info mb-4">
                <i className="fas fa-tree me-2"></i>
                <strong>{individuosRegistrados.length}</strong> individuo(s) registrado(s) en esta sesión
                <button 
                  className="btn btn-sm btn-success ms-3"
                  onClick={handleEnviarTodos}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : " Registrar todos los individuos"}
                </button>
              </div>
            )}

            {/* Formulario principal dividido por pasos */}
            <div className="arbol-form">

              {/* Paso 1: Información del conglomerado y subparcela */}
              {step === 1 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 1: Selección de Subparcela</h3>
                    <p className="text-muted">Seleccione la subparcela donde registrará los individuos</p>
                  </div>
                  
                  <div className="conglomerado-info-card mb-4">
                    <div className="card border-success">
                      <div className="card-body">
                        <h4 className="card-title">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {userInfo.conglomerado?.nombre || "No asignado"}
                        </h4>
                        <p className="card-text">
                          Este es el conglomerado que tiene asignado. Seleccione la subparcela donde realizará el registro.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="subparcela" className="form-label">
                        <i className="fas fa-th-large me-2"></i>Subparcela
                      </label>
                      <select
                        id="subparcela"
                        name="subparcela"
                        value={formData.subparcela}
                        onChange={handleChange}
                        className={`form-select form-select-lg ${errors.subparcela ? "is-invalid" : ""}`}
                      >
                        <option value="">Seleccione subparcela</option>
                        <option value="1">Subparcela 1 (NE)</option>
                        <option value="2">Subparcela 2 (NW)</option>
                        <option value="3">Subparcela 3 (SW)</option>
                        <option value="4">Subparcela 4 (SE)</option>
                      </select>
                      {errors.subparcela && (
                        <div className="invalid-feedback">{errors.subparcela}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-success btn-lg" 
                      onClick={handleNext}
                      disabled={!formData.subparcela}
                    >
                      Continuar <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Registro de individuos */}
              {step === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 2: Registro de Individuos</h3>
                    <p className="text-muted">
                      Subparcela {formData.subparcela} - Ingrese las mediciones de cada individuo
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="dap" className="form-label">
                        <i className="fas fa-ruler me-2"></i>DAP (cm)
                      </label>
                      <input
                        type="number"
                        id="dap"
                        name="dap"
                        value={formData.dap}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        className={`form-control form-control-lg ${errors.dap ? "is-invalid" : ""}`}
                        placeholder="Ej: 25.5"
                      />
                      {errors.dap && (
                        <div className="invalid-feedback">{errors.dap}</div>
                      )}
                      {formData.categoria && (
                        <div className="form-text text-success">
                          <i className="fas fa-tag me-1"></i>
                          Categoría: <strong>{formData.categoria}</strong>
                        </div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="azimut" className="form-label">
                        <i className="fas fa-compass me-2"></i>Azimut (°)
                      </label>
                      <input
                        type="number"
                        id="azimut"
                        name="azimut"
                        value={formData.azimut}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        max="360"
                        className={`form-control form-control-lg ${errors.azimut ? "is-invalid" : ""}`}
                        placeholder="Ej: 45.5"
                      />
                      {errors.azimut && (
                        <div className="invalid-feedback">{errors.azimut}</div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="distancia" className="form-label">
                        <i className="fas fa-arrows-alt-h me-2"></i>Distancia (m)
                      </label>
                      <input
                        type="number"
                        id="distancia"
                        name="distancia"
                        value={formData.distancia}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`form-control form-control-lg ${errors.distancia ? "is-invalid" : ""}`}
                        placeholder="Ej: 3.25"
                      />
                      {errors.distancia && (
                        <div className="invalid-feedback">{errors.distancia}</div>
                      )}
                    </div>
                  </div>

                  {/* Vista previa del individuo actual */}
                  {formData.dap && formData.azimut && formData.distancia && (
                    <div className="vista-previa-individuo mb-4">
                      <div className="card border-info">
                        <div className="card-body">
                          <h6 className="card-title text-info">
                            <i className="fas fa-eye me-2"></i>
                            Vista Previa del Individuo
                          </h6>
                          <div className="row">
                            <div className="col-md-4">
                              <p><strong>DAP:</strong> {formData.dap} cm</p>
                              <p><strong>Categoría:</strong> 
                                <span className={`badge bg-${categoriasInfo.find(c => c.id === formData.categoria)?.color} ms-2`}>
                                  {formData.categoria}
                                </span>
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p><strong>Azimut:</strong> {formData.azimut}°</p>
                              <p><strong>Distancia:</strong> {formData.distancia} m</p>
                            </div>
                            <div className="col-md-4">
                              <p><strong>Subparcela:</strong> {formData.subparcela}</p>
                              <p><strong>Conglomerado:</strong> {formData.nombreConglomerado}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mapa de visualización */}
                  <div className="mapa-container mb-4">
                    <div className="mapa-arbol" style={{ height: "300px", borderRadius: "10px", overflow: "hidden" }}>
                      <Mapa
                        movableMarker={false}
                        selectedConglomerado={userInfo.conglomerado}
                        centroSubparcela={centroSubparcela}
                        individuoPosition={posicionCalculada}
                        mediciones={{
                          azimut: formData.azimut,
                          distancia: formData.distancia
                        }}
                      />
                    </div>
                  </div>

                  {/* Campo para imagen */}
                  <div className="mb-4">
                    <label htmlFor="imagen" className="form-label">
                      <i className="fas fa-camera me-2"></i>
                      Foto del individuo (opcional)
                    </label>
                    <input
                      type="file"
                      id="imagen"
                      name="imagen"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                      <i className="fas fa-arrow-left me-2"></i>Cambiar Subparcela
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleAgregarIndividuo}
                      disabled={!formData.dap || !formData.azimut || !formData.distancia}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Agregar Individuo
                    </button>
                    {individuosRegistrados.length > 0 && (
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={() => setStep(3)}
                      >
                        Ver Resumen <i className="fas fa-list me-2"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 3: Resumen y envío final */}
              {step === 3 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 3: Resumen Final</h3>
                    <p className="text-muted">
                      Revise los {individuosRegistrados.length} individuos registrados en la subparcela {formData.subparcela}
                    </p>
                  </div>

                  {/* Lista de individuos registrados */}
                  <div className="individuos-lista mb-4">
                    <h5 className="mb-3">
                      <i className="fas fa-trees me-2"></i>
                      Individuos Registrados
                    </h5>
                    <div className="row">
                      {individuosRegistrados.map((individuo, index) => (
                        <div key={individuo.id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <h6 className="card-title">Individuo {index + 1}</h6>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleEliminarIndividuo(individuo.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                              <p className="mb-1"><strong>DAP:</strong> {individuo.dap} cm</p>
                              <p className="mb-1"><strong>Azimut:</strong> {individuo.azimut}°</p>
                              <p className="mb-1"><strong>Distancia:</strong> {individuo.distancia} m</p>
                              <p className="mb-1">
                                <strong>Categoría:</strong> 
                                <span className={`badge bg-${categoriasInfo.find(c => c.id === individuo.categoria)?.color} ms-2`}>
                                  {individuo.categoria}
                                </span>
                              </p>
                              <small className="text-muted">{individuo.fechaRegistro}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(2)}>
                      <i className="fas fa-arrow-left me-2"></i>Agregar Más Individuos
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success btn-lg"
                      onClick={handleEnviarTodos}
                      disabled={loading || individuosRegistrados.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Registrar {individuosRegistrados.length} Individuos 
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje de éxito al agregar individuo */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                <strong>¡Individuo agregado!</strong> Puede continuar registrando más individuos en esta subparcela.
                <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportación del componente
export default RegistroArbol;