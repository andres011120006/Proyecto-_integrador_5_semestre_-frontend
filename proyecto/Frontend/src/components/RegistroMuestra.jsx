import { useState } from "react";
import "../assets/css/registroMuestra.css";

const RegistroMuestra = () => {
  const [formData, setFormData] = useState({
    latitud: "",
    longitud: "",
    tipoMuestra: "",
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

    // Latitud
    const lat = parseFloat(formData.latitud);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitud = "Ingrese una latitud válida (entre -90 y 90).";
    }

    // Longitud
    const lon = parseFloat(formData.longitud);
    if (isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.longitud = "Ingrese una longitud válida (entre -180 y 180).";
    }

    // Tipo de muestra
    if (!formData.tipoMuestra) {
      newErrors.tipoMuestra = "Debe seleccionar un tipo de muestra botánica.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Formulario válido:", formData);

      setSuccess(true);
      setFormData({
        latitud: "",
        longitud: "",
        tipoMuestra: "",
        imagen: null,
      });
      setErrors({});

      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="muestra-form-container" role="main" aria-labelledby="formTitle">
      <h1 id="formTitle">Registrar Muestra Botánica</h1>

      <form onSubmit={handleSubmit} noValidate>
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
          placeholder="Ej. 4.5678"
          step="0.0001"
          required
          className={`form-control ${
            errors.latitud ? "is-invalid" : formData.latitud ? "is-valid" : ""
          }`}
        />
        {errors.latitud && <div className="invalid-feedback">{errors.latitud}</div>}

        {/* Longitud */}
        <label htmlFor="longitud" className="mt-3">
          Longitud (°) <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <input
          type="number"
          id="longitud"
          name="longitud"
          value={formData.longitud}
          onChange={handleChange}
          placeholder="Ej. -74.1234"
          step="0.0001"
          required
          className={`form-control ${
            errors.longitud ? "is-invalid" : formData.longitud ? "is-valid" : ""
          }`}
        />
        {errors.longitud && <div className="invalid-feedback">{errors.longitud}</div>}

        {/* Tipo de muestra */}
        <label htmlFor="tipoMuestra" className="mt-3">
          Tipo de muestra botánica <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <select
          id="tipoMuestra"
          name="tipoMuestra"
          value={formData.tipoMuestra}
          onChange={handleChange}
          required
          className={`form-select ${
            errors.tipoMuestra ? "is-invalid" : formData.tipoMuestra ? "is-valid" : ""
          }`}
        >
          <option value="">Seleccione tipo de muestra</option>
          <option value="muestra esteril">Muestra estéril</option>
          <option value="muestra fertil">Muestra fértil</option>
        </select>
        {errors.tipoMuestra && (
          <div className="invalid-feedback">{errors.tipoMuestra}</div>
        )}

        {/* Imagen */}
        <label htmlFor="imagen" className="mt-3">
          Subir imagen (opcional)
        </label>
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
        <div className="muestra-form-buttons mt-4">
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="reset"
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                latitud: "",
                longitud: "",
                tipoMuestra: "",
                imagen: null,
              });
              setErrors({});
              setSuccess(false);
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Mensaje de éxito */}
        {success && (
        <div className="alert alert-success mt-3" role="alert">
            ¡Registro exitoso!
        </div>
        )}

    </div>
  );
};

export default RegistroMuestra;
