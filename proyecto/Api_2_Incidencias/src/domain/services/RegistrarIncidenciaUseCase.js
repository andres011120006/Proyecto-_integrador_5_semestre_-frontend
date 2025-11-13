import { Incidencia } from "../entities/Incidencia.js";

export class RegistrarIncidenciaUseCase {
  constructor(incidenciaRepository) {
    this.incidenciaRepository = incidenciaRepository;
  }

  async registrar(datos) {
    const incidencia = new Incidencia(
      datos.conglomerado,
      datos.categoria,
      datos.descripcion
    );
    return await this.incidenciaRepository.guardar(incidencia);
  }
}
