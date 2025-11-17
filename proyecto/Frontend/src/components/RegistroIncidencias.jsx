// Importar dependencias de React y otras librerías
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../assets/css/registroCon.css';

// Componente Modal de Notificación (integrado directamente)
const ModalNotificacion = ({ notificaciones, onConfirmar, onClose }) => {
  const [notificacionActual, setNotificacionActual] = useState(null);

  useEffect(() => {
    if (notificaciones.length > 0) {
      setNotificacionActual(notificaciones[0]);
    }
  }, [notificaciones]);

  const handleConfirmar = () => {
    if (notificacionActual) {
      onConfirmar(notificacionActual.id);
      const nuevasNotificaciones = notificaciones.filter(n => n.id !== notificacionActual.id);
      if (nuevasNotificaciones.length > 0) {
        setNotificacionActual(nuevasNotificaciones[0]);
      } else {
        onClose();
      }
    }
  };

  if (!notificacionActual) return null;

  return (
    <div className="modal-notificacion-overlay">
      <div className="modal-notificacion-content">
        
        {/* Header con título de alerta */}
        <div className="modal-header alert alert-danger mb-0">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
            <div>
              <h5 className="mb-0">🚨 INCIDENCIA MAYOR REPORTADA</h5>
              <small>Notificación importante del sistema</small>
            </div>
          </div>
        </div>
        
        {/* Cuerpo de la notificación */}
        <div className="modal-body">
          <div className="notificacion-info">
            
            <div className="info-item">
              <strong><i className="fas fa-tag me-2"></i>Categoría:</strong>
              <span className="badge bg-danger">{notificacionActual.categoria}</span>
            </div>
            
            <div className="info-item">
              <strong><i className="fas fa-map-marker-alt me-2"></i>Conglomerado:</strong>
              <span>{notificacionActual.conglomerado_nombre}</span>
            </div>
            
            <div className="info-item">
              <strong><i className="fas fa-user me-2"></i>Reportado por:</strong>
              <span>{notificacionActual.usuario_creador}</span>
            </div>
            
            <div className="info-item">
              <strong><i className="fas fa-clock me-2"></i>Fecha y hora:</strong>
              <span>
                {new Date(notificacionActual.fecha_creacion).toLocaleString('es-ES')}
              </span>
            </div>
            
            {/* Descripción de la incidencia */}
            <div className="info-item descripcion mt-3">
              <strong><i className="fas fa-align-left me-2"></i>Descripción de la incidencia:</strong>
              <div className="descripcion-texto">
                {notificacionActual.descripcion}
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer con botón de confirmación */}
        <div className="modal-footer">
          <button 
            className="btn btn-success btn-lg w-100 py-3"
            onClick={handleConfirmar}
          >
            <i className="fas fa-check-circle me-2"></i>
            CONFIRMAR RECEPCIÓN DE LA NOTIFICACIÓN
          </button>
          
          {/* Información adicional */}
          <div className="notificacion-advertencia mt-3">
            <div className="alert alert-warning mb-0">
              <i className="fas fa-exclamation-circle me-2"></i>
              <strong>Importante:</strong> Esta notificación permanecerá activa hasta que confirme su recepción.
            </div>
          </div>

          {/* Contador de notificaciones restantes */}
          {notificaciones.length > 1 && (
            <div className="contador-restantes mt-2">
              <small className="text-muted">
                <i className="fas fa-inbox me-1"></i>
                {notificaciones.length - 1} notificación(es) adicional(es) pendiente(s)
              </small>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Definir el componente funcional RegistroIncidencias
const RegistroIncidencias = () => {
  // Obtener información del usuario desde localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // VERIFICAR LA INFORMACIÓN DEL USUARIO (usando la misma estructura que el navbar)
  console.log("🔍 UserInfo en RegistroIncidencias:", userInfo);
  console.log("👤 Nombre del usuario:", userInfo.nombre);
  console.log("📍 Conglomerado:", userInfo.conglomerado);

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    conglomerado: userInfo.conglomerado?.nombre || "", // Tomar automáticamente del usuario
    categoria: "",
    descripcion: ""
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});
  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState(false);
  // Estado para manejar el estado de carga durante el envío
  const [loading, setLoading] = useState(false);

  // Estados para el sistema de notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarModalNotificacion, setMostrarModalNotificacion] = useState(false);

  // Definir las categorías de incidencia disponibles
  const categoriasIncidencia = [
    {
      id: "menor",
      nombre: "Incidencia Menor",
      descripcion: "No pone en riesgo la vida o integridad de la brigada y no interfiere en la exploración"
    },
    {
      id: "mayor",
      nombre: "Incidencia Mayor",
      descripcion: "Pone en peligro la integridad o vida de la brigada o no permite continuar con la exploración"
    }
  ];

  // Cargar notificaciones del usuario
  const cargarNotificaciones = async () => {
    try {
      // USAR userInfo.nombre EN VEZ DE userInfo.usuario
      if (!userInfo.nombre) {
        console.log('⚠️ No hay usuario logueado');
        return;
      }

      console.log('🔄 Cargando notificaciones para:', userInfo.nombre);

      const response = await axios.get(
        `http://localhost:4000/api/notificaciones/pendientes/${userInfo.nombre}`
      );
      
      if (response.data.success) {
        console.log(`📬 Notificaciones cargadas: ${response.data.data.length}`);
        setNotificaciones(response.data.data);
        
        // Mostrar modal si hay notificaciones pendientes
        if (response.data.data.length > 0) {
          console.log('🎯 Mostrando modal de notificaciones');
          setMostrarModalNotificacion(true);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error);
      // Si hay error, mostrar notificaciones vacías pero no fallar
      setNotificaciones([]);
    }
  };

  // Confirmar notificación
  const confirmarNotificacion = async (notificacionId) => {
    try {
      // USAR userInfo.nombre EN VEZ DE userInfo.usuario
      const response = await axios.post('http://localhost:4000/api/notificaciones/confirmar', {
        notificacion_id: notificacionId,
        usuario: userInfo.nombre // ← CORREGIDO
      });

      if (response.data.success) {
        console.log('✅ Notificación confirmada:', notificacionId);
      } else {
        console.error('❌ Error en respuesta de confirmación:', response.data);
      }
    } catch (error) {
      console.error('❌ Error confirmando notificación:', error);
    }
  };

  // Cargar notificaciones al iniciar el componente
  useEffect(() => {
    cargarNotificaciones();
    
    // Verificar notificaciones cada 30 segundos
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar error del campo cuando el usuario empiece a escribir/seleccionar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Función de validación del formulario
  const validate = () => {
    let newErrors = {};

    // Validar que el usuario tenga un conglomerado asignado
    if (!formData.conglomerado.trim()) {
      newErrors.conglomerado = "No tiene un conglomerado asignado. Contacte al administrador.";
    }

    // Validar que se haya seleccionado una categoría
    if (!formData.categoria.trim()) {
      newErrors.categoria = "Debe seleccionar una categoría de incidencia";
    }

    // Validar la descripción (requerida y longitud mínima)
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "Debe ingresar una descripción de la incidencia";
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      try {
        // Preparar datos para enviar al servidor (MongoDB)
        const incidenciaData = {
          nombre_conglomerado: formData.conglomerado,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          fecha_registro: new Date().toISOString()
        };

        console.log("📤 Enviando incidencia a Mongo:", incidenciaData);

        // Enviar datos de la incidencia al backend (API de incidencias en puerto 5000)
        const response = await axios.post(
          "http://localhost:5000/api/incidencias",
          incidenciaData
        );

        console.log("✅ Respuesta del servidor:", response.data);

        // SI ES UNA INCIDENCIA MAYOR, CREAR NOTIFICACIÓN PARA LOS BRIGADISTAS
        if (formData.categoria === "mayor" && userInfo.conglomerado) {
          try {
            // USAR userInfo.nombre EN VEZ DE userInfo.usuario
            const notificacionData = {
              categoria: "Incidencia Mayor",
              descripcion: formData.descripcion,
              conglomerado_id: userInfo.conglomerado.id,
              usuario_creador: userInfo.nombre // ← CORREGIDO
            };

            console.log("🚨 Creando notificación para brigadistas:", notificacionData);

            const notificacionResponse = await axios.post(
              "http://localhost:4000/api/notificaciones/incidencia-mayor",
              notificacionData
            );

            if (notificacionResponse.data.success) {
              console.log("✅ Notificación enviada a brigadistas:", notificacionResponse.data);
            } else {
              console.error("❌ Error en notificación:", notificacionResponse.data);
            }
          } catch (notificacionError) {
            console.error("❌ Error enviando notificación:", notificacionError);
            // No fallar el registro principal si la notificación falla
          }
        }

        // Mostrar notificación de éxito
        setSuccess(true);

        // Limpiar formulario después del envío exitoso (mantener el conglomerado)
        setFormData({
          ...formData,
          categoria: "",
          descripcion: ""
        });
        setErrors({});

        // Ocultar notificación después de 5 segundos
        setTimeout(() => setSuccess(false), 5000);

      } catch (error) {
        console.error("❌ Error al registrar incidencia:", error);
        setErrors({
          submit: "Error al registrar la incidencia. Intente nuevamente."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para obtener la descripción de la categoría seleccionada
  const getCategoriaDescripcion = () => {
    const categoria = categoriasIncidencia.find(c => c.id === formData.categoria);
    return categoria ? categoria.descripcion : "";
  };

  // Función para obtener el nombre de la categoría seleccionada
  const getCategoriaNombre = () => {
    const categoria = categoriasIncidencia.find(c => c.id === formData.categoria);
    return categoria ? categoria.nombre : "";
  };

  // Renderizado del componente
  return (
    <div className="registroCon-container my-5" role="main" aria-labelledby="formTitle">
      
      {/* Modal de Notificaciones */}
      {mostrarModalNotificacion && (
        <ModalNotificacion 
          notificaciones={notificaciones}
          onConfirmar={confirmarNotificacion}
          onClose={() => setMostrarModalNotificacion(false)}
        />
      )}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* HEADER CON INFORMACIÓN DEL CONGLOMERADO */}
            <div className="arbol-header text-center mb-4">
              <h1 id="formTitle" className="display-5 fw-bold text-gradient">Registro de Incidencias</h1>
              {userInfo.conglomerado && (
                <div className="conglomerado-badge">
                  <span className="badge bg-primary fs-6">
                    📍 Conglomerado: {userInfo.conglomerado.nombre}
                  </span>
                </div>
              )}
            </div>

            <div className="registroCon-instructions mb-4">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Información importante:</strong> Complete el siguiente formulario para registrar una incidencia en el trabajo de campo. 
                {formData.categoria === "mayor" && (
                  <span className="text-danger fw-bold">
                    {" "}Las incidencias mayores notificarán automáticamente a todos los brigadistas del conglomerado.
                  </span>
                )}
              </div>
            </div>

            {/* INFORMACIÓN DEL CONGLOMERADO ASIGNADO */}
            {formData.conglomerado && (
              <div className="conglomerado-info-card mb-4">
                <div className="card border-primary">
                  <div className="card-body">
                    <h4 className="card-title text-primary">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Conglomerado Asignado
                    </h4>
                    <p className="card-text mb-0">
                      <strong>Nombre:</strong> {formData.conglomerado}
                    </p>
                    <small className="text-muted">
                      {formData.categoria === "mayor" ? (
                        <span className="text-danger">
                          <i className="fas fa-bell me-1"></i>
                          Las incidencias mayores notificarán a todos los brigadistas de este conglomerado.
                        </span>
                      ) : (
                        "Esta incidencia se registrará automáticamente para este conglomerado."
                      )}
                    </small>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="registroCon-form">
              
              {/* Campo: Categoría de Incidencia */}
              <div className="form-group mb-4">
                <label htmlFor="categoria" className="registroCon-label">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Categoría de Incidencia <span className="registroCon-required">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`registroCon-select form-select-lg ${
                    errors.categoria ? "is-invalid" : formData.categoria ? "is-valid" : ""
                  }`}
                >
                  <option value="">Seleccione una categoría</option>
                  {categoriasIncidencia.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <div className="invalid-feedback">{errors.categoria}</div>
                )}
                {formData.categoria && (
                  <div className={`form-text ${formData.categoria === "mayor" ? "text-danger fw-bold" : "text-info"}`}>
                    <i className={`fas ${formData.categoria === "mayor" ? "fa-bell" : "fa-info-circle"} me-1`}></i>
                    {getCategoriaDescripcion()}
                    {formData.categoria === "mayor" && " Se notificará a todos los brigadistas del conglomerado."}
                  </div>
                )}
              </div>

              {/* Campo: Descripción */}
              <div className="form-group mb-4">
                <label htmlFor="descripcion" className="registroCon-label">
                  <i className="fas fa-align-left me-2"></i>
                  Descripción de la Incidencia <span className="registroCon-required">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="5"
                  className={`registroCon-textarea form-control ${
                    errors.descripcion ? "is-invalid" : formData.descripcion ? "is-valid" : ""
                  }`}
                  placeholder="Describa detalladamente la incidencia ocurrida durante el trabajo de campo..."
                  disabled={loading}
                />
                {errors.descripcion && (
                  <div className="invalid-feedback">{errors.descripcion}</div>
                )}
                <div className="form-text">
                  Mínimo 10 caracteres. Sea específico en la descripción de lo ocurrido.
                  {formData.descripcion && (
                    <span className={`ms-2 ${formData.descripcion.length < 10 ? 'text-danger' : 'text-success'}`}>
                      ({formData.descripcion.length}/10 caracteres)
                    </span>
                  )}
                </div>
              </div>

              {/* Información de categorías - CARDS AGREGADAS AQUÍ */}
              <div className="categorias-info mb-4">
                <h6 className="mb-3">
                  <i className="fas fa-clipboard-list me-2"></i>
                  Información sobre categorías de incidencias:
                </h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card border-warning h-100">
                      <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Incidencias Menores
                        </h6>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Definición:</strong> No ponen en riesgo la vida o integridad y no interfieren en la exploración.
                        </p>
                        <p className="card-text mb-0">
                          <strong>Ejemplos:</strong>
                          <ul className="small mb-0 mt-2">
                            <li>Condición climática adversa</li>
                            <li>Fallas en herramientas (GPS, brújula)</li>
                            <li>Problemas de comunicación</li>
                            <li>Equipo de protección personal dañado</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card border-danger h-100">
                      <div className="card-header bg-danger text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-skull-crossbones me-2"></i>
                          Incidencias Mayores
                        </h6>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Definición:</strong> Ponen en peligro la integridad o vida de la brigada o no permiten continuar con la exploración.
                        </p>
                        <p className="card-text mb-0">
                          <strong>Ejemplos:</strong>
                          <ul className="small mb-0 mt-2">
                            <li>Lesiones graves o accidentes</li>
                            <li>Presencia de grupos armados</li>
                            <li>Animales peligrosos</li>
                            <li>Fallas geológicas o deslizamientos</li>
                            <li>Condiciones climáticas extremas</li>
                          </ul>
                        </p>
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-danger">
                            <i className="fas fa-bell me-1"></i>
                            <strong>Notificación automática:</strong> Se notificará a todos los brigadistas del conglomerado.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="registroCon-buttons mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading || !formData.conglomerado}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Registrar Incidencia
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg ms-3"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      categoria: "",
                      descripcion: ""
                    });
                    setErrors({});
                  }}
                  disabled={loading}
                >
                  <i className="fas fa-broom me-2"></i>
                  Limpiar Formulario
                </button>
              </div>

              {errors.submit && (
                <div className="alert alert-danger mt-3" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}

              {errors.conglomerado && (
                <div className="alert alert-warning mt-3" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.conglomerado}
                </div>
              )}
            </form>

            {/* Notificación de éxito */}
            {success && (
              <div className="alert alert-success mt-4" role="alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle fa-2x me-3"></i>
                  <div>
                    <h5 className="alert-heading mb-1">¡Incidencia registrada exitosamente!</h5>
                    <p className="mb-0">
                      La incidencia <strong>{getCategoriaNombre()}</strong> ha sido guardada para el conglomerado <strong>{formData.conglomerado}</strong>.
                      {formData.categoria === "mayor" && (
                        <span className="text-success d-block mt-1">
                          <i className="fas fa-bell me-1"></i>
                          Se han notificado a todos los brigadistas del conglomerado.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje si no hay conglomerado asignado */}
            {!formData.conglomerado && (
              <div className="alert alert-warning mt-4" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>No tiene un conglomerado asignado.</strong> Para registrar incidencias, primero debe seleccionar un conglomerado en su perfil.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportar el componente como default
export default RegistroIncidencias;