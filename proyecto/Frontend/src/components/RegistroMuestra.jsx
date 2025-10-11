import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/registroArbol.css";
import MapaMuestra from "./mapa_muestra";

const RegistroMuestra = () => {
  const [formData, setFormData] = useState({
    nombreConglomerado: "",
    subparcela: "",
    categoria: "",
    latitud: "",
    longitud: "",
    imagen: null,
    individuoSeleccionado: null,
  });

  const [step, setStep] = useState(1);
  const [conglomerados, setConglomerados] = useState([]);
  const [individuos, setIndividuos] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar conglomerados al inicio
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

  // 🔹 Cargar individuos al seleccionar subparcela
  useEffect(() => {
    const fetchIndividuos = async () => {
      if (formData.nombreConglomerado && formData.subparcela) {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/individuos?conglomerado=${formData.nombreConglomerado}&subparcela=${formData.subparcela}`
          );
          setIndividuos(res.data || []);
        } catch (err) {
          console.error("Error cargando individuos:", err);
          setIndividuos([]);
        }
      }
    };
    fetchIndividuos();
  }, [formData.nombreConglomerado, formData.subparcela]);

  // 🔹 Manejar cambios de campos
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // 🔹 Validar pasos
  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.nombreConglomerado)
      newErrors.nombreConglomerado = "Debe seleccionar un conglomerado.";
    if (step === 2 && !formData.subparcela)
      newErrors.subparcela = "Debe seleccionar una subparcela.";
    if (step === 3 && !formData.individuoSeleccionado)
      newErrors.individuoSeleccionado = "Debe seleccionar un individuo arbóreo.";
    if (step === 4 && !formData.categoria)
      newErrors.categoria = "Debe seleccionar una categoría.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend.append(key, value);
      });

      await axios.post("http://localhost:4000/api/muestras", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setStep(1);
      setFormData({
        nombreConglomerado: "",
        subparcela: "",
        categoria: "",
        latitud: "",
        longitud: "",
        imagen: null,
        individuoSeleccionado: null,
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error al guardar la muestra:", err);
      alert("❌ Ocurrió un error al guardar la muestra.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener conglomerado seleccionado
  const selectedConglomerado = conglomerados.find(
    (c) => c.nombre === formData.nombreConglomerado
  );

  return (
    <div className="arbol-container my-5">
      <h1>Registro de Muestra</h1>

      <form onSubmit={handleSubmit}>
        {/* PASO 1: Seleccionar conglomerado */}
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

            {selectedConglomerado && (
              <div className="mapa-arbol my-4" style={{ height: "400px" }}>
                <MapaMuestra
                  individuos={[]} // vacío en este paso
                  onSelect={() => {}}
                  center={[
                    selectedConglomerado.latitud,
                    selectedConglomerado.longitud,
                  ]}
                />
              </div>
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

        {/* PASO 2: Subparcela */}
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

        {/* PASO 3: Seleccionar individuo */}
        {step === 3 && (
          <>
            <h3>Paso 3: Seleccione el individuo arbóreo</h3>
            <p>
              Mapa centrado en el conglomerado seleccionado. Los marcadores
              representan individuos ya registrados.
            </p>

            <div className="mapa-arbol my-4" style={{ height: "400px" }}>
              <MapaMuestra
                individuos={individuos}
                onSelect={(individuo) => {
                  if (individuo && individuo.latitud && individuo.longitud) {
                    setFormData({
                      ...formData,
                      individuoSeleccionado: individuo,
                      latitud: individuo.latitud,
                      longitud: individuo.longitud,
                    });
                  } else {
                    console.warn("Individuo sin coordenadas válidas:", individuo);
                  }
                }}
                individuoSeleccionado={formData.individuoSeleccionado}
                center={[
                  selectedConglomerado?.latitud || 4.711,
                  selectedConglomerado?.longitud || -74.0721,
                ]}
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

            {errors.individuoSeleccionado && (
              <div className="invalid-feedback d-block">
                {errors.individuoSeleccionado}
              </div>
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

        {/* PASO 4: Tipo de muestra */}
        {step === 4 && (
          <>
            <h3>Paso 4: Tipo de muestra e imagen</h3>

            <label htmlFor="categoria">Tipo de muestra</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
            >
              <option value="">Seleccione tipo de muestra</option>
              <option value="Hoja">Hoja</option>
              <option value="Corteza">Corteza</option>
              <option value="Fruto">Fruto</option>
              <option value="Madera">Madera</option>
            </select>
            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}

            <label htmlFor="imagen" className="mt-3">
              Imagen de la muestra (opcional)
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

export default RegistroMuestra;
