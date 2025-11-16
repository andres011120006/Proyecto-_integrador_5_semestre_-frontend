import express from "express";
import { 
  loginUsuario, 
  getUsuarios, 
  actualizarConglomeradoUsuario 
} from "../controllers/usuariosController.js";

const router = express.Router();

// Ruta para login de usuarios
router.post("/", loginUsuario);

// Ruta para actualizar conglomerado del usuario
router.put("/conglomerado", actualizarConglomeradoUsuario);

// Ruta para obtener todos los usuarios (para debugging)
router.get("/", getUsuarios);

export default router;