// Importación de hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importación de Axios para realizar solicitudes HTTP al backend
import axios from "axios";
// Importación del archivo CSS asociado al componente
import "../assets/css/registroArbol.css";
// Importación del componente Mapa que se utiliza en los pasos del formulario
import Mapa from "./mapa_arbol";

const RegistroArbol = () => {
  // Estado inicial del formulario que contiene los datos del individuo
  const [formData, setFormData] = useState({
    nombreConglomerado: "",
    subparcela: "",
    categoria: "",
    latitud: null,
    longitud: null,
    imagen: null,
  });


    // Definir las categorías de indivduo arboreo disponibles
  const categoriasIndividuo = [
    {
      id: "Brinzales",
      nombre: "Brinzales ",
      descripcion: " son los Son los individuos arbóreos más jóvenes del bosque, con un DAP menor a 10 cm. Se encuentran en la etapa inicial de desarrollo, son delgados, de poca altura y muy vulnerables a factores ambientales. Representan la regeneración natural del bosque. Con un DAP menor a 10 cm"

    },
    { 
      id: "Latizales",
      nombre: "Latizales",
      descripcion: "Son los individuos arbóreos en fase intermedia de crecimiento,tienen mayor resistencia, crecen en altura y comienzan a competir intensamente por luz,agua y nutrientes. Son la base del futuro del bosque. DAP entre 10 y 30 cm."

    },
        { 
      id: "Fustal",
      nombre: "Fustal",
      descripcion: "Son individuos arbóreos con un DAP mayor a 30 cm, que ya alcanzaron la madurez estructural.Presentan troncos robustos y rectos, y forman parte importante del dosel del bosque. (DAP entre 30 y 50 cm)."

    },
        { 
      id: "Fustal grande",
      nombre: "Fustal grande",
      descripcion: "Son los individuos arbóreos más desarrollados dentro de los fustales, Se destacan por su gran tamaño, longevidad y valor ecológico,con un DAP superior a 50 cm. "


    }
  ];

  // Estado que controla el paso actual del formulario (1 a 4)
  const [step, setStep] = useState(1);

  // Estado que guarda la lista de conglomerados obtenidos desde el backend
  const [conglomerados, setConglomerados] = useState([]);

  // Estado para manejar los mensajes de error de validación
  const [errors, setErrors] = useState({});

  // Estado para indicar si el registro fue exitoso
  const [success, setSuccess] = useState(false);

  // Estado para controlar la carga mientras se envían los datos
  const [loading, setLoading] = useState(false);

  // useEffect para cargar los conglomerados desde el backend al montar el componente
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        // Petición GET al backend
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data);
      } catch (err) {
        console.error("Error cargando conglomerados:", err);
      }
    };
    fetchConglomerados();
  }, []);

  // Maneja los cambios de los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el campo tiene archivos, se toma el primero; si no, se guarda el valor
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Guarda la latitud y longitud seleccionadas en el mapa
  const handleSelectConglomeradoMapa = (lat, lng) => {
    setFormData({ ...formData, latitud: lat, longitud: lng });
  };

  // Función de validación por cada paso del formulario
  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.nombreConglomerado)
      newErrors.nombreConglomerado = "Debe seleccionar un conglomerado.";
    if (step === 2 && !formData.subparcela)
      newErrors.subparcela = "Debe seleccionar una subparcela.";
    if (step === 3 && (formData.latitud == null || formData.longitud == null))
      newErrors.mapa = "Debe seleccionar la ubicación del individuo.";
    if (step === 4 && !formData.categoria)
      newErrors.categoria = "Debe seleccionar una categoría.";

    setErrors(newErrors);
    // Retorna true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Avanza al siguiente paso si la validación es correcta
  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // Envía el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);

    try {
      // Se usa FormData para enviar datos y archivos al backend
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value != null) dataToSend.append(key, value);
      });

      // Envío de datos al backend mediante POST
      await axios.post("http://localhost:4000/api/individuos", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Si se guarda correctamente, se muestra mensaje de éxito
      setSuccess(true);
      setStep(1);
      // Reinicia el formulario
      setFormData({
        nombreConglomerado: "",
        subparcela: "",
        categoria: "",
        latitud: null,
        longitud: null,
        imagen: null,
      });
      // Oculta el mensaje después de 4 segundos
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("Ocurrió un error al guardar el registro.");
    } finally {
      setLoading(false);
    }
  };

  // Encuentra el conglomerado actualmente seleccionado
  const selectedConglomerado = conglomerados.find(
    (c) => c.nombre === formData.nombreConglomerado
  );

  return (
    <div className="arbol-container my-5">
      <h1>Registro de Individuo Arbóreo</h1>

      {/* Formulario principal dividido por pasos */}
      <form onSubmit={handleSubmit}>

        {/* Paso 1: Selección de conglomerado */}
        {step === 1 && (
          <>
            <h3>Paso 1: Seleccione un conglomerado</h3>
            <select
              name="nombreConglomerado"
              value={formData.nombreConglomerado}
              onChange={handleChange}
              className={`form-select ${errors.nombreConglomerado ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione un conglomerado</option>
              {conglomerados.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>

            {/* Mensaje de error si no se selecciona conglomerado */}
            {errors.nombreConglomerado && (
              <div className="invalid-feedback">{errors.nombreConglomerado}</div>
            )}

            {/* Mapa interactivo con marcador movible */}
            <div className="mapa-arbol my-4" style={{ height: "400px" }}>
              <Mapa
                selectedConglomerado={selectedConglomerado}
                movableMarker={true}
                initialPosition={
                  selectedConglomerado
                    ? { lat: selectedConglomerado.latitud, lng: selectedConglomerado.longitud }
                    : { lat: 4.711, lng: -74.0721 }
                }
                onSelect={handleSelectConglomeradoMapa}
              />
            </div>

            {/* Botón para avanzar */}
            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 2: Selección de subparcela */}
        {step === 2 && (
          <>
            <h3>Paso 2: Seleccione una subparcela</h3>
            <select
              name="subparcela"
              value={formData.subparcela}
              onChange={handleChange}
              className={`form-select ${errors.subparcela ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione subparcela</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            {errors.subparcela && (
              <div className="invalid-feedback">{errors.subparcela}</div>
            )}

            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 3: Selección de ubicación en el mapa */}
        {step === 3 && (
          <>
            <h3>Paso 3: Seleccione la ubicación del individuo</h3>

            <div className="mapa-arbol my-4" style={{ height: "400px" }}>
              <Mapa
                movableMarker={true}
                selectedConglomerado={selectedConglomerado}
                initialPosition={{
                  lat:
                    formData.latitud ??
                    (selectedConglomerado ? selectedConglomerado.latitud : 4.711),
                  lng:
                    formData.longitud ??
                    (selectedConglomerado ? selectedConglomerado.longitud : -74.0721),
                }}
                onSelect={(lat, lng) =>
                  setFormData({ ...formData, latitud: lat, longitud: lng })
                }
              />
            </div>

            {/* Coordenadas seleccionadas */}
            <p>
              <strong>Latitud:</strong>{" "}
              {formData.latitud != null ? formData.latitud.toFixed(6) : "No definida"}
            </p>
            <p>
              <strong>Longitud:</strong>{" "}
              {formData.longitud != null ? formData.longitud.toFixed(6) : "No definida"}
            </p>

            {errors.mapa && (
              <div className="invalid-feedback d-block">{errors.mapa}</div>
            )}

            <button type="button" className="btn btn-primary mt-3" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {/* Paso 4: Selección de categoría y carga de imagen */}
        {step === 4 && (
          <>
            <h3>Paso 4: Categoría e imagen</h3>

            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione categoría</option>
              <option value="Brinzales">Brinzales </option>
              <option value="Latizales">Latizales </option>
              <option value="Fustal">Fustal </option>
              <option value="Fustal grande">Fustal grande</option>
            </select>

            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}
            {/* Información de categorías - CARDS AGREGADAS AQUÍ */}
   <div className="categorias-info mb-4">
  <h6 className="mb-3">Información sobre categorías:</h6>
  <div className="row">
    <div className="col-md-6 mb-3">
      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title text-success">
            Brinzales
          </h6>
          <p className="card-text small">
            son los Son los individuos arbóreos más jóvenes del bosque, Se encuentran en la etapa inicial de desarrollo, son delgados, de poca altura y muy vulnerables a factores ambientales. Representan la regeneración natural del bosque. Con un DAP menor a 10 cm
            <br />
            <strong>Ejemplos:</strong> Árboles jóvenes, retoños, plántulas, etc.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6 mb-3">
      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title text-success">
            Latizales
          </h6>
          <p className="card-text small">
            Son los individuos arbóreos en fase intermedia de crecimiento,tienen mayor resistencia, crecen en altura y comienzan a competir intensamente por luz,agua y nutrientes. Son la base del futuro del bosque. DAP entre 10 y 30 cm
            <br />
            <strong>Ejemplos:</strong> Árboles en crecimiento, juveniles, etc.  
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6 mb-3">
      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title text-success">
            Fustal
          </h6>
          <p className="card-text small">
            Son individuos arbóreos que ya alcanzaron la madurez estructural.Presentan troncos robustos y rectos, y forman parte importante del dosel del bosque. (DAP entre 30 y 50 cm).
            <br />
            <strong>Ejemplos:</strong> Árboles maduros, etc.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6 mb-3">
      <div className="card border-success">
        <div className="card-body">
          <h6 className="card-title text-success">
            Fustal grande
          </h6>
          <p className="card-text small">
            Son los individuos arbóreos más desarrollados dentro de los fustales, Se destacan por su gran tamaño, longevidad y valor ecológico,con un DAP superior a 50 cm. 
            <br />
            <strong>Ejemplos:</strong> Árboles centenarios, gigantes, etc. 
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

            {/* Campo para subir imagen del árbol */}
            <label htmlFor="imagen" className="mt-3">
              Foto del individuo (opcional)
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />

            {/* Botón para enviar el formulario */}
            <button type="submit" className="btn btn-success mt-3" disabled={loading}>
              {loading ? "Guardando..." : "Enviar"}
            </button>
          </>
        )}
      </form>

      {/* Mensaje de éxito al registrar correctamente */}
      {success && (
        <div className="arbol-success-message" role="alert">
          Registro exitoso.
        </div>
      )}
    </div>
  );
};

// Exportación del componente
export default RegistroArbol;
