/**
 * @file CrearIncidenciaUseCase.js
 * @description Caso de uso responsable de registrar una nueva incidencia
 */

import { Incidencia } from "../entities/Incidencia.js";

export default class CrearIncidenciaUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Ejecuta la lógica para crear una nueva incidencia.
   * @param {Object} data - Datos de la incidencia (nombre_conglomerado, categoria, descripcion)
   * @returns {Promise<Object>} La incidencia creada
   */
  async execute(data) {
    // Creamos la entidad del dominio (con validaciones incluidas)
    const incidencia = new Incidencia(data);

    // La guardamos usando el repositorio
    return await this.repository.crear(incidencia.toJSON());
  }
}
