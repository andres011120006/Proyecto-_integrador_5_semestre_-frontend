import express from "express";
import { 
  getConglomerados, 
  getConglomeradosPaginados 
} from "../controllers/conglomeradosController.js";

const router = express.Router();

/**
 * @route GET /api/conglomerados
 * @description Obtener todos los conglomerados
 */
router.get("/", getConglomerados);

/**
 * @route GET /api/conglomerados/paginados
 * @description Obtener conglomerados paginados para el modal
 */
router.get("/paginados", getConglomeradosPaginados);

export default router;