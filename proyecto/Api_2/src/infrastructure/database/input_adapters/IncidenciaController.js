import { RegistrarIncidencia } from "../../application/use_cases/RegistrarIncidencia.js";

export class IncidenciaController {
  constructor(outputAdapter) {
    this.registrarIncidencia = new RegistrarIncidencia(outputAdapter);
  }

  async registrar(req, res) {
    try {
      const incidencia = await this.registrarIncidencia.run(req.body);
      res.status(201).json({
        mensaje: "✅ Incidencia registrada correctamente",
        incidencia
      });
    } catch (error) {
      res.status(400).json({
        mensaje: "❌ Error al registrar la incidencia",
        error: error.message
      });
    }
  }
}
