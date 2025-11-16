import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conglomeradosRoutes from "./routes/conglomeradosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import individuosRoutes from "./routes/individuosRoutes.js";
import muestrasRoutes from "./routes/muestrasRoutes.js";

dotenv.config();

const app = express();

// ✅ CONFIGURACIÓN MEJORADA DE CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json());

// ✅ MIDDLEWARE MEJORADO - Manejar OPTIONS primero
app.use((req, res, next) => {
  // Manejar pre-flight requests inmediatamente
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ... el resto de tu código se mantiene igual ...
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    routes: {
      conglomerados: {
        all: "GET /api/conglomerados",
        paginated: "GET /api/conglomerados/paginados"
      },
      usuarios: {
        login: "POST /usuarios",
        updateConglomerado: "PUT /usuarios/conglomerado",
        all: "GET /usuarios"
      },
      individuos: {
        create: "POST /api/individuos",
        multiple: "POST /api/individuos/multiple", 
        get: "GET /api/individuos"
      },
      muestras: {
        create: "POST /api/muestras"
      }
    }
  });
});

// Rutas principales
app.use("/api/conglomerados", conglomeradosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/api/individuos", individuosRoutes);
app.use("/api/muestras", muestrasRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      "GET /api/conglomerados",
      "GET /api/conglomerados/paginados", 
      "POST /usuarios",
      "PUT /usuarios/conglomerado",
      "GET /usuarios",
      "POST /api/individuos",
      "POST /api/individuos/multiple",
      "GET /api/individuos",
      "POST /api/muestras"
    ]
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log("📋 Rutas configuradas:");
  console.log("   GET  /api/conglomerados");
  console.log("   GET  /api/conglomerados/paginados");
  console.log("   POST /usuarios"); 
  console.log("   PUT  /usuarios/conglomerado");
  console.log("   GET  /usuarios");
  console.log("   POST /api/individuos");
  console.log("   POST /api/individuos/multiple");
  console.log("   GET  /api/individuos");
  console.log("   POST /api/muestras");
});