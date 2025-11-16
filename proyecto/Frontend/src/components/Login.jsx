// Importa React para poder usar JSX y componentes funcionales
import React, { useState } from "react";
// Importa el hook useNavigate de React Router para redirigir a otras rutas
import { useNavigate } from "react-router-dom";
// Importa los estilos CSS específicos del login
import "../assets/css/login.css";

// Componente funcional Login
const Login = () => {
  // Hook para manejar la navegación entre rutas
  const navigate = useNavigate();
  
  // Estado para manejar el loading y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función que maneja el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Obtiene los valores de los campos del formulario y elimina espacios al inicio y final
    const usuario = e.target.usuario.value.trim();
    const contrasena = e.target.contrasena.value.trim();

    // Validación: Verifica que todos los campos estén llenos
    if (!usuario || !contrasena) {
      alert("Por favor, llena todos los campos.");
      return; // Detiene la ejecución si falta algún campo
    }

    setLoading(true);
    setError("");

    try {
      // Realizar la petición a la API para verificar el usuario
      const response = await fetch('http://localhost:4000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Si las credenciales son correctas, redirigir según el rol
        const userRole = data.rol;
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('userInfo', JSON.stringify({
          id: data.id_brigadista,
          nombre: usuario,
          rol: userRole,
          loggedIn: true,
          timestamp: new Date().toISOString()
        }));

        // Redirigir según el rol
        switch (userRole) {
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
        // Si las credenciales no coinciden, muestra un mensaje de error
        setError(data.message || "Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
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

            {/* Mostrar error si existe */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Campo de usuario */}
            <div className="login-input-box">
              <input 
                type="text" 
                name="usuario" 
                id="usuario" 
                placeholder="Usuario" 
                required 
                disabled={loading}
              />
              <i className="bx bxs-user"></i> {/* Ícono de usuario */}
            </div>

            {/* Campo de contraseña */}
            <div className="login-input-box">
              <input 
                type="password" 
                name="contrasena" 
                id="contrasena" 
                placeholder="Contraseña" 
                required 
                disabled={loading}
              />
              <i className="bx bxs-lock-alt"></i> {/* Ícono de candado */}
            </div>

            {/* Botón para enviar el formulario */}
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
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