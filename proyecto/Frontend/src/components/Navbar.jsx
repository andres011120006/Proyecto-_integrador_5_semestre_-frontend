import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/img/Ideam_(Colombia)_logo.png';
import ConglomeradoModal from './ConglomeradoModal';
import '../assets/css/nav.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [showConglomeradoModal, setShowConglomeradoModal] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);
  const [loadingConglomerado, setLoadingConglomerado] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // Cargar conglomerado automáticamente al iniciar sesión
  const cargarConglomeradoAutomatico = async () => {
    if (!userInfo.nombre || userInfo.conglomerado || loadingConglomerado) return;

    try {
      setLoadingConglomerado(true);
      const response = await axios.get(
        `http://localhost:4000/api/conglomerados/usuario/${userInfo.nombre}`
      );
      
      if (response.data.success && response.data.data.length > 0) {
        const conglomerado = response.data.data[0];
        
        // Actualizar userInfo en localStorage
        const userInfoActualizado = {
          ...userInfo,
          conglomerado: conglomerado
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfoActualizado));
        
        // Forzar actualización del componente
        window.dispatchEvent(new Event('storage'));
        console.log("Conglomerado cargado automáticamente:", conglomerado.nombre);
      }
    } catch (error) {
      console.error('Error cargando conglomerado automáticamente:', error);
    } finally {
      setLoadingConglomerado(false);
    }
  };

  // Cargar notificaciones automáticamente
  const cargarNotificaciones = async () => {
    try {
      const usuarioParaBuscar = userInfo?.usuario || userInfo?.nombre;
      
      if (!usuarioParaBuscar) return;

      setLoadingNotificaciones(true);
      const response = await axios.get(
        `http://localhost:4000/api/notificaciones/pendientes/${usuarioParaBuscar}`
      );
      
      if (response.data.success) {
        setNotificaciones(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setNotificaciones([]);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  // Confirmar notificación
  const confirmarNotificacion = async (notificacionId) => {
    try {
      const usuarioParaConfirmar = userInfo?.usuario || userInfo?.nombre;
      
      const response = await axios.post('http://localhost:4000/api/notificaciones/confirmar', {
        notificacion_id: notificacionId,
        usuario: usuarioParaConfirmar
      });

      if (response.data.success) {
        // Actualizar lista local
        setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
      }
    } catch (error) {
      console.error('Error confirmando notificación:', error);
    }
  };

  // Cargar conglomerado y notificaciones al iniciar
  useEffect(() => {
    if (userInfo.nombre) {
      cargarConglomeradoAutomatico();
      cargarNotificaciones();
      const intervalo = setInterval(cargarNotificaciones, 30000);
      return () => clearInterval(intervalo);
    }
  }, [userInfo.nombre]);

  // Escuchar cambios en el localStorage para actualizar el conglomerado
  useEffect(() => {
    const handleStorageChange = () => {
      // El componente se actualizará automáticamente cuando cambie el localStorage
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const redirectToDashboard = () => {
    if (userInfo.rol) {
      switch (userInfo.rol) {
        case 'botanico':
          navigate("/botanico_dashboard");
          break;
        case 'jefe de brigada':
          navigate("/jefe_brigada_dashboard");
          break;
        case 'brigadista':
          navigate("/brigadista_dashboard");
          break;
        default:
          navigate("/inicio");
      }
    } else {
      navigate("/inicio");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate("/");
  };

  const handleConglomeradoSelected = (conglomerado) => {
    console.log("Conglomerado actualizado:", conglomerado);
    
    // Actualizar userInfo en localStorage
    const userInfoActualizado = {
      ...userInfo,
      conglomerado: conglomerado
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfoActualizado));
    
    // Forzar actualización del componente
    window.dispatchEvent(new Event('storage'));
    
    setShowConglomeradoModal(false);
  };

  // Formatear fecha relativa
  const formatearFechaRelativa = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = ahora - fechaNotif;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    
    return fechaNotif.toLocaleDateString('es-ES');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow py-2"
      style={{
        background: "linear-gradient(90deg, #00c9a7 0%, #009ffd 100%)",
      }}
    >
      <div className="container-fluid px-3">
        
        {/* Logo y marca */}
        <a className="navbar-brand d-flex align-items-center fw-bold me-3" href="/inicio">
          <img
            src={logo}
            alt="Logo IDEAM"
            height="50"
            className="me-2"
          />
          <span className="d-none d-md-inline">Inventario Forestal</span>
          <span className="d-inline d-md-none">IFN Colombia</span>
        </a>

        {/* Botón para menú colapsable */}
        <button
          className="navbar-toggler border-0 py-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor del menú colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* Navegación principal */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link px-2" href="/inicio#informacion">
                Información
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2" href="/inicio#formulario">
                Contacto
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2" href="/inicio#recursos">
                Recursos
              </a>
            </li>
          </ul>

          {/* Sección de usuario */}
          <ul className="navbar-nav ms-2">
            
            {/* Usuario NO logueado */}
            {!userInfo.nombre && (
              <li className="nav-item">
                <a className="nav-link px-2" href="/">
                   Iniciar Sesión
                </a>
              </li>
            )}

            {/* Usuario LOGUEADO */}
            {userInfo.nombre && (
              <>
                {/* Información del conglomerado - Se carga automáticamente */}
                {userInfo.conglomerado ? (
                  <li className="nav-item d-none d-lg-block">
                    <span 
                      className="nav-link conglomerado-info px-3"
                      title={`Conglomerado: ${userInfo.conglomerado.nombre}`}
                    >
                      {loadingConglomerado ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          Cargando...
                        </>
                      ) : (
                        <>
                          📍 {userInfo.conglomerado.nombre}
                        </>
                      )}
                    </span>
                  </li>
                ) : (
                  // Mostrar estado de carga si no hay conglomerado
                  <li className="nav-item d-none d-lg-block">
                    <span 
                      className="nav-link conglomerado-info px-3"
                      title="Cargando conglomerado..."
                    >
                      {loadingConglomerado ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          Cargando ubicación...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-map-marker-alt me-1"></i>
                          Sin ubicación
                        </>
                      )}
                    </span>
                  </li>
                )}

                {/* Botón cambiar conglomerado */}
                <li className="nav-item d-none d-lg-block">
                  <button 
                    className="nav-link btn btn-link px-2"
                    onClick={() => setShowConglomeradoModal(true)}
                    title="Cambiar conglomerado"
                    disabled={loadingConglomerado}
                  >
                    {loadingConglomerado ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    ) : (
                      <> Cambiar conglo</>
                    )}
                  </button>
                </li>

                {/* Campana de notificaciones */}
                <li className="nav-item dropdown position-static">
                  <button 
                    className="nav-link btn btn-link position-relative px-2"
                    onClick={() => setShowNotificaciones(!showNotificaciones)}
                    title="Notificaciones"
                  >
                    <i className="fas fa-bell"></i>
                    {notificaciones.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {notificaciones.length}
                        <span className="visually-hidden">notificaciones pendientes</span>
                      </span>
                    )}
                  </button>

                  {/* Dropdown de notificaciones - Position absolute para mejor visualización */}
                  {showNotificaciones && (
                    <div className="dropdown-menu dropdown-menu-end show notificaciones-dropdown position-absolute">
                      <div className="dropdown-header d-flex justify-content-between align-items-center">
                        <strong>Notificaciones</strong>
                        {notificaciones.length > 0 && (
                          <span className="badge bg-primary">{notificaciones.length}</span>
                        )}
                      </div>
                      
                      {loadingNotificaciones ? (
                        <div className="dropdown-item text-center py-3">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <span className="ms-2">Cargando...</span>
                        </div>
                      ) : notificaciones.length === 0 ? (
                        <div className="dropdown-item text-center py-3 text-muted">
                          <i className="fas fa-bell-slash me-2"></i>
                          No hay notificaciones
                        </div>
                      ) : (
                        <div className="notificaciones-list">
                          {notificaciones.map((notificacion) => (
                            <div key={notificacion.id} className="dropdown-item notificacion-item p-3">
                              <div className="d-flex w-100 justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                                    <h6 className="mb-0 text-danger">{notificacion.categoria}</h6>
                                  </div>
                                  <p className="mb-2 small text-dark">{notificacion.descripcion}</p>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      {notificacion.conglomerado_nombre} • 
                                      {formatearFechaRelativa(notificacion.fecha_creacion)}
                                    </small>
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => confirmarNotificacion(notificacion.id)}
                                      title="Confirmar recepción"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item">
                        <button 
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={cargarNotificaciones}
                        >
                          <i className="fas fa-sync-alt me-2"></i>
                          Actualizar
                        </button>
                      </div>
                    </div>
                  )}
                </li>

                {/* Dropdown de usuario */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center px-3"
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <span className="user-info-compact">
                      <span className="d-none d-sm-inline">{userInfo.nombre}</span>
                      <span className="d-inline d-sm-none">👤</span>
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    
                    {/* Información del usuario en dropdown */}
                    <li className="dropdown-header small">
                      Información de usuario
                    </li>
                    <li>
                      <span className="dropdown-item-text small py-1">
                        <strong>Usuario:</strong> {userInfo.nombre}
                      </span>
                    </li>
                    <li>
                      <span className="dropdown-item-text small py-1">
                        <strong>Rol:</strong> {userInfo.rol}
                      </span>
                    </li>
                    {userInfo.conglomerado && (
                      <li>
                        <span className="dropdown-item-text small py-1">
                          <strong>Conglomerado:</strong> {userInfo.conglomerado.nombre}
                        </span>
                      </li>
                    )}
                    
                    <li><hr className="dropdown-divider my-1" /></li>
                    
                    {/* Acciones en dropdown */}
                    <li>
                      <button 
                        className="dropdown-item py-2"
                        onClick={redirectToDashboard}
                      >
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Mi Dashboard
                      </button>
                    </li>
                    
                    <li>
                      <button 
                        className="dropdown-item py-2"
                        onClick={() => setShowConglomeradoModal(true)}
                      >
                        <i className="fas fa-map me-2"></i>
                        Cambiar Conglomerado
                      </button>
                    </li>
                    
                    <li><hr className="dropdown-divider my-1" /></li>
                    
                    {/* Cerrar sesión */}
                    <li>
                      <button 
                        className="dropdown-item text-danger py-2"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Modal para selección de conglomerado */}
      <ConglomeradoModal 
        show={showConglomeradoModal}
        onClose={() => setShowConglomeradoModal(false)}
        usuario={userInfo.nombre}
        onConglomeradoSelected={handleConglomeradoSelected}
      />

      {/* Overlay para cerrar notificaciones al hacer click fuera */}
      {showNotificaciones && (
        <div 
          className="notificaciones-overlay"
          onClick={() => setShowNotificaciones(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;