import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/registroArbol.css";
import Mapa from "./mapa_arbol";

const RegistroArbol = () => {
  const [formData, setFormData] = useState({
    nombreConglomerado: "",
    subparcela: "",
    categoria: "",
    latitud: "",
    longitud: "",
    imagen: null,
  });

  const [step, setStep] = useState(1);
  const [conglomerados, setConglomerados] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Traer conglomerados desde el backend
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data);
      } catch (err) {
        console.error("Error cargando conglomerados:", err);
      }
    };
    fetchConglomerados();
  }, []);

  // 🔹 Manejar cambios en campos
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // 🔹 Manejar selección en mapa
  const handleMapClick = (lat, lng) => {
    setFormData({ ...formData, latitud: lat, longitud: lng });
  };

  // 🔹 Selección de conglomerado (actualiza coordenadas iniciales)
  const handleSelectConglomeradoMapa = (c) => {
    setFormData({
      ...formData,
      nombreConglomerado: c.nombre,
      latitud: c.latitud,
      longitud: c.longitud,
    });
  };

  // 🔹 Validación de pasos
  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.nombreConglomerado)
      newErrors.nombreConglomerado = "Debe seleccionar un conglomerado.";
    if (step === 2 && !formData.subparcela)
      newErrors.subparcela = "Debe seleccionar una subparcela.";
    if (step === 3 && (!formData.latitud || !formData.longitud))
      newErrors.mapa = "Debe seleccionar la ubicación del individuo.";
    if (step === 4 && !formData.categoria)
      newErrors.categoria = "Debe seleccionar una categoría.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // 🔹 Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);

    try {
      // FormData para enviar texto + archivo
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend.append(key, value);
      });

      await axios.post("http://localhost:4000/api/individuos", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Éxito
      setSuccess(true);
      setStep(1);
      setFormData({
        nombreConglomerado: "",
        subparcela: "",
        categoria: "",
        latitud: "",
        longitud: "",
        imagen: null,
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("❌ Ocurrió un error al guardar el registro.");
    } finally {
      setLoading(false);
    }
  };

  const selectedConglomerado = conglomerados.find(
    (c) => c.nombre === formData.nombreConglomerado
  );

  return (
    <div className="arbol-container my-5">
      <h1>Registro de Individuo Arbóreo</h1>

      <form onSubmit={handleSubmit}>
        {/* PASO 1 */}
        {step === 1 && (
          <>
            <h3>Paso 1: Seleccione un conglomerado</h3>
            <select
              name="nombreConglomerado"
              value={formData.nombreConglomerado}
              onChange={handleChange}
              className={`form-select ${
                errors.nombreConglomerado ? "is-invalid" : ""
              }`}
            >
              <option value="">Seleccione un conglomerado</option>
              {conglomerados.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.nombreConglomerado && (
              <div className="invalid-feedback">
                {errors.nombreConglomerado}
              </div>
            )}

            <div className="mapa-arbol my-4" style={{ height: "400px" }}>
              <Mapa
                selectedConglomerado={selectedConglomerado}
                onSelect={handleSelectConglomeradoMapa}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleNext}
            >
              Siguiente
            </button>
          </>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <>
            <h3>Paso 2: Seleccione una subparcela</h3>
            <select
              name="subparcela"
              value={formData.subparcela}
              onChange={handleChange}
              className={`form-select ${
                errors.subparcela ? "is-invalid" : ""
              }`}
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

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleNext}
            >
              Siguiente
            </button>
          </>
        )}

{step === 3 && (
  <>
    <h3>Paso 3: Seleccione la ubicación del individuo</h3>
    <div className="mapa-arbol my-4" style={{ height: "400px" }}>
      <Mapa
        selectedConglomerado={selectedConglomerado}
        onSelect={({ lat, lng }) => {
          setFormData({ ...formData, latitud: lat, longitud: lng });
        }}
      />
    </div>

    <p>
      <strong>Latitud:</strong>{" "}
      {formData.latitud ? formData.latitud.toFixed(6) : "No definida"}
    </p>
    <p>
      <strong>Longitud:</strong>{" "}
      {formData.longitud ? formData.longitud.toFixed(6) : "No definida"}
    </p>

    {errors.mapa && (
      <div className="invalid-feedback d-block">{errors.mapa}</div>
    )}

    <button
      type="button"
      className="btn btn-primary mt-3"
      onClick={handleNext}
    >
      Siguiente
    </button>
  </>
)}


        {/* PASO 4 */}
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
              <option value="Brinzales">Brinzales (DAP ≤ 10 cm)</option>
              <option value="Latizales">Latizales (10 cm ≤ DAP &lt; 30 cm)</option>
              <option value="Fustal">Fustal (30 cm ≤ DAP &lt; 50 cm)</option>
              <option value="Fustal grande">Fustal grande (DAP ≥ 50 cm)</option>
            </select>
            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}

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

            <button
              type="submit"
              className="btn btn-success mt-3"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Enviar"}
            </button>
          </>
        )}
      </form>

      {success && (
        <div className="arbol-success-message" role="alert">
          ✅ ¡Registro exitoso!
        </div>
      )}
    </div>
  );
};

export default RegistroArbol;
