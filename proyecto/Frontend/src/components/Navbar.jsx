import React from "react";
import logo from '../assets/img/Ideam_(Colombia)_logo.png';
import '../assets/css/nav.css';
const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow py-3"
      style={{ background: "linear-gradient(90deg, #00c9a7 0%, #009ffd 100%)" }}
    >
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/inicio">
          <img
            src={logo}
            alt="Logo"
            height="70"
            className="me-2"
          />
          Inventario Forestal Colombia
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/inicio">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/inicio#informacion">
                Información
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/inicio#formulario">
                Contacto
              </a>
            </li>
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