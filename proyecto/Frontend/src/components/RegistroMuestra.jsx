// Importación de dependencias principales de React y librerías auxiliares
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../assets/css/registroArbol.css";

/**
 * COMPONENTE: RegistroMuestra
 */
const RegistroMuestra = () => {
  // ==================== ESTADOS DEL COMPONENTE ====================
  
  // Obtener información del usuario desde localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    nombreConglomerado: userInfo.conglomerado?.nombre || "",
    subparcela: "",
    categoria: "",
    imagen: null,
    individuoSeleccionado: null,
  });

  // Estado para las muestras registradas en la sesión actual
  const [muestrasRegistradas, setMuestrasRegistradas] = useState([]);

  // Estado para el paso actual del formulario (1 a 3)
  const [step, setStep] = useState(1);

  // Estado para la lista de individuos cargados desde el backend
  const [individuos, setIndividuos] = useState([]);
  const [filteredIndividuos, setFilteredIndividuos] = useState([]);

  // Estados auxiliares para manejo de UI y errores
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [cargandoIndividuos, setCargandoIndividuos] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔧 NUEVO: useRef para controlar llamadas múltiples
  const isFetching = useRef(false);
  const abortControllerRef = useRef(null);

  // ==================== EFECTOS SECUNDARIOS CORREGIDOS ====================

  /**
   * Cargar individuos según la subparcela seleccionada
   * SOLUCIÓN COMPLETA: Con control de llamadas múltiples
   */
  const fetchIndividuos = useCallback(async () => {
    // Evitar múltiples llamadas simultáneas
    if (isFetching.current) {
      console.log("⏳ Ya hay una llamada en curso, cancelando...");
      return;
    }

    if (!formData.subparcela || !userInfo.conglomerado?.nombre) {
      setIndividuos([]);
      setFilteredIndividuos([]);
      return;
    }

    // Cancelar llamada anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    isFetching.current = true;

    setCargandoIndividuos(true);
    setServerError("");
    
    try {
      console.log("🔄 Cargando individuos para:", userInfo.conglomerado.nombre, formData.subparcela);
      
      const response = await axios.get(
        `http://localhost:4000/api/individuos?conglomerado=${encodeURIComponent(userInfo.conglomerado.nombre)}&subparcela=${formData.subparcela}`,
        {
          signal: abortControllerRef.current.signal,
          timeout: 10000 // 10 segundos timeout
        }
      );
      
      //  MANEJO ROBUSTO: Procesar diferentes estructuras de respuesta
      let individuosData = [];
      
      if (Array.isArray(response.data)) {
        individuosData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        individuosData = response.data.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        individuosData = response.data.data;
      } else if (response.data && Array.isArray(response.data.individuos)) {
        individuosData = response.data.individuos;
      } else {
        console.warn("⚠️ Estructura de respuesta no reconocida:", response.data);
        individuosData = [];
      }
      
      console.log(`✅ ${individuosData.length} individuos procesados`);
      setIndividuos(individuosData);
      setFilteredIndividuos(individuosData);
      
      if (individuosData.length === 0) {
        setServerError("No se encontraron individuos registrados en esta subparcela.");
      }
      
    } catch (err) {
      // Ignorar errores de cancelación
      if (axios.isCancel(err)) {
        console.log(" Llamada cancelada correctamente");
        return;
      }
      
      console.error(" Error cargando individuos:", err);
      setIndividuos([]);
      setFilteredIndividuos([]);
      setServerError(`Error al cargar los individuos: ${err.response?.data?.message || err.message}`);
    } finally {
      setCargandoIndividuos(false);
      isFetching.current = false;
    }
  }, [formData.subparcela, userInfo.conglomerado?.nombre]);

  /**
   * useEffect CORREGIDO: Con cleanup completo y debounce mejorado
   */
  useEffect(() => {
    // Debounce para evitar llamadas múltiples rápidas
    const timer = setTimeout(() => {
      fetchIndividuos();
    }, 500); // 500ms debounce

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isFetching.current = false;
    };
  }, [fetchIndividuos]);

  /**
   * Filtrar individuos según búsqueda
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredIndividuos(individuos);
    } else {
      const filtered = individuos.filter(individuo =>
        individuo.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individuo.id?.toString().includes(searchTerm) ||
        individuo.dap?.toString().includes(searchTerm)
      );
      setFilteredIndividuos(filtered);
    }
  }, [searchTerm, individuos]);

  // ==================== MANEJADORES DE EVENTOS ====================

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "subparcela") {
      setMuestrasRegistradas([]);
      setFormData({ 
        ...formData, 
        [name]: value,
        individuoSeleccionado: null,
        categoria: "",
        imagen: null
      });
      setSearchTerm("");
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    if (serverError) setServerError("");
  };

  const handleSeleccionarIndividuo = (individuo) => {
    console.log("📍 Individuo seleccionado:", individuo);
    setFormData({
      ...formData,
      individuoSeleccionado: individuo,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1 && !formData.subparcela) {
      newErrors.subparcela = "Debe seleccionar una subparcela.";
    }

    if (step === 2 && !formData.individuoSeleccionado) {
      newErrors.individuoSeleccionado = "Debe seleccionar un individuo arbóreo.";
    }

    if (step === 3 && !formData.categoria) {
      newErrors.categoria = "Debe seleccionar una categoría.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleAgregarMuestra = () => {
    if (!validateStep()) return;

    const nuevaMuestra = {
      id: Date.now(),
      nombreConglomerado: formData.nombreConglomerado,
      subparcela: formData.subparcela,
      categoria: formData.categoria,
      individuo: formData.individuoSeleccionado,
      imagen: formData.imagen,
      fechaRegistro: new Date().toLocaleString()
    };

    setMuestrasRegistradas(prev => [...prev, nuevaMuestra]);
    
    setFormData(prev => ({
      ...prev,
      categoria: "",
      imagen: null,
      individuoSeleccionado: null
    }));

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEnviarTodas = async () => {
    if (muestrasRegistradas.length === 0) {
      alert("No hay muestras para enviar.");
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      console.log("📤 Enviando muestras:", muestrasRegistradas);
      
      const promesas = muestrasRegistradas.map(async (muestra) => {
        const dataToSend = new FormData();
        
        dataToSend.append("nombreConglomerado", muestra.nombreConglomerado);
        dataToSend.append("subparcela", muestra.subparcela);
        dataToSend.append("categoria", muestra.categoria);
        dataToSend.append("idIndividuo", muestra.individuo.id);
        
        if (muestra.imagen) {
          dataToSend.append("imagen", muestra.imagen);
        }

        return axios.post("http://localhost:4000/api/muestras", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      const resultados = await Promise.all(promesas);
      console.log("✅ Resultados del envío:", resultados);

      setMuestrasRegistradas([]);
      setFormData({
        nombreConglomerado: userInfo.conglomerado?.nombre || "",
        subparcela: "",
        categoria: "",
        imagen: null,
        individuoSeleccionado: null,
      });
      setStep(1);
      
      alert(`¡Éxito! Se enviaron ${muestrasRegistradas.length} muestras a la base de datos.`);
      
    } catch (err) {
      console.error(" Error detallado al enviar datos:", err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message ||
                          "Error desconocido al guardar las muestras";
      
      setServerError(`Error al guardar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMuestra = (id) => {
    setMuestrasRegistradas(prev => prev.filter(muestra => muestra.id !== id));
  };

  // ==================== FUNCIÓN PARA OBTENER COLOR DE CATEGORÍA ====================

  const getColorCategoria = (categoria) => {
    switch(categoria) {
      case "Brinzales": return "primary";
      case "Latizales": return "success";
      case "Fustal": return "warning";
      case "Fustal grande": return "danger";
      default: return "secondary";
    }
  };

  // Función para verificar si un individuo está seleccionado
  const isSelected = (individuo) => {
    return formData.individuoSeleccionado && formData.individuoSeleccionado.id === individuo.id;
  };

  // ==================== RENDERIZADO DEL COMPONENTE ====================

  return (
    <div className="arbol-container my-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            
            {/* HEADER CON INFORMACIÓN DEL CONGLOMERADO */}
            <div className="arbol-header text-center mb-4">
              <h1 className="display-5 fw-bold text-gradient">Registro de Muestras Biológicas</h1>
              {userInfo.conglomerado && (
                <div className="conglomerado-badge">
                  <span className="badge bg-primary fs-6">
                    📍 Conglomerado: {userInfo.conglomerado.nombre}
                  </span>
                </div>
              )}
            </div>

            {/* BARRA DE PROGRESO */}
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

            {/* CONTADOR DE MUESTRAS REGISTRADAS */}
            {muestrasRegistradas.length > 0 && (
              <div className="alert alert-info mb-4">
                <i className="fas fa-vial me-2"></i>
                <strong>{muestrasRegistradas.length}</strong> muestra(s) registrada(s) en esta sesión
                <button 
                  className="btn btn-sm btn-success ms-3"
                  onClick={handleEnviarTodas}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : " Registrar Todas"}
                </button>
              </div>
            )}

            {/* FORMULARIO PRINCIPAL POR PASOS */}
            <div className="arbol-form">

              {/* ========== PASO 1: SELECCIÓN DE SUBPARCELA ========== */}
              {step === 1 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 1: Selección de Subparcela</h3>
                    <p className="text-muted">Seleccione la subparcela donde registrará las muestras</p>
                  </div>
                  
                  <div className="conglomerado-info-card mb-4">
                    <div className="card border-success">
                      <div className="card-body">
                        <h4 className="card-title">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {userInfo.conglomerado?.nombre || "No asignado"}
                        </h4>
                        <p className="card-text">
                          Este es el conglomerado que tiene asignado. Seleccione la subparcela donde realizará el registro de muestras.
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
                        <option value="1">Subparcela 1</option>
                        <option value="2">Subparcela 2</option>
                        <option value="3">Subparcela 3</option>
                        <option value="4">Subparcela 4</option>
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

              {/* ========== PASO 2: SELECCIÓN DE INDIVIDUO DESDE TABLA ========== */}
              {step === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 2: Selección de Individuo</h3>
                    <p className="text-muted">
                      Subparcela {formData.subparcela} - Seleccione un individuo de la tabla
                    </p>
                  </div>

                  {/* BARRA DE BÚSQUEDA - IGUAL QUE CONGLOMERADOS */}
                  <div className="search-container mb-4">
                    <div className="search-input-group">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar individuo por categoría, ID o DAP..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={cargandoIndividuos}
                      />
                    </div>
                    <div className="search-results-info">
                      {cargandoIndividuos ? (
                        <span className="text-warning"> Cargando individuos...</span>
                      ) : (
                        `${filteredIndividuos.length} de ${individuos.length} individuos`
                      )}
                    </div>
                  </div>

                  {/* MENSAJE DE ERROR */}
                  {serverError && (
                    <div className="error-message mb-4">
                      {serverError}
                    </div>
                  )}

                  {/* TABLA DE INDIVIDUOS - EXACTAMENTE IGUAL QUE CONGLOMERADOS */}
                  <div className="table-container mb-4">
                    <table className="conglomerados-table">
                      <thead className="table-header">
                        <tr>
                          <th width="80">Seleccionar</th>
                          <th>ID</th>
                          <th>DAP (cm)</th>
                          <th>Categoría</th>
                          <th>Azimut (°)</th>
                          <th>Distancia (m)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIndividuos.map((individuo) => (
                          <tr 
                            key={individuo.id}
                            className={`table-row ${isSelected(individuo) ? 'selected' : ''}`}
                            onClick={() => handleSeleccionarIndividuo(individuo)}
                          >
                            <td>
                              <input
                                type="radio"
                                name="individuo"
                                checked={isSelected(individuo)}
                                onChange={() => handleSeleccionarIndividuo(individuo)}
                                className="radio-input"
                              />
                            </td>
                            <td className="individuo-id">
                              <strong>{individuo.id}</strong>
                            </td>
                            <td>{individuo.dap} cm</td>
                            <td>
                              <span className={`badge bg-${getColorCategoria(individuo.categoria)}`}>
                                {individuo.categoria}
                              </span>
                            </td>
                            <td>{individuo.azimut}°</td>
                            <td>{individuo.distancia} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* INDICADOR DE CARGA */}
                    {cargandoIndividuos && (
                      <div className="loading-indicator">
                        <div className="loading-spinner"></div>
                        <span>Cargando individuos...</span>
                      </div>
                    )}

                    {/* MENSAJE CUANDO NO HAY RESULTADOS */}
                    {filteredIndividuos.length === 0 && !cargandoIndividuos && (
                      <div className="no-results">
                        {searchTerm ? `No se encontraron individuos para "${searchTerm}"` : 'No hay individuos disponibles en esta subparcela'}
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN DEL INDIVIDUO SELECCIONADO */}
                  {formData.individuoSeleccionado && (
                    <div className="selected-conglomerado-info mb-4">
                      <h6> Individuo Seleccionado:</h6>
                      <p><strong>ID:</strong> {formData.individuoSeleccionado.id}</p>
                      <p><strong>DAP:</strong> {formData.individuoSeleccionado.dap} cm</p>
                      <p><strong>Categoría:</strong> {formData.individuoSeleccionado.categoria}</p>
                      <p><strong>Azimut:</strong> {formData.individuoSeleccionado.azimut}°</p>
                      <p><strong>Distancia:</strong> {formData.individuoSeleccionado.distancia} m</p>
                      <p><strong>Subparcela:</strong> {formData.individuoSeleccionado.subparcela}</p>
                    </div>
                  )}

                  {/* MENSAJE DE ERROR SI NO SE SELECCIONA INDIVIDUO */}
                  {errors.individuoSeleccionado && (
                    <div className="alert alert-danger">{errors.individuoSeleccionado}</div>
                  )}

                  {/* BOTONES DE NAVEGACIÓN */}
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                      <i className="fas fa-arrow-left me-2"></i>Cambiar Subparcela
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={handleNext}
                      disabled={!formData.individuoSeleccionado}
                    >
                      Continuar <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* ========== PASO 3: REGISTRO DE MUESTRA ========== */}
              {step === 3 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3 className="text-success">Paso 3: Registro de Muestra</h3>
                    <p className="text-muted">
                      Complete la información de la muestra para el individuo seleccionado
                    </p>
                  </div>

                  {/* INFORMACIÓN DEL INDIVIDUO DE REFERENCIA */}
                  {formData.individuoSeleccionado && (
                    <div className="selected-conglomerado-info mb-4">
                      <h6> Individuo de Referencia:</h6>
                      <div className="row">
                        <div className="col-md-4">
                          <p><strong>ID:</strong> {formData.individuoSeleccionado.id}</p>
                          <p><strong>DAP:</strong> {formData.individuoSeleccionado.dap} cm</p>
                        </div>
                        <div className="col-md-4">
                          <p><strong>Categoría:</strong> {formData.individuoSeleccionado.categoria}</p>
                          <p><strong>Subparcela:</strong> {formData.individuoSeleccionado.subparcela}</p>
                        </div>
                        <div className="col-md-4">
                          <p><strong>Azimut:</strong> {formData.individuoSeleccionado.azimut}°</p>
                          <p><strong>Distancia:</strong> {formData.individuoSeleccionado.distancia} m</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SELECTOR DE TIPO DE MUESTRA */}
                  <div className="mb-4">
                    <label htmlFor="categoria" className="form-label">
                      <i className="fas fa-vial me-2"></i>Tipo de Muestra *
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className={`form-select form-select-lg ${errors.categoria ? "is-invalid" : ""}`}
                    >
                      <option value="">Seleccione tipo de muestra</option>
                      <option value="Muestras Fertiles">Muestras Fértiles</option>
                      <option value="Muestras Infertiles">Muestras Infértiles</option>
                    </select>
                    {errors.categoria && (
                      <div className="invalid-feedback">{errors.categoria}</div>
                    )}
                  </div>

                  {/* CARGA DE IMAGEN (OPCIONAL) */}
                  <div className="mb-4">
                    <label htmlFor="imagen" className="form-label">
                      <i className="fas fa-camera me-2"></i>
                      Imagen de la muestra (opcional)
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

                  {/* BOTONES DE ACCIÓN */}
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                      <i className="fas fa-arrow-left me-2"></i>Cambiar Individuo
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleAgregarMuestra}
                      disabled={!formData.categoria}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Agregar Muestra
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* COMPONENTES DE ESTADO */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                <strong>¡Muestra agregada!</strong> Puede continuar registrando más muestras en esta subparcela.
                <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
              </div>
            )}

            {serverError && (
              <div className="alert alert-danger mt-4" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {serverError}
              </div>
            )}

            {/* LISTA DE MUESTRAS REGISTRADAS (SOLO EN PASO 3) */}
            {step === 3 && muestrasRegistradas.length > 0 && (
              <div className="muestras-lista mt-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-vial me-2"></i>
                      Muestras Registradas en esta Sesión ({muestrasRegistradas.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {muestrasRegistradas.map((muestra, index) => (
                        <div key={muestra.id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <h6 className="card-title">Muestra {index + 1}</h6>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleEliminarMuestra(muestra.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                              <p className="mb-1"><strong>Tipo:</strong> {muestra.categoria}</p>
                              <p className="mb-1"><strong>Individuo ID:</strong> {muestra.individuo.id}</p>
                              <p className="mb-1"><strong>DAP:</strong> {muestra.individuo.dap} cm</p>
                              <p className="mb-1"><strong>Subparcela:</strong> {muestra.subparcela}</p>
                              {muestra.imagen && (
                                <p className="mb-1"><strong>Imagen:</strong> {muestra.imagen.name}</p>
                              )}
                              <small className="text-muted">{muestra.fechaRegistro}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-success btn-lg"
                        onClick={handleEnviarTodas}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Enviar {muestrasRegistradas.length} Registrar muestras
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroMuestra;