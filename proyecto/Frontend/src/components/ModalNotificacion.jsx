import React, { useState, useEffect } from "react";
import axios from "axios";
import "./notificaciones.css";

const ModalNotificacion = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificacionActual, setNotificacionActual] = useState(null);

  // Cargar notificaciones del usuario logueado
  const cargarNotificaciones = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.usuario) return;

      console.log('🔄 Cargando notificaciones para:', userInfo.usuario);

      const response = await axios.get(
        `http://localhost:4000/api/notificaciones/pendientes/${userInfo.usuario}`
      );
      
      if (response.data.success) {
        console.log('📬 Notificaciones cargadas:', response.data.data.length);
        setNotificaciones(response.data.data);
        
        // Mostrar la primera notificación si hay pendientes
        if (response.data.data.length > 0 && !mostrarModal) {
          console.log('🎯 Mostrando notificación automáticamente');
          setNotificacionActual(response.data.data[0]);
          setMostrarModal(true);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error);
    }
  };

  // Confirmar notificación
  const confirmarNotificacion = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      console.log('✅ Confirmando notificación:', notificacionActual.id);

      const response = await axios.post('http://localhost:4000/api/notificaciones/confirmar', {
        notificacion_id: notificacionActual.id,
        usuario: userInfo.usuario
      });

      if (response.data.success) {
        console.log('👍 Notificación confirmada exitosamente');
        
        // Quitar la notificación confirmada de la lista
        const nuevasNotificaciones = notificaciones.filter(n => n.id !== notificacionActual.id);
        setNotificaciones(nuevasNotificaciones);
        
        // Mostrar siguiente notificación o cerrar modal
        if (nuevasNotificaciones.length > 0) {
          console.log('➡️ Mostrando siguiente notificación');
          setNotificacionActual(nuevasNotificaciones[0]);
        } else {
          console.log('🎉 Todas las notificaciones confirmadas');
          setMostrarModal(false);
          setNotificacionActual(null);
        }
      }
    } catch (error) {
      console.error('❌ Error confirmando notificación:', error);
      alert('Error al confirmar notificación. Intente nuevamente.');
    }
  };

  // Cargar notificaciones al iniciar el componente
  useEffect(() => {
    cargarNotificaciones();
    
    // Verificar cada 30 segundos si hay nuevas notificaciones
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // Si no hay modal que mostrar, no renderizar nada
  if (!mostrarModal || !notificacionActual) {
    return null;
  }

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
            onClick={confirmarNotificacion}
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

export default ModalNotificacion;