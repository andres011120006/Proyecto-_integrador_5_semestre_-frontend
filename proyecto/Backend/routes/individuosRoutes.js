import express from "express";
import { createIndividuo,getIndividuos } from "../controllers/individuosController.js";
import multer from "multer";

const router = express.Router();

// Configuración de multer (para manejar la subida de imágenes)
const storage = multer.memoryStorage(); // Guarda el archivo en memoria temporal
const upload = multer({ storage });

// Ruta para registrar un nuevo individuo arbóreo
router.post("/", upload.single("imagen"), createIndividuo);

// Traer individuos por conglomerado y subparcela
router.get("/", getIndividuos);

export default router;
