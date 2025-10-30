import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conglomeradosRoutes from "./routes/conglomeradosRoutes.js";
import individuosRoutes from "./routes/individuosRoutes.js";
import muestrasRoutes from "./routes/muestrasRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/conglomerados", conglomeradosRoutes);
app.use("/api/individuos", individuosRoutes);
app.use("/api/muestras", muestrasRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
