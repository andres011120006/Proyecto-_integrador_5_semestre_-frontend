/**
 * @file IncidenciaController.js
 * @description Controlador que maneja las rutas HTTP relacionadas con las incidencias.
 * Se comunica con los casos de uso del dominio para mantener la separación de capas.
 */

import express from "express";
import IncidenciaRepositoryAdapter from "../../infrastructure/adapters/IncidenciaRepositoryAdapter.js";
import CrearIncidenciaUseCase from "../../domain/services/CrearIncidenciaUseCase.js";

const router = express.Router();

// Instanciamos el adaptador que conecta al repositorio (MongoDB)
const repository = new IncidenciaRepositoryAdapter();

// Instanciamos el caso de uso, pasándole el repositorio (principio DIP)
const crearIncidenciaUseCase = new CrearIncidenciaUseCase(repository);

/**
 * @route POST /api/incidencias
 * @description Crea una nueva incidencia en la base de datos
 * @access Público
 */
router.post("/", async (req, res) => {
  try {
    const { nombre_conglomerado, categoria, descripcion } = req.body;

    // Validamos que se reciban los campos necesarios
    if (!nombre_conglomerado || !categoria || !descripcion) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Ejecutamos el caso de uso
    const nuevaIncidencia = await crearIncidenciaUseCase.execute({
      nombre_conglomerado,
      categoria,
      descripcion,
    });

    res.status(201).json({
      mensaje: " Incidencia creada correctamente",
      data: nuevaIncidencia,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/incidencias
 * @description Obtiene todas las incidencias almacenadas
 * @access Público
 */
router.get("/", async (req, res) => {
  try {
    const incidencias = await repository.obtenerTodas();
    res.json(incidencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportamos el router como default
export default router;
