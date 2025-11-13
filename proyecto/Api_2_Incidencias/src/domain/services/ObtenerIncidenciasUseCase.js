/**
 * @usecase ObtenerIncidenciasUseCase
 * @description Caso de uso para obtener todas las incidencias registradas.
 */
export class ObtenerIncidenciasUseCase {
  constructor(incidenciaRepository) {
    this.incidenciaRepository = incidenciaRepository;
  }

  /**
   * Ejecuta la obtención de incidencias.
   * @returns {Promise<Array>} Lista de incidencias.
   */
  async ejecutar() {
    return await this.incidenciaRepository.obtenerTodas();
  }
}
