// Navbar.js - Versión sin botón de dashboard
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/img/Ideam_(Colombia)_logo.png';
import ConglomeradoModal from './ConglomeradoModal';
import '../assets/css/nav.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [showConglomeradoModal, setShowConglomeradoModal] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
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
    window.location.reload();
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
              <a className="nav-link active px-2" href="/inicio">
                Inicio
              </a>
            </li>
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
                {/* Información del conglomerado - Más visible */}
                {userInfo.conglomerado && (
                  <li className="nav-item d-none d-lg-block">
                    <span 
                      className="nav-link conglomerado-info px-2"
                      title={`Conglomerado: ${userInfo.conglomerado.nombre}`}
                    >
                       Conglo:{userInfo.conglomerado.nombre}
                    </span>
                  </li>
                )}

                {/* Botón cambiar conglomerado - Más visible */}
                <li className="nav-item d-none d-lg-block">
                  <button 
                    className="nav-link btn btn-link px-2"
                    onClick={() => setShowConglomeradoModal(true)}
                    title="Cambiar conglomerado"
                  >
                     Cambiar
                  </button>
                </li>

                {/* Dropdown de usuario */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center px-2"
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
    </nav>
  );
};

export default Navbar;