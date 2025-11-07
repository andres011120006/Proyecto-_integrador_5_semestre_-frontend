import { Incidencia } from "../entities/Incidencia.js";

export class RegistrarIncidenciaUseCase {
  constructor(outputPort) {
    this.outputPort = outputPort;
  }

  async execute(data) {
    const incidencia = new Incidencia(data);
    await this.outputPort.guardarIncidencia(incidencia);
    return incidencia;
  }
}
