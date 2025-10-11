import { useState, useEffect } from "react";
import MapaMuestra from "./mapa_muestra"; // 🔹 Asegúrate de que el nombre del archivo sea correcto
import "../assets/css/registroMuestra.css";

const RegistroMuestra = () => {
  const [conglomerados, setConglomerados] = useState([]);
  const [subparcelas, setSubparcelas] = useState([]);
  const [individuos, setIndividuos] = useState([]);

  const [selectedConglomerado, setSelectedConglomerado] = useState(null);
  const [selectedSubparcela, setSelectedSubparcela] = useState(null);
  const [selectedIndividuo, setSelectedIndividuo] = useState(null);

  //   Cargar conglomerados al iniciar
  useEffect(() => {
    fetch("http://localhost:4000/api/conglomerados")
      .then((res) => res.json())
      .then((data) => setConglomerados(data))
      .catch((err) => console.error("Error cargando conglomerados:", err));
  }, []);

  //  Cargar subparcelas al seleccionar conglomerado
  useEffect(() => {
    if (selectedConglomerado) {
      fetch(`http://localhost:4000/api/subparcelas?conglomerado=${selectedConglomerado.id}`)
        .then((res) => res.json())
        .then((data) => setSubparcelas(data))
        .catch((err) => console.error("Error cargando subparcelas:", err));
    } else {
      setSubparcelas([]);
    }
  }, [selectedConglomerado]);

  //  Cargar individuos al seleccionar subparcela
  useEffect(() => {
    if (selectedSubparcela) {
      fetch(`http://localhost:4000/api/individuos?subparcela=${selectedSubparcela.id}`)
        .then((res) => res.json())
        .then((data) => setIndividuos(data))
        .catch((err) => console.error("Error cargando individuos:", err));
    } else {
      setIndividuos([]);
    }
  }, [selectedSubparcela]);

  //  Manejar selección de individuo en el mapa
  const handleSelectIndividuo = (individuo) => {
    setSelectedIndividuo(individuo);
    console.log(" Individuo seleccionado:", individuo);
  };

  return (
    <div className="registro-muestra-container">
      <h2>Registro de Muestra</h2>

      {/*  Selección de conglomerado */}
      <div className="form-section">
        <label>Selecciona un Conglomerado:</label>
        <select
          value={selectedConglomerado?.id || ""}
          onChange={(e) => {
            const selected = conglomerados.find((c) => c.id === parseInt(e.target.value));
            setSelectedConglomerado(selected || null);
            setSelectedSubparcela(null);
            setSelectedIndividuo(null);
          }}
        >
          <option value="">-- Seleccionar --</option>
          {conglomerados.map((cong) => (
            <option key={cong.id} value={cong.id}>
              {cong.nombre_conglomerado}
            </option>
          ))}
        </select>
      </div>

      {/*  Selección de subparcela */}
      {selectedConglomerado && (
        <div className="form-section">
          <label>Selecciona una Subparcela:</label>
          <select
            value={selectedSubparcela?.id || ""}
            onChange={(e) => {
              const selected = subparcelas.find((s) => s.id === parseInt(e.target.value));
              setSelectedSubparcela(selected || null);
              setSelectedIndividuo(null);
            }}
          >
            <option value="">-- Seleccionar --</option>
            {subparcelas.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nombre_subparcela}
              </option>
            ))}
          </select>
        </div>
      )}

      {/*  Mapa de individuos */}
      {selectedSubparcela && (
        <div className="mapa-section">
          <h3>Individuos Registrados</h3>
          <MapaMuestra individuos={individuos} onSelect={handleSelectIndividuo} />
        </div>
      )}

      {/* 🔸 Información del individuo seleccionado */}
      {selectedIndividuo && (
        <div className="info-section">
          <h4>Individuo Seleccionado</h4>
          <p>
            <strong>ID:</strong> {selectedIndividuo.id}
          </p>
          <p>
            <strong>Latitud:</strong> {selectedIndividuo.latitud}
          </p>
          <p>
            <strong>Longitud:</strong> {selectedIndividuo.longitud}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistroMuestra;
