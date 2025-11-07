import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  nombre_conglomerado: { type: String, required: true },
  categoria: { type: String, enum: ["menor", "mayor"], required: true },
  descripcion: { type: String, required: true },
  fecha_registro: { type: Date, default: Date.now }
});

const IncidenciaModel = mongoose.model("Incidencia", incidenciaSchema);
export default IncidenciaModel;
