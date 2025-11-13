/**
 * @interface IncidenciaRepositoryPort
 * @description Define los métodos que cualquier adaptador de persistencia debe implementar.
 * Esto permite que el dominio no dependa de una tecnología específica (como MongoDB).
 */
export class IncidenciaRepositoryPort {
  /**
   * Guarda una incidencia en la base de datos.
   * @param {Incidencia} incidencia - Entidad de incidencia a guardar.
   */
  async guardar(incidencia) {
    throw new Error("Método no implementado: guardar()");
  }

  /**
   * Obtiene todas las incidencias almacenadas.
   * @returns {Promise<Array>} Lista de incidencias.
   */
  async obtenerTodas() {
    throw new Error("Método no implementado: obtenerTodas()");
  }

  /**
   * Obtiene todos los conglomerados únicos.
   * @returns {Promise<Array>} Lista de nombres de conglomerados.
   */
  async obtenerConglomerados() {
    throw new Error("Método no implementado: obtenerConglomerados()");
  }
}
