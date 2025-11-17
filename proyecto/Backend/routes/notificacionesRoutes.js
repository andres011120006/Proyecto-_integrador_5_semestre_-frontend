import express from 'express';
import {
  crearNotificacionIncidencia,
  confirmarNotificacion,
  getNotificacionesPendientes
} from '../controllers/notificacionesController.js';

const router = express.Router();

// Ruta para crear notificación de incidencia mayor
router.post('/incidencia-mayor', crearNotificacionIncidencia);

// Ruta para confirmar recepción de notificación
router.post('/confirmar', confirmarNotificacion);

// Ruta para obtener notificaciones pendientes de un usuario
router.get('/pendientes/:usuario', getNotificacionesPendientes);

export default router;