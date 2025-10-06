import { useState } from "react";
import "../assets/css/registroArbol.css";

const RegistroArbol = () => {
  const [formData, setFormData] = useState({
    nombreConglomerado: "",
    subparcela: "",
    nombreComun: "",
    categoria: "",
    altitud: "",
    latitud: "",
    longitud: "",
    imagen: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Validaciones
  const validate = () => {
    let newErrors = {};

    if (!formData.nombreConglomerado)
      newErrors.nombreConglomerado = "El campo 'Nombre conglomerado' es obligatorio.";
    if (!formData.subparcela)
      newErrors.subparcela = "Debe seleccionar una subparcela.";
    if (!formData.categoria)
      newErrors.categoria = "Debe seleccionar una categoría.";

    const altitud = parseFloat(formData.altitud);
    if (isNaN(altitud) || altitud < 0)
      newErrors.altitud = "Ingrese una altitud válida (número positivo).";

    const lat = parseFloat(formData.latitud);
    if (isNaN(lat) || lat < -90 || lat > 90)
      newErrors.latitud = "Ingrese una latitud válida (entre -90 y 90).";

    const lon = parseFloat(formData.longitud);
    if (isNaN(lon) || lon < -180 || lon > 180)
      newErrors.longitud = "Ingrese una longitud válida (entre -180 y 180).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Formulario válido:", formData);

      setSuccess(true);
      setFormData({
        nombreConglomerado: "",
        subparcela: "",
        nombreComun: "",
        categoria: "",
        altitud: "",
        latitud: "",
        longitud: "",
        imagen: null,
      });
      setErrors({});

      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="arbol-container my-5" role="main" aria-labelledby="formTitleArbol">
      <h1 id="formTitleArbol">Registrar Individuo Arbóreo</h1>
      <form onSubmit={handleSubmit} noValidate>
        
        {/* Conglomerado */}
        <label htmlFor="nombreConglomerado">
          Seleccionar Nombre conglomerado <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <select
          id="nombreConglomerado"
          name="nombreConglomerado"
          value={formData.nombreConglomerado}
          onChange={handleChange}
          className={`form-select ${errors.nombreConglomerado ? "is-invalid" : formData.nombreConglomerado ? "is-valid" : ""}`}
        >
          <option value="">Seleccione un conglomerado</option>
          <option value="1">Conglomerado 1</option>
          <option value="2">Conglomerado 2</option>
          <option value="3">Conglomerado 3</option>
          <option value="4">Conglomerado 4</option>
        </select>
        {errors.nombreConglomerado && <div className="invalid-feedback">{errors.nombreConglomerado}</div>}

        {/* Subparcela */}
        <label htmlFor="subparcela">
          Seleccionar subparcela <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <select
          id="subparcela"
          name="subparcela"
          value={formData.subparcela}
          onChange={handleChange}
          className={`form-select ${errors.subparcela ? "is-invalid" : formData.subparcela ? "is-valid" : ""}`}
        >
          <option value="">Seleccione subparcela</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        {errors.subparcela && <div className="invalid-feedback">{errors.subparcela}</div>}

        {/* Nombre común */}
        <label htmlFor="nombreComun">Nombre común (opcional)</label>
        <input
          type="text"
          id="nombreComun"
          name="nombreComun"
          value={formData.nombreComun}
          onChange={handleChange}
          className="form-control"
          placeholder="Ej. Roble"
        />

        {/* Categoría */}
        <label htmlFor="categoria">
          Categoría <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={`form-select ${errors.categoria ? "is-invalid" : formData.categoria ? "is-valid" : ""}`}
        >
          <option value="">Seleccione categoría</option>
          <option value="Brinzales">Brinzales (DAP ≤ 10 cm)</option>
          <option value="Latizales">Latizales (10 cm ≤ DAP &lt; 30 cm)</option>
          <option value="Fustal">Fustal (30 cm ≤ DAP &lt; 50 cm)</option>
          <option value="Fustal grande">Fustal grande (DAP ≥ 50 cm)</option>
        </select>
        {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}

        {/* Altitud */}
        <label htmlFor="altitud">
          Altitud (m) <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <input
          type="number"
          id="altitud"
          name="altitud"
          value={formData.altitud}
          onChange={handleChange}
          className={`form-control ${errors.altitud ? "is-invalid" : formData.altitud ? "is-valid" : ""}`}
          placeholder="Ej. 1500.5"
          step="0.01"
        />
        {errors.altitud && <div className="invalid-feedback">{errors.altitud}</div>}

        {/* Latitud */}
        <label htmlFor="latitud">
          Latitud (°) <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <input
          type="number"
          id="latitud"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
          className={`form-control ${errors.latitud ? "is-invalid" : formData.latitud ? "is-valid" : ""}`}
          placeholder="Ej. 4.5678"
          step="0.0001"
        />
        {errors.latitud && <div className="invalid-feedback">{errors.latitud}</div>}

        {/* Longitud */}
        <label htmlFor="longitud">
          Longitud (°) <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <input
          type="number"
          id="longitud"
          name="longitud"
          value={formData.longitud}
          onChange={handleChange}
          className={`form-control ${errors.longitud ? "is-invalid" : formData.longitud ? "is-valid" : ""}`}
          placeholder="Ej. -74.1234"
          step="0.0001"
        />
        {errors.longitud && <div className="invalid-feedback">{errors.longitud}</div>}

        {/* Imagen */}
        <label htmlFor="imagen">Subir imagen (opcional)</label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          className="form-control"
        />
        <small style={{ color: "#4caf50", fontSize: "0.85rem" }}>
          Formatos permitidos: JPG, PNG, GIF
        </small>

        {/* Botones */}
        <div className="arbol-buttons mt-3">
          <button type="submit" className="arbol-btn btn-success">Enviar</button>
          <button
            type="reset"
            className="arbol-btn reset-btn"
            onClick={() => {
              setFormData({
                nombreConglomerado: "",
                subparcela: "",
                nombreComun: "",
                categoria: "",
                altitud: "",
                latitud: "",
                longitud: "",
                imagen: null,
              });
              setErrors({});
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {success && (
        <div className="arbol-success-message" role="alert">
          ¡Registro exitoso!
        </div>
      )}
    </div>
  );
};

export default RegistroArbol;
