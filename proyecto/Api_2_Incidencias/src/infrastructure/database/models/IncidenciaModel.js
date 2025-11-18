//  src/infrastructure/database/models/IncidenciaModel.js

import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  nombre_conglomerado: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

// Exportamos el modelo como default
export default mongoose.model("Incidencia", incidenciaSchema);
