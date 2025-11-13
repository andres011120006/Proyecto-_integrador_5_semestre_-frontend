// Importar dependencias de React y otras librerías
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../assets/css/registroCon.css';

// Definir el componente funcional RegistroIncidencias
const RegistroIncidencias = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    conglomerado: "",
    categoria: "",
    descripcion: ""
  });

  // Estado para almacenar la lista de conglomerados
  const [conglomerados, setConglomerados] = useState([]);
  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});
  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState(false);
  // Estado para manejar el estado de carga durante el envío
  const [loading, setLoading] = useState(false);
  // Estado para manejar la carga inicial de conglomerados
  const [loadingConglomerados, setLoadingConglomerados] = useState(true);

  // Efecto para cargar los conglomerados al montar el componente
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        setLoadingConglomerados(true);
        // Realizar petición GET para obtener conglomerados (API local 4000)
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data);
      } catch (err) {
        console.error("Error cargando conglomerados:", err);
        setErrors({
          conglomerados: "Error al cargar los conglomerados. Intente nuevamente."
        });
      } finally {
        setLoadingConglomerados(false);
      }
    };
    fetchConglomerados();
  }, []);

  // Definir las categorías de incidencia disponibles
  const categoriasIncidencia = [
    {
      id: "menor",
      nombre: "Incidencia Menor",
      descripcion: "No pone en riesgo la vida o integridad de la brigada y no interfiere en la exploración"
    },
    {
      id: "mayor",
      nombre: "Incidencia Mayor",
      descripcion: "Pone en peligro la integridad o vida de la brigada o no permite continuar con la exploración"
    }
  ];

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar error del campo cuando el usuario empiece a escribir/seleccionar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Función de validación del formulario
  const validate = () => {
    let newErrors = {};

    // Validar que se haya seleccionado un conglomerado
    if (!formData.conglomerado.trim()) {
      newErrors.conglomerado = "Debe seleccionar un conglomerado";
    }

    // Validar que se haya seleccionado una categoría
    if (!formData.categoria.trim()) {
      newErrors.categoria = "Debe seleccionar una categoría de incidencia";
    }

    // Validar la descripción (requerida y longitud mínima)
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "Debe ingresar una descripción de la incidencia";
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      try {
        // Preparar datos para enviar al servidor (MongoDB)
        const incidenciaData = {
          nombre_conglomerado: formData.conglomerado,
          categoria: formData.categoria,
          descripcion: formData.descripcion
        };

        console.log(" Enviando incidencia a Mongo:", incidenciaData);

        // Enviar datos de la incidencia al backend (API de incidencias en puerto 5000)
        const response = await axios.post(
          "http://localhost:5000/api/incidencias",
          incidenciaData
        );

        console.log("Respuesta del servidor:", response.data);

        // Mostrar notificación de éxito
        setSuccess(true);

        // Limpiar formulario después del envío exitoso
        setFormData({
          conglomerado: "",
          categoria: "",
          descripcion: ""
        });
        setErrors({});

        // Ocultar notificación después de 5 segundos
        setTimeout(() => setSuccess(false), 5000);

      } catch (error) {
        console.error(" Error al registrar incidencia:", error);
        setErrors({
          submit: "Error al registrar la incidencia. Intente nuevamente."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para obtener la descripción de la categoría seleccionada
  const getCategoriaDescripcion = () => {
    const categoria = categoriasIncidencia.find(c => c.id === formData.categoria);
    return categoria ? categoria.descripcion : "";
  };

  // Función para obtener el conglomerado seleccionado
  const getConglomeradoSeleccionado = () => {
    return conglomerados.find(c => c.id === parseInt(formData.conglomerado));
  };

  // Renderizado del componente
  return (
    <div className="registroCon-container my-5" role="main" aria-labelledby="formTitle">
      <h1 id="formTitle" className="registroCon-title">Registrar Incidencia</h1>

      <div className="registroCon-instructions mb-4">
        <p className="text-muted">
          Complete el siguiente formulario para registrar una incidencia en el trabajo de campo.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="registroCon-form">
        {/* Campo: Selección de Conglomerado */}
        <div className="form-group mb-4">
          <label htmlFor="conglomerado" className="registroCon-label">
            Conglomerado <span className="registroCon-required">*</span>
          </label>

          {loadingConglomerados ? (
            <div className="alert alert-info">
              <i className="fas fa-spinner fa-spin me-2"></i>
              Cargando conglomerados...
            </div>
          ) : errors.conglomerados ? (
            <div className="alert alert-danger">
              {errors.conglomerados}
            </div>
          ) : (
            <select
              id="conglomerado"
              name="conglomerado"
              value={formData.conglomerado}
              onChange={handleChange}
              className={`registroCon-select ${
                errors.conglomerado ? "is-invalid" : formData.conglomerado ? "is-valid" : ""
              }`}
              disabled={conglomerados.length === 0}
            >
              <option value="">Seleccione un conglomerado</option>
              {conglomerados.map((conglomerado) => (
                <option key={conglomerado.id} value={conglomerado.nombre}>
                  {conglomerado.nombre}
                  {conglomerado.estado && ` - Estado: ${conglomerado.estado}`}
                </option>
              ))}
            </select>
          )}

          {errors.conglomerado && (
            <div className="invalid-feedback">{errors.conglomerado}</div>
          )}

          {conglomerados.length === 0 && !loadingConglomerados && (
            <div className="form-text text-warning">
              No hay conglomerados disponibles para registrar incidencias.
            </div>
          )}
        </div>

        {/* Campo: Categoría de Incidencia */}
        <div className="form-group mb-4">
          <label htmlFor="categoria" className="registroCon-label">
            Categoría de Incidencia <span className="registroCon-required">*</span>
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className={`registroCon-select ${
              errors.categoria ? "is-invalid" : formData.categoria ? "is-valid" : ""
            }`}
          >
            <option value="">Seleccione una categoría</option>
            {categoriasIncidencia.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <div className="invalid-feedback">{errors.categoria}</div>
          )}
          {formData.categoria && (
            <div className="form-text">
              <small>{getCategoriaDescripcion()}</small>
            </div>
          )}
        </div>

        {/* Campo: Descripción */}
        <div className="form-group mb-4">
          <label htmlFor="descripcion" className="registroCon-label">
            Descripción de la Incidencia <span className="registroCon-required">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="5"
            className={`registroCon-textarea ${
              errors.descripcion ? "is-invalid" : formData.descripcion ? "is-valid" : ""
            }`}
            placeholder="Describa detalladamente la incidencia ocurrida..."
            disabled={loading}
          />
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
          <div className="form-text">
            Mínimo 10 caracteres. Sea específico en la descripción.
            {formData.descripcion && (
              <span className={`ms-2 ${formData.descripcion.length < 10 ? 'text-danger' : 'text-success'}`}>
                ({formData.descripcion.length}/10 caracteres)
              </span>
            )}
          </div>
        </div>

        {/* Información de categorías - CARDS AGREGADAS AQUÍ */}
        <div className="categorias-info mb-4">
          <h6 className="mb-3">Información sobre categorías:</h6>
          <div className="row">
            <div className="col-md-6">
              <div className="card border-warning">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Incidencias Menores
                  </h6>
                  <p className="card-text small">
                    No ponen en riesgo la vida o integridad y no interfieren en la exploración.
                    <br />
                    <strong>Ejemplos:</strong> Condición climática adversa, fallas en herramientas (GPS), etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-danger">
                <div className="card-body">
                  <h6 className="card-title text-danger">
                    <i className="fas fa-skull-crossbones me-2"></i>
                    Incidencias Mayores
                  </h6>
                  <p className="card-text small">
                    Ponen en peligro la integridad o vida de la brigada o no permiten continuar con la exploración.
                    <br />
                    <strong>Ejemplos:</strong> Lesiones graves, grupos armados, animales peligrosos, fallas geológicas, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="registroCon-buttons mt-4">
          <button
            type="submit"
            className="registroCon-btn btn-primary"
            disabled={loading || conglomerados.length === 0}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Registrando...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Registrar Incidencia
              </>
            )}
          </button>
          <button
            type="button"
            className="registroCon-btn registroCon-btn-reset"
            onClick={() => {
              setFormData({
                conglomerado: "",
                categoria: "",
                descripcion: ""
              });
              setErrors({});
            }}
            disabled={loading}
          >
            <i className="fas fa-broom me-2"></i>
            Limpiar Formulario
          </button>
        </div>

        {errors.submit && (
          <div className="alert alert-danger mt-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errors.submit}
          </div>
        )}
      </form>

      {/* Notificación de éxito */}
      {success && (
        <div className="alert alert-success mt-3" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>¡Incidencia registrada exitosamente!</strong>
          <br />
          La incidencia ha sido guardada 
        </div>
      )}
    </div>
  );
};

// Exportar el componente como default
export default RegistroIncidencias;