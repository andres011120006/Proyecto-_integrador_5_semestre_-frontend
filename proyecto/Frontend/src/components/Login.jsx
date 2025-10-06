import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuario = e.target.usuario.value.trim();
    const correo = e.target.correo.value.trim();
    const contrasena = e.target.contrasena.value.trim();

    if (!usuario || !correo || !contrasena) {
      alert("Por favor, llena todos los campos.");
      return;
    }

    if (!correo.includes("@")) {
      alert("El correo debe contener un '@'.");
      return;
    }

    if (usuario === "juan" && correo === "juan@gmail.com" && contrasena === "123") {
      navigate("/inicio");
    } else {
      alert("Usuario, correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="fon">
      <div className="login-container">
        <div className="login-form-box">
          <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">Inicio de sesión</h1>

            <div className="login-input-box">
              <input type="text" name="usuario" id="usuario" placeholder="Usuario" required />
              <i className="bx bxs-user"></i>
            </div>

            <div className="login-input-box">
              <input type="text" name="correo" id="correo" placeholder="Correo electrónico" required />
              <i className="bx bxs-envelope"></i>
            </div>

            <div className="login-input-box">
              <input type="password" name="contrasena" id="contrasena" placeholder="Contraseña" required />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <button type="submit" className="login-btn">Ingresar</button>
          </form>
        </div>

        <div className="login-toggle-box">
          <div className="login-toggle-panel login-toggle-left">
            <h1>Bienvenido al IFN</h1>
            <p>A continuación inicie sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;