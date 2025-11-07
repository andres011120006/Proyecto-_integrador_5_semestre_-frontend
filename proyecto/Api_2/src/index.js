import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./config/server.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(3000, () => console.log("🚀 Servidor en puerto 3000"));
  })
  .catch(err => console.error("❌ Error de conexión:", err));
