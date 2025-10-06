import React, { useState } from "react";
import carrusel1 from '../assets/img/niels-van-altena-baUqXWWvN1c-unsplash.jpg'
import carrusel2 from '../assets/img/robin-noguier-CZJp1S4bZos-unsplash.jpg'
import carrusel3 from '../assets/img/urban-vintage-78A265wPiO4-unsplash.jpg'
import card1 from '../assets/img/foto_card_conglomerado.jpeg'
import card2 from '../assets/img/pexels-mahima-518693-1250260.jpg'
import card3 from '../assets/img/matthew-smith-Rfflri94rs8-unsplash.jpg'
import card4 from '../assets/img/lukas-blazek-mcSDtbWXUZU-unsplash.jpg'
import '../assets/css/iniciocon.css';

const InicioCon = () => {
    // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    institucion: "",
    interes: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" }); // limpiar error al escribir
  };

  // Validar formulario
  const validate = () => {
    let newErrors = {};
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim())
      newErrors.nombre = "Por favor ingresa tu nombre completo";

    if (!emailRegex.test(formData.email))
      newErrors.email = "Por favor ingresa un email válido";

    if (!formData.interes)
      newErrors.interes = "Por favor selecciona un área de interés";

    if (!formData.mensaje.trim())
      newErrors.mensaje = "Por favor ingresa tu mensaje";

    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSuccess(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        institucion: "",
        interes: "",
        mensaje: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    }
  };
  return (
    <div>
      {/* Sección 1: Hero */}
      <section id="inicio" className="hero-section text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
                Inventario Forestal Nacional de Colombia
              </h1>
              <p className="lead mb-4 animate__animated animate__fadeInUp">
                Monitoreo y conservación de nuestros recursos forestales para
                un futuro sostenible y ecológico
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel */}
      <section
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={carrusel1}
              className="d-block nose"
              alt="Bosque 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src={carrusel2}
              className="d-block nose"
              alt="Bosque 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src={carrusel3}
              className="d-block nose"
              alt="Bosque 3"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        <div className="text-center my-4">
          <a href="#formulario" className="btn btn-success btn-lg px-5 py-3 bounce-animation">
            <i className="fas fa-arrow-down me-2"></i> Únete a nosotros
          </a>
        </div>
      </section>

      {/* Información */}
      <section id="informacion" className="info-section">
        <div className="container">
          <div className="row align-items-center">
            {/* Texto */}
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

            {/* Video */}
            <div className="col-md-8 info-video">
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/rT9RKbue0hE"
                  title="Video IFN"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <div className="card-group">
        <div className="card">
          <a href="/registroCon">
            <img
              src={card1}
              className="card-img-top"
              alt="Conglomerado"
            />
          </a>
          <div className="card-body">
            <h4 className="card-title">Registrar conglomerado y brigada</h4>
            <p className="card-text">
              Da click en la imagen para realizar un registro sobre el conglomerado y la brigada
            </p>
          </div>
        </div>

        <div className="card">
          <a href="/registroArboreos">
            <img
              src={card2}
              className="card-img-top"
              alt="Árbol"
            />
          </a>
          <div className="card-body">
            <h4 className="card-title">Registrar individuos arbóreos</h4>
            <p className="card-text">
              Da click en la imagen para realizar un registro sobre un individuo arbóreo
            </p>
          </div>
        </div>

        <div className="card">
          <a href="/registroMuestra">
            <img
              src={card3}
              className="card-img-top"
              alt="Muestra botánica"
            />
          </a>
          <div className="card-body">
            <h4 className="card-title">Muestras botánicas</h4>
            <p className="card-text">
              Da click en la imagen para ir a realizar un registro sobre una muestra botánica
            </p>
          </div>
        </div>

        <div className="card">
          <a href="/reporte">
            <img
              src={card4}
              className="card-img-top"
              alt="Reporte"
            />
          </a>
          <div className="card-body">
            <h4 className="card-title">Generar Reporte</h4>
            <p className="card-text">
              Da click en la imagen para generar un reporte
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <section id="formulario" className="py-5 fade-in">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="form-section p-4 p-lg-5">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="form-container p-4 p-lg-5">
                      <h2 className="text-center text-success mb-4">
                        Únete a Nuestra Iniciativa
                      </h2>

                      <form onSubmit={handleSubmit} noValidate>
                        {/* Nombre */}
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
                          {errors.nombre && (
                            <div className="invalid-feedback">{errors.nombre}</div>
                          )}
                        </div>

                        {/* Email */}
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
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </div>

                        {/* Teléfono */}
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

                        {/* Institución */}
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

                        {/* Interés */}
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
                          {errors.interes && (
                            <div className="invalid-feedback">{errors.interes}</div>
                          )}
                        </div>

                        {/* Mensaje */}
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
                          {errors.mensaje && (
                            <div className="invalid-feedback">{errors.mensaje}</div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btn bg-success w-100 py-3"
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Enviar Solicitud
                        </button>

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