import { RegistrarIncidenciaUseCase } from "../../domain/services/RegistrarIncidenciaUseCase.js";

export class RegistrarIncidencia {
  constructor(outputPort) {
    this.useCase = new RegistrarIncidenciaUseCase(outputPort);
  }

  async run(data) {
    return await this.useCase.execute(data);
  }
}
