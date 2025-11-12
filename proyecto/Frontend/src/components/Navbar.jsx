// Importación de React
import React from "react";
// Importación del logo institucional
import logo from '../assets/img/Ideam_(Colombia)_logo.png';
// Importación de los estilos CSS del componente
import '../assets/css/nav.css';

// ======================== COMPONENTE NAVBAR ======================== //

/**
 * Componente: Navbar
 * Descripción:
 * Representa la barra de navegación principal del sitio.
 * Incluye el logotipo del IDEAM y enlaces de navegación hacia secciones
 * del portal del Inventario Forestal de Colombia.
 */
const Navbar = () => {
  return (
    // Elemento principal <nav> con clases de Bootstrap y estilos personalizados
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow py-3"
      style={{
        background: "linear-gradient(90deg, #00c9a7 0%, #009ffd 100%)", // Degradado azul-verde
      }}
    >
      {/* Contenedor Bootstrap que centra el contenido */}
      <div className="container">
        {/* Marca y logo institucional (enlace a la página de inicio) */}
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/inicio">
          <img
            src={logo}           // Imagen importada como logo
            alt="Logo"           // Texto alternativo
            height="70"          // Altura del logo
          />
          {/* Texto del título institucional */}
          Inventario Forestal Colombia
        </a>

        {/* Botón para menú colapsable en pantallas pequeñas  */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"   // Habilita la animación de colapso de Bootstrap
          data-bs-target="#navbarNav" // ID del contenedor colapsable
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {/* Icono del botón hamburguesa */}
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor del menú colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Lista de enlaces de navegación alineados a la derecha (ms-auto) */}
          <ul className="navbar-nav ms-auto">
            
            {/* Enlace a la página principal */}
            <li className="nav-item">
              <a className="nav-link active" href="/inicio">
                Inicio
              </a>
            </li>

            {/* Enlace a la sección de información */}
            <li className="nav-item">
              <a className="nav-link" href="/inicio#informacion">
                Información
              </a>
            </li>

            {/* Enlace a la sección de contacto */}
            <li className="nav-item">
              <a className="nav-link" href="/inicio#formulario">
                Contacto
              </a>
            </li>

            {/* Enlace a la sección de recursos */}
            <li className="nav-item">
              <a className="nav-link" href="/inicio#recursos">
                Recursos
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
