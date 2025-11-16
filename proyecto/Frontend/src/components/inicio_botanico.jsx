import React, { useState } from "react";
import carrusel1 from '../assets/img/niels-van-altena-baUqXWWvN1c-unsplash.jpg'
import carrusel2 from '../assets/img/robin-noguier-CZJp1S4bZos-unsplash.jpg'
import carrusel3 from '../assets/img/urban-vintage-78A265wPiO4-unsplash.jpg'
import card1 from '../assets/img/logo_incidencia_2.png'
import card2 from '../assets/img/pexels-mahima-518693-1250260.jpg'
import card3 from '../assets/img/matthew-smith-Rfflri94rs8-unsplash.jpg'
import card4 from '../assets/img/lukas-blazek-mcSDtbWXUZU-unsplash.jpg'
import '../assets/css/iniciocon.css';

/**
 * InicioCon Component - Página principal del Inventario Forestal Nacional
 * 
 * Componente que representa la página de inicio del sistema de Inventario Forestal Nacional
 * de Colombia. Incluye secciones hero, carrusel de imágenes, información institucional,
 * tarjetas de navegación y formulario de contacto para colaboradores.
 * 
 * @component
 * @version 1.0.0
 * @author Mariana Ruales Diaz y An
 
 */
const InicioCon = () => {
    // Estado para almacenar los datos del formulario de contacto
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        institucion: "",
        interes: "",
        mensaje: "",
    });

    // Estado para manejar los errores de validación del formulario
    const [errors, setErrors] = useState({});
    
    // Estado para controlar la visualización del mensaje de éxito
    const [success, setSuccess] = useState(false);

    /**
     * Maneja los cambios en los campos del formulario
     * @param {Object} e - Evento del input change
     */
    const handleChange = (e) => {
        // Extrae el id y value del elemento que disparó el evento
        const { id, value } = e.target;
        
        // Actualiza el estado del formulario manteniendo los valores existentes
        setFormData({ ...formData, [id]: value });
        
        // Limpia el error específico del campo cuando el usuario comienza a escribir
        setErrors({ ...errors, [id]: "" });
    };

    /**
     * Valida los datos del formulario antes del envío
     * @returns {Object} Objeto con los errores de validación encontrados
     */
    const validate = () => {
        let newErrors = {};
        
        // Expresión regular para validación de formato de email
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validación de campo nombre: requerido y no vacío
        if (!formData.nombre.trim())
            newErrors.nombre = "Por favor ingresa tu nombre completo";

        // Validación de campo email: formato válido requerido
        if (!emailRegex.test(formData.email))
            newErrors.email = "Por favor ingresa un email válido";

        // Validación de campo interés: selección requerida
        if (!formData.interes)
            newErrors.interes = "Por favor selecciona un área de interés";

        // Validación de campo mensaje: requerido y no vacío
        if (!formData.mensaje.trim())
            newErrors.mensaje = "Por favor ingresa tu mensaje";

        return newErrors;
    };

    /**
     * Maneja el envío del formulario de contacto
     * @param {Object} e - Evento de submit del formulario
     */
    const handleSubmit = (e) => {
        // Previene el comportamiento por defecto del formulario
        e.preventDefault();
        
        // Ejecuta la validación y obtiene los errores
        const validationErrors = validate();

        // Si hay errores de validación, los muestra y detiene el envío
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Si no hay errores, procede con el envío exitoso
            setErrors({});
            setSuccess(true);
            
            // Resetea el formulario a valores vacíos
            setFormData({
                nombre: "",
                email: "",
                telefono: "",
                institucion: "",
                interes: "",
                mensaje: "",
            });

            // Oculta el mensaje de éxito después de 5 segundos
            setTimeout(() => setSuccess(false), 5000);
        }
    };

    return (
        <div>
            {/* Sección Hero: Encabezado principal de la página */}
            <section id="inicio" className="hero-section text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* Título principal con animación de entrada */}
                            <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
                                Inventario Forestal Nacional de Colombia
                            </h1>
                            {/* Descripción con animación de entrada */}
                            <p className="lead mb-4 animate__animated animate__fadeInUp">
                                Monitoreo y conservación de nuestros recursos forestales para
                                un futuro sostenible y ecológico
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección Carrusel: Galería de imágenes  */}
            <section
                id="carouselExampleAutoplaying"
                className="carousel slide"
                data-bs-ride="carousel"
            >
                {/* Contenedor interno del carrusel */}
                <div className="carousel-inner">
                    {/* Primer slide activo por defecto */}
                    <div className="carousel-item active">
                        <img
                            src={carrusel1}
                            className="d-block nose"
                            alt="Bosque tropical colombiano - Ecosistema forestal diverso"
                        />
                    </div>
                    {/* Segundo slide del carrusel */}
                    <div className="carousel-item">
                        <img
                            src={carrusel2}
                            className="d-block nose"
                            alt="Vegetación boscosa - Hábitat natural preservado"
                        />
                    </div>
                    {/* Tercer slide del carrusel */}
                    <div className="carousel-item">
                        <img
                            src={carrusel3}
                            className="d-block nose"
                            alt="Paisaje forestal - Conservación ambiental"
                        />
                    </div>
                </div>

                {/* Controles de navegación del carrusel */}
                {/* Botón para slide anterior */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>
                
                {/* Botón para slide siguiente */}
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                </button>

                {/* Llamado a la acción debajo del carrusel */}
                <div className="text-center my-4">
                    <a href="#formulario" className="btn btn-success btn-lg px-5 py-3 bounce-animation">
                        <i className="fas fa-arrow-down me-2"></i> Únete a nosotros
                    </a>
                </div>
            </section>

            {/* Sección de Información: Objetivo y misión del IFN */}
            <section id="informacion" className="info-section">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Columna de texto explicativo */}
                        <div className="col-md-4 info-text">
                            <h2>¿Cuál es el objetivo y la misión del Inventario Forestal Nacional?</h2>
                            <p>
                                El objetivo del Inventario Forestal Nacional es recopilar,
                                analizar y actualizar información sobre la extensión, estado,
                                composición y cambios de los bosques de un país.
                                <br />
                                <br />
                                La misión es apoyar la gestión sostenible de los recursos
                                forestales, proporcionando datos confiables que sirvan para la
                                toma de decisiones, la conservación, el uso responsable y la
                                formulación de políticas ambientales.
                            </p>
                        </div>

                        {/* Columna de video explicativo */}
                        <div className="col-md-8 info-video">
                            <div className="video-container">
                                <iframe
                                    src="https://www.youtube.com/embed/rT9RKbue0hE"
                                    title="Video explicativo del Inventario Forestal Nacional de Colombia"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Tarjetas: Navegación a funcionalidades del sistema */}
            <div className="card-group">
                {/* Tarjeta 3: Registro de muestras botánicas */}
                <div className="card">
                    <a href="/registroMuestra">
                        <img
                            src={card3}
                            className="card-img-top"
                            alt="Registro de muestras botánicas para estudio científico"
                        />
                    </a>
                    <div className="card-body">
                        <h4 className="card-title">Muestras botánicas</h4>
                        <p className="card-text">
                            Da click en la imagen para ir a realizar un registro sobre una muestra botánica
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección de Formulario: Contacto y colaboración */}
            <section id="formulario" className="py-5 fade-in">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="form-section p-4 p-lg-5">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="form-container p-4 p-lg-5">
                                            {/* Título del formulario */}
                                            <h2 className="text-center text-success mb-4">
                                                Únete a Nuestra Iniciativa
                                            </h2>

                                            {/* Formulario de contacto */}
                                            <form onSubmit={handleSubmit} noValidate>
                                                
                                                {/* Campo: Nombre completo */}
                                                <div className="mb-3">
                                                    <label htmlFor="nombre" className="form-label">
                                                        Nombre Completo *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${
                                                            errors.nombre ? "is-invalid" : ""
                                                        }`}
                                                        id="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleChange}
                                                    />
                                                    {/* Mensaje de error para campo nombre */}
                                                    {errors.nombre && (
                                                        <div className="invalid-feedback">{errors.nombre}</div>
                                                    )}
                                                </div>

                                                {/* Campo: Correo electrónico */}
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        Correo Electrónico *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${
                                                            errors.email ? "is-invalid" : ""
                                                        }`}
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                    {/* Mensaje de error para campo email */}
                                                    {errors.email && (
                                                        <div className="invalid-feedback">{errors.email}</div>
                                                    )}
                                                </div>

                                                {/* Campo: Teléfono (opcional) */}
                                                <div className="mb-3">
                                                    <label htmlFor="telefono" className="form-label">
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="telefono"
                                                        value={formData.telefono}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                {/* Campo: Institución u organización */}
                                                <div className="mb-3">
                                                    <label htmlFor="institucion" className="form-label">
                                                        Institución/Organización
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="institucion"
                                                        value={formData.institucion}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                {/* Campo: Área de interés (select) */}
                                                <div className="mb-3">
                                                    <label htmlFor="interes" className="form-label">
                                                        Área de Interés *
                                                    </label>
                                                    <select
                                                        className={`form-select ${
                                                            errors.interes ? "is-invalid" : ""
                                                        }`}
                                                        id="interes"
                                                        value={formData.interes}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Selecciona una opción</option>
                                                        <option value="investigacion">Investigación</option>
                                                        <option value="voluntariado">Voluntariado</option>
                                                        <option value="donacion">Donación</option>
                                                        <option value="colaboracion">Colaboración Institucional</option>
                                                        <option value="consultoria">Consultoría Técnica</option>
                                                    </select>
                                                    {/* Mensaje de error para campo interés */}
                                                    {errors.interes && (
                                                        <div className="invalid-feedback">{errors.interes}</div>
                                                    )}
                                                </div>

                                                {/* Campo: Mensaje personalizado */}
                                                <div className="mb-4">
                                                    <label htmlFor="mensaje" className="form-label">
                                                        Mensaje *
                                                    </label>
                                                    <textarea
                                                        className={`form-control ${
                                                            errors.mensaje ? "is-invalid" : ""
                                                        }`}
                                                        id="mensaje"
                                                        rows="4"
                                                        value={formData.mensaje}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                    {/* Mensaje de error para campo mensaje */}
                                                    {errors.mensaje && (
                                                        <div className="invalid-feedback">{errors.mensaje}</div>
                                                    )}
                                                </div>

                                                {/* Botón de envío del formulario */}
                                                <button
                                                    type="submit"
                                                    className="btn bg-success w-100 py-3"
                                                >
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Enviar Solicitud
                                                </button>

                                                {/* Mensaje de éxito después del envío */}
                                                {success && (
                                                    <div className="alert alert-success mt-3">
                                                        <i className="fas fa-check-circle me-2"></i>
                                                        ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InicioCon;