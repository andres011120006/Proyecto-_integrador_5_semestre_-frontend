import { useState } from "react";
import { jsPDF } from "jspdf";
import '../assets/css/reporte.css'

const ReporteConglomerado = () => {
  const [conglomerado, setConglomerado] = useState("");
  const [errors, setErrors] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (conglomerado === "") {
      setErrors(true);
      isValid = false;
    } else {
      setErrors(false);
    }

    if (isValid) {
      setSuccess(true);

      // ✅ Generar PDF con jsPDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Conglomerado", 20, 20);
      doc.setFontSize(12);
      doc.text(`Conglomerado seleccionado: ${conglomerado}`, 20, 40);
      doc.text("✅ Este es un reporte generado de ejemplo.", 20, 60);

      // Descargar PDF
      doc.save(`Reporte_${conglomerado}.pdf`);

      // Resetear después de 2 segundos
      setTimeout(() => {
        setConglomerado("");
        setErrors(false);
      }, 2000);

      // Ocultar mensaje a los 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <div
      className="reporte-form-container my-5"
      role="main"
      aria-labelledby="formTitle"
    >
      <h1 id="formTitle">Generar Reporte de Conglomerado</h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* Selección de conglomerado */}
        <label htmlFor="conglomerado" className="reporte-form-label">
          Seleccione Conglomerado{" "}
          <span style={{ color: "#d32f2f" }}>*</span>
        </label>
        <select
          id="conglomerado"
          name="conglomerado"
          value={conglomerado}
          onChange={(e) => setConglomerado(e.target.value)}
          className={`form-select ${
            errors ? "is-invalid" : conglomerado ? "is-valid" : ""
          }`}
          required
        >
          <option value="">
            -- Seleccione un conglomerado --
          </option>
          <option value="conglomerado_1">Conglomerado 1</option>
          <option value="conglomerado_2">Conglomerado 2</option>
          <option value="conglomerado_3">Conglomerado 3</option>
        </select>
        {errors && (
          <div className="invalid-feedback">
            Debe seleccionar un conglomerado.
          </div>
        )}

        {/* Botones */}
        <div className="reporte-buttons mt-4">
          <button type="submit" className="btn btn-success">
            Generar
          </button>
          <button
            type="reset"
            className="btn btn-secondary"
            onClick={() => {
              setConglomerado("");
              setErrors(false);
              setSuccess(false);
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Mensaje de éxito */}
      {success && (
        <div
          className="alert alert-success mt-3 reporte-success-message"
          role="alert"
        >
          ✅ Reporte generado correctamente.
        </div>
      )}
    </div>
  );
};

export default ReporteConglomerado;
