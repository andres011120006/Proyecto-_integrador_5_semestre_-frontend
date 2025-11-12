// Importa React para poder usar JSX y componentes funcionales
import React from "react";
// Importa el hook useNavigate de React Router para redirigir a otras rutas
import { useNavigate } from "react-router-dom";
// Importa los estilos CSS específicos del login
import "../assets/css/login.css";

// Componente funcional Login
const Login = () => {
  // Hook para manejar la navegación entre rutas
  const navigate = useNavigate();

  // Función que maneja el evento de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Obtiene los valores de los campos del formulario y elimina espacios al inicio y final
    const usuario = e.target.usuario.value.trim();
    const correo = e.target.correo.value.trim();
    const contrasena = e.target.contrasena.value.trim();

    // Validación: Verifica que todos los campos estén llenos
    if (!usuario || !correo || !contrasena) {
      alert("Por favor, llena todos los campos.");
      return; // Detiene la ejecución si falta algún campo
    }

    // Validación: Verifica que el correo contenga el carácter '@'
    if (!correo.includes("@")) {
      alert("El correo debe contener un '@'.");
      return;
    }

    // Validación de credenciales (ejemplo estático para pruebas)
    if (usuario === "juan" && correo === "juan@gmail.com" && contrasena === "123") {
      // Si las credenciales son correctas, redirige a la ruta "/inicio"
      navigate("/inicio");
    } else {
      // Si las credenciales no coinciden, muestra un mensaje de error
      alert("Usuario, correo o contraseña incorrectos.");
    }
  };

  // Retorna la estructura del formulario de login
  return (
    <div className="fon"> {/* Fondo principal del login */}
      <div className="login-container"> {/* Contenedor general */}
        
        {/* Caja del formulario */}
        <div className="login-form-box">
          <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">Inicio de sesión</h1>

            {/* Campo de usuario */}
            <div className="login-input-box">
              <input 
                type="text" 
                name="usuario" 
                id="usuario" 
                placeholder="Usuario" 
                required 
              />
              <i className="bx bxs-user"></i> {/* Ícono de usuario */}
            </div>

            {/* Campo de correo electrónico */}
            <div className="login-input-box">
              <input 
                type="text" 
                name="correo" 
                id="correo" 
                placeholder="Correo electrónico" 
                required 
              />
              <i className="bx bxs-envelope"></i> {/* Ícono de correo */}
            </div>

            {/* Campo de contraseña */}
            <div className="login-input-box">
              <input 
                type="password" 
                name="contrasena" 
                id="contrasena" 
                placeholder="Contraseña" 
                required 
              />
              <i className="bx bxs-lock-alt"></i> {/* Ícono de candado */}
            </div>

            {/* Botón para enviar el formulario */}
            <button type="submit" className="login-btn">Ingresar</button>
          </form>
        </div>

        {/* Panel lateral con mensaje de bienvenida */}
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

// Exporta el componente para que pueda ser utilizado en otras partes de la app
export default Login;
