import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { obtenerReporteConglomeradoDebug } from './controllers/reportesController.js';
import conglomeradosRoutes from "./routes/conglomeradosRoutes.js";
import individuosRoutes from "./routes/individuosRoutes.js";
import muestrasRoutes from "./routes/muestrasRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Ruta debug para probar en curl/Postman
app.get("/api/reportes-debug/:id_conglomerado", obtenerReporteConglomeradoDebug);

// 🔹 Rutas principales
app.use("/api/conglomerados", conglomeradosRoutes);
app.use("/api/individuos", individuosRoutes);
app.use("/api/muestras", muestrasRoutes);
app.use("/api/reportes", reportesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
