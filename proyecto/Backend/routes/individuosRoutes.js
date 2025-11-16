import express from "express";
import { createIndividuo, getIndividuos, createMultipleIndividuos } from "../controllers/individuosController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Ruta para crear un solo individuo
router.post("/", upload.single("imagen"), createIndividuo);

// NUEVA RUTA: Para crear múltiples individuos (sin imágenes o con imágenes separadas)
router.post("/multiple", upload.any(), createMultipleIndividuos);

// Ruta para obtener individuos
router.get("/", getIndividuos);

export default router;