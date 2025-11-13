import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables del archivo .env

/**
 * @function conectarMongo
 * @description Establece la conexión con la base de datos MongoDB.
 */
export const conectarMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1); // Finaliza el proceso si no hay conexión
  }
};
