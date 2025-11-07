import express from "express";
import { obtenerReporteConglomerado } from "../controllers/reportesController.js";

const router = express.Router();

// GET /api/reportes/:id_conglomerado
router.get("/:id_conglomerado", obtenerReporteConglomerado);

export default router;
