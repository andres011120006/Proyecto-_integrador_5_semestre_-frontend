import { Incidencia } from "../entities/Incidencia.js";
import{IncidenciaInputPort} from "../interfaces/IncidenciaInputPort.js"

export class RegistrarIncidenciaUseCase extends IncidenciaInputPort {
  constructor(outputPort) {
    this.outputPort = outputPort;
  }

  async registrarIncidencia(data) {
    const incidencia = new Incidencia(data);
    await this.outputPort.guardarIncidencia(incidencia);
    return incidencia;
  }
}
