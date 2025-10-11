import express from "express";
import { createMuestra } from "../controllers/muestrasController.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Registrar nueva muestra
router.post("/", upload.single("imagen"), createMuestra);

export default router;
