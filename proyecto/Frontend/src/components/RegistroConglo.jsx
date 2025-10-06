import { useState } from "react";
import '../assets/css/registroCon.css'

const RegistroConglo = () => {
  const [formData, setFormData] = useState({
    nombreConglomerado: "",
    latitud: "",
    longitud: "",
    jefeBrigada: "",
    tecnicoAuxiliar: "",
    botanico: "",
    coinvestigador: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.nombreConglomerado.trim())
      newErrors.nombreConglomerado = "El nombre del conglomerado es obligatorio.";
    if (!formData.jefeBrigada.trim())
      newErrors.jefeBrigada = "El nombre del jefe de brigada es obligatorio.";
    if (!formData.tecnicoAuxiliar.trim())
      newErrors.tecnicoAuxiliar = "El nombre del técnico auxiliar es obligatorio.";
    if (!formData.botanico.trim())
      newErrors.botanico = "El nombre del botánico es obligatorio.";
    if (!formData.coinvestigador.trim())
      newErrors.coinvestigador = "El nombre del coinvestigador es obligatorio.";

    const lat = parseFloat(formData.latitud);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitud = "Ingrese una latitud válida (entre -90 y 90).";
    }

    const lon = parseFloat(formData.longitud);
    if (isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.longitud = "Ingrese una longitud válida (entre -180 y 180).";
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
        nombreConglomerado: "",
        latitud: "",
        longitud: "",
        jefeBrigada: "",
        tecnicoAuxiliar: "",
        botanico: "",
        coinvestigador: "",
      });
      setErrors({});

      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="registroCon-container my-5" role="main" aria-labelledby="formTitle">
      <h1 id="formTitle" className="registroCon-title">Registrar Conglomerado y Brigada</h1>
      <form onSubmit={handleSubmit} noValidate className="registroCon-form">
        <label htmlFor="nombreConglomerado" className="registroCon-label">
          Nombre del conglomerado <span className="registroCon-required">*</span>
        </label>
        <input
          type="text"
          id="nombreConglomerado"
          name="nombreConglomerado"
          value={formData.nombreConglomerado}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.nombreConglomerado ? "is-invalid" : formData.nombreConglomerado ? "is-valid" : ""
          }`}
          placeholder="Ej. Conglomerado Norte"
        />
        {errors.nombreConglomerado && (
          <div className="invalid-feedback">{errors.nombreConglomerado}</div>
        )}

        <label htmlFor="latitud" className="registroCon-label">
          Latitud del conglomerado (°) <span className="registroCon-required">*</span>
        </label>
        <input
          type="number"
          id="latitud"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.latitud ? "is-invalid" : formData.latitud ? "is-valid" : ""
          }`}
          placeholder="Ej. 4.5678"
          step="0.0001"
        />
        {errors.latitud && <div className="invalid-feedback">{errors.latitud}</div>}

        <label htmlFor="longitud" className="registroCon-label">
          Longitud del conglomerado (°) <span className="registroCon-required">*</span>
        </label>
        <input
          type="number"
          id="longitud"
          name="longitud"
          value={formData.longitud}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.longitud ? "is-invalid" : formData.longitud ? "is-valid" : ""
          }`}
          placeholder="Ej. -74.1234"
          step="0.0001"
        />
        {errors.longitud && <div className="invalid-feedback">{errors.longitud}</div>}

        <label htmlFor="jefeBrigada" className="registroCon-label">
          Nombre del jefe de brigada <span className="registroCon-required">*</span>
        </label>
        <input
          type="text"
          id="jefeBrigada"
          name="jefeBrigada"
          value={formData.jefeBrigada}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.jefeBrigada ? "is-invalid" : formData.jefeBrigada ? "is-valid" : ""
          }`}
          placeholder="Ej. Juan Pérez"
        />
        {errors.jefeBrigada && <div className="invalid-feedback">{errors.jefeBrigada}</div>}

        <label htmlFor="tecnicoAuxiliar" className="registroCon-label">
          Nombre del técnico auxiliar <span className="registroCon-required">*</span>
        </label>
        <input
          type="text"
          id="tecnicoAuxiliar"
          name="tecnicoAuxiliar"
          value={formData.tecnicoAuxiliar}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.tecnicoAuxiliar ? "is-invalid" : formData.tecnicoAuxiliar ? "is-valid" : ""
          }`}
          placeholder="Ej. María López"
        />
        {errors.tecnicoAuxiliar && <div className="invalid-feedback">{errors.tecnicoAuxiliar}</div>}

        <label htmlFor="botanico" className="registroCon-label">
          Nombre del botánico <span className="registroCon-required">*</span>
        </label>
        <input
          type="text"
          id="botanico"
          name="botanico"
          value={formData.botanico}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.botanico ? "is-invalid" : formData.botanico ? "is-valid" : ""
          }`}
          placeholder="Ej. Carlos Ruiz"
        />
        {errors.botanico && <div className="invalid-feedback">{errors.botanico}</div>}

        <label htmlFor="coinvestigador" className="registroCon-label">
          Nombre del coinvestigador <span className="registroCon-required">*</span>
        </label>
        <input
          type="text"
          id="coinvestigador"
          name="coinvestigador"
          value={formData.coinvestigador}
          onChange={handleChange}
          className={`registroCon-input ${
            errors.coinvestigador ? "is-invalid" : formData.coinvestigador ? "is-valid" : ""
          }`}
          placeholder="Ej. Ana García"
        />
        {errors.coinvestigador && (
          <div className="invalid-feedback">{errors.coinvestigador}</div>
        )}

        <div className="registroCon-buttons mt-4">
          <button type="submit" className="registroCon-btn">
            Guardar
          </button>
          <button
            type="reset"
            className="registroCon-btn registroCon-btn-reset"
            onClick={() => {
              setFormData({
                nombreConglomerado: "",
                latitud: "",
                longitud: "",
                jefeBrigada: "",
                tecnicoAuxiliar: "",
                botanico: "",
                coinvestigador: "",
              });
              setErrors({});
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {success && (
        <div className="registroCon-success mt-3" role="alert">
          ¡Registro exitoso!
        </div>
      )}
    </div>
  );
};

export default RegistroConglo;
