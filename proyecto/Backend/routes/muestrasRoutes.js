import express from "express";
import { createMuestra } from "../controllers/muestrasController.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  }
});

// Ruta para crear muestra con imagen
router.post("/", upload.single("imagen"), createMuestra);

export default router;