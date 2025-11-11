import { RegistrarIncidenciaUseCase } from "../../domain/services/RegistrarIncidenciaUseCase.js";
import{IncidenciaInputPort} from "../interfaces/IncidenciaInputPort.js"

// debe implemnetar  intput_port//
export class RegistrarIncidencia extends IncidenciaInputPort {
  constructor(outputPort) {
    this.useCase = new RegistrarIncidenciaUseCase(outputPort);
  }

  async RegistrarIncidencia(data) {
    return await this.useCase.execute(data);
  }
}
