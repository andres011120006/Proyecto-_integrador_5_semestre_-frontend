//  src/infrastructure/adapters/IncidenciaRepositoryAdapter.js

// Importamos el modelo de incidencia desde la base de datos
import IncidenciaModel from "../database/models/IncidenciaModel.js";

// Adaptador que conecta el dominio con la infraestructura (MongoDB)
export default class IncidenciaRepositoryAdapter {
  
  // Crea una nueva incidencia en la base de datos
  async crear(data) {
    try {
      const nuevaIncidencia = new IncidenciaModel(data);
      return await nuevaIncidencia.save();
    } catch (error) {
      throw new Error("Error al crear la incidencia: " + error.message);
    }
  }

  // Obtiene todas las incidencias almacenadas
  async obtenerTodas() {
    try {
      return await IncidenciaModel.find();
    } catch (error) {
      throw new Error("Error al obtener incidencias: " + error.message);
    }
  }
}
