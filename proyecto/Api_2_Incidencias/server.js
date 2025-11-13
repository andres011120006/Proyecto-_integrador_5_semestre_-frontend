import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import incidenciaRouter from "./src/application/controllers/IncidenciaController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conexión exitosa a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas principales
app.use("/api/incidencias", incidenciaRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
